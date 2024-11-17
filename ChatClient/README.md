# CS 255: Intro to Cryptography
### Báo Cáo Về Chương Trình Chat Bảo Mật trong Khóa Học Cryptography I

#### Giới Thiệu
Trong dự án này thuộc khóa học Cryptography I của Dan Boneh, chúng tôi đã triển khai một ứng dụng chat bảo mật với mã hóa đầu-cuối sử dụng thuật toán Double Ratchet. Thuật toán này, được sử dụng trong các ứng dụng nhắn tin bảo mật như Signal, đảm bảo tính bảo mật chuyển tiếp (forward secrecy) và khả năng khôi phục sau xâm nhập (break-in recovery). Ngoài ra, để mô phỏng tình huống giám sát của chính phủ, chúng tôi đã tích hợp một tính năng mã hóa khóa phiên bằng khóa công khai do chính phủ cấp, cho phép giải mã tin nhắn bởi chính phủ trong khi vẫn bảo vệ quyền riêng tư khỏi các bên không được phép.

#### Tổng Quan Về Triển Khai
Triển khai bao gồm ba thành phần chính:

1. **Các Nguyên Thủy Mật Mã (lib.js)**: File này cung cấp các hàm mật mã cơ bản sử dụng API Web Crypto, được bọc trong các hàm hỗ trợ. Các nguyên thủy quan trọng gồm có:
   - `generateEG()`: Tạo cặp khóa ElGamal cho trao đổi khóa Diffie-Hellman.
   - `encryptWithGCM()` và `decryptWithGCM()`: Sử dụng cho mã hóa và giải mã AES-GCM.
   - `HMACtoAESKey()` và `HMACtoHMACKey()`: Dùng để dẫn xuất khóa cho các thao tác AES và HMAC.
   - `HKDF()`: Thực hiện dẫn xuất khóa cho cơ chế ratchet, như mô tả trong giao thức Signal.

2. **Lớp MessengerClient (messenger.js)**: Đây là phần cốt lõi của ứng dụng chat, thực hiện thuật toán Double Ratchet để thiết lập phiên bảo mật và mã hóa tin nhắn.
   - `generateCertificate()`: Tạo chứng chỉ chứa khóa công khai ElGamal cho trao đổi khóa.
   - `receiveCertificate()`: Nhận và xác minh chứng chỉ bằng khóa công khai của Cơ Quan Chứng Nhận (CA).
   - `sendMessage()`: Mã hóa tin nhắn bằng AES-GCM với các khóa được dẫn xuất qua cơ chế ratchet. Mỗi tin nhắn bao gồm một tiêu đề mã hóa với các chi tiết để dẫn xuất khóa giải mã.
   - `receiveMessage()`: Giải mã tin nhắn nhận được bằng các khóa được dẫn xuất qua ratchet và xác thực tính toàn vẹn của tin nhắn.

3. **Kiểm Thử (test-messenger.js)**: File này chứa các bài kiểm thử đơn vị để kiểm tra chức năng của ứng dụng, bao gồm mã hóa, giải mã tin nhắn, xử lý nhiều cuộc trò chuyện, và khả năng giải mã của chính phủ. Các kiểm thử xác nhận rằng:
   - Tin nhắn mã hóa không thể đọc được nếu không có khóa tương ứng.
   - Chính phủ có thể giải mã tin nhắn sử dụng khóa phiên được mã hóa.
   - Các cuộc tấn công phát lại, chứng chỉ không hợp lệ, và người nhận sai đều được xử lý đúng cách.

#### Tính Bảo Mật
Ứng dụng chat đảm bảo:
- **Bảo Mật Chuyển Tiếp (Forward Secrecy)**: Việc lộ khóa hiện tại không làm lộ các tin nhắn trong quá khứ, vì mỗi tin nhắn có khóa riêng nhờ cơ chế Double Ratchet.
- **Khả Năng Khôi Phục Sau Xâm Nhập (Break-in Recovery)**: Nếu kẻ tấn công có quyền truy cập vào khóa hiện tại, bảo mật giao tiếp có thể được khôi phục khi cả hai bên trao đổi tin nhắn mới.
- **Giải Mã Bởi Chính Phủ**: Bằng cách mã hóa khóa phiên bằng khóa công khai của chính phủ, ứng dụng cho phép chính phủ giải mã các tin nhắn mà không làm mất tính bảo mật chuyển tiếp đối với các bên không mong muốn.

#### Kết Luận
Dự án này minh họa một ứng dụng chat bảo mật sử dụng thuật toán Double Ratchet, có khả năng bảo mật giao tiếp ngay cả trong điều kiện giám sát của chính phủ. Triển khai này đã áp dụng thành công các nguyên lý mật mã học được trong khóa học, đảm bảo cả quyền riêng tư cho người dùng và khả năng truy cập có kiểm soát cho các bên được ủy quyền.

---

### Short answer question
Here are answers to the short-answer questions in Section 7:

1. **Could the protocol be modified to have Alice and Bob increment the DH ratchets once every ten messages without compromising confidentiality (semantic security)?**
   - Incrementing the Diffie-Hellman (DH) ratchet less frequently, such as every ten messages instead of every message, would not immediately compromise confidentiality or semantic security for each message independently. However, it would reduce the overall security because an attacker who compromises a DH key would be able to decrypt up to ten previous messages in the sending chain until the next DH ratchet. Thus, while semantic security for individual messages may still be achieved, the risk to message confidentiality over time increases as the frequency of DH ratcheting decreases.

2. **What if they never update their DH keys at all? Explain the security consequences regarding Forward Secrecy and Break-in Recovery.**
   - If Alice and Bob never update their DH keys, they would lose **Forward Secrecy** because all messages could be decrypted if the long-term DH key is compromised. This would mean that compromising one DH key would expose all past and future communications. Additionally, **Break-in Recovery** would also be compromised because if an attacker gains access to the DH key, the attacker could continue intercepting and decrypting future messages without interruption, even if Alice or Bob detect the compromise and attempt to resume secure communication.

3. **What is the length of the longest sending chain used by Alice? By Bob?**
   - In the conversation sequence provided:
     - Alice has sent three messages ("Hey Bob, can you send me the locker combo?", "I need to get my laptop", and "Great, thanks! I used it and deleted the previous message").
     - Bob has sent two messages ("Sure, it’s 1234!" and "Did it work?").
   - Therefore, the longest sending chain for Alice is 3, and for Bob, it is 2. This reflects the number of messages each has sent consecutively without a new DH ratchet occurring.

4. **Explain why Mallory, after compromising Alice's phone, cannot determine the locker combination.**
   - The relevant security property here is **Forward Secrecy**. Even though Mallory gains access to Alice's current keys by compromising her phone, the Double Ratchet algorithm ensures that past session keys (and thus past messages) cannot be decrypted if those keys were deleted after use. Since Alice's previous messages, including the locker combination, were secured with earlier ratcheted keys that have since been discarded, Mallory cannot decrypt those past messages even with access to Alice’s current keys.

5. **Why might the government’s surveillance method be ineffective or flawed?**
   - The government’s surveillance method relies on access to the session keys by mandating that they be encrypted with the government’s public key. However, this approach has several flaws:
     - **Vulnerability to Key Compromise**: If the government’s private key is ever compromised, an adversary could potentially decrypt all intercepted session keys, leading to a large-scale security breach.
     - **Limited Usefulness**: Encrypting only the session keys may prevent passive eavesdropping but does not give real-time access to plaintext messages. This method may be bypassed by end-users who can employ additional layers of encryption or quickly rotate session keys.
     - **Privacy Risks**: This method undermines user privacy and could encourage users to avoid the platform altogether, reducing the system’s overall effectiveness.

6. **Comparison of ECDSA and RSA-based signatures using SubtleCrypto:**
   - **(a) Which keys take longer to generate**: Generally, RSA keys take longer to generate than ECDSA keys, especially for large key sizes, because RSA key generation involves generating large prime numbers.
   - **(b) Which signature takes longer to generate**: RSA signatures tend to take longer to generate than ECDSA signatures due to the computational complexity of RSA signing.
   - **(c) Which signature is longer in length**: RSA signatures are usually longer than ECDSA signatures for equivalent security levels, as RSA requires larger key sizes to achieve the same level of security.
   - **(d) Which signature takes longer to verify**: RSA signatures typically take longer to verify than ECDSA signatures because RSA verification is also computationally intensive compared to ECDSA verification.

These answers reflect typical cryptographic properties and can be verified with empirical timing tests if needed.