# FINAL EXAM

---

### Q1.
Let $(E, D)$ be an authenticated encryption system built by combining a CPA-secure symmetric cipher and a MAC. The system is combined with an error-correction code to correct random transmission errors. In what order should encryption and error correction be applied?

- [ ] The order does not matter - either one is fine.
- [ ] The order does not matter - neither one can correct errors.
- [x] Encrypt and then appply the error correction code.
- [ ] Apply the correction code and then encrypt the result.

> **Explain:**  The error correction code will do its best to correct random errors after which the MAC in the ciphertext will be checked to ensure no other errors remains.

### Q2.
Let $X$ be a uniform random variable over the set $\{0, 1\}^n$.
Let $Y$ be an arbitrary random variable over the set $\{0, 1\}^n$ (not necessarily uniform) that is independent of $X$.
Define the random variable $Z = X \oplus Y$. What is the probability that $Z$ equals $0^n$?

- [ ] $0.5$
- [ ] $0$
- [ ] $2/2^n$
- [x] $1/2^n$

> **Explain:** $Z = 0^n \rightarrow X = Y$ therefore the probability is $1/2^n$ since $X$ is uniform in the space of $2^n$.

### Q3.
Suppose $(E_1, D_1)$ is a symmetric cipher that uses 128 bit keys to encrypt 1024 bit messages. Suppose $(E_2, D_2)$ is a symmetric cipher that uses 128 bit keys to encrypt 128 bit messages. The encryption algorithms $E_1$ and $E_2$ are deterministic and do not use nonces. Which of the following statements is true?

- [ ] $(E_1, D_1)$ can be perfectly secure.
- [ ] $(E_1, D_1)$ can be semantically secure under chosen plaintext attack.
- [x] $(E_2, D_2)$ can be perfectly secure.
- [x] $(E_2, D_2)$ can be one-time semantically secure and perfectly secure.

> **Explain:** 
> - Definition: 
>   - Perfectly secure: ciphertext produced by encrypting a message provides no information about the plaintext
>   - Semantically secure: for any two plaintexts $P_0$ and $P_1$, and for any ciphertext $C$, an adversary cannot distinguish whether $C$ corresponds to $P_0$ or $P_1$
> - In $(E_1, D_1)$: there is a high probability that 2 messages have the same ciphertext and therefore can leak information about plaintext (not perfectly secure). The attacker can choose 2 messages that has the same ciphertext for the challenger to decrypt and easily win the CPA game (not semantically secure under CPA).
> - In $(E_2, D_2)$: can be a OTP which is one-time semantically secure and perfectly secure.

### Q4.
Which of the following statements regarding CBC and counter mode is correct?

- [x] CBC mode encryption requires a block cipher (PRP), but counter mode encryption only needs a PRF.
- [ ] Both counter mode and CBC mode require a block cipher (PRP).
- [ ] Counter mode encrytion equires a block cipher (PRP), but CBC mode encryption only needs a PRF.
- [ ] Both counter mode and CBC mode can operate just using PRF.

> **Explain:** CBC needs to invert the PRP for decryption, while counter mode only needs to evaluate the PRF in the forward direction for both encryption and decryption. Therefore, a PRF is sufficient for counter mode.

### Q5.
Let $G: X \rightarrow X^2$ be a secure PRG where $X = \{0, 1\}^{256}$.
We let $G(k)[0]$ denote the left half of the output and $G(k)[1]$ denote the right half. Which of the following statements is true?

- [x] $F(k, m) = G(k)[m]$ is a secure PRF with key space $X$ and message space $m \in \{0, 1\}$.  
- [ ] $F(k, m) = G(k)[0] \oplus m$ is a secure PRF with key space and message space $X$
- [ ] $F(k, m) = G(m)[0] \oplus k$ is a secure PRF with key space and message space $X$
- [ ] $F(k, m) = k \oplus m$ is a secure PRF with key space and message space $X$

> **Explain:** Since the output of $G(k)$ is indistinguishable from random, the left and right halves are indistinguishable from random independent values.

### Q6.
Let $(E,D)$ be a nonce-based symmetric encryption system (i.e. algorithm $E$ takes as input a key, a message, and a nonce, and similarly the decryption algorithm takes a nonce as one of its inputs). The system provides chosen plaintext security (CPA-security) as long as the nonce never repeats. Suppose a single encryption key is used to encrypt $2^{32}$ messages and the nonces are generated independently at random for each encryption, how long should the nonce be to ensure that it never repeats with high probability?

- [ ] 16 bits
- [ ] 64 bits
- [x] 128 bits
- [ ] 32 bits

> **Explain:** Base on the birthday paradox we have: $P_{collision} = 1 - e^{-\frac{n^2}{2M}}$ where $n$ is the number of nonces ($n = 2^{32}$) and $M$ is the nonce space ($M = 2^m$, for nonce length $m$). To avoid collision $M > n^2 \rightarrow 2^m > 2^{64} \rightarrow m > 64$. Therefore only $m = 128$ bits satisfies.

### Q7.
Same as question 6 except that now the nonce is generated using a counter. The counter resets to 0 when a new key is chosen and is incremented by 1 after every encryption.   What is the shortest nonce possible to ensure that the nonce does not repeat when encrypting $2^{32}$ messages using a single key?

- [ ] 16 bits
- [ ] 48 bits
- [x] 32 bits
- [ ] the nonce must be chosen at random, otherwise the system cannot be CPA secure.

> **Explain:** With 32 bits there are $2^{32}$ nonces and each message will use a different nonce.

### Q8.
Let $(S,V)$ be a deterministic MAC system with message space $M$ and key space $K$. Which of the following properties is implied by the standard MAC security definition?

- [x] For any two distinct messages $m_0$ and $m_1$, given $m_0, m_1$ and $S(k, m_0)$ it is difficult to compute $S(k, m_1)$.
- [ ] $S(k, m)$ preserves semantic security of $m$.
      That is, the adversary learns nothing about $m$ given $S(k, m)$.
- [ ] Given key $k$ in $K$ it is difficult to find distinct messages $m_0$ and $m_1$ such that $S(k, m_0) = S(k, m_1)$.
- [ ] The function $S(k, m)$ is a secure PRF.

> **Explain:** This is implied by existential unforgeability under a chosen message attack.

### Q9.
Let $H: M \rightarrow T$ be a collision resistant hash function where $|T| < |M|$.
Which of the following properties is implied by collision resistance?

- [ ] It is difficult to find $m_0$ and $m_1$ such that $H(m_0) = H(m_1) + 1$ (here we treats output of $H$ as integers).
- [ ] $H(m)$ preserves semantic security of $m$.
      That is, the adversary learns nothing about $m$ given $H(m)$.
- [ ] For $m$ in $M$, $H(m)$ must be shorter than $m$.
- [x] It is difficult to construct two distinct messages $m_0$ and $m_1$ such that $H(m_0) = H(m_1)$.
  
> **Explain:** Definition of collision resistance.

### Q10.
Recall that when encrypting data you should typically use a symmetric encryption system that provides authenticated encryption. Let $(E,D)$ be a symmetric encryption system providing authenticated encryption. Which of the following statements is implied by authenticated encryption?

- [ ] The attacker cannot create a ciphertext $c$ such that $D(k, c) = ⊥$
- [x] Given $m$ and $E(k, m)$ the attacker cannot create a valid encryption of $m+1$ (here we treats plaintext as integers).
  > **Explain:** Otherwise, it is not secure against CPA. 
- [x] Given $m$ and $E(k, m)$ it is difficult to compute $k$.
  > **Explain:** Otherwise, the encrypting system totally broken, since key $k$ is easily exposed.
- [ ] Given $k, m$ and $E(k, m)$ the attacker cannot creat a valid encryption of $m+1$ under key $k$ (here we treats plaintext as integers).

### Q11.
Which of the following statements is true about the basic Diffie-Hellman key-exchange protocol.

- [x] The protocol can be converted to a public-key encryption system called the ElGamal public-key system.
  > **Explain:** Definition of ElGamal public-key system.
- [ ] As with RSA, the protocol only provides eavesdropping security in the group $\mathbb{Z}^*_N$ where $N$ is an RSA modulus.
- [ ] The basic protocol provides key exchang secure against active adversaries that can inject and modify messages.
- [x] The protocol provides security against eavesdropping in any finite group in wich the Hash Diffie-Hellman (HDH) assumption holds.
  > **Explain:** In any such group the hash of the Diffie-Hellman secret $g^{ab}$ can be used as a shared secret.

### Q12.
Suppose $n+1$ parties, call them $B, A_1, \dots, A_n$ wish to setup a shared group key. They want a protocol so that at the end of the protocol they all have a common secret key $k$, but an eavesdropper who sees the entire conversation cannot determine $k$. The parties agree on the following protocol that runs in a group $G$ of prime order $q$ with generator $g$:
- For $i = 1, \dots, n$ party $A_i$ chooses a random $a_i$ in $\{1, \dots, q\}$ and sends to party $B$ the quantity $X_i \leftarrow g^{a_i}$.
- Party $B$ generates a random $b$ in $\{1, \dots, q\}$ and for $i = 1, \dots, n$ responds to party $A_i$ with the message $Y_i \leftarrow X^{b_i}$.

The final group key should be $g^{b}$. Clearly party $B$ can compute this group key. How would each Party $A_i$ compute this group key?

- [ ] Party $A_i$ computes $g^b$ as $Y_i^{a_i}$.
- [ ] Party $A_i$ computes $g^b$ as $Y_i^{-a_i}$.
- [x] Party $A_i$ computes $g^b$ as $Y_i^{1/a_i}$.
- [ ] Party $A_i$ computes $g^b$ as $Y_i^{-1/a_i}$.

> **Explain:** $Y_i^{1/a_i} = g^{ba_i/a_i} = g^b$.

### Q13.
Recall that the RSA trapdoor permutation is defined in the group $\mathbb{Z}^*_N$ where $N$ is a product of two large primes. The public key is $(N, e)$ and the private key is $(N, d)$ where $d$ is the inverse of $e$ in $\mathbb{Z}^*_{\phi(N)}$.
Suppose RSA was defined modulo a prime $p$ instead of an RSA composite $N$. Show that in that case anyone can compute the private key $(N, d)$ from the public key $(N, e)$ by computing:

- [ ] $d \leftarrow -e$ (mod $p$).
- [x] $d \leftarrow e^{-1}$ (mod $p - 1$).
- [ ] $d \leftarrow e^{-1}$ (mod $p + 1$).
- [ ] $d \leftarrow e^{-1}$ (mod $p$).

> **Explain:** We have $N = p \rightarrow \phi(N) = p - 1$
> - Since $d$ is the inverse of $e$ in $\mathbb{Z}^*_{\phi(N)}$, therefore: $d \cdot e = 1$ (mod $\phi(N)$) $= 1$ (mod $p - 1$).
> - Transform this we have $d = e^{-1}$ (mod $p - 1$).
