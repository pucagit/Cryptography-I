# CS255: Take-home Final Exam 
## Winter 2022
---

### Problem 1

a. You are given a secure MAC scheme \( (S, V) \) that can be used to sign a sequence of bytes whose length is a multiple of eight. That is, its length can be 8 bytes, 16 bytes, 24 bytes, etc. Explain how to use this MAC scheme to sign a sequence of bytes of arbitrary length (i.e., including messages whose length may not be a multiple of eight).
> *Your answer:*
> Use padding scheme like the PKCS7:
> - If message length is multiple of 8: pad a dummy block with 8 bytes of 0x08.
> - If message length is not multiple of 8: pad $n=(8-(\text{len}(m)\mod{8}))$ bytes of 0xn.

b. A recent paper shows that the implementation of AES-GCM on a widely used phone can end up using the same (key, nonce) pair many times. Recall that AES-GCM is built from randomized counter mode encryption (rCTR). Suppose an attacker has a message \( m \in \{0, 1\}^\ell \) and has its rCTR encryption \( ct := (IV, c) \). The attacker also has another rCTR ciphertext \( ct' := (IV, c') \) of some unknown message \( m' \), where \( ct' \) is constructed with the same \( IV \) and key as \( ct \). Moreover, \( c \) and \( c' \) are the same length. Explain how the attacker can decrypt \( ct' \) using the data at its disposal.
> *Your answer:*
> In rCTR: $c=m \oplus F(k,IV)$
> The attacker already knows:
> - $c=m \oplus F(k,IV)$
> - $c'=m' \oplus F(k,IV)$
>
> Therefore, $c \oplus c'=m \oplus m' \rightarrow m'=c \oplus c' \oplus m$. Where $c,c',m$ are known to the attacker.

c. Suppose Alice has a password \( pwd \), and this password is also known to server Bob. When Alice connects to the server, the server uses a MAC-based challenge-response identification protocol to authenticate Alice. 

Show that an attacker who eavesdrops on network traffic between Alice and the server can mount a dictionary attack to recover Alice’s password. You may assume Alice’s password is chosen from a dictionary \( PWD \) so that \( pwd \in PWD \).
> *Your answer:*
> MAC-based challenge-response identification protocol:
> - Bob generates a random challenge $c$ and sends to Alice.
> - Alice computes the response $r=MAC(pwd,c)$ and sends back to Bob.
> - Bob computes $r'=MAC(pwd,c)$ and compares with $r$. If $r=r'$, Alice is authenticated.
>
> Dictionary attack:
> - Attacker captures challenge $c$. 
> - For $\forall pwd' \in PWD$ computes: $r_{attacker}=MAC(pwd',c)$ and sends that to Bob to verify.
> - Repeat that until find the right $pwd$.

d. For a prime \( p \), consider the following PRG defined over \( (\mathbb{Z}_p, \mathbb{Z}_p^2) \): given an input \( x \in \mathbb{Z}_p \), the PRG outputs 

\[
G(x) := (x^2, x^3) = (u,v) \in \mathbb{Z}_p^2.
\]

Is this PRG secure? If so, explain why. If not, describe an attack.
> *Your answer:*
> This PRG is not secure because $G(x)$ does not provide randomness to the response. An attack goes like this:
> - The attacker receives $(u,v)$, checks if $u$ is perfect square modulo in $\mathbb{Z}_p^2$
> - If $u$ is a perfect square, computes $x=\plusmn \sqrt{u} \mod{p}$ and verifies whether $x^3 \mod{p}=v$
> - If the condition holds, conclude $G(x)$ is a PRG. 

e. Give an example of a function \( f \) that is believed to be a one-way function, but is trivially not collision resistant. You can assume that SHA256 is a one-way function. Make sure to explain why your function is one-way and why it is easy to find a collision for it.
> *Your answer:*
> Define a function $f$: $f(x)=2^x \mod{6}$
> - This is a one-way function, since to invert $f$, we need to compute $log_2(f(x)) \mod{6}$ which is a Dlog problem (it is hard to solve).
> - But it is easy to find a collision, e.g. $f(1)=f(3)=2$

---

### Problem 2. A two-query PRF

a. For a prime \( p \geq 5 \), consider the following PRF defined over \( (\mathbb{Z}_p^2, \mathbb{Z}_p, \mathbb{Z}_p) \):

\[
F((k_1, k_2), x) := k_1 x + k_2.
\]

Show that this PRF is not secure: construct an adversary \( A \) that distinguishes this PRF from a random function from \( \mathbb{Z}_p \) to \( \mathbb{Z}_p \).
> *Your answer:*
> Adversary $A$ sends $x_1,x_2$ to the PRF and got $$y_1=k_1x_1+k_2, \\ y_2=k_1x_2+k_2$$
> He then computes the difference: $Δ=y_1-y_2=k_1(x_1-x_2)$.
> The adversary can then distinguish $F$ from a truly random function by check whether Δ exhibits linearity.

b. One can show that the PRF from part (a) is secure against a PRF adversary that can issue at most two evaluation queries. We say that \( F \) is a 2-time secure PRF.

More generally, let \( F \) be a PRF defined over \( (K, \mathcal{M}, \mathcal{T}) \). Recall that in class we defined a MAC scheme \( (S, V) \) derived from the PRF \( F \) as follows:

\[
S(k, m) := F(k, m) \quad \text{and} \quad V(k, m, t) \text{ accepts if } t = F(k, m).
\]

We showed that if the range \( \mathcal{T} \) of the PRF is sufficiently large and \( F \) is a secure PRF, then \( (S, V) \) is a secure MAC scheme.

Suppose that \( F \) is not a secure PRF but is 2-time secure, as is the \( F \) from part (a). Show that the derived MAC scheme \( (S, V) \) is a secure one-time MAC, meaning that it is secure if the adversary can issue at most a single chosen message query.

**Hint**: As usual, prove the contra-positive: Let \( A \) be a MAC adversary that succeeds in forging a message-tag pair after issuing only one chosen message query to the MAC challenger. Show how to use \( A \) to build a PRF adversary \( B \) that breaks the PRF using at most two queries. Your argument shows that the PRF from part (a) gives a very efficient one-time MAC.
> *Your answer:*
> Goal is $B$ uses $A$ to break 2-time security of the PRF.
> Steps:
> - $B$ chooses $m_1$ and sends to $A$.
> - $A$ issue $m_1$ to the MAC challenger, receives tag $t_1$. He then successfully forged message $m_2$ and a valid tag $t_2$ ($V(k, m_2, t_2)$ = accept).
> - $B$ send $(m_2, t_2)$ to the MAC challenger. If it is accepted, conclude that it is the PRF. Else, it is a truly random function.
---

### Problem 3. Attacks on Schnorr signatures

Let \( G \) be a finite cyclic group of order \( q \) with generator \( g \). Let \( H : \mathcal{M} \times G \to \mathbb{Z}_q \) be a hash function. Recall that a Schnorr secret key is a random \( sk := \alpha \gets \mathbb{Z}_q \), and the public key \( pk := h \gets g^\alpha \in G \). 

A (non-optimized) signature is generated by choosing a random \( \rho \gets \mathbb{Z}_q \), computing 

\[
R \gets g^\rho \in G, \quad c \gets H(m, R) \in \mathbb{Z}_q, \quad z \gets \rho + c \cdot \alpha \in \mathbb{Z}_q,
\]

and outputting \( \sigma := (R, z) \). The verification algorithm \( V(pk, m, (R, z)) \) computes \( c \gets H(m, R) \) and accepts if \( g^z = R \cdot h^c \), where \( h = pk = g^\alpha \).

**a. Faulty hashing**
Suppose that during signing and verification the challenge \( c \) is computed as \( c \gets H(m) \) instead of \( c \gets H(m, R) \). Show that the resulting signature scheme is insecure: an adversary who has \( pk \) can forge a signature on any message \( m \in \mathcal{M} \).
> Lỏ vl

**b. Faulty randomness**
Let \( (sk, pk) \) be a key pair for the Schnorr signature scheme. Suppose the signing algorithm is faulty and chooses **dependent values** for \( R \) in consecutively issued signatures. In particular, when signing a message \( m_0 \), the signing algorithm chooses a uniformly random \( \rho_0 \in \mathbb{Z}_q \), as required. However, when signing the next message \( m_1 \), it chooses \( \rho_1 \) as 

\[
\rho_1 \gets a \cdot \rho_0 + b \in \mathbb{Z}_q,
\]

for some publicly known \( a, b \in \mathbb{Z}_q \). 

Show that if the adversary obtains the corresponding Schnorr message-signature pairs \( (m_0, \sigma_0) \) and \( (m_1, \sigma_1) \), and knows \( a, b \) and \( pk \), it can learn the secret signing key \( sk \), with high probability. Recall that \( \sigma_0 = (R_0, z_0) \) and \( \sigma_1 = (R_1, z_1) \).

**Hint**: Build a system of two linear equations in two variables, \( \alpha \) and \( \rho_0 \).
> *Your answer:*
> The attacker knows $\sigma_0, \sigma_1, c_0, c_1$. He has:
> - $z_0=\rho_0+ \alpha c_0 \rightarrow \rho_0=z_0-\alpha c_0$
> - $z_1=\rho_1+ \alpha c_1=a\rho_0+b+ \alpha c_1 \rightarrow \alpha=\frac{z_1-az_0-b}{c_1-ac_0}$

c. Related keys

Let \( h := g^\alpha \in G \) be a random Schnorr public key. Define \( n \) related Schnorr public keys \( pk_1, \ldots, pk_n \) by setting 

\[
pk_i := h \cdot g^i \in G \quad \text{for } i = 1, \ldots, n.
\]

Show that this scheme is insecure with respect to the public keys \( pk_1, \ldots, pk_n \). In particular, show that a signature \( (R, z) \) on a message \( m \) with respect to \( pk_j \), lets the adversary construct a signature on the same message \( m \) with respect to \( pk_i \) for some \( i \neq j \). This is an **existential forgery** on \( pk_i \).
> *Your answer:*
> The attacker knows about the signature of message $m$ with respect to $pk_j$. This means he knows: $$g^z=g^{\rho}g^{\alpha c+ic} \rightarrow \rho + \alpha c=z-ic$$
> Knowing that, the attacker can modify $z'$ such that $z'-jc=\rho + \alpha c$ for some $i \neq j$.
> This will result in a valid signature for messsage $m$: $(R,z')$


#### Problem 4. Birthday Paradox

a. Let \( x_1, \ldots, x_n \) be randomly sampled integers in the range \([1, B]\). The birthday paradox says that when \( n \geq 1.2\sqrt{B} \), the probability that there is a collision (i.e., exists \( i \neq j \) such that \( x_i = x_j \)) is at least \( 1/2 \). How large must \( n \) be, as a function of \( k \) and \( B \), so that the expected number of collisions is at least \( k \), for some given \( k > 1 \)?

**Hint**: For \( 1 \leq i, j \leq n \), define the indicator random variable \( I_{i,j} \) to be 1 if \( x_i = x_j \) and 0 otherwise. Then the expected number of collisions is 

\[
\sum_{i \neq j} \mathbb{E}[I_{i,j}].
\]

Moreover, \( \mathbb{E}[I_{i,j}] = 1/B \) for \( i \neq j \). You may use the approximation \( n(n - 1) \approx n^2 \).
> *Your answer:*
> Define the indicator random variable $I_{i,j}:$ 
> \[
   I_{i,j} =
   \begin{cases}
   1, & \text{if } x_i = x_j, \\
   0, & \text{otherwise.}
   \end{cases}
   \]
> The total number of collisions \( C \) is the sum of all \( I_{i,j} \) over distinct pairs \( i \neq j \):
   \[
   C = \sum_{1 \leq i < j \leq n} I_{i,j}.
   \]
> The average number of collisions is:
   \[
   \mathbb{E}[C] = \sum_{1 \leq i < j \leq n} \mathbb{E}[I_{i,j}].
   \]
> Since \( x_1, \ldots, x_n \) are uniformly distributed over \([1, B]\), the probability that \( x_i = x_j \) for \( i \neq j \) is:
\[
\mathbb{E}[I_{i,j}] = \Pr[x_i = x_j] = \frac{1}{B}.
\]
> The expected number of collisions is:
\[
\mathbb{E}[C] = \sum_{1 \leq i < j \leq n} \mathbb{E}[I_{i,j}] = \frac{n(n-1)}{2} \cdot \frac{1}{B} \approx \frac{n^2}{2B}.
\]
> To ensure the expected number of collisions is at least \( k \), we solve:
\[
\frac{n^2}{2B} \geq k ⇔ n \geq \sqrt{2Bk}.
\]

b. A three-way collision is a triple of distinct \( i, j, \ell \) such that \( x_i = x_j = x_\ell \). How large must \( n \) be, as a function of \( B \), so that there is at least one three-way collision in expectation?

**Hint**: Use a similar approach as in part (a). For \( 1 \leq i, j, \ell \leq n \), define the indicator random variable \( I_{i,j,\ell} \) to be 1 if \( x_i = x_j = x_\ell \) and 0 otherwise. Then the expected number of 3-way collisions is 

\[
\sum_{i \neq j \neq \ell \neq i} \mathbb{E}[I_{i,j,\ell}].
\]

You may use the approximation \( n(n - 1)(n - 2) \approx n^3 \).
> *Your answer:*
> Define the indicator random variable $I_{i,j,l}:$ 
> \[
   I_{i,j} =
   \begin{cases}
   1, & \text{if } x_i = x_j = x_l, \\
   0, & \text{otherwise.}
   \end{cases}
   \]
> The total number of collisions \( C \) is the sum of all \( I_{i,j,l} \) over distinct pairs \( i \neq j \neq l\):
   \[
   C = \sum_{1 \leq i < j \leq l \leq n} I_{i,j,l}.
   \]
> The average number of collisions is:
   \[
   \mathbb{E}[C] = \sum_{1 \leq i < j \leq l \leq n} \mathbb{E}[I_{i,j,l}].
   \]
> Since \( x_1, \ldots, x_n \) are uniformly distributed over \([1, B]\), the probability that \( x_i = x_j = x_l \) for \( i \neq j \neq l \) is:
\[
\mathbb{E}[I_{i,j}] = \Pr[x_i = x_j = x_l] = \frac{1}{B} \cdot \frac{1}{B} = \frac{1}{B^2}.
\]
> The expected number of collisions is:
\[
\mathbb{E}[C] = \sum_{1 \leq i < j \leq l \leq n} \mathbb{E}[I_{i,j,l}] = \frac{n(n-1)(n-2)}{6} \cdot \frac{1}{B^2} \approx \frac{n^3}{6B^2}.
\]
> To ensure the expected number of collisions is at least \( k \), we solve:
\[
\frac{n^3}{6B^2} \geq k ⇔ n \geq (6B^2k)^{1/3}.
\]

---

#### Problem 5. Meet in the middle

a. Let \( \mathcal{E} := (E, D) \) be a cipher defined over \( (K, \mathcal{M}, \mathcal{C}) \) where \( \mathcal{C} \subseteq \mathcal{M} \). One can define a cipher with double the key length, called \( 2\mathcal{E} \), defined over \( (K^2, \mathcal{M}, \mathcal{C}) \) as follows:

\[
2E((k_1, k_2), m) := E(k_1, E(k_2, m)).
\]

That is, we apply the encryption algorithm \( E \) twice with independent keys \( k_1 \) and \( k_2 \). Write out the decryption algorithm:
> *Your answer:*
> $2D((k_1,k_2),c):=D(k_2,D(k_1,E(k_1,E(k_2,m))))$

b. Now, recall that the AES block cipher can take either 128, 192, or 256-bit keys, denoted AES128, AES192, and AES256, respectively. You are probably wondering why there is a need for AES256. We can simply define AES256 to be 2AES128, namely define:

\[
\text{BadAES256}((k_1, k_2), m) := 2\text{AES128}((k_1, k_2), m) = \text{AES128}(k_1, \text{AES128}(k_2, m)).
\]

The key for this BadAES256 is \((k_1, k_2)\), which is 256 bits, as required. So why is AES256 a separate algorithm? Why can’t we simply use 2AES128?

Let us first compare the running time of 2AES128 with the running time of the real AES256. How many rounds of the AES round function are used in AES256? How many are used in 2AES128?
> *Your answer:*
> Number of rounds in a single AES128: 10 rounds $\rightarrow$ Number of rounds in a 2AES128: $2 \times 10=20$ rounds
> Number of rounds in a single AES256: 10 rounds

c. Ok, so AES256 is faster than 2AES128. What about the security of 2AES128? Let us show that the \( 2\mathcal{E} \) cipher is no more secure than the underlying \( \mathcal{E} \) cipher. This means that 2AES128 is no more secure than AES128, which is not what we want for AES256.

For a multi-block message \( M = (m_1, m_2, \ldots, m_n) \), write 

\[
E(k, M) := (E(k, m_1), \ldots, E(k, m_n)).
\]

You are given a pair \( (M, C) \) where \( C = 2E((k_1, k_2), M) \). You may assume that there is a unique \( (k_1, k_2) \) that satisfies \( C = 2E((k_1, k_2), M) \). Your goal is to find this \( (k_1, k_2) \).

An exhaustive search algorithm over all possible \( (k_1, k_2) \) will take time \( |\mathcal{K}|^2 \). Your goal is to design an algorithm that finds \( (k_1, k_2) \) in time \( O(|\mathcal{K}|) \). This is the time to break \( \mathcal{E} \), which means that \( 2\mathcal{E} \) is no more secure than \( \mathcal{E} \).
**Hint:** Observe that if \( C = 2E((k_1, k_2), M) \), then 
\[
E(k_2, M) = D(k_1, C) \tag{1}
\]

Try building a table \( T \) of pairs \( (k, E(k, M)) \) for all \( k \in \mathcal{K} \). This takes \( |\mathcal{K}| \) evaluations of \( E(k, M) \), and the table will contain all possible values of the left-hand side of (1). Now that \( T \) is built, show that you can find \( (k_1, k_2) \) in time \( O(|\mathcal{K}|) \). 

To do so, use the right-hand side of (1). You can assume that testing if \( T \) contains a pair \( (\ast, c) \) can be done in constant time.
> *Your answer:*
> **Step 1: Precompute $T$**
> - Build table $T$ containing all possible values of $E(k,M) \forall k \in \mathcal{K}$
> - This requires $|\mathcal{K}|$ evaluation $\rightarrow O(|\mathcal{K}|)$
> 
> **Step 2: Iterates over $T$**
> - For each $k_1 \in \mathcal{K}$, computes $D(k_1,C)$ which gives $E(k_2,M)$.
> - Check if $E(k_2,M)$ is in $T$. If yes, conclude the pair $(k_1,k_2)$. If not, continue with the next key $k_1 \rightarrow O(|\mathcal{K}|)$
>
> **Combined complexity: $O(|\mathcal{K}|)+O(|\mathcal{K}|)=O(|\mathcal{K}|)$**

d. The algorithm from part (c) is called a **meet in the middle attack** because you are attacking the mid-point of algorithm \( 2\mathcal{E} \). Meet in the middle attacks come up often. Let us show a meet in the middle attack on the discrete logarithm problem. 

Let \( G \) be a cyclic group of prime order \( q \) with generator \( g \in G \). Let \( h = g^\alpha \) for some \( \alpha \in \mathbb{Z}_q \). Your goal is to design an algorithm that finds \( \alpha \) in time \( O(\sqrt{q}) \) using a meet in the middle attack.

**Hint**: Let \( Q := \lceil \sqrt{q} \rceil \). We can write \( \alpha \) in base \( Q \) so that \( \alpha = \alpha_1 Q + \alpha_2 \), where \( 0 \leq \alpha_1, \alpha_2 < Q \). Then \( g^\alpha = h \) can be re-written as:

\[
(g^Q)^{\alpha_1} = h / g^{\alpha_2}.
\]

Use the same strategy as in part (c) to find \( (\alpha_1, \alpha_2) \) using a table \( T \) and a total of about \( 2Q \) multiplications in \( G \). The table \( T \) will contain pairs \( (\gamma, (g^Q)^\gamma) \) for all \( 0 \leq \gamma < Q \).
> *Your answer:*
> **Step 1: Precompute table $T$**
> - For each $\gamma \in [0,Q)$ computes $(g^Q)^{\gamma}$ and store it in $T$.
> - This step takes $O(Q)$.
>
> **Step 2: Iterates over $T$**
> - For each $0 \leq \alpha_2 \leq Q$ computes $h / g^{\alpha_2}$.
> - Check in the table if $h / g^{\alpha_2}$ is present. If yes, conclude $(\alpha_1=\gamma, \alpha_2)$. If not, continue with the next value of $\alpha_2$.
> - This step takes another $O(Q)$.
>
> **Step 3: Recover $\alpha$**
> - $\alpha=\alpha_1 Q + \alpha_2$.
> - This step takes $O(1)$.
> 
> **Combined complexity: $O(Q) + O(Q) + O(1)=O(Q)=O(\sqrt{q})$.**





