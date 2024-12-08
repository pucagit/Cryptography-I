# BLOCK CIPHERS

---

### Q1.

Consider the following five events:

1. Correctly guessing a random 128-bit AES key on the first try.
2. Winning a lottery with 1 million contestants (the probability is $\frac{1}{10^6}$).
3. Winning a lottery with 1 million contestants 5 times in a row (the probability is $(\frac{1}{10^6})^5$.
4. Winning a lottery with 1 million contestants 6 times in a row.
5. Winning a lottery with 1 million contestants 7 times in a row.
   What is the order of these events from most likely to least likely?

- [x] 2,3,4,1,5
- [ ] 2,3,5,4,1
- [ ] 2,4,3,1,5
- [ ] 3,2,5,4,1

> **Explain:** The probability of event:
> (1) is $\frac{1}{2^{128}}$
> (2) is $\frac{1}{10^6} \approx \frac{1}{2^{20}}$
> (3) is $\frac{1}{(10^6)^5} \approx \frac{1}{2^{100}}$
> (4) is $\frac{1}{(10^6)^6} \approx \frac{1}{2^{120}}$
> (5) is $\frac{1}{(10^6)^7} \approx \frac{1}{2^{140}}$

---

### Q2.

Suppose that using commodity hardware it is possible to build a computer for about $200 that can brute force about 1 billion AES keys per second. Suppose an organization wants to run an exhaustive search for a single 128-bit AES key and was willing to spend 4 trillion dollars to buy these machines (this is more than the annual US federal budget). How long would it take the organization to brute force this single 128-bit AES key with these machines? Ignore additional costs such as power and maintenance.

- [x] More than a billion ($10^9$) years
- [ ] More than a year but less than 100 years
- [ ] More than a week but less than a month
- [ ] More than a 100 years but less than a million years
- [ ] More than a month but less than a year

> **Explain:** The answer is about 540 billion years.
> - #machines = $\frac{4 \times 10^{12}}{200} = 2 \times 10^{10}$
> - #keys processed per sec = $10^9 \times (2 \times 10^{10}) = 2 \times 10^{19}$
> Worst case: needs to brute force all $2^{128}$ possible combination of keys
> $\rightarrow$ #seconds = $\frac{2^{128}}{2 \times 10^{19}} = 1.7 \times 10^{19} \approx 540 \times 10^9$ years.

---

### Q3.

Let $F: \{0, 1\}^n \times \{0, 1\}^n \rightarrow \{0, 1\}^n$ be a secure PRF (i.e. a PRF where the key space, input space, and output space are all $\{0, 1\}^n$) and say $n = 128$.
Which of the following is a secure PRF (there is more than one correct answer):

- [ ] $F'(k, x) = k \oplus x$
  > **How to break:** send $x_1 = 0^n, x_2 = 1^n$ if $F'(k, x_1) \oplus F'(k, x_2) = 1^n \rightarrow$ distinguish from a truly random generator
- [ ] $F'(k, x) = F(k, x) \oplus F(k, x \oplus 1^n)$
  > **How to break:** send $x_1 = 0^n, x_2 = 1^n$ if $F'(k, x_1) = F'(k, x_2) \rightarrow$ distinguish from a truly random generator
- [ ] $F'(k, x) = 
\left\{
    \begin{array}{ll}
      F(k, x) & \text{when } x \neq 0^n \\
      0^n & \text{otherwise}
    \end{array}
\right.$
  > **How to break:** send $x = 0^n$ always receive $F'(k, x) = 0^n \rightarrow$ distinguish from a truly random generator
- [x] $F'((k_1, k_2), x) = F(k_1, x) \oplus F(k_2, x)$
  > **Explain:** Cannot distinguish F' from a truly random generator
- [x] $F'(k, x) = F(k, x \oplus 1^n)$
  > **Explain:** Cannot distinguish F' from a truly random generator
- [x] $F'((k_1, k_2, x)) = F(k_1, x) || F(k_2, x)$
  > **Explain:** Cannot distinguish F' from a truly random genrator

### Q4.

Recall that the Luby-Rackoff theorem discussed in [The Data Encryption Standard lecture](https://www.coursera.org/learn/crypto/lecture/TzBaf/the-data-encryption-standard) states that applying a three round Feistel network to a secure PRF gives a secure block cipher. Let's see what goes wrong if we only use a two round Feistel.
Let $F: K \times \{0, 1\}^{32} \rightarrow \{0, 1\}^{32}$ be a secure PRF.
Recall that a 2-round Feistl defines the following PRP
$F_2: K^2 \times \{0, 1\}^{64} \rightarrow \{0, 1\}^{64}$\
![2-round_Feistel](https://hackmd.io/_uploads/H1vL-K2lkx.png)
Here $R_0$ is the right 32 bits of the 64-bit input and $L_0$ is the left 32 bits. One of the following lines is the output of this PRP $F_2$ using a random key, while the other three are the output of a truly random permutation $f: \{0, 1\}^{64} \rightarrow \{0, 1\}^{64}$. All 64-bit outputs are encoded as 16 hex characters.
Can you say which is the output of the PRP? (Note that since you are able to distinguish the output of $F_2$ from random, $F_2$ is not a secure block cipher, which is what we wanted to show).
**Hint:** First argue that there is a detectable pattern in the XOR of $F(\cdot, 0^{64})$ and $F(\cdot, 1^{32}0^{32})$. Then try to detect this pattern in the given outputs.

- [x] On input $0^{64}$ the output is "9f970f4e 932330e4"
      On input $1^{32}0^{32}$ the output is "6068f0b1 b645c008"
- [ ] On input $0^{64}$ the output is "7c2822eb fdc48bfb"
      On input $1^{32}0^{32}$ the output is "325032a9 c5e2364b"
- [ ] On input $0^{64}$ the output is "4af53267 1351e2e1"
      On input $1^{32}0^{32}$ the output is "87a40cfa 8dd39154"
- [ ] On input $0^{64}$ the output is "2d1cfa42 c0b1d266"
      On input $1^{32}0^{32}$ the output is "eea6e3dd b2146dd0"

> **Explain:** (_Code:_ [TwoRoundFeistel.py](https://github.com/pucagit/Cryptography-I/blob/main/Week%202/TwoRoungFeistel.py)) From the figure we can easily prove that $L_2 = L_0 \oplus F(k_1, R_0)$ so with these 2 inputs:
> - $0^{64} \rightarrow L_2 = F(k_1, 0^{32})$
> - $1^{32}0^{32} \rightarrow L'_2 = 1^{64} \oplus F(k_1, 0^{32})$
> Then $L_2 \oplus L'_2 = 1^{64}$

### Q5.

Nonce-based CBC. Recall that in [Lecture 4.4](https://www.coursera.org/learn/crypto/lecture/wlIX8/modes-of-operation-many-time-key-cbc) we said that if one wants to use CBC encryption with a non-random unique nonce then the nonce must first be encrypted with an independent PRP key and the result then used as the CBC IV.
Let's see what goes wrong if one encrypts the nonce with the same PRP key as the key used for CBC encryption.
Let $F: K \times \{0, 1\}^l \rightarrow \{0, 1\}^l$ be a secure PRP with, say, $l = 128$. Let $n$ be a nonce and suppose one encrypts a message $m$ by first computing $IV = F(k, n)$ and then using this IV in CBC encryption using $F(k, \cdot)$. Note that the same key $k$ is used for computing the IV and for CBC encryption. We show that the resulting system is not nonce-based CPA secure.
The attacker begins by asking for the encryption of the two block message $m = (0^l, 0^l)$ with nonce $n = 0^l$. It receives back a two block ciphertext $(c_0, c_1)$. Observe that by definition of CBC we know that $c_1 = F(k, c_0)$.
Next, the attacker asks for the encryption of the one block message $m_1 = c_0 \oplus c_1$ with nonce $n = c_0$. It receives back a one block ciphertext $c'_0$.
What relation holds between $c_0, c_1, c'_0$? Note that this relation lets the adversary win the nonce-based CPA game with advantage 1.

- [ ] $c_1 = c_0 \oplus c'_0$
- [x] $c_1 = c'_0$
- [ ] $c_0 = c_1 \oplus c'_0$
- [ ] $c'_0 = c_0 \oplus 1^l$

> **Explain:**: From the definition of CBC with an encrypted nonce we can see that:
> - $c_1 = E(k, c_0)$
> - $c'_0 = E(k, c_0 \oplus c_1 \oplus E(k, c_0)) = E(k, c_0 \oplus c_1 \oplus c_1) = E(k, c_0) = c_1$

### Q6.

Let $m$ be a message consisting of $l$ AES blocks (say $l = 100$). Alice encrypts $m$ using CBC mode and transmits the resulting ciphertext to Bob. Due to a network error, ciphertext block number $l/2$ is corrupted during transmission. All other ciphertext blocks are transmitted and received correctly.
Once Bob decrypts the received ciphertext, how many plaintext blocks will be corrupted?

- [ ] $3$
- [ ] $l/2$
- [x] $2$
- [ ] $0$
- [ ] $l$

> **Explain:** In the CBC **decryption** circuit, each ciphertet blocks affects only the current plaintext block and the next.

### Q7.

Let $m$ be a message consisting of $l$ AES blocks (say $l = 100$). Alice encrypts $m$ using randomized counter mode and transmits the resulting ciphertext to Bob. ue to a network error, ciphertext block number $l/2$ is corrupted during transmission. All other ciphertext blocks are transmitted and received correctly.
Once Bob decrypts the received ciphertext, how many plaintext blocks will be corrupted?

- [ ] $0$
- [ ] $1 + l/2$
- [ ] $l/2$
- [x] $1$
- [ ] $3$

> **Explain:** In the CBC counter mode **decryption** circuit, each ciphertet blocks affects only the current plaintext block.

### Q8.

Recall that encryption systems do not fully hide the length of has been used to eavesdrop on encrypted HTTPS traffic to a number of web sites, such as tax preparation sites, Google searches, and healthcare sites.
Suppose an attacker intercepts a packet where he knows that the packet payload is encrypted using AES in CBC mode with a random IV. The encrypted packet payload is 128 bytes. Which of the following messages is plausibly the decryption of the payload:

- [x] "An encyphering-deciphering machine (in general outline) of my invention has been sent to your organization."
- [ ] "The most direct computation would be for the enemy to try all 2^r possible keys, one by one."
- [ ] "We see immediately that one needs little information to begin to break down the process."
- [ ] "To consider the resistance of the enciphering process to being broken we should assume that at the same times the enemy knows everything but the key being used and to break it needs only discover the key from this information."

> **Explain:** (_Code:_ [GuessPayload.py](https://github.com/pucagit/Cryptography-I/blob/main/Week_2/GuessPayload.py)) The length of the string is 106 bytes, which after padding becomes 112 bytes, and after prepending the IV becomes 128 bytes.

### Q9.

Let $R := \{0, 1\}^4$ and consider the following PRF $F: R^5 \times R \rightarrow R$ defined as follows:
$F(k, x) := 
\left\{
    \begin{array}{ll}
        t = k[0] \\
        \text{for } i = 1 \text{ to } 4 \text{ do} \\
        \quad \text{if } (x[i - 1] == 1) \text{ } t = t \oplus k[i] \\
        \text{output } t
    \end{array}
\right.$
That is, the key is $k = (k[0], k[1], k[2], k[3], k[4])$ in $R^5$ and the function at, for example, $0101$ is defined as $F(k, 0101) = k[0] \oplus k[2] \oplus k[4]$.
For a random key $k$ unknown to you, you learn that
$\quad F(k, 0110) = 0011$ and $F(k, 0101) = 1010$ and $F(k, 1110) = 0110$.
What is the value of $F(k, 1101)$? Note that since you are able to predict the function at new point, this PRF is insecure.
`Answer: 1111`

> **Explain:** From the given arguments we see that:
> - $F(k, 0110) = 0011 = k[0] \oplus k[2] \oplus k[3]$ _(1)_
> - $F(k, 0101) = 1010 = k[0] \oplus k[2] \oplus k[4]$ _(2)_
> - $F(k, 1110) = 0110 = k[0] \oplus k[1] \oplus k[2] \oplus k[3]$ (3)
> Let $(1) \oplus (2) \equiv k[3] \oplus k[4] = 1001$ _(4)_
> Then $F(k, 1101) = k[0] \oplus k[1] \oplus k[2] \oplus k[4] = (3) \oplus (4) = 1111$
