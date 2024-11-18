# COURSE OVERVIEW AND STREAM CIPHERS

---

### Q1.

Data compression is often used in data storage and transmission. Suppose you want to use data compression in conjunction with encryption. Does it make more sense to:

- [x] Compress then encrypt.
- [ ] Encrypt then compress.
- [ ] The order does not matter - neither one will compress the data.
- [ ] The order does not matter - either one is fine.

> **Explain:** Ciphertexts tend to look like random strings so therefore the only opportunity for compression is prior to encryption

### Q2.

Let $G: {0, 1}^s \rightarrow {0, 1}^n$ be a secure PRG. Which of the following is a secure PRG (there is more than one correct answer):

- [ ] $G'(k) = G(0)$
> **Explain:** A distinguisher will output not random whenever the same output $G(0)$ is shown after 2 generations.
- [ ] $G'(k) = G(k) || 0$
> **Explain:** A distinguisher will output not random whenever the last bit of its input is 0.
- [x] $G'(k) = G(k \oplus 1^s)$
- [x] $G'(k) = G(k) \oplus 1^n$
- [ ] $G'(k) = G(k) || G(k)$
> **Explain:** A distinguisher will output not random whenever the first n bits are equal to the last n bits.
- [x] $G'(k) = G(k)[0, ..., n - 2]$ (i.e., $G'(k)$ drops the last bit of $G(k)$)

### Q3.

Let $G: K \rightarrow {0, 1}^n$ be a secure PRG.
Define $G'(k_1, k_2) = G(k_1) \land G(k_2)$ where $\land$ is the bit-wise AND function.
Consider the following statistical test $A$ on ${0, 1}^n$:
$A(x)$ outputs $LSB(x)$, the least significant bit of $x$.
What is $Adv_{PRG}[A, G']$?
You may assume that $LSB(G(k))$ is 0 for exactly half the seeds $k$ in $K$.
Note: Please enter the advantage as a decimal between 0 and 1 with a leading 0. If the advantage is 3/4, you should enter it as 0.75
`Answer: 0.25`

> **Explain:** We can prove that
>
> - $Pr(A(G'(k_1, k_2)) = 1) = \frac{1}{4}$
>   because $A(G'(k_1, k_2))$ ouputs $1$ when $LSB(G(k_1) \land G(k_2)) = 1 \rightarrow LSB(G(k_1)) = LSB(G(k_2)) = 1$ (there is only 1 in 4 combination of $LSB(G(k_1)), LSB(G(k_2))$)
> - $Pr(A(G(k)) = 1) = 1 - \frac{1}{2} = \frac{1}{2}$ (denote from the task)
>
> $\rightarrow Adv_{PRG}[A, G'] = |Pr(A(G'(k_1, k_2)) = 1) - Pr(A(G(k)) = 1)| = |\frac{1}{4} - \frac{1}{2}| = 0.25$

### Q4.

Let $(E, D)$ be a (one-time) semantically secure cipher with key space $K = \{0, 1\}^l$. A bank wishes to split a decryption key $k \in \{0, 1\}^l$ into two pieces $p_1$ and $p_2$ so that both are needed for decryption. The piece $p_1$ can be given to one executive and $p_2$ to another so that both must contribut their piecesfor decryption to proceed.
The bank generates random $k_1$ in $\{0, 1\}^l$ and sets $k'_1 \leftarrow k \oplus k_1$. Note that $k \oplus k'_1 = k$. The bank can give $k_1$ to one executive and $k'_1$ to another. Both must be present for decryption to proceed since, by itself, each piece contains no information about the secret key $k$ (note that each piece is a one-time pad encryption of $k$).
Now, suppose the bank wants to split $k$ into three pieces $p_1, p_2, p_3$ so that any two of the pieces enable decryption using $k$. This ensures that even if one executive is out sick, decryption can still succeed. To do so the bank generates two random pairs $(k_1, k'_1)$ and $(k_2, k'_2)$ as in the previous paragraph so that $k_1 \oplus k'_1 = k_2 \oplus k'_2 = k$.
How should the bank assign pieces so that any two pieces enable decryption using $k$, but no single piece can decypt?

- [ ] $p_1 = (k_1, k_2)$, $p_2 = (k_2, k'_2)$, $p_3 = (k'_2)$
- [x] $p_1 = (k_1, k_2)$, $p_2 = (k'_1, k_2)$, $p_3 = (k'_2)$
- [ ] $p_1 = (k_1, k_2)$, $p_2 = (k_1, k_2)$, $p_3 = (k'_2)$
- [ ] $p_1 = (k_1, k_2)$, $p_2 = (k'_1)$, $p_3 = (k'_2)$
- [ ] $p_1 = (k_1, k_2)$, $p_2 = (k'_1, k'_2)$, $p_3 = (k'_2)$

> **Explain:** From the task, the message must be decrypted using atleast $p_i$ and $p_j$ $(\forall i,j \in [1, 3], i \neq j)$
>
> - (1) using only $p_2$ can decrypt the message
> - (3) using $p_1$ and $p_2$ cannot decrypt the message
> - (4) using $p_2$ and $p_3$ cannot decrypt the message
> - (5) using $p_2$ and $p_3$ cannot decrypt the message

### Q5.

Let $M = C = K = {0, 1, 2, ..., 255}$ and consider the following cipher defined over $$(K, M, C): E(k, m) = m + k \text{ (mod 256); } D(k, c) = c - k \text{ (mod 256); }$$ Does this cipher have perfect secrecy?

- [ ] No, only the One Time Pad has perfect secrecy.
- [x] Yes.
- [ ] No, there is a simple attack on this cipher.

> **Explain:** We have $c = m + k$ mod $256 \rightarrow k = c - m$ mod $256$ which is exactly one key mapping a given message m to a ciphertext c just like with OTP, which has perfect secrecy. 

### Q6.

Let $(E, D)$ be a (one-time) semantically secure cipher where the message and ciphertext space is ${0, 1}^n$. Which of the following encryption schemes are (one-time) semantically secure?

- [ ] $E'(k, m) = E(k, m) || LSB(m)$
- [x] $E'(k, m) = 0 || E(k, m)$ (i.e. prepend 0 to the ciphertext)
- [ ] $E'(k, m) = E(k, m) || k$
- [x] $E'(k, m) = reverse(E(k, m))$
- [ ] $E'(k, m) = E(0^n, m)$
- [x] $E'((k, k'), m) = E(k, m) || E(k', m)$

> **Explain:**
> - (1) expose m's content
> - (3) expose k
> - (5) key is not changed $\rightarrow$ not (one-time) semantically secure

### Q7.

Suppose you are told that the one time pad encryption of the message "attack at dawn" is _09e1c5f70a65ac519458e7e53f36_
(the plaintext letters are encoded as 8-bit ASCII and the given ciphertext is written in hex). What would be the one time pad encryption of the message "attack at dusk" under the same OTP key?)
`Answer: 09e1c5f70a65ac519458e7f13b33`

> **Explain:** Let $m_1$ = "attack at dawn", $c_1$ = "09e1c5f70a65ac519458e7e53f36", $m_2$ = "attack at dusk"
> Goal is to find $c_2 = m_2 \oplus k$ where $k = m_1 \oplus c_1$ since the key is reused.

### Q8.

The movie industry wants to protect digital content distributed on DVD’s. We develop a variant of a method used to protect Blu-ray disks called AACS. Suppose there are at most a total of $n$ DVD players in the world (e.g. $n = 2^{32}$). We view these $n$ players as the leaves of a binary tree of height $log_2n$. Each node in this binary tree contains an AES key $k_i$. These keys are kept secret from consumers and are fixed for all time. At manufacturing time each DVD player is assigned a serial number $i \in [0, n - 1]$. Consider the set of nodes $S_i$ along the path from the root to leaf number $i$ in the binary tree. The manufacturer of the DVD player embeds in player number $i$ the keys associated with the nodes in the set $S_i$. A DVD movie $m$ is encrypted as $E(k_{root}, k) || E(k, m)$ where $k$ is a random AES key called a content-key and $k_{root}$ is the key associated with root of the tree. Since all DVD players have the key $k_{root}$ all players can decrypt the movie $m$. We refer to $E(k_{root}, k)$ as the header and $E(k, m)$ as the body. In what follows the DVD header may contain multiple ciphertexts where each ciphertext is the encryption of the content-key $k$ under some key $k_i$ in the binary tree.
Suppose the keys embedded in DVD player number $r$ are exposed by hackers and published on the Internet. In this problem we show that when the movie industry distributes a new DVD movie, they can encrypt the contents of the DVD using a slightly larger header (containing about $log_2n$ keys) so that all DVD players, except for player number $r$, can decrypt the movie. In effect, the movie industry disables player number $r$ without affecting other players.
As shown below, consider a tree with $n=16$ leaves. Suppose the leaf node labeled 25 corresponds to an exposed DVD player key. Check the set of keys below under which to encrypt the key $k$ so that every player other than player 25 can decrypt the DVD. Only four keys are needed.
![DVD_encryption](https://hackmd.io/_uploads/ByhYD3agkx.png)

- [x] 26
- [x] 1
- [ ] 0
- [x] 6
- [ ] 23
- [ ] 16
- [x] 11
- [ ] 17

> **Explain:** Since DVD 25's key is exposed $\rightarrow$ all keys on the path to DVD is exposed $(k_0, k_2, k_5, k_{12}, k_{25})$
> So for every other DVDs to successfully decrypt the key $k$ they must not use those keys. For DVD:
>
> - $(15 \rightarrow 22)$ use key 1
> - $(23,24)$ use key 11
> - $(27 \rightarrow 30)$ use key 6
> - $26$ use key 26

### Q9.

Continuing with the previous question, if there are $n$ DVD players, what is the number of keys under which the content key $k$ must be encrypted if exactly one DVD player's key needs to be revoked?

- [x] $log_2n$
- [ ] $n/2$
- [ ] $\sqrt{n}$
- [ ] $2$
- [ ] $n - 1$

> **Explain:** The key will need to be encrypted with every key on each node on the path from root to that DVD. There are $log_2n$ nodes on that path.

### Q10.

Continuing with question 8, suppose the leaf nodes labeled 16, 18, and 25 correspond to exposed DVD player keys. Check the smallest set of keys under which to encrypt the key k so that every player other than players 16, 18 and 25 can decrypt the DVD. Only six keys are needed.

- [x] 4
- [x] 6
- [x] 11
- [x] 15
- [x] 17
- [x] 26
- [ ] 8
- [ ] 13
- [ ] 14
- [ ] 20

> **Explain:** Same as Q8 👀
