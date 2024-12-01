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

### Problem 11.
If you need to build an application that needs to encrypt multiple messages using a single key, what encryption method should you use? (for now, we ignore the question of key generation and management)
- [ ] Invent your own encryption mode using AES and implement it yourself.
- [ ] Use a standard implementation of CBC encryption with a random $IV$.
- [x] Use a standard implementation of an authenticated encryption mode such as AES-GCM.
- [ ] Implement Encrypt-then-Mac yourself based on Intel's AES-NI.

### Problem 12.
Let $(E, D)$ be a symmetric encryption system with message space $M$ (think of $M$ as only consisting for short messages, say $32$ bytes). Define the following MAC $(S, V)$ for messages in $M$:
$ S(k, m) := E(k, m); \quad V(k, m, t) := 
\begin{cases} 
1 & \text{if } D(k, t) = m \\ 
0 & \text{otherwise}
\end{cases}$
What is the property that the encryption system $(E, D)$ needs to satisfy for this MAC system to be secure?
- [x] Ciphertext integrity
- [ ] Perfect secrecy
- [ ] Semantic security
- [ ] Semantic security under a chosen plaintext attack

> **Explain:** Prevents existential forgery under a chosen message attack.

### Problem 13.
What is $7^{1000000}$ mod $1255$? Use Euler's theorem
Please do not use a calculator for this.  Hint: 251 is a prime number.

- [ ] $7$
- [x] $1$
- [ ] $7^{-1}$
- [ ] $-1$
- [ ] $3$

> **Explain:** 
> - By Euler: $x^{\phi(N)} = 1$ in $\mathbb{Z}_N$
> - We have $\phi(1255) = (251 - 1) \times (5 - 1) = 1000 \rightarrow 7^{1000} = 1$ in $\mathbb{Z}_N$
> - Therefore $7^{1000000} = 1$ in $\mathbb{Z}_N$

### Problem 14.
Consider the RSA public key $(n, e)$ where $n = 1255$ and $e = 3$. What is the private decryption exponent $d$?
- [ ] $d = 3$
- [ ] $d = 541$
- [x] $d = 667$
- [ ] $d = 87$
- [ ] $d = 17$

> **Explain:** In RSA trapdoor permutation: $pk = (n, e)$ where $e \cdot d = 1 \text{ (mod } \phi(n))$
> - We have $n = 1255 = 5 \times 251 \rightarrow \phi(n) = (5 - 1) \times (251 - 1) = 1000$
> - Therefore $3 \cdot d = 1 \text{ (mod } 1000) \rightarrow d = 667$

### Problem 15.
Suppose Alice and Bob run the Diffie-Hellman protocol in cyclic group $\mathbb{G} = \mathbb{Z}^*_{101}$ with generator $g = 7$. What is the Diffie-Hellman secret $s = g^{ab} \in \mathbb{G}$ if Alice uses $a = 3$ and Bob uses $b = 67$? (again, you do not need a calculator)
- [ ] $s = 1$
- [ ] $s = -1$
- [x] $s = 7$
- [ ] $s = 15$
- [ ] $s = 49$

> **Explain:** In Eulers's theorem: $\forall x \in \mathbb{Z}_N^*: x^{\phi(N)} = 1 \text{ in } \mathbb{Z}_N$
> - Since 101 is a prime $\rightarrow \phi(101) = 101 - 1 = 100$
> - Therefore $7^{100} = 1 \text{ in } \mathbb{Z}_{101} \rightarrow (7^{100})^2 \times 7 = 7 \text{ in } \mathbb{Z}_{101} \rightarrow 7^{3 \times 67} = 7 \text{ in } \mathbb{Z}_{101}$

### Problem 16.
Let $\mathbb{G}$ be a finite cyclic group (e.g. $\mathbb{G} = \mathbb{Z}^*_p$) with generator $g$. Suppose the Diffie-Hellman function $DH_g(g^x, g^y) = g^{xy}$ is difficult to compute in $\mathbb{G}$. Consider the following related functions: $$f_1(g^x, g^y) = g^{xy + 3x}; f_2(g^x, g^y) = g^{(x + 2)(y - 3)}; f_3(g^x, g^y) = g^{x + 2y};$$ Which of these functions must also be difficult to compute?
Hint: as usual, identify the functions for wich the contra-positive holds: if $f(\cdot, \cdot)$ were easy to compute then so would $DH_g(\cdot, \cdot)$.
- [x] $f_1$ and $f_2$ but not $f_3$.
- [ ] $f_2$ and $f_3$ but not $f_1$.
- [ ] $f_3$ and $f_1$ but not $f_2$.
- [ ] all three are hard to compute.
- [ ] $f_2$ but not $f_1$ or $f_3$.

### Problem 17.
Let $(Gen, E, D)$ be a semantically secure public key encryption system. Can algorithm $E$ be deterministic?
- [ ] Yes, for example, the RSA trapdoor function is deterministic.
- [ ] Some semantically secure public key encryption schemes are deterministic, while others are not.
- [ ] No, but chosen-ciphertext secure public key encryption can be deterministic.
- [x] No, semantically secure public key encryption must be randomized. 

> **Explain:** Otherwise the attacker can easily break semantic security

### Problem 18.
Suppose Alice and Bob live in a country with 50 states.  Alice is currently in state $a \in \{1,...,50\}$ and Bob is currently in state $b \in \{1,...,50\}$.  They can communicate with one another and Alice wants to test if she is currently in the same state as Bob. If they are in the same state, Alice should learn that fact and otherwise she should learn nothing else about Bob's location.  Bob should learn nothing about Alice's location. 
They agree on the following scheme:
- They fix a group $G$ of prime $p$ and generator $g$ of $G$
- Alice chooses random $x$ and $y$ in $\mathbb{Z}_p$ and sends to Bob $(A_0, A_1, A_2) = (g^x, g^y, g^{xy + a})$
- Bob choose random $r$ and $s$ in $\mathbb{Z}_p$ and sends back to Alice $(B_1, B_2) = (A^r_1g^s, (A_2/g^b)^rA_0^s)$
What should Alice do now to test if they are in the same state (i.e. to test if $a = b$)?
Note that Bob learns nothing from this protocol because he simply recieved a plain ElGamal encryption of $g^a$ under the public key $g^x$. Once can show that if $a \neq b$ then Alice learns nothing else from this protocol because she receives the encryption of a random vvalue.
- [ ] Alice test if $a = b$ by checking if $B_1^xB_2 = 1$
- [x] Alice test if $a = b$ by checking if $B_2/B_1^x = 1$
- [ ] Alice test if $a = b$ by checking if $B_2B_1^x = 1$
- [ ] Alice test if $a = b$ by checking if $B_2^xB_1 = 1$

> **Explain:** The pair $(B_1, B_2)$ from Bob satisfies $B_1 = g^{yr+s}$ and $B_2 = (g^x)^{yr+s}g^{r(a-b)}$. Therefore, it is a plain ElGamal encryption of the plaintext $g^{r(a-b)}$ under the public key $(g, g^x)$. This plaintext happens to be $1$ when $a = b$. The term $B_2/B_1^x$ computes the ElGamal plaintext and compares it to $1$.
> Note that when $a \neq b$ the $r(a - b)$ term ensures that Alice learns nothing about $b$ other than the fact that $a \neq b$.
> Indeed, when $a \neq b$ then $r(a - b)$ is a uniform non-zero element of $\mathbb{Z}_p$. 

### Problem 19.
Recall that password systems make it harder to mount an offline dictionary attack by using a slow hash function. This forces the attacker to spend more effort to evaluate the hash function at many inputs. One way to construct a slow hash function is to start from a standard hash function, such as SHA256, and iterate it many times. That is,
$$H_n(x) = SHA256(SHA256(\cdot \cdot \cdot SHA256(x) \cdot \cdot \cdot)) \text{     [iterated n times]}$$The number of iteration $n$ is set so that the running time of $H_n(\cdot)$ is about 0.1 seconds for the real identification server who is verifying the password. In class we saw a slow a hash function called PBKDF2 that builds upon this basic iteration method.
In this question we show that iteration does not always slow down the time to evaluate a function.
Consider the function: $H: \mathbb{Z} \rightarrow \mathbb{Z}$ defined by 
$$H_{p,a,b}(x) = ax + b \text{ mod } p$$ where $p$ is a prime and $a, b$ are some fixed integers in $\mathbb{Z}$ that are chosen at random when the function is first defined. The attacker knows $p,a,b$. This function, is not one-way and should not be used to hash passwords, but is useful for making the point of this excercise.
Let $H^{(n)}$ be the results of iterating $H_{p,a,b}$ a total of $n$ times (say $n = 1000$). The attacker is given $p,a,b$ and its goal is to write down the fastest program for evaluating $H^{(n)}(x)$ for $x \in \mathbb{Z}_p$. How fast can this program be?
- [ ] Evaluating $H^{(n)}(x)$ can be done as fast as evaluating $H_{(p,a,b)}(x)$.
- [ ] Evaluating $H^{(n)}(x)$ takes twice as long as evaluating $H_{(p,a,b)}(x)$.
- [ ] Evaluating $H^{(n)}(x)$ takes time $O(n)$.
- [ ] Evaluating $H^{(n)}(x)$ takes time $O(logn)$.

---

### Problem 20

In class, we saw a one-sided AKE (authenticated key exchange protocol) with forward-secrecy and a two-sided AKE without forward-secrecy. Let’s try to construct the best of both worlds: a two-sided AKE with forward-secrecy.

Consider the following two-sided AKE with forward-secrecy between Alice and Bank: They each have a certificate for a signing key, and we denote by $S_{\text{alice}}(\text{data})$ and $S_{\text{bank}}(\text{data})$ their respective signatures on 'data'. They fix a group $G$ of order $q$ and generator $g \in G$. Alice chooses a random $a$, and Bank chooses a random $b$, both in $\mathbb{Z}_q$. They exchange the following messages:
1. **Alice → Bank**: 
$$g^a, \text{cert}_{\text{alice}}, S_{\text{alice}}(g^a)$$
- Key derivation: 
$$k \gets H(g^{ab}, \text{"alice"})$$
2. **Bank → Alice**: 
$$g^b, \text{cert}_{\text{bank}}, S_{\text{bank}}(g^a, g^b)$$
- Key derivation: 
$$k \gets H(g^{ab}, \text{id from cert}_{\text{alice}})$$

Both sides compute the same key $k$ using a hash function $H: G \times ID \to K$, and each side deletes its secret $a$ or $b$.
If all the certificates and signatures verify correctly, then Alice thinks she is speaking with Bank, and Bank thinks it is speaking with Alice. The protocol provides forward-secrecy because a compromise of the server or the client does not compromise past sessions.
Since the Diffie-Hellman messages in this protocol are signed by the participants, one might expect that the protocol is secure against a person-in-the-middle attack. Unfortunately, that is incorrect: the protocol is vulnerable to an identity misbinding attack.
Which of the following actions by a person-in-the-middle leads to identity misbinding?
- [ ] The attacker blocks Alice's message and replaces it with the following message to Bank:
Evil → Bank:   $g^{a} \text{, } cert_{evil} \text{, } S_{evil}(g^a)$ 
- [ ] The attacker sets $a' \leftarrow \mathbb{Z}_q$, blocks Alice's message, and replaces it with the following message to Bank:
Evil → Bank:   $g^{(a')} \text{, } cert_{evil} \text{, } S_{evil}(g^{(a')})$ 
- [ ] The attacker blocks Bank's message and replaces it with the following message to Alice:
Evil → Alice:   $g^{b} \text{, } cert_{evil} \text{, } S_{evil}(g^a, g^b)$ 
- [ ] The attacker chooses $b' \leftarrow \mathbb{Z}_q$, blocks Bank's message, and replaces it with the following message to Alice:
Evil → Alice:   $g^{(b')} \text{, } cert_{evil} \text{, } S_{evil}(g^a, g^{(b')})$ 
