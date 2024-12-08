## Đề thi môn *Mật mã ứng dụng*
Thời gian: 90 phút
Không sử dụng tài liệu

### Bài 1.
Xét $\Epsilon = (E, D)$ là một hệ mã ***an toàn ngữ nghĩa*** (semantic security) trên $(K, M, L)$ với $M = \{0, 1\}^L$. Hệ mã nào dưới đây cũng là an toàn ngữ nghĩa? Nếu an toàn hãy đưa ra chứng minh, ngược lại hãy chỉ ra một cách tấn công.
(a) $E_1(k, m) \colonequals 0 \text{ || } E(k, m) \qquad \qquad \qquad \quad$ (b)  $E_2(k, m) \colonequals E(k, m) \text{ || } parity(m)$
Ở đây, cho xâu bit $s$, $parity(s)$ bằng 1 nếu số lượng 1 trong $s$ là lẻ, và bằng 0 trong trường hợp ngược lại.

> **Trả lời:**
> - **(a) an toàn**. Vì với $\Epsilon$ là một hệ mã an toàn ngữ nghĩa thì với việc $E_1$ nối thêm bit 0 vào trước bản mật không làm lộ bất cứ thông tin gì về bản rõ.
> - **(b) không an toàn**. Một cách tấn công đơn giản là kẻ tấn công sẽ gửi đi $m_0 = 0$ và $m_1 = 1$. Challenger lúc đó sẽ chọn mã hóa một trong hai bản thật này và trả về $C \leftarrow E(k, m_b)$ $(b = 0$ hoặc $b = 1)$. Kẻ tấn công lúc này kiểm tra bit cuối của $C$, nếu $LSB(C) = 1 \rightarrow$ số lượng bit 1 là lẻ tức là $m_1$ đã được mã hóa. Ngược lại $m_0$ đã được mã hóa. Từ đó kẻ tấn công dễ dàng phá vỡ hệ mã này.

### Bài 2.
Ta muốn xây dựng một hệ mã khối $\Epsilon = (E, D)$ từ hai hệ mã khối $\Epsilon_1 = (E_1, D_1)$ và $\Epsilon_2 = (E_2, D_2)$ sao cho nếu ở một thời điểm nào đó trong tương lai một trong hai (nhưng không phải cả hai) hệ $\Epsilon_1$ hoặc $\Epsilon_2$ bị phá thì hệ $\Epsilon$ vẫn an toàn. Giả sử cả $\Epsilon_1$ và $\Epsilon_2$ được định nghĩa trên (K, X). Ta định nghĩa $\Epsilon$ như sau:
$E((k_1, k_2), x) \colonequals E_1(k_1, E_2(k_2, x)) \qquad \text{ và } \qquad D((k_1, k_2), y) \colonequals D_2(k_2, D_1(k_1, y))$
Chứng minh rằng $\Epsilon$ an toàn nếu $\Epsilon_1$ hoặc $\Epsilon_2$ an toàn.

> **Trả lời:**
> - Giả sử trong tương lai $E_1$ an toàn, $E_2$ bị phá (kẻ tấn công có thể dễ dàng mã hóa và giải mã với $k_2$), ta có thể coi $E_2(k_2, x) = x$ và $D_2(k_2, D_1(k_1, y)) = D_1(k_1, y)$. Lúc này $\Epsilon = (E_1, D_1) = E_1$. Mà $E_1$ vẫn an toàn nên $\Epsilon$ vẫn an toàn.
> - Giả sử trong tương lai $E_1$ bị phá, $E_2$ an toàn (kẻ tấn công có thể dễ dàng mã hóa và giải mã với $k_1$), ta có thể coi $E_1(k_1, E_2(k_2, x)) = E_2(k_2, x)$ và $D_1(k_1, y) = y$. Lúc này $\Epsilon = (E_2, D_2) = E_2$. Mà $E_2$ vẫn an toàn nên $\Epsilon$ vẫn an toàn.

### Bài 3.
Xét F là một PRF định nghĩa trên $(K, R, X)$ với $X = \{0, 1\}^{32}$. Xét $CRC_{32}$ là một mã sửa sai quen thuộc và đơn giản chỉ để phát hiện lỗi ngẫu nhiên; $CRC_{32}(m)$ nhận input là các xâu nhị phân độ dài $\leq l$ và luôn output ra một xâu nhị phân 32 bit. Với bài tập này, bạn chỉ cần biết rằng $CRC_{32}(m_1) \oplus CRC_{32}(m_2) = CRC_{32}(m_1 \oplus m_2)$. Ta định nghĩa MAC $(S, V)$ sau đây:
$
S(k, m) \colonequals \{r \leftarrow R, t \leftarrow F(k, r) \oplus CRC_{32}(m) \text{ , output}(r, t)\}$
$V(k, m) \colonequals \begin{cases}
    yes \quad \text{nếu } t = F(k, r) \oplus CRC_{32}(m) \\
    no \quad \text{ ngược lại}
\end{cases}$
Hãy chứng minh rằng hệ MAC này **không** an toàn.

> **Trả lời:**
> Một cách tấn công đơn giản vào hệ này là:
> - Kẻ tấn công gửi $m_0 = 0^n \rightarrow$ nhận được $\{r_0 \leftarrow R, t_0 \leftarrow F(k, r_0) \oplus CRC_{32}(m_0)\}$
> - Hắn tự tạo ra tag $t_1 \leftarrow t_0 \oplus CRC_{32}(m_1 = 1^n) \equiv F(k, r_0) \oplus CRC_{32}(m_0) \oplus CRC_{32}(m_1) \equiv F(k, r_0) \oplus CRC_{32}(m_0 \oplus m_1) \equiv F(k, r_0) \oplus CRC_{32}(m_1)$
> - Từ đây hắn gửi $(r_0, t_1)$ là một tag hợp lệ cho $m_1 = 1^n$

### Bài 4.
Giả sử $H$ và $H'$ là các ***hàm băm kháng xung đột*** (collision-resistant). Hàm băm $H''$ trong mỗi câu dưới đây có kháng xung đột hay không? Hãy giải thích.
(a) $H''(x) = H(x) \text{ || } 0 \dots 0$

> **Trả lời:** Có. Giả sử $H(x)$ có chiều dài $n$, $H''(x)$ nối thêm $m$ bit 0 sẽ có chiều dài $m + n$. Từ đó vẫn không tồn tại bất cứ 2 bản mã $x_1, x_2$ nào sao cho $H''(x_1) = H''(x_2)$ bởi vì $m$ bit đầu của chúng luôn khác nhau (do $H$ là hàm băm kháng xung đột).

(b) $H''(x) = H(H'(x))$

> **Trả lời:** Có. Vì bản thân $H$ đã hàm băm kháng xung đột nên với bất kì đầu vào là gì, đầu ra vẫn đảm bảo tính kháng xung đột.

(c) $H''(x) = H(x) \text{ || } H'(x)$

> **Trả lời:** Có. Vì nối 2 hàm kháng xung đột với nhau thì đầu ra vẫn đảm bảo tính kháng xung đột

(d) $H''(x) = H(x) \oplus H'(x)$

> **Trả lời:** Không. Giả sử tồn tại $H(x) = 1 \oplus x$ và $H'(x) = x$ với $x = 0, 1$ đều đảm bảo tính kháng xung đột. Nhưng với $H''(x)$ thì không. Thật vậy, $H''(0) = H(0) \oplus H'(0) = 1 \oplus 0 = 1 = H(1) \oplus H'(1) = H''(1)$. 

### Bài 5.
Giả sử $(E, D)$ là một hệ mã xác thực (authenticated encryption), với không gian khóa $K$, không gian bản rõ $\{0, 1\}^n$ và không gian bản mã $\{0, 1\}^s$. Hệ mã trong mỗi câu dưới đây có xác thực hay không? Hãy giải thích.
(a) $E'((k_1, k_2), m) = E(k_2, E(k_1, m)) \quad \text{ và } \quad D'((k_1, k_2), c) = \begin{cases}
    D(k_1, D(k_2, c)) & \text{nếu } D(k_2, c) \neq ⊥ \\
    ⊥ & \text{nếu ngược lại}
\end{cases}$

> **Trả lời:** Có, vì $(E', D')$ đảm bảo:
> - An toàn ngữ nghĩa (semantic security): vì $(E, D)$ là hệ mã xác thực
> - Tính toàn vẹn (ciphertext integrity): vì nó thực hiện kiểm tra tính toàn vẹn của $c$ thông qua $D(k_2, c)$

(b) $E'(k, m) = [ c \leftarrow E(k, m), output(c, c)] \quad \text{ và } \quad D'(k, (c_1, c_2)) = \begin{cases}
    D(k, c_1) & \text{nếu } c_1 = c_2 \\
    ⊥ & \text{nếu ngược lại}
\end{cases}$

> **Trả lời:** Không vì tính xác thực không được đảm bảo: Kẻ tấn công có thể thay $c_1, c_2$ bằng $c_3, c_4$ với $c_3 = c_4 \neq c_1$ và khiến cho hệ $(E', D')$ không biết rằng bản mật đã bị thay đổi.

(c) $E'(k, m) = (E(k, m), 0) \quad \text{ và } \quad D'(k, (c, b)) = D(k, c)$

> **Trả lời:** Không vì tính xác thực không được đảm bảo: kẻ tấn công có thể thay đổi bản mật một cách tùy ý mà hệ $(E', D')$ vẫn không nhận ra bởi vì tại $D'$ không hề có bước kiểm tra nào.

### Bài 6.
Xét $F: \{0, 1\}^n \times \{0, 1\}^n \rightarrow \{0, 1\}^n$ là một PRP an toàn. Ta xây dựng sơ đồ mã hóa $E(k, m)$ từ $F$ như sau:
- Thông điệp *m* được chia thành các khối *n* bit $m = m_1 \text{ || } m_2 \text{ || } \dots \text{ || } m_t$.
- Chọn ngẫu nhiên một số $n$-bit $r$.
- Output $r \text{ || } F(k, r+1+m_1) \text{ || } F(k, r+2+m_2) \text{ || } \dots \text{ || } F(k, r+t+m_t)$

Phương pháp nào sau đây Attacker có thể sử dụng để chỉ ra rằng sơ đồ mã trên **không** là CPA an toàn? Hãy giải thích.
(a) Lấy một $n$-bit block $m$ bất kỳ; và gửi $M_0 = m \text{ || } m$ và $M_1 = m \text{ || } m-1$. Nhận được bản mã $r \text{ || } c_1 \text{ || } c_2$. Quyết định output 1 nếu và chỉ nếu $c_1 = c_2$.
(b) Chọn ngẫu nhiên hai $n$-bit block $m$ và $m'$; và gửi $M_0 = m \text{ || } m$ và $M_1 = m \text{ || } m'$. Nhận được bản mã $r \text{ || } c_1 \text{ || } c_2$. Quyết định output 1 nếu và chỉ nếu $c_1 = c_2$.
(c) Lấy một $n$-bit block $m$ bất kỳ; và gửi $M_0 = m$ và $M_1 = m \text{ || } m$. Quyết định output 0 nếu và chỉ nếu bản mã nhận được chứa 2 blocks 
(d) Chọn ngẫu nhiên bốn $n$-bit block $m_1, m_2, m_3, m_4$; và gửi $M_0 = m_1 \text{ || } m_2$ và $M_1 = m_3 \text{ || } m_4$. Nhận được bản mã $r \text{ || } c_1 \text{ || } c_2$. Quyết định output 0 nếu và chỉ nếu $r = 0 \dots 0$.

> **Trả lời:** 
> - (a) Đúng, vì giả sử $M_1$ được chọn để mã hóa thì: $c_1 = F(k, r + 1 + m) = F(k, r + 2 + m - 1) = c_2$. Ngược lại nếu $M_0$ được mã hóa thì $c_1 = F(k, r + 1 + m) \neq F(k, r + 2 + m) = c_2$.
> - (b) Sai, vì với cả trường hợp $M_0$ hay $M_1$ được mã hóa thì $c_1 \neq c_2 \rightarrow$ không phân biệt được $M_0$ hay $M_1$ được mã hóa.
> - (c) Sai, vì đối với challenge chỉ chấp nhận $|M_0|=|M_1|$.
> - (d) Sai, vì $r$ là giá trị ngẫu nhiên và từ nó không có căn cứ gì để xác định rằng $M_0$ hay $M_1$ được mã hóa.

### Bài 7.
Giả sử có $n+1$ bên, gọi là $B, A_1, \dots, A_n$, muốn có một khóa chung cho cả nhóm. Họ muốn có một giao thức sao cho mọi người đều có chung một khóa bí mật, nhưng kẻ nghe lén dù thấy được toàn bộ quá trình trao đổi vẫn không xác định được $k$.
Các bên thống nhất một nhóm $G$ có cấp nguyên tố $q$ với phần tử sinh $g$ và dùng giao thức sau đây:
- Mỗi $A_i$ chọn một số ngẫu nhiên $a_i$ thuộc $\{1,\dots,q\}$ và gửi cho $B$ giá trị $X_i \leftarrow g^{a_i}$.
- Bên B sinh một số ngẫu nhiên $b$ thuộc $\{1,\dots,q\}$ và gửi trả lại $A_i$ thông điệp $Y_i \leftarrow X_i^b$.

Khóa cuối cùng của nhóm là $g^b$. Rõ ràng $B$ có thể tính được khóa này. Các $A_i$ tính khóa này như thế nào? Hãy giải thích ngắn gọn.

> **Trả lời:** 
> - Tại $B$: có $g$ (do đã thống nhất trước) nên chọn $b$ ngẫu nhiên và dễ dàng tính được $g^b$.
> - Tại $A$: nhận được $Y_i \leftarrow X_i^b = (g^{a_i})^b$ từ $B$ nên dễ dàng tính được $b = log_{g^{a_i}}((g^{a_i})^b) = log_{g^{a_i}}(Y_i)$. Do cũng có $g$ (do đã thống nhất trước) nên $A$ cũng dễ dàng tính được $g^b$
> - Kẻ nghe lén: dù có bắt được toàn bộ quá trình trao đổi nhưng cũng không thể tính được khóa bí mật ($g^b$) do không biết trước $g$.

### Bài 8.
Nhắc lại rằng hoán vị cửa sập RSA được định nghĩa trong nhóm $\mathbb{Z}_N^*$ với $N$ là tích của hai số nguyên tố lớn. Khóa công khai là $(N, e)$ và khóa bí mật là $(N, d)$ với $d$ là nghịch đảo của $e$ trong $\mathbb{Z}_{\phi(N)}^*$.
Giả sử trong thuật toán RSA, thay vì lấy $N$ là hợp số bạn lại chọn $N = p$ là số nguyên tố. Hãy chỉ ra rằng trong trường hợp này mọi người đều có thể tính hoặc không tính được khóa bí mật $(N, d)$ từ khóa công khai $(N, e)$ bằng mỗi cách tính dưới đây. Hãy giải thích ngắn gọn.

(a) $d \leftarrow -e  \pmod{p}$. 
(b) $d \leftarrow e^2  \pmod{p}$.
(c) $d \leftarrow e^{-1}  \pmod{p}$.
(d) $d \leftarrow e^{-1}  \pmod{(p-1)}$.

> **Trả lời:** Do $d$ là nghịch đảo của $e$ nên $d \cdot e = 1 \pmod{\phi(N)}$ với $\phi(N) = p - 1$ (do $N=p$ là số nguyên tố). Suy ra được $d = e^{-1} \pmod{(p-1)}$ hay chính là đáp án (d).