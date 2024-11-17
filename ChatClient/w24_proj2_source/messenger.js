"use strict";

/** ******* Imports ********/

const {
  /* The following functions are all of the cryptographic
  primatives that you should need for this assignment.
  See lib.js for details on usage. */
  bufferToString,
  genRandomSalt,
  generateEG, // async
  computeDH, // async
  verifyWithECDSA, // async
  HMACtoAESKey, // async
  HMACtoHMACKey, // async
  HKDF, // async
  encryptWithGCM, // async
  decryptWithGCM,
  cryptoKeyToJSON, // async
  govEncryptionDataStr,
} = require("./lib");

/** ******* Implementation ********/

class MessengerClient {
  constructor(certAuthorityPublicKey, govPublicKey) {
    // the certificate authority DSA public key is used to
    // verify the authenticity and integrity of certificates
    // of other users (see handout and receiveCertificate)

    // you can store data as needed in these objects.
    // Feel free to modify their structure as you see fit.
    this.caPublicKey = certAuthorityPublicKey;
    this.govPublicKey = govPublicKey;
    this.conns = {}; // data for each active connection
    this.certs = {}; // certificates of other users
    this.EGKeyPair = {}; // keypair from generateCertificate
  }

  /**
   * Generate a certificate to be stored with the certificate authority.
   * The certificate must contain the field "username".
   *
   * Arguments:
   *   username: string
   *
   * Return Type: certificate object/dictionary
   */
  async generateCertificate(username) {
    const certificate = {};
    certificate.username = username;
    const key_pair = await generateEG();
    certificate.pub_key = key_pair.pub;

    // this.conns.seenPks = new Set()
    this.EGKeyPair = { cert_pk: key_pair.pub, cert_sk: key_pair.sec };
    return certificate;
  }

  /**
   * Receive and store another user's certificate.
   *
   * Arguments:
   *   certificate: certificate object/dictionary
   *   signature: ArrayBuffer
   *
   * Return Type: void
   */
  async receiveCertificate(certificate, signature) {
    // The signature will be on the output of stringifying the certificate
    // rather than on the certificate directly.
    const certString = JSON.stringify(certificate);
    const valid = await verifyWithECDSA(
      this.caPublicKey,
      certString,
      signature
    );
    if (!valid) throw "invalid signature provided";
    this.certs[certificate.username] = certificate;
  }

  /**
   * Generate the message to be sent to another user.
   *
   * Arguments:
   *   name: string
   *   plaintext: string
   *
   * Return Type: Tuple of [dictionary, ArrayBuffer]
   */
  async sendMessage(name, plaintext) {
    // generate rk, ck_s if user has not communicated with name before
    if (!(name in this.conns)) {
      const bob_public_key = this.certs[name].pub_key;
      const raw_root_key = await computeDH(
        this.EGKeyPair.cert_sk,
        bob_public_key
      );

      const fresh_pair = await generateEG();
      this.EGKeyPair[name] = {
        pub_key: fresh_pair.pub,
        sec_key: fresh_pair.sec,
      }; // update during DH ratchet in receiveMessage()

      const hkdf_input_key = await computeDH(
        this.EGKeyPair[name].sec_key,
        bob_public_key
      ); // myPrivateKey, theirPublicKey

      const [root_key, chain_key] = await HKDF(
        hkdf_input_key,
        raw_root_key,
        "ratchet-salt"
      );

      this.conns[name] = { rk: root_key, ck_s: chain_key };
      this.conns[name].seenPks = new Set();
    }

    //at this point we know we have a rk and ck_s

    //ck_s is undefined because receive() is first called, which adds rk and ck_r but not ck_s
    const ck_s = await HMACtoHMACKey(this.conns[name].ck_s, "ck-str");
    const mk = await HMACtoAESKey(this.conns[name].ck_s, "mk-str");
    const mk_buffer = await HMACtoAESKey(this.conns[name].ck_s, "mk-str", true);
    this.conns[name].ck_s = ck_s;

    //form header
    const ivGov = genRandomSalt();
    const receiver_iv = genRandomSalt();
    const new_gov_pair = await generateEG();

    //gov needs to be able to derive dh_secret given 1) govPublicKey and 2) new_gov_par.pub (vGov)
    const dh_secret = await computeDH(new_gov_pair.sec, this.govPublicKey); // pub^sec --> (g^b)^a : DH between gov and Alice
    const dh_secret_key = await HMACtoAESKey(dh_secret, govEncryptionDataStr); //k = H(v, m) Since computeDH() output is configured with HMAC, need to run the output through HMACtoAESKey() to generate a key that can be used with AES-GCM
    const cGov = await encryptWithGCM(dh_secret_key, mk_buffer, ivGov); // encrypt by gov

    //form header
    const header = {
      vGov: new_gov_pair.pub,
      cGov: cGov,
      receiverIV: receiver_iv,
      ivGov: ivGov,
      pk_sender: this.EGKeyPair[name].pub_key,
    };

    //encrypt message
    const ciphertext = await encryptWithGCM(
      mk,
      plaintext,
      receiver_iv,
      JSON.stringify(header)
    );
    return [header, ciphertext];
  }

  /**
   * Decrypt a message received from another user.
   *
   * Arguments:
   *   name: string
   *   [header, ciphertext]: Tuple of [dictionary, ArrayBuffer]
   *
   * Return Type: string
   */
  async receiveMessage(name, [header, ciphertext]) {
    // if A has not previously communicated with B, setup the session by generating necessary double ratchet keys
    if (!(name in this.conns)) {
      const sender_cert_pk = this.certs[name].pub_key;
      const raw_root_key = await computeDH(
        this.EGKeyPair.cert_sk,
        sender_cert_pk
      );

      const hkdf_input_key = await computeDH(
        this.EGKeyPair.cert_sk,
        header.pk_sender
      ); // DH key from Alice and the sender
      const [root_key, chain_key] = await HKDF(
        hkdf_input_key,
        raw_root_key,
        "ratchet-salt"
      );

      const fresh_pair = await generateEG(); // new key pair for the receiver
      this.EGKeyPair[name] = {
        pub_key: fresh_pair.pub,
        sec_key: fresh_pair.sec,
      };

      const dh_result = await computeDH(
        this.EGKeyPair[name].sec_key,
        header.pk_sender
      ); // DH key from new key and public key of the sender

      const [final_root_key, ck_s] = await HKDF(
        dh_result,
        root_key,
        "ratchet-salt"
      );

      // save
      this.conns[name] = { rk: final_root_key, ck_r: chain_key, ck_s: ck_s };
      // create seen pks set
      this.conns[name].seenPks = new Set(); // lưu lại các public key đã set
    } else if (!this.conns[name].seenPks.has(header.pk_sender)) {
      // apply a DH ratchet because the sender is different than the last sender!
      // apply DH ratchet

      // DH with receiver's private key and sender's public key
      const first_dh_output = await computeDH(
        this.EGKeyPair[name].sec_key,
        header.pk_sender
      );
      let [rk_first, ck_r] = await HKDF(
        first_dh_output,
        this.conns[name].rk,
        "ratchet-salt"
      );

      const fresh_pair = await generateEG();
      this.EGKeyPair[name] = {
        pub_key: fresh_pair.pub,
        sec_key: fresh_pair.sec,
      };

      const second_dh_output = await computeDH(
        this.EGKeyPair[name].sec_key,
        header.pk_sender
      );
      const [rk, ck_s] = await HKDF(second_dh_output, rk_first, "ratchet-salt");

      this.conns[name].rk = rk;
      this.conns[name].ck_s = ck_s;
      this.conns[name].ck_r = ck_r;
    }

    // apply symmetric-key ratchet on receiving chain to get message key for the received message
    const ck_r = await HMACtoHMACKey(this.conns[name].ck_r, "ck-str");
    const mk = await HMACtoAESKey(this.conns[name].ck_r, "mk-str");

    // update ck_r and the public key of the last sender
    this.conns[name].ck_r = ck_r;
    this.conns[name].seenPks.add(header.pk_sender);

    const plaintext = await decryptWithGCM(
      mk,
      ciphertext,
      header.receiverIV,
      JSON.stringify(header)
    );
    return bufferToString(plaintext);
  }
}

module.exports = {
  MessengerClient,
};
