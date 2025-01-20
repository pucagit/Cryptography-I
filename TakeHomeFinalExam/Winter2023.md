# CS255: Take-home Final Exam 
## Winter 2023
---

### Problem 1

a. Does counter mode encryption require a PRP, or is a PRF suffcient?Justify your answer.
> *Your answer:*
> CTR only requires PRF since in the decryption scheme, we only need to XOR the cipher block with the encrypted version of the IV to get the message block. There is no need to invert the encryption of the IV (which requires PRP).

b. Recall that the one-time pad is defined over \( (K, \mathcal{M}, \mathcal{C}) \) where \( K = \mathcal{M} = \mathcal{C} = \{0, 1\}^n \) and \( E(k, m) = k \oplus m \). Notice that when the key \( k = 0^n \) is used, then \( E(k, m) = m \), and this does not seem secure.

Suppose we improve the one-time pad by setting the key space to \( K := \{0, 1\}^n \setminus \{0^n\} \). That is, we take \( 0^n \) out of the key space so that it will never be chosen as a key. Does the resulting cipher have perfect secrecy? Justify your answer.
> *Your answer:*
> The resulting cipher doesn't have perfect secrecy, because when removing one key ($0^n$) the key space will be reduced to $2^n-1$ which is smaller than the message space ($2^n$). That violates the property of perfect secrecy.

c. Let \( G \) be a group of prime order \( p \) with generator \( g \in G \). Assume that the discrete log problem is hard in \( G \). Consider the following PRG defined over \( (\mathbb{Z}_p, G^2) \): given an input \( x \in \mathbb{Z}_p \), the PRG outputs 

\[
G(x) := (g^{4x}, g^{5x}) \in G^2.
\]

Is this a secure PRG? If so, explain why. If not, describe an attack.
> *Your answer:*
> This is not a secure PRG, because their is a linear relationship between $g^{4x}$ and $g^{5x}$:
> $$log_g(g^{4x})=\frac{4}{5} \times log_g(g^{5x}).$$
> An attack on this is, suppose the attacker receives $(u, v)=(g^{4x}, g^{5x})$. He can then compute if $u^5=v^4$. If so, he can distinguish PRG from a truly random pair.

d. What is the smallest possible positive value of \( e \) that can be used to define the RSA trapdoor function? Explain why a smaller value of \( e \) cannot be used.
> *Your answer:*
> The smallest possible positive value of $e$ is 3. Here is why:
> - If $e=1$: attacker can easily compute $d=1 \mod{\phi(n)}$ and got the secret key $(N, d)$.
> - If $e=2$: attacker can easily compute $d=\frac{N+1}{2}$ in $\mathbb{Z}_N$ ($\frac{N+1}{2}=2^{-1}=e^{-1}=d$)
> - If $e=3$: $\phi(N)=(p-1)(q-1)$ is an even number ($p,q$ prime $\rightarrow p,q$ is odd $\rightarrow (p-1),(q-1)$ is even). Therefore $gcd(\phi(N),e=3) = 1$ which is valid to have $d=e^{-1} \mod{\phi(N)}$.

e. In the ElGamal public key encryption system, is it safe to fix the group \( G \) and generator \( g \in G \), so that all users in the world use the same \( (G, g) \)?
> *Your answer:*
> It is safe to fix the group $G$ and generator $g \in G$, because the secret key is what needed to be kept secret and with the given public key $(g, h=g^a)$, it is hard to compute $a$ (the secret key) because of the discrete log problem. Therefore, fixing $g$ and $G$ does not affect the secret $a$.

---

### Problem 2

a. Show that if \( H_1 \) and \( H_2 \) are distinct collision-resistant functions with range \( \mathcal{T} := \{0, 1\}^n \), then 

\[
H(x) := H_1(x) \oplus H_2(x)
\]

need not be collision-resistant.

**Hint**: Let \( F \) be a collision-resistant hash function with range \( \mathcal{T} \). Use \( F \) to construct two collision-resistant functions \( H_1, H_2 \) such that \( H \) is not collision-resistant.
> *Your answer:*
> Let $F$ be a collision-resistant hash function with range \( \mathcal{T}=\{0,1\}^N \). Define:
> - $H_1(x) = F(x)$ is collision-resistant
> - $H_2(x) = F(x) \oplus 1^n$ collision-resistant
> The combined function would be: $H(x)=H_1(x) \oplus H_2(x)=1^n$. For any message $x$, this hash function always provide $1^n$ as the digest of $x$ which leads to a collision.

b. The UNIX `crypt` function is a hash function that only looks at the first eight bytes of the input message. For example, `crypt(helloworld)` returns the same value as `crypt(hellowor)`.

Consider the following MAC system \( (S, V) \) whose key space \( \mathcal{K} \) is the set of eight-character strings:

\[
S(k, m) := \text{crypt}(m \| k) \quad ; \quad V(k, m, t) := \{\text{output yes if } t = \text{crypt}(m \| k)\}.
\]

Here \( \| \) denotes string concatenation. Show that this MAC is vulnerable to a chosen message attack. In particular, show that an adversary can recover \( k \) with \( 8 \times 256 \) chosen message queries.
> *Your answer:*
> 1. The adversary chooses \( m \) to be a 7-character string: \( m = "aaaaaaa" \).
> - The input to `crypt` becomes \( m \| k = "aaaaaaa" \| k = "aaaaaaa k_1" \), where \( k_1 \) is the first byte of \( k \).
> - The adversary iterates through all 256 possible values of \( k_1 \), constructing test strings \( "aaaaaaa" \| k_1' \) for each \( k_1' \in \{0, 1, \dots, 255\} \).
> - For each test string, the adversary computes:
   \[
   t' = \text{crypt}("aaaaaaa" \| k_1'),
   \]
   and compares \( t' \) with the actual MAC \( t = S(k, m) \).
> - When \( t' = t \), the adversary has found \( k_1 \).
> 2. The adversary chooses \( m = "aaaaaa" \) (6 characters), so the input to `crypt` becomes \( m \| k = "aaaaaa k_1 k_2" \).
> - The adversary already knows \( k_1 \) from Step 1.
> - The adversary iterates through all 256 possible values of \( k_2 \), constructing test strings \( "aaaaaa" \| k_1 \| k_2' \) for each \( k_2' \in \{0, 1, \dots, 255\} \).
> - For each test string, the adversary computes:
   \[
   t' = \text{crypt}("aaaaaa" \| k_1 \| k_2'),
   \]
   and compares \( t' \) with the actual MAC \( t = S(k, m) \).
> - When \( t' = t \), the adversary has found \( k_2 \).
> 3. Repeat that for all the remaining bytes and  Since \( k \) is 8 bytes long, the total number of queries is: $8 \times 256 = 2048 \text{ queries.}$

c. Let \( F \) be a secure PRF defined over \( (K, \mathcal{X}, \mathcal{Y}) \) where \( \mathcal{X} = \mathbb{F}_2^n \). Recall that \( \mathbb{F}_2 = \{0, 1\} \), where addition and multiplication are defined modulo two (e.g., \( 1 + 1 = 0 \) and \( 1 \times 1 = 1 \)), and \( \mathbb{F}_2^n \) can be treated as the set of all \( n \)-bit strings. Let’s try to construct a secure MAC for messages in \( \mathbb{F}_2^\ell \), namely \( \ell \)-bit messages, where \( \ell > n \).

Let \( A \) be an \( n \times \ell \) matrix over \( \mathbb{F}_2 \), where \( \ell > n \). This matrix \( A \) is fixed and public. Here is a simple proposal for a MAC algorithm for messages \( m \) in \( \mathbb{F}_2^\ell \):

\[
S(k, m) := \{x \leftarrow A \cdot m \in \mathbb{F}_2^n, \text{ output } t \leftarrow F(k, x)\}
\]

\[
V(k, m, t) := \{\text{accept if } t = F(k, A \cdot m)\}.
\]

Someone who did not take CS255 might argue that without \( k \), an attacker cannot compute the tag for a message \( m \) of its choice. However, show that this proposal is flawed: an attacker can carry out an existential forgery given one valid message-tag pair.

**Hint**: Use the fact that because \( \ell > n \), the kernel of \( A \) is non-trivial, meaning that there are non-zero vectors \( z \in \mathbb{F}_2^\ell \) such that \( A z = 0 \).
> *Your answer:*
> Given: The attacker knows one valid message-tag pair $(m, t)$ where: $$t=F(k,A \cdot m)$$
> Goal: Forge a different $m' \neq m$ along with a valid tag $t'$ such that: $$t'=F(k,A \cdot m')$$
> Attack steps:
> - Compute a non-zero vector $z \in \mathbb{F}_2^l$ such that: $Az=0$.
> - Generate $m'=m \oplus z$ and tag $t'=t$. This is a valid tag because the signing alg. then would be: $$x' \leftarrow A \cdot m' = A \cdot m \oplus A \cdot z= A \cdot m=x$$ Therefore, output $t' \leftarrow F(k,x')=F(k,x)=t$
> 
> The attacker now has a new message-tag pair $(m',t')$ where $m' \neq m$ and $t'=t$. This constitutes a valid existential forgery.

---

### Problem 3. Private broadcast

a. Let \( (Gen, E, D) \) be a public key encryption scheme. Let \( pk_1, pk_2, \ldots, pk_n \) be \( n \) public keys generated using \( Gen() \). Bob wants to send a long secret message \( M \), such as a video, to all \( n \) recipients, and he has a broadcast channel to do so. Think of Bob sending his message to a satellite in orbit, which then beams the message to all \( n \) recipients at once.

Naively, Bob can encrypt the message \( M \) under each recipient’s public key and broadcast the resulting \( n \) ciphertexts all at once. This results in a broadcast message of size \( O(n \times \text{len}(M)) \). Show that Bob can encrypt \( M \) so that the broadcast message size is only \( O(n + \text{len}(M)) \).

**Hint**: You may use a symmetric cipher \( (E_\text{sym}, D_\text{sym}) \) with key space \( K \) that provides authenticated encryption.
> *Your answer:*
> - Bob generate a symmetric key encryption scheme $(E_{sym}, D_{sym})$ with key $k_{sym}$.
> - Encrypt the secret message $M$ using this key: $C=E_{sym}(k_{sym},M)$.
> - Use each public key $pk_i$ to encrypt this key: $C_{ki}=E(pk_i,k_{sym})$.
> - Sends to each recipient $i$: $(C, C_{ki})$.
> - Recipient $i$ can decrypt $C_{ki}$ to get the $k_{sym}$ and use this key to decrypt $C$ to get message $M$.

b. Next, with the same setup as in part (a), suppose that Bob wants to send the secret message \( M \) to a subset \( S \) of the \( n \) recipients, namely some \( S \subseteq \{1, \ldots, n\} \). However, it is important to Bob that the set \( S \) remains secret, even from the \( n \) recipients. Of course, if recipient number \( i \) can obtain the message \( M \) from the broadcast, then it learns that \( i \) is in \( S \). However, it should learn nothing else about the set \( S \). For example, think of a TV-satellite system where the broadcaster does a global broadcast but wants to keep the set of active subscribers secret.

Show how to modify your construction from part (a) to satisfy this goal. Note that everyone will see the satellite broadcast, so Bob cannot solve this problem by restricting the physical broadcast to just the members of \( S \).

To reiterate, Bob needs a way to encrypt \( M \) so that:
1. Every recipient in \( S \) should receive \( M \).
2. Recipients not in \( S \) should learn nothing about \( M \) (other than its length).
3. Recipient \( i \) learns if \( i \) is in \( S \), but should learn nothing else about \( S \).

**Hint**: The broadcast message size is still \( O(n + \text{len}(M)) \) even though the number of parties who receive \( M \) may be much smaller than \( n \).
> *Your answer:*
> Same as above but instead of encrypting directly the symmetric key $k_{sym}$. Bob now use a random blinding key $r \in K$:
> - Compute the masked key $k'$: $k'=k \oplus r$.
> - For each recipient $j \in S$, encrypts $r$ using their $pk_j$: $C_k=E(pk_j, r)$.
> - For each recipient $j \notin S$, encrypts $\empty$ using their $pk_j$: $C_k=E(pk_j, \empty)$.
> - Sends a broadcast message: $BM=(C,k',C_j)$ for $j \in S$.
> Each recipient $i$ will performs the following steps:
> - Tries to decrypt every $C_j$ in $BM$.
>   - If got $\empty$, conclude that they are not in $S$ and learns nothing else about $S$ or $M$.
>   - If success (got $r$), compute $k=k' \oplus r$ and use this key to decrypt $C$ and get the message $M$. However, the recipient still learns nothing else about $S$.

---

#### Problem 4. Variants of ElGamal

Let \( G \) be a group of prime order \( q \) with generator \( g \in G \). Here is a simplified version of the ElGamal public key encryption scheme:

\[
Gen() := \{ \alpha \gets \mathbb{Z}_q, \; sk \gets \alpha, \; pk \gets g^\alpha \}
\]

\[
E(pk, m) := \{ \rho \gets \mathbb{Z}_q, \; u \gets g^\rho, \; v \gets m \cdot pk^\rho, \; ct \gets (u, v) \}
\]

\[
D(sk, (u, v)) := v / u^{sk}
\]

One can show that this scheme is semantically secure assuming a problem called Decision Diffie-Hellman (DDH) is hard in \( G \).

Let us consider three variants of the encryption algorithm:

1. \( E_1(pk, m) := \{ \rho \gets \mathbb{Z}_q, \; u \gets g^{\rho + 1}, \; v \gets m \cdot pk^\rho, \; ct \gets (u, v) \} \)
2. \( E_2(pk, m) := \{ \rho \gets \mathbb{Z}_q, \; u \gets \rho, \; v \gets m \cdot pk^\rho, \; ct \gets (u, v) \} \)
3. \( E_3(pk, m) := \{ \rho, \psi \gets \mathbb{Z}_q, \; u \gets g^\psi, \; v \gets m \cdot pk^\rho, \; ct \gets (u, v) \} \)

For each variant, answer two questions:
1. Is there an efficient decryption algorithm using \( sk \), and if so, show the algorithm.
2. Is the encryption scheme semantically secure? If not, describe an attack, and if so, give a reduction to the security of the basic scheme at the top of the page (that is, show that a semantic security attacker \( A \) on the modified scheme can be used to construct a semantic security attacker \( B \) for the original scheme).

**Note**: Semantic security is tied to the Decision Diffie-Hellman (DDH) assumption.
a. Is there an efficient decryption algorithm for $E_1$?
> *Your answer:*
> Decryption algorithm:
> - $v=m \cdot pk^ρ=m \cdot g^{αρ}$
> - $\frac{v}{u^α}=\frac{m \cdot g^{αρ}}{g^{αρ+α}}=\frac{m}{g^α}=\frac{m}{pk}$
> $\rightarrow m=pk \times \frac{v}{u^{sk}}$.

b. Is $E_1$ semantically secure?
> *Your answer:*
> $E_1$ has semantic security because $ct$ doesn't leak any information about $sk$ or $m$.

c. Is there an efficient decryption algorithm for $E_2$?
> *Your answer:*
> Decryption algorithm: $m=\frac{v}{pk^ρ}=\frac{v}{pk^u}$.

d. Is $E_2$ semantically secure?
> *Your answer:*
> $E_2$ doesn't have semantic security because $ct$ reveals directly $u=ρ$ which can be use to decrypt the message without knowing the secret key (as the decryption alg. descibes above).

e. Is there an efficient decryption algorithm for $E_3$?
> *Your answer:*
> There is no efficient decryption algorithm for this encryption scheme, since $ct$ does not provide any information about $ρ$, which is needed to compute $m$.

f. Is $E_3$ semantically secure?
> *Your answer:*
> $E_3$ has semantic security because $ct$ doesn't leak any information about $sk$ or $m$.

---

#### Problem 5. Challenge-response

In [class](#) we saw a signature-based challenge-response identification protocol that is secure against active adversaries, requires no secrets on the server, and where the challenge is short (e.g., six digits) and the response is long (a digital signature).

a. Describe a challenge-response protocol with the same properties as the one we saw in class, except that the challenge is long and the response is short (e.g., six digits). The adversary’s success probability should be at most \( 1/2^\ell \), where \( \ell \) is the response length in bits.

**Hint**: Instead of a signature scheme, construct your protocol using a public-key encryption scheme \( (G, E, D) \), where the verifier sends the encryption of a short random challenge.
> *Your answer:*
> **Challenge-response Protocol:**
> - Setup: The prover use $G$ to generate $pk$ (share with the verifier) and $sk$ (kept secretly by the prover).
> - Verifier: Generates a random long challenge $r$, encrypt it and send to the prover: $E(pk,r)$. He also computes $s=f(r)$ (where $f$ is a deterministic function, $s$ is a short response with length $l$)
> - Prover: Decrypts and got the challenge $r=D(sk,E(pk,r))$. Computes $s'=f(r)$ and sends back $s'$ to the verifier.
> - Verifier: compares $s,s'$. If $s=s'$: conclude a valid signature.
> 
> The adversary's success probability would be $1/2^l$ since he has to guess the right $s$ which length is $l$ digits.

b. In the scheme from part (a), the verifier needs to keep a secret value between the time that it sends the challenge and the time it receives the response from the prover. Suppose we require the protocol to be **public coin**, meaning that the verifier cannot keep any secrets. The signature-based challenge-response protocol is an example of a public coin protocol. 

Show that in this case, any challenge-response protocol (two rounds) where the prover sends back an \( \ell \)-bit message can be broken in time \( O(2^\ell) \). That is, the adversary can fool the verifier with probability 1 after performing a computation that takes time \( O(2^\ell) \). You may assume the verifier runs in constant time. Hence, if \( \ell \) is small, the protocol cannot be secure.
> *Your answer:*
> **Public coin protocol:**
> - Round 1 (verifier $\rightarrow$ prover): challenge $c$
> - Round 2 (prover $\rightarrow$ verifier): response $r$.
> - The verifier checks if $r$ is a valid repsonse for $c$. 
> 
> **Attack steps:**
> - The attacker intercepts and got the challenge $c$.
> - He then computes a verification function $V(r,c)$ (the same as the one the verifier uses) for all $2^l$ possible responses of $r$. $$\forall r \in \{0,1\}^l, \text{check if } V(r,c)=\text{accept}.$$
> - Once a valid $r$ is found, send to the verifier with probability 1 and break the protocol.
>
> This shows that any challenge-response protocol (two rounds) where the prover sends back an $l$-bit message can be broken in time $O(2^l)$ because the attacker has to guess $2^l$ responses. And therefore, if $l$ is small, the protocol cannot be secure.