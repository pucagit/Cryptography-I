# Midterm Practice Worksheet CS 255

### Problem 1.

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


### Problem 2.

Let $M = C = K = {0, 1, 2, ..., 255}$ and consider the following cipher defined over $$(K, M, C): E(k, m) = m + k \text{ (mod 256); } D(k, c) = c - k \text{ (mod 256); }$$ Does this cipher have perfect secrecy?
- [ ] No, there is a simple attack on this cipher.
- [ ] No, only the One Time Pad has perfect secrecy.
- [x] Yes.
- [ ] It would, if 255 were a prime number.

> **Explain:** We have $c = m + k$ mod $256 \rightarrow k = c - m$ mod $256$ which is exactly one key mapping a given message m to a ciphertext c just like with OTP, which has perfect secrecy. 

### Problem 3.

Let $(E, D)$ be a (one-time) semantically secure cipher where the message and ciphertext space is ${0, 1}^n$. Which of the following encryption schemes are (one-time) semantically secure?
- [ ] $E'(k, m) = E(k, m) || LSB(m)$
- [x] $E'(k, m) = 000 || E(k, m)$ 
- [ ] $E'(k, m) = E(k, m) || k$
- [ ] $E'(k, m) = E(0^n, m)$

> **Explain:**
> - (1) expose m's content
> - (3) expose k
> - (4) key is not changed $\rightarrow$ not (one-time) semantically secure

### Problem 4.

Suppose that using commodity hardware it is possible to build a computer for about $200 that can brute force about 10 billion AES keys per second. Suppose an organization wants to run an exhaustive search for a single 128-bit AES key and was willing to spend 4 trillion dollars to buy these machines (this is more than the annual US federal budget). How long would it take the organization to brute force this single 128-bit AES key with these machines? Ignore additional costs such as power and maintenance.
- [x] More than a billion ($10^9$) years
- [ ] More than a year but less than 100 years
- [ ] More than a week but less than a month
- [ ] More than a 100 years but less than a million years
- [ ] More than a month but less than a year

> **Explain:** The answer is about 54 billion years.
> - #machines = $\frac{4 \times 10^{12}}{200} = 2 \times 10^{10}$
> - #keys processed per sec = $10^{10} \times (2 \times 10^{10}) = 2 \times 10^{20}$
> Worst case: needs to brute force all $2^{128}$ possible combination of keys
> $\rightarrow$ #seconds = $\frac{2^{128}}{2 \times 10^{20}} = 1.7 \times 10^{18} \approx 54 \times 10^9$ years.

### Problem 5.
Let $F: \{0,1\}^n \times \{0,1\}^n \rightarrow \{0,1\}^n$ be a secure PRF (i.e, the key space, input space and output space are all $\{0,1\}^n$), where $n = 128$. Consider the following derived PRFs:
$$F_1(k, x) = F(k, x \oplus 1^n); F_2(k, x) = F(k, x) || 0; F_3((k_1, k_2), x) = \begin{cases}
    F(k_1, x) & \text{when } x \neq 0^n \\ 
    k_2 & \text{otherwise}
\end{cases} $$
Which of these is a secure PRF?
- [ ] $F_1,F_2$, but not $F_3$.
- [ ] $F_1,F_3$, but not $F_2$.
- [ ] $F_2,F_3$, but not $F_1$.
- [x] $F_1$, but not $F_2$ or $F_3$.
- [ ] $F_3$, but not $F_1$ or $F_2$.
  
> **Explain:** 
> $F_2$ : A distinguisher can always look for a 0 at the last bit to distinguish with a truly random function.
> $F_3$ : A distinguisher will always get the same fixed key $k_2$ for input $0^n$ which is distinguishable from a truly random function.

### Problem 6.
Let $m$ be a message consisting of $l$ AES blocks (say $l = 100$). Alice encrypts $m$ using randomized counter mode and transmits the resulting ciphertext to Bob. ue to a network error, ciphertext block number $l/2$ is corrupted during transmission. All other ciphertext blocks are transmitted and received correctly.
Once Bob decrypts the received ciphertext, how many plaintext blocks will be corrupted?
- [ ] $0$
- [ ] $1 + l/2$
- [ ] $l/2$
- [x] $1$
- [ ] $3$

> **Explain:** In the CBC counter mode **decryption** circuit, each ciphertet blocks affects only the current plaintext block.

### Problem 7.
In nonce-based CBC mode encryption (where the nonce is unique but not random), how does one generate the $IV$?
- [ ] By choosing the $IV$ randomly.
- [ ] By setting the $IV$ to zero.
- [ ] By computing $AES(k, nonce)$ where $k$ is the message encryption key.
- [x] By computing $AES(k', nonce)$ where $k'$ is a key used only for $IV$ generation.

> **Explain:** see definition in slide 240 (nonce-based CBC).

### Problem 8.
Suppose a MAC system $(S, V)$ is used to protect files in a file system by appending a MAC tag to each file. The MAC signing algorith S is applied to the file contents and nothing else. What tampering attacks are not prevented by this system?

- [x] Changing the las modification time of a file.
- [ ] Replacing the contents of a file with the concatenation of two files on the file system.
- [ ] Changing the first byte of the file contents.
- [ ] Replacing the tag and contents of one file with the tag and contents of a file from another computer proctected by the sam MAC system, but a different key

> **Explain:** The MAC signing algorithm is only applied to the file contents and does not protect the file meta data.

### Problem 9.
Consider the encrypted CBC MAC built from AES. Suppose we compute the tag for a long message $m$ comprising of $n$ AES blocks. Let $m'$ be the $n$-block message obtained from $m$ by flipping the last bit of $m$ (i,e, if the last bit of $m$ is $b$ then the last bit of $m'$ is $b \oplus 1$).
How many calls to AES would it take to compute the tag for $m'$ from the tag for $m$ and the MAC key? (in this question please ignore message padding and simply assume that the message length is always a multiple of the AES block size)

- [ ] $n + 1$
- [ ] $3$
- [ ] $2$
- [x] $4$

> **Explain:**: Decrypt the final CBC MAC encryption step done using $k_1$ to get $F(k, m \oplus F(k, \cdot))$, then decrypt this last CBC MAC encryption step done using $k$ to get $m \oplus F(k, \cdot)$, since flipping the last bit of $m$ is equivalent to flipping the last bit of $m \oplus F(k, \cdot)$, flip the last bit of the result, and re-apply the 2 encryptions.

### Problem 10.
Suppose $H_1$ and $H_2$ are collision resistant hash functions mapping inputs in a set $M$ to $\{0, 1\}^{256}$. Our goal is to show that the function $H_2(H_1(m))$ is also collision resistant.
We prove the contra-positive: suppose $H_2(H_1(\cdot))$ is not collision resistant, that is, we are given $x \neq y$ such that $H_2(H_1(x)) = H_2(H_1(y))$. We build a collision for either $H_1$ or for $H_2$. This will prove that if $H_1$ and $H_2$ are collision resistant then so is $H_2(H_1(\cdot))$.
Which of the following must be true:

- [ ] Either $H_2(x), H_2(y)$ are a collision for $H_1$ or $x, y$ are a collision for $H_2$.
- [x] Either $x, y$ are a collision for $H_1$ or $H_1(x), H_1(y)$ are a collision for $H_2$.
- [ ] Either $x, H_1(y)$ are a collision for $H_2$ or $H_2(x), y$ are a collision for $H_1$.
- [ ] Either $x, y$ are a collision for $H_2$ or $H_1(x), H_1(y)$ are a collision for $H_1$.

> **Explain:** If $H_2(H_1(x)) = H_2(H_1(y))$ then either $H_1(x) = H_1(y)$ and $x \neq y$, thereby giving us a collision on $H_1$. Or $H_1(x) \neq H_1(y)$ but $H_2(H_1(x)) = H_2(H_1(y))$ giving us a collision on $H_2$. Either way we obtain a collision on $H_1$ or $H_2$ which is opposite from the given task.