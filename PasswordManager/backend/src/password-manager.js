"use strict";
/********* External Imports ********/

const {
  keyToBuffer,
  stringToBuffer,
  bufferToString,
  encodeBuffer,
  decodeBuffer,
  getRandomBytes,
  arrayBuffersEqual,
} = require("./lib");
const { subtle } = require("crypto").webcrypto;

/********* Constants ********/

const PBKDF2_ITERATIONS = 100000; // Number of iterations for PBKDF2 algorithm
const MAX_PASSWORD_LENGTH = 64; // Maximum password length

/********* Implementation ********/
class Keychain {
  constructor(kvs, masterKey, salt) {
    this.kvs = kvs || {};
    this.masterKey = masterKey; // This is a CryptoKey
    this.salt = salt;
  }

  static async init(password) {
    const salt = getRandomBytes(16); // Generate a random salt
    const masterKey = await deriveKey(password, salt);
    return new Keychain({}, masterKey, salt);
  }

  static async load(password, repr, trustedDataCheck) {
    const { kvs, salt } = JSON.parse(repr);
    const saltArrayBuffer = new Uint8Array(salt).buffer; // Convert back to ArrayBuffer

    const masterKey = await deriveKey(password, saltArrayBuffer);

    // Calculate the checksum for integrity check
    const serializedForCheck = JSON.stringify({
      kvs: kvs,
      salt: Array.from(new Uint8Array(salt)), // Ensure consistent conversion
    });

    const hashCheck = await computeHash(masterKey, serializedForCheck);

    // Compare the checksums
    if (!arrayBuffersEqual(trustedDataCheck, hashCheck)) {
      throw new Error("Checksum mismatch!");
    }

    return new Keychain(kvs, masterKey, saltArrayBuffer);
  }

  async dump() {
    const saltArray = Array.from(new Uint8Array(this.salt)); // Convert ArrayBuffer to regular array
    const serialized = JSON.stringify({
      kvs: this.kvs,
      salt: saltArray,
    });
    const hash = await computeHash(this.masterKey, serialized);
    return [serialized, hash];
  }

  async set(name, value) {
    const hmacKey = await deriveHMACKey(this.salt, name); // Derive HMAC key separately
    const hmac = await subtle.sign("HMAC", hmacKey, stringToBuffer(name));
    const encryptedValue = await encryptValue(value, this.masterKey);
    this.kvs[encodeBuffer(hmac)] = encryptedValue;
  }

  async get(name) {
    const hmacKey = await deriveHMACKey(this.salt, name); // Derive HMAC key separately
    const hmac = await subtle.sign("HMAC", hmacKey, stringToBuffer(name));
    const encodedHmac = encodeBuffer(hmac);
    return this.kvs[encodedHmac]
      ? await decryptValue(this.kvs[encodedHmac], this.masterKey)
      : null;
  }

  async remove(name) {
    const hmacKey = await deriveHMACKey(this.salt, name); // Derive HMAC key separately
    const hmac = await subtle.sign("HMAC", hmacKey, stringToBuffer(name));
    const encodedHmac = encodeBuffer(hmac);
    if (this.kvs[encodedHmac]) {
      delete this.kvs[encodedHmac];
      return true;
    }
    return false;
  }
}

// Helper functions
async function deriveKey(password, salt) {
  const keyMaterial = await subtle.importKey(
    "raw",
    stringToBuffer(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

async function deriveHMACKey(salt, name) {
  // Use the name as part of the context for deriving the HMAC key
  const hmacKeyMaterial = await subtle.importKey(
    "raw",
    stringToBuffer(name), // Using the name directly to create an HMAC key
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    hmacKeyMaterial,
    {
      name: "HMAC",
      hash: "SHA-256",
      length: 256,
    },
    false,
    ["sign", "verify"]
  );
}

async function encryptValue(value, key) {
  const iv = getRandomBytes(12); // Generate a random IV
  const encrypted = await subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    stringToBuffer(value)
  );
  return { iv: encodeBuffer(iv), data: encodeBuffer(encrypted) };
}

async function decryptValue(encrypted, key) {
  const iv = decodeBuffer(encrypted.iv);
  const data = decodeBuffer(encrypted.data);
  const decrypted = await subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );
  return bufferToString(decrypted);
}

async function computeHash(key, data) {
  // return await subtle.digest("SHA-256", stringToBuffer(data));
  const encoder = new TextEncoder();
  const bufferedKey = await keyToBuffer(key);

  const keyData = await crypto.subtle.importKey(
    "raw",
    bufferedKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    keyData,
    encoder.encode(data)
  );
  return new Uint8Array(signature);
}

module.exports = { Keychain };
