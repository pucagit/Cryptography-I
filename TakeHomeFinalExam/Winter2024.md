# CS255: Take-home Final Exam 
## Winter 2024
---

### Problem 1. 

a. Suppose \( G : \{0, 1\}^s \rightarrow \{0, 1\}^n \) is a secure PRG. Is \( G'(x) = G(x \oplus 1^s) \) a secure PRG? If so, briefly explain why by providing a security reduction. If not, describe an attack.
> *Your answer:*
> $G'(x)$ when standing alone (the attacker doesn't know about the existence of $G(x)$) is secure. A security reduction is that the advantage of the adversary distinguishing $G'(x)$ from a truly random string is equual to the advantage of the adversary distinguishing $G(x)$ from a truly random string because manipulating the input before passing to an already secure PRG doesn't affect it's security (for any input the output is indisinguishable from random).

b. Suppose \( F : K \times \{0, 1\}^n \rightarrow \{0, 1\}^n \) is a secure PRF. Is \( F'(k, x) = F(k, x) \oplus F(k, x \oplus 1^n) \) a secure PRF? If so, briefly explain why by providing a security reduction. If not, describe an attack.
> *Your answer:*
> $F'(k,x)$ is not a secure PRF. Here is a simple attack on this:
> - The attacker creates 2 messages: $x \text{ and } x \oplus 1^s$.
> - He receives 2 outputs: $$F'(k,x)=F(k,x) \oplus F(k,x\oplus 1^s) \\F'(k,x\oplus 1^s)=F(k,x\oplus 1^s) \oplus F(k,x)$$
> - He sees that the 2 outputs are the same and therefore can distinguish $F'$ from a truly random function.

c. Let \( (S, V) \) be a secure MAC with message space \( \{0, 1\}^n \) for some large \( n \). Define the MAC \( (S', V') \) as

\[
S'(k, m) := (S(k, m), S(k, m \oplus 1^n))
\]

and

\[
V'(k, m, (t_1, t_2)) := 
\begin{cases} 
1 & \text{if } V(k, m, t_1) = V(k, m \oplus 1^n, t_2) = \text{accept} \\
0 & \text{otherwise}
\end{cases}
\]

Is this \( (S', V') \) a secure MAC? If so, briefly explain why by providing a security reduction. If not, describe an attack.
> *Your answer:*
> No this $(S', V')$ is not a secure MAC, because the attacker can forge a valid tag for a message $m' \neq m$. Here is a simple attack:
> - Suppose the attacker can retrieve a previously valid tag $(S(k, m), S(k, m \oplus 1^n))=(t_1,t_2)$ for message $m$. 
> - He then creates a new message $m'=m\oplus 1^n$ and pair of tag $(t_2,t_1)$. This is obviously a valid tag for $m'$ because if you apply $m'$ to the MAC system, it will output: $$S'(k, m\oplus 1^n) := (S(k, m\oplus 1^n), S(k, m))=(t_2,t_1)$$

**d.** Let \( G \) be a group in which the Computational Diffie-Hellman problem (CDH) is easy. That is, there is an efficient algorithm \( A \) that for all \( x, y \in \mathbb{Z} \), given \( (g, g^x, g^y) \in G^3 \) outputs \( g^{xy} \). Can this algorithm be used to break the ElGamal encryption system in \( G \)? If so, explain how. If not, explain why not.
> *Your answer:*
> Yes $A$ can be use to break the Elgamal encryption system.
> Elgamal Encryption system recap:
> - Private key is $x \in \mathbb{Z}_q$ and public key is $h=g^x$.
> - Encryption: choose random $y \in \mathbb{Z}_q$ and sends $(u=g^y,c=m \cdot h^y)$ to encryptor.
> - Decryption: has the private key $x$ and computes $m=c/u^x=c/g^{xy}$.
>
> Attack:
> - The attacker has $g,g^x=h,g^y=u$ therefore can computes $g^{xy}$.
> - Got $c$, he then can compute $m=c/g^{xy}$.

**e.** Let \( G \) be a cyclic group of large prime order \( q \) with generator \( g \in G \). Explain how to quickly calculate the 7th root of \( g \) in \( G \). That is, how do you find an \( h \in G \) such that \( h^7 = g \)?

> *Your answer:* \( h := g^d \) where \( d \) is the modular inverse of 7 in $G$: $$d \cdot 7 \equiv 1 \mod{q}$$
> Therefore, $$h^7 = (g^d)^7 = g^{d \cdot 7} = g \mod{q}$$

---

### Problem 2. (Stream ciphers)

Let \( G : K \rightarrow \{0, 1\}^n \) be a PRG. In class we defined the derived stream cipher \( (E_G, D_G) \) as a cipher defined over \( (K, \{0, 1\}^n, \{0, 1\}^n) \) that operates as

\[
E_G(k, m) := m \oplus G(k) \quad \text{and} \quad D_G(k, c) := c \oplus G(k).
\]

We showed that if \( G \) is a secure PRG then \( (E_G, D_G) \) is semantically secure.

a. Show that \( (E_G, D_G) \) is malleable. In particular, construct an adversary \( A(m, c) \rightarrow c' \) that takes as input \( m \in \{0, 1\}^n \) and \( c := E_G(k, m) \in \{0, 1\}^n \), and outputs a \( c' \in \{0, 1\}^n \) such that \( D_G(k, c') = m \oplus 1^n \).
> *Your answer:* \( A(m, c) := c \oplus 1^n\)

b. Suppose that for all \( k \in K \), the xor of the \( n \) bits of \( G(k) \in \{0, 1\}^n \) is always zero (that is, \( G(k) \) could output 101 but not 001). Is the derived stream cipher \( (E_G, D_G) \) semantically secure? If so, prove security; otherwise, describe a semantic security attacker.
> *Your answer:*
> $(E_G, D_G)$ is not semantically secure. Because the XOR of the \( n \) bits of \( G(k) \in \{0, 1\}^n \) is always zero, $G(k)$ has an even number of 1s. This means, if $m$ has an even number of 1s then so does $c$. The same goes with $m$ with an odd number of 1s. This pattern leaks information $m$ which breaks the semantic security.

c. Show that \( (E_G, D_G) \) is not CPA-secure by describing a CPA adversary that wins the CPA-game with advantage close to 1.
> *Your answer:*
> - Attacker craft 2 different message $m_0,m_1$ (where $m_0$ has even number of 1s and $m_1$ has odd number of 1s) and sends to the encryption system.
> - He receives $c$. Because the xor of the \( n \) bits of \( G(k) \in \{0, 1\}^n \) is always zero, that means the number of 1s in $G(k)$ is an even number. That is, XORing an message with even number of 1s with $G(k)$ gives an even number of 1s, XORing an message with odd number of 1s with $G(k)$ gives an odd number of 1s.
> - If $c$ has even number of 1s, the attacker concludes that $m_0$ was encrypted, else is $m_1$.

d. Consider the randomized cipher \( (E', D') \) defined as

\[
E'(k, m) := 
\begin{cases} 
r \leftarrow_R \{0, 1\}^n, \\
c_1 \leftarrow E_G(k, r), \\
c_2 \leftarrow E_G(k, m \oplus r), \\
\text{output } c \leftarrow (c_1, c_2)
\end{cases}
\]

\[
D'(k, (c_1, c_2)) := D_G(k, c_1) \oplus D_G(k, c_2).
\]

Is \( (E', D') \) CPA-secure? If so, explain why. If not, describe an attack.
> *Your answer:*
> This $(E',D')$ is not CPA-secure. Here is an attack:
> - Attacker craft 2 different message $m_0,m_1$ (where $m_0$ contains all 0s, $m_1 \neq m_0$) and sends to the encryption system.
> - If he receives back $c_1=c_2$, he concludes that $m_0$ was encrypted ($c_2 \gets E_G(k,0^n\oplus r) = E_G(k,r)=c_1$). Else, $m_1$ was encrypted.

e. Recall that a cipher provides authenticated encryption (AE) if it is (i) CPA-secure and (ii) has ciphertext integrity. Suppose \( (E'', D'') \) is a cipher for which there is an adversary \( A \) as in part (a): given \( (m, c) \) as input, the adversary outputs \( c' \) that decrypts to \( m \oplus 1^n \). Which of the two AE properties fails for \( (E'', D'') \): CPA-security or ciphertext integrity?
> *Your answer:*
> $(E'',D'')$ fails the ciphertext integrity property, because the attacker was able to create a different ciphertext $c'$ that can be decrypted to a meaningful $m'=m \oplus 1^n$.
---

### Problem 3. (Digital signatures)

a. Let \( (G, S, V) \) be a signature scheme where algorithm \( S \) always outputs a 64-bit signature. Describe an existential forgery attack on the scheme that requires at most \( 2^{64} \) invocations of algorithm \( V \).
> *Your answer:*
> Queries the algorithm $V$ for all possible $2^{64}$ signatures until it is accepted.

b. Recall that the Lamport signature scheme is a one-time signature that makes use of a one-way function \( f : \mathcal{X} \to \mathcal{Y} \). To sign an \( n \)-bit message, the key generation algorithm outputs a public key containing \( 2n \) elements in \( \mathcal{Y} \). A signature on an \( n \)-bit message \( m \) is a set of pre-images of some \( n \) elements in the public key.

Show that the length of a Lamport signature can be reduced by a factor of \( t \) at the cost of expanding the public and secret key by a factor of at most \( 2^t \). Make sure to describe your key generation, signing, and verification algorithms. You may assume that \( t \) divides \( n \).

**Hint**: In the Lamport signature scheme, we sign one bit of the message at a time. Think of a way to expand the public key that lets us sign \( t \) bits of the message at a time.

c. In Lecture 17 we described the Schnorr signature scheme. The scheme operates in a finite cyclic group \( G \) of prime order \( q \) with generator \( g \in G \). Recall that the secret key is \( \text{sk} := \alpha \in \mathbb{Z}_q \) and the public key is \( \text{pk} := g^\alpha \in G \). The Sign and Verify algorithms use a hash function \( H : \mathcal{M} \times G \to \mathbb{Z}_q \) and work as follows:

\[
S(\text{sk}, m) := 
\begin{cases}
r \leftarrow_R \mathbb{Z}_q, \\
c \leftarrow H(m, g^r) \in \mathbb{Z}_q, \\
z \leftarrow c\alpha + r \in \mathbb{Z}_q \\
\text{output } \sigma \leftarrow (c, z) \in \mathbb{Z}_q^2
\end{cases}
\]

\[
V(\text{pk}, m, (c, z)) := 
\begin{cases}
\text{output accept if } H(m, g^z / \text{pk}^c) = c
\end{cases}
\]
> Nhót khó vl

Note that when computing the signature on \( m \), the signer computes \( z \leftarrow c\alpha + r \), which becomes part of the signature. Here the random nonce \( r \) acts as a "one-time pad" to hide \( c\alpha \).

Suppose that a crypto library implements Schnorr signing incorrectly. Instead of sampling a fresh random \( r \) in \( \mathbb{Z}_q \) for every signature, they implement \( r \) using a counter. The counter \( r \) is initialized to a random value in \( \mathbb{Z}_q \) when the secret key is first generated. Then, after every issued signature, the counter is incremented by one.

Show that an adversary that observes two consecutive signatures \( (m_1, (c_1, z_1)) \) and \( (m_2, (c_2, z_2)) \), can recover the secret signing key \( \alpha \). By consecutive, we mean that the signature \( (c_1, z_1) \) is generated using some (unknown) value \( r_1 \). The signature \( (c_2, z_2) \) is generated using the (unknown) value \( r_1 + 1 \).
> *Your answer:*
> - The attacker knows $$(c_1,z_1=c_1\alpha + r_1)\\ (c_2,z_2=c_2\alpha + r_1+1)$$
> - He can recover $\alpha$ by computing $$z_2-z_1=(c_2-c_1)\alpha+1$$.
> - Since $(c_1,z_1)$, $(c_2,z_2)$ is known to the attacker he can easily recover $\alpha$: $$\alpha=\frac{z_2-z_1-1}{c_2-c_1}$$

d. Briefly explain why your attack from part (c) does not apply if \( r \) is sampled uniformly at random in \( \mathbb{Z}_q \) for every signature.
> *Your answer:*
> Simply because to compute $\alpha$ the attacker needs to know about $r_1,r_2$ which is as hard as guessing $\alpha$ straight away since $r$ is uniformly sampled at random: $$\alpha=\frac{z_2-z_1-r_2+r_1}{c_2-c_1}$$
---

### Problem 4. (Weak PRFs) 
Let \( F : \mathcal{K} \times \mathcal{X} \to \mathcal{Y} \) be a PRF where the input space \( \mathcal{X} \) is large (so that \( 1 / |\mathcal{X}| \) is negligible). We say that \( F \) is weakly secure if the adversary cannot distinguish \( F \) from a truly random function in \( \text{Funs}[\mathcal{X}, \mathcal{Y}] \) when the adversary only sees the evaluation of \( F(k, \cdot) \) at random points in the domain \( \mathcal{X} \). That is, the adversary is given pairs \( (x_i, f(x_i)) \) for \( i = 1, \ldots, q \) where all \( x_i \) are chosen at random in \( \mathcal{X} \), and is supposed to distinguish the case where \( f \) is a truly random function (i.e., \( f \leftarrow_R \text{Funs}[\mathcal{X}, \mathcal{Y}] \)) from the case where \( f \) is a random PRF instance (i.e., \( f(x) := F(k, x) \) for \( k \leftarrow_R \mathcal{K} \)).

a. Write the precise security game defining a weakly secure PRF and define the advantage function for this game. Say that \( F \) is weakly secure if no efficient adversary can win the game with non-negligible advantage.
> *Your answer:*
> **Setup:**
> - The challenger selects a random bit \( b \leftarrow_R \{0, 1\} \):
     - If \( b = 0 \), \( f \leftarrow_R \text{Funs}[\mathcal{X}, \mathcal{Y}] \) (a truly random function).
     - If \( b = 1 \), \( f(x) = F(k, x) \) for a random key \( k \leftarrow_R \mathcal{K} \) (a PRF instance).
>
> **Query Phase:**
>  - The adversary \( A \) makes \( q \) queries to the challenger. For each query \( x_i \in \mathcal{X} \):
>    - The challenger responds with \( f(x_i) \).
>
> **Challenge:**
> - After \( q \) queries, the adversary outputs a guess \( b' \in \{0, 1\} \), where:
     - \( b' = 0 \): The adversary believes \( f \) is a truly random function.
     - \( b' = 1 \): The adversary believes \( f \) is a PRF instance.
>
> **Winning Condition:** The adversary wins if \( b' = b \).
>  The adversary's advantage in the weakly secure PRF game is defined as:
\[
\text{Adv}_{F,A}^{\text{weak-PRF}}(q) = \left| \Pr[b' = b \mid b = 1] - \Pr[b' = b \mid b = 0] \right|,
\]
> where:
> - \( \Pr[b' = b \mid b = 1] \): Probability the adversary guesses correctly when \( f(x) = F(k, x) \) (PRF case).
> - \( \Pr[b' = b \mid b = 0] \): Probability the adversary guesses correctly when \( f \) is a truly random function.

b. Let \( F : \mathcal{K} \times \mathcal{X} \to \mathcal{Y} \) be a secure PRF (in the standard sense) and define:

\[
F'(k, x) :=
\begin{cases} 
k & \text{if } x = 0 \\ 
F(k, x) & \text{otherwise}
\end{cases}
\]

- Is \( F' \) a secure PRF in the standard sense? If so explain why, if not give an attack.
> *Your answer:*
> $F'$ is not a secure PRF. Here is a chosen plaintext attack:
> - Attacker sends $x=0$ and receives back the key $k$.
> - He sends another $x' \neq x$, precompute $F(k,x')$. If he receives back $F'(k,x')=F(k,x')$, he concludes that $F'$ is a PRF, else it is a truly random function. 

- Is \( F' \) a weakly secure PRF? If so explain why, if not give an attack.
> *Your answer:*
> $F'$ is a weakly secure PRF, because the attacker cannot control the input that is sent and therefore cannot distinguish when the key itself is returned or not. This property makes $F'$ looks random.

c. Suppose we use a weakly secure PRF in the standard MAC-based challenge-response protocol. That is, we directly use the weakly secure PRF as the MAC in this protocol. Is the resulting authentication protocol secure against active attacks?

**Hint**: Give an example weakly secure PRF for which there is an active attack on the resulting challenge-response protocol. Make sure to explain how the attack works.
> *Your answer:*
> The resulting authentication protocol is not secure against active attacks.
> Consider the following weak PRF: $$F(k,x)=k \cdot x \mod{p}$$
> Where: 
> - $k \in \mathbb{Z}_p$ is the secret key.
> - $x$ is the message to sign.
> - $p$ is a relatively large prime.
>
> This is a weak PRF because at random input the attacker is not able to distinguish it with a truly random function.
> But in active attack, this property does not hold. Here is why:
> - The attacker sends to messages $x_1 \neq x_2$. and receives back $$t_1=k \cdot x_1 \mod{p}\\ t_2=k \cdot x_2 \mod{p}$$.
> - He notice the linearity relationship and obtain $$k=\frac{t_1}{x_1} \mod{p}=\frac{t_2}{x_2} \mod{p}$$
> - Knowing the secret key $k$, attacker is able to break this weak PRF in an active attack.

---

### Problem 5. (Collision resistant)
Let \( h : \mathcal{X} \to \mathcal{Y} \) be a collision-resistant hash function, where \( |\mathcal{X}| \) is large.

a. Briefly explain why is it that if we want it to take time \( 2^{128} \) to find a collision for \( h \), then we must have \( |\mathcal{Y}| > 2^{256} \).
> *Your answer:*
> - The birthday paradox states that for a function mapping a large domain \( \mathcal{X} \) to a smaller range \( \mathcal{Y} \), the probability of finding a collision increases significantly as the number of inputs tested approaches the square root of \( |\mathcal{Y}| \).
> - Specifically, the probability of finding a collision becomes significant after approximately \( \sqrt{|\mathcal{Y}|} \) inputs have been hashed.
> - To ensure it takes \( 2^{128} \) operations to find a collision, the expected number of hashes required must be close to \( 2^{128} \), which corresponds to the square root of \( |\mathcal{Y}| \):
     \[
     2^{128} \approx \sqrt{|\mathcal{Y}|}.
     \]
> Which means: \[
   |\mathcal{Y}| \geq (2^{128})^2 = 2^{256}.
   \]

b. Let us show that a one-way function need not be collision resistant. Let \( f : \mathcal{X} \to \mathcal{Y} \) be a one-way function. Use \( f \) to construct another function \( f' : \mathcal{X} \to \mathcal{Y} \) such that \( f' \) is one-way, but is not collision resistant. Make sure to explain why your \( f' \) is one-way but not collision resistant.
> *Your answer:*
> Define a one-way function like this: $$f'(x)=\begin{cases} 
f(x) & \text{if } x \text{ is odd} \\ 
f(x-1) & \text{otherwise}
\end{cases}$$
> This is a one-way function because to invert $f'$ you need to invert $f$ which is hard since $f$ is already a one-way function.
> But $f'$ is not collision-resistant because $\forall x \in \mathcal{X}: f'(x)=f'(x+1)=f(x)$.

c. Suppose that \( h : \mathcal{X} \to \mathcal{X} \) is collision resistant. Is \( h'(x) := h(h(x)) \) also collision resistant? If so, show that a collision for \( h' \) gives a collision for \( h \). If not, give an example \( h \) that is collision resistant, but \( h' \) is not.
> *Your answer:*
> Yes, $h'$ is collision resistant. Here is a prove using contrapositive arguments:
> - If $h'$ is not collision resistant, then there exist $x_1 \neq x_2$ such that: $$h'(x_1)=h'(x_2) \rightarrow h(h(x_1))=h(h(x_2)) \text{  (1)} $$
> - But since $h$ is collision resistant, with $x_1 \neq x_2 \rightarrow h(x_1) \neq h(x_2)$
> - From (1), we see that $$h(h(x_1))=h(h(x_2)), h(x_1) \neq h(x_2)$$
> 
> - This breaks the property of collision resistant of $h$. Therefore, $h'$ is also collision resistant.