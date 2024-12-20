# BASIC KEY EXCHANGE

---

### Q1.
Consider the toy key exchange protocol using an online trusted 3rd party (TTP) discussed in [Lecture 9.1](https://www.coursera.org/learn/crypto/lecture/Ef7Gy/trusted-3rd-parties). Suppose Alice, Bob, and Carol are three users of this system (among many others) and each have a secret key with the TTP denoted $k_a, k_b, k_c$ respectively. They wish to generate a group session key $k_{ABC}$ that will be known to Alice, Bob and Carol but unknown to an eavesdropper. How would you modify the protocol in the lecture to accommodate a group key exchange of this type?   (note that all these protocols are insecure against active attacks).

- [ ] Alice contacts the TTP. TTP generates a random $k_{ABC}$ and sends to Alice 
$E(k_a, k_{ABC}), ticket_1 \leftarrow E(k_b, k_{ABC}), ticket_2 \leftarrow E(k_c, k_{ABC})$.
Alice sends $k_{ABC}$ to Bob and Carol.
- [x] Alice contacts the TTP. TTP generates a random $k_{ABC}$ and sends to Alice 
$E(k_a, k_{ABC}), ticket_1 \leftarrow E(k_b, k_{ABC}), ticket_2 \leftarrow E(k_c, k_{ABC})$.
Alice sends $ticket_1$ to Bob and $ticket_2$ Carol.
- [ ] Alice contacts the TTP. TTP generates a random $k_{ABC}$ and sends to Alice 
$E(k_a, k_{ABC}), ticket_1 \leftarrow E(k_b, k_{AB}), ticket_2 \leftarrow E(k_c, k_{AC})$.
Alice sends $ticket_1$ to Bob and $ticket_2$ Carol.
- [ ] Alice contacts the TTP. TTP generates a random $k_{ABC}$ and sends to Alice 
$E(k_a, k_{ABC}), ticket_1 \leftarrow k_{ABC}, ticket_2 \leftarrow k_{ABC}$.
Alice sends $ticket_1$ to Bob and $ticket_2$ Carol.

> **Explain:** The protocol must ensure that Alice, Bob and Carol have the same group session key $k_{ABC}$ after decrypting the tickets with their secret key (e.g. Bob gets $k_{ABC} = D(k_b, ticket_1)$), but the attacker cannot get it since it has no information about $k_b$ or $k_c$.


### Q2.
Let $G$ be a finite cyclic group (e.g. $G = \mathbb{Z}^*_p$) with generator $g$. Suppose the Diffie-Hellman function $DH_g(g^x, g^y) = g^{xy}$ is difficult to compute in $G$. Which of the following functions is also difficult to compute?
As usual, identify the $f$ below for which the contra-positive holds: if $f(\cdot, \cdot)$ is easy to compute then so is $DH_g(\cdot, \cdot)$. If you can show that then it will follow that if $DH_g$ is hard to compute in $G$ then so must be $f$.
- [ ] $f(g^x, g^y) = g^{x-y}$
- [x] $f(g^x, g^y) = g^{x(y+1)}$
> **Explain:** Calculating $f(g^x, g^y)$ can be converted to calculating $DH_g(g^x, g^y)$ which is hard to compute
- [x] $f(g^x, g^y) = (g^{3xy}, g^{2xy})$
> **Explain:** Calculating $f(g^x, g^y)$ can be converted to calculating $DH_g(g^x, g^y)$ which is hard to compute
- [ ] $f(g^x, g^y) = g^{x+y}$
 
### Q3.
Suppose we modify the Diffie-Hellman protocol so that Alice operates as usual, namely chooses a random $a$ in ${1, ..., p - 1}$ and sends to Bob $A \leftarrow g^a$. Bob, however, chooses a random $b$ in ${1, ..., p - 1}$ and sends to Alice $B \leftarrow g^{\frac{1}{b}}$. What shared key can they generate and how would they do it?
- [x] secret $= g^{\frac{a}{b}}$. Alice computes the secret as $B^a$ and Bob computes $A^{\frac{1}{b}}$.
- [ ] secret $= g^{\frac{b}{a}}$. Alice computes the secret as $B^a$ and Bob computes $A^{\frac{1}{b}}$.
- [ ] secret $= g^{\frac{a}{b}}$. Alice computes the secret as $B^{\frac{1}{a}}$ and Bob computes $A^b$.
- [ ] secret $= g^{\frac{a}{b}}$. Alice computes the secret as $B^{\frac{1}{b}}$ and Bob computes $A^a$.
  
> **Explain:** Both Alice and Bob must obtain $g^{\frac{a}{b}}$ after the computation.

### Q4.
Consider the toy key exchange protocol using public key encryption described in [Lecture 9.4](https://www.coursera.org/learn/crypto/lecture/HB4jI/public-key-encryption).
Suppose that when sending his reply $c \leftarrow E(pk', x)$ to Alice, Bob appends a MAC $t := S(x, c)$ to the ciphertext so that when sending to Alice is a pair $(c, t)$. Alice verifies the tag $t$ and rejects the message from Bob if the tag does not verify.
Will this additional step prevent the man in the middle attack described in the lecture?
- [x] no
- [ ] yes
- [ ] it depends on what public key encryption system is used.
- [ ] it depends on what MAC system is used.

> **Explain:** In the MITM attack, the attacker can still decrypt $E(pk', x)$ to recover the secret $x$ and then replace $(c, t)$ by $(c', t')$ where $c' \leftarrow E(pk, x)$ and $t \leftarrow S(x, c')$. 

### Q5.
The numbers 7 and 23 are relatively prime and therefore there must exist integers $a$ and $b$ such that $$7a + 23b = 1$$ Find such a pair of integers $(a, b)$ with the smallest possible $a > 0$.
Given this pair, can you determine the inverse of 7 in $\mathbb{Z}_{23}$?
Enter below comma separated values for $a, b$ and for $7^{-1}$ in $\mathbb{Z}_{23}$.

**Answer:**
`10, -3, 10`

> **Explain:** 
> - Find $a, b$: basic math ($a,b$ are integers)
> - Find $7^{-1}$: We have $7 \times 10 + 23 \times (-3) = 1 \rightarrow 7 \times 10 = 1$ in $\mathbb{Z}_{23}$
> $\rightarrow 7^{-1} = 10$ in $\mathbb{Z}_{23}$ 

### Q6.
Solve the equation $3x + 2 = 7$ in $\mathbb{Z}_{19}$.

**Answer:**
`8`

> **Explain:** 
> - Let's find $3^{-1} \leftarrow x$: 
>   - $3 \times x = 1$ in $\mathbb{Z}_{19} \rightarrow x = \frac{19k + 1}{3}$ $(\forall k, x \in \mathbb{Z}, x < 19)$
>   - At $k = 2 \rightarrow x = 13$
> - We have $x = (7 - 2) \times 3^{-1}$ in $\mathbb{Z}_{19} = 5 \times 13$ in $\mathbb{Z}_{19} = 8$. 


### Q7.
How many elements are there in $\mathbb{Z}^*_{35}$?

**Answer:**
`24`

> **Explain:** $\phi(35) = \phi(7 \times 5) = (7 - 1) \times (5 - 1) = 24$

### Q8.
How much is $2^{10001}$ mod $11$?
Please do not use a calculator for this.  Hint: use Fermat's theorem.

**Answer:**
`2`

> **Explain:** 
> - By Fermat $2^{p-1} = 1$ in $\mathbb{Z}_{p}$ $\rightarrow 2^{10} = 1$ in $\mathbb{Z}_{11}$. 
> - Therefore $1^4 \times 2 = {(2^{10})}^4 \times 2 = 2^{10001}$ in $\mathbb{Z}_{11}$.
> $\rightarrow 2^{10001} \text{ mod } 11 = 2$

### Q9.
While we are at it, how much is $2^{245}$ mod $35$?
Hint: use Euler's theorem  (you should not need a calculator)

**Answer:**
`32`

> **Explain:** 
> - By Fermat $2^{\phi(N)} = 1$ in $\mathbb{Z}_{N}$ $\rightarrow 2^{24} = 1$ in $\mathbb{Z}_{35}$. 
> - Therefore $1^{10} \times 2^5 = {(2^{24})}^{10} \times 2^5 = 2^{245}$ in $\mathbb{Z}_{35}$.
> $\rightarrow 2^{245} \text{ mod } 35 = 32$

### Q10.
What is the order of $2 \text{ in } \mathbb{Z}^*_{35}$

**Answer:**
`12`

> **Explain:** 
> - Let the order of $2$ is $a \rightarrow \text{ smallest } a > 0, \text{ .s.t. } g^a = 1 \text{ in } \mathbb{Z}^*_{35}$.
> - Therefore $a = \log_2(35k + 1) = 12$ $\forall k, a \in \mathbb{Z}$

### Q11.
Which of the following numbers is a generator of $\mathbb{Z}^*_{13}$
- [x] $6, ⟨6⟩ = \{1,6,10,8,9,2,12,7,3,5,4,11\}$
- [ ] $5, ⟨5⟩= \{1,5,12,8\}$
- [x] $7, ⟨7⟩= \{1,7,10,5,9,11,12,6,3,8,4,2\}$
- [ ] $10, ⟨10⟩= \{1,10,9,12,3,4\}$
- [ ] $9, ⟨9⟩= \{1,9,3\}$

> **Explain:** 
> - $g$ is called a generator of $\mathbb{Z}^*_{p}$ if $\{1, g, g^2, g^3, ..., g^{p-2}\} = \mathbb{Z}^*_{p}$
> - Trick: because for prime $p \rightarrow \phi(p) = p - 1$ 
> $\rightarrow$ find the sets that contains exactly $13 - 1 = 12$ elements.

### Q12.
Solve the equation $x^2 + 4x + 1 = 0$ in $\mathbb{Z}_{23}$.
Use the method described in [Lecture 10.3](https://www.coursera.org/learn/crypto/lecture/fjRVO/modular-e-th-roots) using the quadratic formula.

**Answer:**
`14 and 5`

> **Explain:** 
> - We have $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ in $\mathbb{Z}_{23} = (-4 \pm \sqrt{12}) \times 2^{-1}$ in $\mathbb{Z}_{23}$
> - Find $2^{-1}$: $2 \times 12 = 1$ in $\mathbb{Z}_{23} \rightarrow 2^{-1} = 12$
> - Find $\sqrt{12} \leftarrow x$ : find $x^2 = 12$ in $\mathbb{Z}_{23}$ for $x \in [1, 22] \rightarrow x = 9$.
>  - Then $x_1 = (-4 - 9) \times 12 = -156$ in $\mathbb{Z}_{23} \rightarrow x_1 = 5$ in $\mathbb{Z}_{23}$
> - Then $x_2= (-4 + 9) \times 12 = 60$ in $\mathbb{Z}_{23} \rightarrow x_2 = 14$ in $\mathbb{Z}_{23}$

### Q13.
What is the $11th$ root of $2$ in $\mathbb{Z}_{19}$? (i.e. what is $2^{\frac{1}{11}}$ in $\mathbb{Z}_{19}$)
Hint: observe that $11^{-1} = 5$ in $\mathbb{Z}_{18}$

**Answer:**
`13`

> **Explain:**
> - We have: if $d = e^{-1}$ in $\mathbb{Z}_{p-1}$ then $c^{\frac{1}{e}} = c^d$ in $\mathbb{Z}_{p}$
> - Then $2^{\frac{1}{11}} = 2^5 = 32 \equiv 13$ in $\mathbb{Z}_{19}$.

### Q14.
What is the discrete log of $5$ base $2$ in $\mathbb{Z}_{13}$? (i.e. what is $Dlog_2(5)$)
Recall that the powers of $2$ in $\mathbb{Z}_{13}$ are $⟨2⟩= \{1,2,4,8,3,6,12,11,9,5,10,7\}$

**Answer:**
`9`

> **Explain:** $2^9 = 5$ in $\mathbb{Z}_{13}$

### Q14.
If $p$ is a prime, how many generators are there in $\mathbb{Z}^*_{p}$?
- [ ] $\frac{p+1}{2}$
- [ ] $p - 1$
- [ ] $\sqrt{p}$
- [x] $\phi(p-1)$

> **Explain:** Let $g$ be some generator of $\mathbb{Z}^*_{p}$ and let $h = g^x$ for some $x$. It is not difficult to see that $h$ is a generator exactly when we can write $g$ as $g = h^y$ for some integer $y$ ($h$ is a generator because if $g = h^y$ then any power of $g$ can also be written as a power of $h$). 
> Since  $y = x^{-1}$ mod $p - 1$ this $y$ exists exactly when $x$ is relatively prime to $p -1$. The number of such $x$ is the size of $\mathbb{Z}^*_{p-1}$ which is precisely $\phi(p-1)$.