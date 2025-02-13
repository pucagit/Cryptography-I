# PUBLIC-KEY ENCRYPTION

---

### Q1.
Question 1
Recall that with symmetric ciphers it is possible to encrypt a 32-bit message and obtain a 32-bit ciphertext (e.g. with the one time pad or with a nonce-based system). Can the same be done with a public-key system?

- [ ] Yes, the RSA-OAEP system can produce 32-bit ciphertext.
- [x] No public-key systems with short ciphertext can never be secure.
- [ ] Yes, when encrypting a short plaintext the output of the public-key encryption algorithm can be truncated to the length of the plaintext.
- [ ] It is not possible with the ElGamal system, but may be possible with other systems.

> **Explain:** An attacker can use the public key to build a dictionary of all $2^{32}$ ciphertexts of length 32 bits along with their decryption and use the dictionary to decrypt any captured ciphertext. 

### Q2.
Let $(Gen, E, D)$ be a semantically secure public-key encryption system. Can algorithm $E$ be deterministic?
- [ ] Yes, some public-key encryption schemes are deterministic.
- [ ] No but chosen-ciphertext secure encryption can be deterministic.
- [x] No, semantically secure public-key encryption must be randomized.
- [ ] Yes, RSA encryption is deterministic

> **Explain:** That's correct since otherwise an attacker can easily break semantic security.
 
### Q3.
Let $(Gen, E, D)$ be a chosen ciphertext secure public-key encryption system with message space $\{0, 1\}^{128}$. Which of the following is also chosen ciphertext secure?
- [x] $(Gen, E', D')$ where 
      $E'(pk, m) = [c \leftarrow E(pk, m), output (c,c)]$
      and $D'(sk, (c_1, c_2)) = 
      \begin{cases}
      D(sk, c_1) & \text{if } c_1 = c_2 \\
      \perp & \text{otherwise}
      \end{cases}$
- [x] $(Gen, E', D')$ where 
      $E'(pk, m) = [E(pk, m), 0^{128}]$
      and $D'(sk, (c_1, c_2)) = 
      \begin{cases}
      D(sk, c_1) & \text{if } c_2 = 0^{128} \\
      \perp & \text{otherwise}
      \end{cases}$
- [ ] $(Gen, E', D')$ where 
      $E'(pk, m) = [E(pk, m), E(pk, m)]$
      and $D'(sk, (c_1, c_2)) = 
      \begin{cases}
      D(sk, c_1) & \text{if } D(sk, c_1) = D(sk, c_2) \\
      \perp & \text{otherwise}
      \end{cases}$
    > **Explain:** An attacker can output 2 messages $m_0 = 0^{128}$ and $m_1 = 1^{128}$ then receives back $(c_1, c_2)$. He would then, on his own, create a random encryption of $m_0$, call it $c_3$ and ask for the decryption of $(c_1, c_3)$ which is a valid decryption query ($(c_1, c_2) \neq (c_1, c_3)$). The response is now either $m_0$ or $\perp$. Base on that response the attacker is able to guess which message is being encrypted because this reveals information about $c_2$ which violates the indistinguishability under chosen-ciphertext attack (IND-CCA2) requirement.
- [ ] $(Gen, E', D')$ where 
      $E'(pk, m) = [E(pk, m), E(pk, 0^{128})]$
      and $D'(sk, (c_1, c_2)) = 
      \begin{cases}
      D(sk, c_1) & \text{if } D(sk, c_2) = 0^{128} \\
      \perp & \text{otherwise}
      \end{cases}$
    > **Explain:** An attacker can output 2 messages $m_0 = 0^{128}$ and $m_1 = 1^{128}$ then receives back $(c_1, c_2)$. He would then ask for the decryption of $(c_2, c_1)$ which is a valid decryption query ($(c_1, c_2) \neq (c_2, c_1)$). The response is now either $0^{128}$ or $\perp$. Base on that response the attacker is able to guess which message is being encrypted (response is $0^{128} \rightarrow m_0$ is encrypted, else $m_1$ is encrypted).
- [ ] $(Gen, E', D')$ where 
      $E'(pk, m) = [E(pk, m), E(pk, 0^{128})]$
      and $D'(sk, (c_1, c_2)) = D(sk, c_1)$
    > **Explain:** An attacker can output 2 messages $m_0 = 0^{128}$ and $m_1 = 1^{128}$ then receives back $(c_1, c_2)$. He would than generates a random ciphertext $c_3 \neq c_2$ and ask for the decryption of $(c_1, c_3)$ which is a valid decryption query ($(c_1, c_2) \neq (c_1, c_3)$). The response is now the decrypted ciphertext of $c_1$. Base on that response the attacker is able to guess which message is being encrypted (response is $m_0 \rightarrow m_0$ is encrypted, else $m_1$ is encrypted).

### Q4.
Recall that an RSA public key consists of an RSA modulus $N$ and an exponent $e$. One might be tempted to use the same RSA modulus in different public keys. For example, Alice might use $(N,3)$ as her public key while Bob may use $(N,5)$ as his public key. Alice's secret key is $d_a = 3^{−1} \text{ mod } φ(N)$ and Bob's secret key is 
$d_b = 5^{−1} \text{ mod } φ(N)$.
In this question and the next we will show that it is insecure for Alice and Bob to use the same modulus $N$. In particular, we show that either user can use their secret key to factor $N$. Alice can use the factorization to compute $φ(N)$ and then compute Bob's secret key.
As a first step, show that Alice can use her public key $(N,3)$ and private key $d_a$ to construct an integer multiple of $φ(N)$. 
Which of the following is an integer multiple of $φ(N)$?
- [ ] $d_a + 1$
- [x] $3d_a - 1$
- [ ] $N + d_a$
- [ ] $5d_a - 1$

> **Explain:** We have $d_a = 3^{−1} \text{ mod } φ(N) \rightarrow 3d_a = 1 \text{ mod } φ(N) \rightarrow 3d_a - 1 = kφ(N)$ 

### Q5.
Now that Alice has a multiple of $φ(N)$ let's see how she can factor $N = pq$. Let $x$ be the given muliple of $φ(N)$. Then for any $g$ in $\mathbb{Z}^*_N$ we have $g^x = 1$ in $\mathbb{Z}_N$. Alice chooses a random $g$ in $\mathbb{Z}^*_N$ and computes the sequence $g^x, g^{x/2}, g^{x/4}, g^{x/8} ...$ in $\mathbb{Z}_N$ and stops as soon as she reaches the first element $y = g^{x/2^i}$ such that $y \neq 1$ (if she gets stuck because the exponent becomes odd, she picks a new random $g$ and tries again). It can be shown that with probability $1/2$ this $y$ satisfies
$
\begin{cases} 
y \equiv 1 \pmod{p}, \\
y \equiv -1 \pmod{q}
\end{cases}
\quad \text{or} \quad
\begin{cases} 
y \equiv -1 \pmod{p}, \\
y \equiv 1 \pmod{q}
\end{cases}
$
How can Alice use this $y$ to factor $N$?
- [ ] compute $gcd(N, y)$
- [x] compute $gcd(N, y - 1)$
- [ ] compute $gcd(N + 1, y)$
- [ ] compute $gcd(N, 2y - 1)$
- [ ] compute $gcd(N, y^2 - 1)$

> **Explain:** 
> - From the condition we get: 
$
\begin{cases}
y = mp + 1 \rightarrow (y - 1) \text{ ⁝ } p\\
y = nq - 1 \rightarrow (y + 1) \text{ ⁝ } q
\end{cases}
\quad \text{or} \quad
\begin{cases}
y = mp - 1 \rightarrow (y + 1) \text{ ⁝ } p\\ 
y = nq + 1 \rightarrow (y - 1) \text{ ⁝ } q
\end{cases}
$
> - Since $(y - 1)$ is divisible by either $p$ or $q$, the only common factor of $N$ and $y - 1$ is either $p$ or $q$ $\rightarrow gcd(N, y - 1) = p \lor q$
> - Same goes for $gcd(N, y + 1)$

### Q6.
In standard RSA the modulus $N$ is a product of two distinct primes. Suppose we choose the modulus so that it is a product of three distinct primes, namely $N = pqr$. Given an exponent $e$ relatively prime to $\phi(N)$ we can derive the secret key $d = e^{-1} \text{ mod } \phi(N)$. The public key $(N, e)$ and secret key $(N, d)$ work as before. 
What is $\phi(N)$ when $N$ is a product of three distinct primes?

- [ ] $\phi(N) = (p - 1)(q - 1)$
- [ ] $\phi(N) = (p - 1)(q - 1)r$
- [x] $\phi(N) = (p - 1)(q - 1)(r - 1)$
- [ ] $\phi(N) = pqr - 1$

> **Explain:** 
> - Since $p, q, r$ are 3 distinct primes, base on Euler's generalization of Fermat: $\mathbb{Z}^*_p = p - 1$, $\mathbb{Z}^*_q = q - 1$, $\mathbb{Z}^*_r = r - 1$.
> - Therefore $\phi(N) = |\mathbb{Z}^*_N| = |\mathbb{Z}^*_p| \cdot |\mathbb{Z}^*_q| \cdot |\mathbb{Z}^*_r| = (p - 1)(q - 1)(r - 1)$.

### Q7.
An administrator comes up with the following key management scheme: he generates an RSA modulus $N$ and an element $s$ in $\mathbb{Z}^*_N$. He then gives user number $i$ the secret key $s_i = s^{r_i}$ in $\mathbb{Z}^*_N$ where $r_i$ is the i'th prime (i.e. 2 is the first prime, 3 is the second and so on).
Now, the administrator encrypts a file that is accessible to users $i, j$ and $t$ with the key $k = s^{r_ir_jr_t}$ in $\mathbb{Z}^*_N$.
It is easy to see that each of the three users can compute $k$. For example, user $i$ computes $k$ as $k = (s_i)^{r_jr_t}$. The administrator hopes that other than users $i, j$ and $t$, no other user can compute $k$ and access the file.
Unfortunately, this system is terribly insecure. Any two colluding users can combine their secret keys to recover the master secret $s$ and then access all files on the system. Let's see how. Suppose users 1 and 2 collude. Because $r_1$ and $r_2$ are distinct primes there are integers $a$ and $b$ such that $ar_1 + br_2 = 1$.
Now, users 1 and 2 can copmute $s$ from the secret key $s_1$ and $s_2$ as follow:

- [x] $s = s_1^a \cdot s_2^b$ in $\mathbb{Z}^*_N$.
- [ ] $s = s_1^b \cdot s_2^a$ in $\mathbb{Z}^*_N$.
- [ ] $s = s_1^a + s_2^b$ in $\mathbb{Z}^*_N$.
- [ ] $s = s_1^b / s_2^a$ in $\mathbb{Z}^*_N$.

> **Explain:** We have $s_i = s^{r_i} \rightarrow 
\begin{cases}
      s_1^a = s^{ar_1} \\ 
      s_2^b = s^{br_2}      
\end{cases} 
\quad \rightarrow s_1^a \cdot s_2^b = s^{ar_1 + br_2} = s^1 = s$

### Q8.
Let $G$ be a finite cyclic group of order $n$ and consider the following variant of ElGamal encryption in $G$:
- Gen: choose a random $g$ in $G$ and a random $x$ in $\mathbb{Z}_n$. Output $pk = (g, h = g^x)$ and $sk = (g, x)$.
- $E(pk, m \in G)$: choose a random $r$ in $\mathbb{Z}_n$ and output $(g^r, m \cdot h^r)$.
- $D(sk, (c_0, c_1))$: output $c_1/c_0^x$.
This variant, called plain ElGamal, can be shown to be semantically secure under an appropriate assumption about $G$. It is however not chosen-ciphertext secure because it is easy to compute on ciphertexts. That is, let $(c_0, c_1)$ be the output of $E(pk, m_0)$ and let $(c_2, c_3)$ be the output of $E(pk, m_1)$. Then just given these two ciphertexts it is easy to construct the encryption of $m_0 \cdot m_1$ as follows:

- [ ] $(c_0 - c_2, c_1 - c_3)$ is an encryption of $m_0 \cdot m_1$.
- [ ] $(c_0c_3, c_1c_2)$ is an encryption of $m_0 \cdot m_1$.
- [x] $(c_0c_2, c_1c_3)$ is an encryption of $m_0 \cdot m_1$.
- [ ] $(c_0/c_3, c_1/c_2)$ is an encryption of $m_0 \cdot m_1$.

> **Explain:**
> - For message $m_0$: $E(pk, m_0) \rightarrow (g^r, m_0 \cdot h^r) = (c_0, c_1)$.
> - For message $m_1$: $E(pk, m_1) \rightarrow (g^{r'}, m_1 \cdot h^{r'}) = (c_2, c_3)$.
> - Therefore for message $m_0 \cdot m_1$: $(c_0c_2, c_1c_3) = (g^{r + r'}, m_0m_1 \cdot h^{r + r'}) = (g^{r + r'}, m_0m_1 \cdot g^{x(r + r')})$ is a valid encryption of $m_0 \cdot m_1$ since the decryption function can successfully decrypt it ($D(sk, (g^{r + r'}, m_0m_1 \cdot h^{r + r'})) \rightarrow \frac{m_0m_1 \cdot g^{x(r + r')}}{g^{x(r + r')}} = m_0m_1$)

### Q9.
Let $G$ be a finite cyclic group of order $n$ and let $pk = (g, h = g^a)$ and $sk = (g, a)$ be an ElGamal public/secret key pair in $G$ as described in [Segment 12.1](https://www.coursera.org/learn/crypto/lecture/ycSSO/the-elgamal-public-key-system). Suppose we want to distribute the secret key to two parties so that both parties are needed to decrypt. Moreover, during decryption the secret key is never re-constructed in a single location. A simple way to do so it to choose random numbers $a_1, a_2$ in $\mathbb{Z}_n$ such that $a_1 + a_2 = a$. One party is given $a_1$ and the other party is given $a_2$. Now, to decrypt an ElGamal ciphertext $(u, c)$ we send $u$ to both parties. 
What do the parties return and how do we use these values to decrypt?

- [ ] party 1 returns $u_1 \leftarrow u^{a_1}$, party 2 returns $u_2 \leftarrow u^{a_2}$ and the results are combined by computing $v \leftarrow u_1 - u_2$.
- [x] party 1 returns $u_1 \leftarrow u^{a_1}$, party 2 returns $u_2 \leftarrow u^{a_2}$ and the results are combined by computing $v \leftarrow u_1 \cdot u_2$.
- [ ] party 1 returns $u_1 \leftarrow u^{a_1}$, party 2 returns $u_2 \leftarrow u^{a_2}$ and the results are combined by computing $v \leftarrow u_1 + u_2$.
- [ ] party 1 returns $u_1 \leftarrow u^{-a_1}$, party 2 returns $u_2 \leftarrow u^{-a_2}$ and the results are combined by computing $v \leftarrow u_1 \cdot u_2$.

> **Explain:** $v = u_1 \cdot u_2 = u^{a_1} \cdot u^{a_2} = u^{a_1 + a_2} = u^a$ as needed for decryption (the secret key was never re-constructed - see slide 604: The Elgamal system (a modern view)).

### Q10.
Suppose Alice and Bob live in a country with 50 states.  Alice is currently in state $a \in \{1,...,50\}$ and Bob is currently in state $b \in \{1,...,50\}$.  They can communicate with one another and Alice wants to test if she is currently in the same state as Bob. If they are in the same state, Alice should learn that fact and otherwise she should learn nothing else about Bob's location.  Bob should learn nothing about Alice's location. 
They agree on the following scheme:
- They fix a group $G$ of prime $p$ and generator $g$ of $G$
- Alice chooses random $x$ and $y$ in $\mathbb{Z}_p$ and sends to Bob $(A_0, A_1, A_2) = (g^x, g^y, g^{xy + a})$
- Bob choose random $r$ and $s$ in $\mathbb{Z}_p$ and sends back to Alice $(B_1, B_2) = (A^r_1g^s, (A_2/g^b)^rA_0^s)$

What should Alice do now to test if they are in the same state (i.e. to test if $a = b$)?
Note that Bob learns nothing from this protocol because he simply recieved a plain ElGamal encryption of $g^a$ under the public key $g^x$. Once can show that if $a \neq b$ then Alice learns nothing else from this protocol because she receives the encryption of a random value.

- [ ] Alice test if $a = b$ by checking if $B_1^xB_2 = 1$
- [x] Alice test if $a = b$ by checking if $B_2/B_1^x = 1$
- [ ] Alice test if $a = b$ by checking if $B_2B_1^x = 1$
- [ ] Alice test if $a = b$ by checking if $B_2^xB_1 = 1$

> **Explain:** The pair $(B_1, B_2)$ from Bob satisfies $B_1 = g^{yr+s}$ and $B_2 = (g^x)^{yr+s}g^{r(a-b)}$. Therefore, it is a plain ElGamal encryption of the plaintext $g^{r(a-b)}$ under the public key $(g, g^x)$ ($yr + s$ treat as a chosen random value). This plaintext happens to be $1$ when $a = b$. The term $B_2/B_1^x$ computes the ElGamal plaintext and is equals to $1$ only if $a = b$.
> Note that when $a \neq b$ the $r(a - b)$ term ensures that Alice learns nothing about $b$ other than the fact that $a \neq b$. Indeed, when $a \neq b$ then $r(a - b)$ is a uniform non-zero element of $\mathbb{Z}_p$.

### Q11.
What is the bound on $d$ for Wiener's attack when $N$ is a product of **three** equal size distinct primes?

- [ ] $d < \frac{N^{2/3}}{c}$ for some constant $c$.
- [ ] $d < \frac{N^{1/5}}{c}$ for some constant $c$.
- [x] $d < \frac{N^{1/6}}{c}$ for some constant $c$.
- [ ] $d < \frac{N^{1/2}}{c}$ for some constant $c$.

> **Explain:** The only change to the analysis is that $N - \phi(N)$ is now on the order of $N^{2/3}$. Everything else stays the same. Plugging in this bound gives the answer. Note that the bound is weaker in this case compared to when $N$ is a product of two primes making the attack less effective.