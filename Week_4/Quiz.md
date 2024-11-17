# AUTHENTICATED ENCRYPTION

---

### Q1.
An attacker intercepts the following ciphertext (hex encoded): 
`20814804c1767293b99f1d9cab3bc3e7 ac1e37bfb15599e5f40eef805488281d`
He knows that the plaintext is the ASCII encoding of the message "Pay Bob 100\$" (excluding the quotes). He also knows that the cipher used is CBC encryption with a random IV using AES as the underlying block cipher.
Show that the attacker can change the ciphertext so that it will decrypt to "Pay Bob 500\$". What is the resulting ciphertext (hex encoded)?
This shows that CBC provides no integrity.

**Answer:**
`20814804c1767293bd9f1d9cab3bc3e7 ac1e37bfb15599e5f40eef805488281d`

> **Explain:** 
>  - AES has a block size of 16 bytes (128 bits).
>  - Since "Pay Bob 100$" is a 12-character string, which is padded to 16 bytes, it should fit into a single block.
>  - Finding the position to modify:
>    -  ASCII of `100$` is: `31 30 30 24`
>    - ASCII of `500$` is: `35 30 30 24`
>    - The difference is only in the first character: `31` should become `35`.
>    - XOR difference needed to change `1` to `5`: `31` $\oplus$ `35 = 04` $= x$
>    - Because $m[0] = D(k, c[0]) \oplus IV \to m'[0] = D(k, c[0]) \oplus IV \oplus \{00000000x0000000\}$ so we only need to modify the IV to get the desired text
>    - Since `1` is at the $9^{th}$ byte of Ciphertext block we need to modify the $9^{th}$ byte of the previous block which is `b9` in the IV block: `b9` $\oplus$ `04 = bd` 
> - So the first block needs to modified to `20814804c1767293bd9f1d9cab3bc3e7` and the second block remain the same.


### Q2.
Let $(E, D)$ be an encryption system with key space $K$, message space $\{0, 1\}^n$ and ciphertext space $\{0, 1\}^s$. Suppose $(E, D)$ provides authenticated encryption. Which of the following systems provide authenticated encryption:
- [ ] \( E'(k, m) = (E(k, m), 0) \) and  
  \( D'(k, (c, b)) = D(k, c) \)

> **Explain:** This does not provide integrity where the attacker queries for $E'(k, m)$ to obtain $(c, 0)$. It then outputs $(c, x)$ for every $x \neq 0$ to win the ciphertext integrity game.

- [x] \( E'(k, m) = E(k, m \oplus 1^n) \) and  
  \( D'(k, c) = \begin{cases} 
      D(k, c) \oplus 1^n & \text{if } D(k, c) \neq \perp \\ 
      \perp & \text{otherwise} 
    \end{cases} \)

- [ ] \( E'(k, m) = (E(k, m), E(k, m)) \) and  
  \( D'(k, (c_1, c_2)) = \begin{cases} 
      D(k, c_1) & \text{if } D(k, c_1) = D(k, c_2) \\ 
      \perp & \text{otherwise} 
    \end{cases} \)

> **Explain:** This system does not provide ciphertext integrity. To see why, recall that authenticated encryption (without a nonce) must be randomized to provide CPA security. Therefore, $E'(k, m) = (c_1, c_2)$ will likely output a distinct ciphertext pair $c_1 \neq c_2$. The attacker can then output the ciphertext $(c_1, c_1)$ and win the integrity game. 
- [x] \( E'(k, m) = (E(k, m), 0) \) and  
  \( D'(k, (c, b)) = \begin{cases} 
      D(k, c) & \text{if } b = 0 \\ 
      \perp & \text{otherwise} 
    \end{cases} \)

- [ ] \( E'(k, m) = (E(k, m), H(m)) \) and

\[
D'(k, (c, h)) = 
\begin{cases} 
D(k, c) & \text{if } H(D(k, c)) = h \\ 
\perp & \text{otherwise}
\end{cases}
\]

(here \( H \) is some collision-resistant hash function)

> **Explain:**  This system is not CPA secure because $H(m)$ leaks information about the message in the ciphertext.   

 
### Q3.
If you need to build an application that needs to encrypt multiple messages using a single key, what encryption method should you use? (for now, we ignore the question of key generation and management)
- [ ] use a standard implementation of CBC encryption with a random $IV$.
- [x] use standard implementation of one the authenticated encryption modes GCM, CCM, EAX or OCB.
- [ ] implement OCB your self.
- [ ] use a standard implementation of randomized counter mode

### Q4.
Let $(E, D)$ be a symmetric encryption system with message space $M$ (think of $M$ as only consisting for short messages, say $32$ bytes). Define the following MAC $(S, V)$ for messages in $M$:
\( S(k, m) := E(k, m); \quad V(k, m, t) := 
\begin{cases} 
1 & \text{if } D(k, t) = m \\ 
0 & \text{otherwise}
\end{cases} \)
What is the property that the encryption system $(E, D)$ needs to satisfy for this MAC system to be secure?
- [x] authenticated encryption
- [ ] semantic security under a chosen plaintext attack
- [ ] semantic security
- [ ] chosen ciphertext security

> **Explain:** Authenticated encryption implies ciphertext integrity which prevents existential forgery under a chosen message attack.

### Q5.
In [Key Derivation](https://www-origin.coursera.org/learn/crypto/lecture/A1ETP/key-derivation) we discussed how to derive session keys from a shared secret. The problem is what to do when the shared secret is non-uniform. In this question we show that using a PRF with a non-uniform key may result in non-uniform values. This shows that session keys cannot be derived by directly using a non-uniform secret as a key in a PRF. Instead, one has to use a key derivation function like HKDF.
Suppose $k$ is a *non-uniform* secret key sampled from the key space $\{0, 1\}^{256}$.
In particular, $k$ is sampled uniformly from the set of all keys whose most significant $128$ bits are all $0$. In other words, $k$ is chosen uniformly from a small subset of the key space. More precisely, for all \( c \in \{0, 1\}^{256} : \Pr[k = c] = 
\begin{cases} 
\frac{1}{2^{128}} & \text{if } \text{MSB}_{128}(c) = 0^{128} \\ 
0 & \text{otherwise}
\end{cases} \)
Let $F(k, x)$ be a secure PRF with input space $\{0, 1\}^{126}$. Which of the following is a secure PRF when the key $k$ is uniform in the key space $\{0, 1\}^{126}$, but is insecure when the key is sampled from the *non-uniform* distribution described above?
- [x] \(F'(k, x) = 
\begin{cases}
F(k, x) & \text{if } MSB_{128} \neq 0^{128} \\
1^{256} & \text{otherwise}
\end{cases}\)
- [ ] \(F'(k, x) = 
\begin{cases}
F(k, x) & \text{if } MSB_{128} \neq 1^{128} \\
1^{256} & \text{otherwise}
\end{cases}\)
- [ ] \(F'(k, x) = 
\begin{cases}
F(k, x) & \text{if } MSB_{128} \neq 1^{128} \\
0^{256} & \text{otherwise}
\end{cases}\)
- [ ] $F'(k, x) = F(k, x)$

> **Explain:** 
> * Case uniform key $k$: the probability for $k$ to have the $MSB_{128} = 0^{128}$ is $\frac{1}{2^{128}}$ which is neligible, so it will fall into the case of $F(k, x)$ which is a secure $PRF$.
> * Case non-uniform key $k$ ($MSB_{128} = 0^{128}$): it will always output $1^{256}$ which is distinguishable, so not secure.

### Q6.
In what settings is it acceptable to use *deterministic authenticated* encryption (DAE) like $SIV$?
- [x] when the encryption key is used to encrypt only one message.
- [ ] when a fixed message is repeatedly encrypted using a single key.
- [ ] to individually encrypt many packets in a voice conversation with a single key.
- [ ] to encrypts many records in a database with a single key when the same record may repeat multiple times.

> **Explain:** Deterministic encryption is safe to use when the message/key pair is never used more than once.
### Q7.
Let $E(k, x)$ be a secure block cipher. Consider the following tweakable block cipher:
$E'((k_1, k_2), t, x) = E(k_1, k_2) \oplus E(k_2, t)$
Is this tweakable block cipher secure?
- [x] no, because for $t \neq t'$ we have 
$E'((k_1, k_2), t, 0) \oplus E'((k_1, k_2), t, 1) = E'((k_1, k_2), t', 0) \oplus E'((k_1, k_2), t', 1)$
- [ ] no, because for $t \neq t'$ we have 
$E'((k_1, k_2), t, 0) \oplus E'((k_1, k_2), t', 1) = E'((k_1, k_2), t', 0) \oplus E'((k_1, k_2), t', 1)$
- [ ] no, because for $x \neq x' \text{ and }t \neq t'$ we have 
$E'((k_1, k_2), t, x) \oplus E'((k_1, k_2), t', x) = E'((k_1, k_2), t, x') \oplus E'((k_1, k_2), t', x)$
- [ ] no, because for $x \neq x'$ we have 
$E'((k_1, k_2), 0, x) \oplus E'((k_1, k_2), 0, x) = E'((k_1, k_2), 0, x') \oplus E'((k_1, k_2), 0, x')$
- [ ] yes, it is secure assuming $E$ is a secure cipher block.

> **Explain:** Since this relation holds, an attacker can make those 4 queries to $E'$ and distinguish $E'$ from a random collection of 1-to-1 functions. 
### Q8.
In [Format Preserving Encryption](https://www-origin.coursera.org/learn/crypto/lecture/aFRSZ/format-preserving-encryption) we discussed format preserving encryption which is a PRP on a domain $\{0, 1, ..., s - 1\}$ for some pre-specified value of $s$.
Recall that the construction we presented worked in two steps, where the second step worked by iterating the PRP until the output fell into the set $\{0, 1, ..., s - 1\}$.
Suppose we try to build a format preserving credit card encryption system from AES using *only* the second step.   That is, we start with a PRP with domain $\{0, 1\}^{128}$ from which we want to build a PRP with domain $10^6$. If we only used step (2), how many iterations of AES would be needed in expectation for each evaluation of the PRP with domain $10^{16}$.
- [ ] $2^{128}$
- [x] $2^{128}/10^{16} \approx 3.4 \times 10^{22}$
- [ ] $2$
- [ ] $10^{16}/2^{128}$

> **Explain:** The probability of hitting the desired smaller domain in a single iteration is: $\frac{10^{16}}{2^{128}}$. There for number of iteration needed is $\frac{1}{\frac{10^{16}}{2^{128}}} = \frac{2^{128}}{10^{16}}$

### Q9.
Let $(E, D)$ be a secure tweakable block cipher. 
Define the following MAC $(S, V)$:
\( S(k, m) := E(k, m, 0); \quad V(k, m, tag) := 
\begin{cases} 
1 & \text{if } E(k, m, 0) = tag \\ 
0 & \text{otherwise}
\end{cases} \)
In other words, the message $m$ is used as the tweak and the plaintext given to $E$ is always set to $0$. Is this MAC secure?
- [ ] no.
- [ ] it depends on the tweakable block cipher.
- [x] yes.

> **Explain:** Each message $m$ maps to a unique tag under the assumption that $E$ is secure, an adversary should not be able to guess or forge a new valid tag for any unqueried $m$ without the key.

### Q10.
In [CBC Padding Attacks](https://www-origin.coursera.org/learn/crypto/lecture/8s23o/cbc-padding-attacks) we discussed padding oracle attacks. These chosen-ciphertext attacks can break poor implementations of MAC-then-encrypt. 
Consider a system that implements MAC-then-encrypt where encryption is done using CBC with a random IV using AES as the block cipher. Suppose the system is vulnerable to a padding oracle attack. An attacker intercepts a 64-byte ciphertext $c$ (the first 16 bytes of $c$ are the $IV$ and the remaining 48 bytes are the encrypted payload).  How many chosen ciphertext queries would the attacker need in the worst case in order to decrypt the entire 48 byte payload?  Recall that padding oracle attacks decrypt the payload one byte at a time. 
- [ ] $16384$
- [ ] $256$
- [ ] $48$
- [ ] $1024$
- [x] $12288$

> **Explain:** Padding oracle attacks decrypt the payload one byte at a time. For each byte the attacker needs no more than 256 guesses in the worst case. Since there are 48 bytes total, the number queries needed is $256 \times 48 = 12288$ (slide 398).
