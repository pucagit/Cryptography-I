# Các tính chất của phép đồng dư
- $a \equiv a \pmod{m}$ 
- $a \equiv b \pmod{m}$ $⇔ m \mid (a-b) \quad$ ($m$ là ước của $(a-b)$)
- $a \equiv b \pmod{m}$ ⇒ $b \equiv a \pmod{m}$
- $\begin{cases}
    a \equiv b  \pmod{m} \\ 
    b \equiv c  \pmod{m}
\end{cases} \quad ⇒ a \equiv c  \pmod{m}$
- Cộng hoặc trừ theo vế các đồng dư thức cùng modullo:
  $\forall i \in [1,n], a_i \equiv b_i \text{ (mod m)} ⇒ \sum_{i=1}^n a_i \equiv \sum_{i=1}^n b_i \pmod{m}$
- Cộng hoặc trừ cả hai vế của đồng dư thức với một hằng số:
  $a \equiv b  \pmod{m} ⇒ a \plusmn c = b \plusmn c \pmod{m}$
- Nhân theo vế các đồng dư thức cùng modullo:
  $\forall i \in [1,n], a_i \equiv b_i \pmod{m} ⇒ \prod_{i=1}^n a_i \equiv \prod_{i=1}^n b_i \pmod{m}$
- Nhân cả hai vế của đồng dư thức với một số nguyên:
  $a \equiv b$ (mod $m$) $⇒ ca \equiv cb$ (mod $m$)
- Nếu $c$ là số nguyên dương ta còn có:
  $a \equiv b \pmod{m} ⇒ a^n \equiv b^n$ (mod $m$)
- Chia cả hai vế cho một số nguyên tố cùng nhau với modulo:
  $\begin{cases}
    a \equiv b \pmod{m} \\
    d | a \\ 
    d | b \\
    (m, d) = 1
  \end{cases} ⇒ \frac{a}{d} = \frac{b}{d} \pmod{m}$
- Chia cả hai vế và modulo cho một số:
  $a \equiv b \pmod{m} ⇒ \frac{a}{d} = \frac{b}{d} \pmod{\frac{m}{d}}$
- Lấy bội chung nhỏ nhất các modulo:
  $\forall i \in [1,\dots, n], a \equiv b \pmod{m_1} ⇒ a \equiv b \pmod{[m_1,m_2,\dots,m_n]}$

# Phép cộng, trừ, nhân và lũy thừa modulo M
- $(a + b) \pmod{M} = (a \pmod{M} + b \pmod{M}) \pmod{M}$
- $(a \times b) \pmod{M} = (a \pmod{M} \times b \pmod{M}) \pmod{M}$
- $(a - b) \pmod{M} = (a \pmod{M} - b \pmod{M} + M) \pmod{M}$