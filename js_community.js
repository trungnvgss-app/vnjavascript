/* FILE NÀY ĐƯỢC TỰ ĐỘNG SINH RA BỞI GITHUB ACTION DỰA TRÊN ISSUES ĐÓNG GÓP */

const COMMUNITY_CONCEPTS = [
  {
    "block_id": "basic",
    "term": "Math",
    "code": "console.log(Math.PI); \nconsole.log(Math.random()); \nconsole.log(Math.floor(4.7));",
    "short_explain": "Đối tượng `Math` trong JavaScript là một đối tượng tích hợp sẵn, cung cấp các hằng số và phương thức để thực hiện các phép toán học cơ bản và nâng cao mà không cần khởi tạo.",
    "explain": "<p><strong>🌟 Bản chất & Đời sống:</strong> Hãy tưởng tượng <code>Math</code> như một chiếc máy tính khoa học siêu việt được tích hợp sẵn trong JavaScript của bạn. Nó không phải là một người hay một vật cụ thể mà là một bộ công cụ luôn sẵn sàng để bạn thực hiện mọi phép tính từ đơn giản đến phức tạp, từ việc làm tròn số đến tính sin, cos hay tạo số ngẫu nhiên.</p><p><strong>⚙️ Cơ chế hoạt động:</strong> <code>Math</code> là một đối tượng toàn cục (global object) và tĩnh (static), nghĩa là bạn không cần tạo một thể hiện mới của nó (ví dụ: <code>new Math()</code>). Thay vào đó, bạn truy cập trực tiếp các thuộc tính (như <code>Math.PI</code>) và phương thức (như <code>Math.random()</code>, <code>Math.floor()</code>) của nó bằng cách sử dụng <code>Math.</code> theo sau là tên thuộc tính/phương thức. Các phương thức này thực hiện các thuật toán toán học đã được định nghĩa sẵn và trả về kết quả.</p><p><strong>⚠️ Cái bẫy thường gặp:</strong> Lỗi phổ biến là cố gắng khởi tạo <code>Math</code> bằng <code>new Math()</code>, điều này sẽ gây lỗi <code>TypeError</code>. Một cái bẫy khác là nhầm lẫn giữa <code>Math.round()</code>, <code>Math.floor()</code>, <code>Math.ceil()</code> khi làm tròn số âm hoặc dương, hoặc quên rằng <code>Math.random()</code> trả về số thập phân từ 0 (bao gồm) đến dưới 1 (không bao gồm).</p><p><strong>💡 Ứng dụng thực tế:</strong> <code>Math</code> được sử dụng rộng rãi trong nhiều tình huống: tạo số ngẫu nhiên cho game, mô phỏng, hoặc OTP; tính toán vị trí trong đồ họa máy tính; xử lý dữ liệu tài chính; làm tròn giá trị hiển thị cho người dùng; hoặc bất cứ khi nào bạn cần thực hiện các phép toán số học chính xác trong ứng dụng của mình.</p>",
    "source": "Cộng Đồng (Tích hợp từ Github Issue #1)"
  }
];

const COMMUNITY_QUIZZES = [
  {
    "difficulty": "medium",
    "question": "Đoạn mã sau sẽ in ra giá trị nào?",
    "code": "let x = Math.floor(Math.random() * 10) + 1;\nconsole.log(x >= 1 && x <= 10);",
    "options": [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    "answer": 0,
    "short_explain": "`Math.random()` tạo số từ 0 đến dưới 1. Nhân với 10 tạo số từ 0 đến dưới 10. `Math.floor()` làm tròn xuống, tạo số nguyên từ 0 đến 9. Cộng 1 tạo số nguyên từ 1 đến 10. Do đó, biểu thức điều kiện luôn đúng.",
    "explanation": "HTML giải thích chi tiết: <code>Math.random()</code> trả về một số dấu phẩy động giả ngẫu nhiên trong khoảng [0, 1) (bao gồm 0, không bao gồm 1). Khi nhân với 10, khoảng này trở thành [0, 10). <code>Math.floor()</code> làm tròn số xuống số nguyên gần nhất, vì vậy kết quả sẽ là một số nguyên trong khoảng [0, 9]. Cuối cùng, cộng thêm 1 sẽ dịch chuyển khoảng này thành [1, 10]. Do đó, biến <code>x</code> luôn là một số nguyên nằm trong khoảng từ 1 đến 10 (bao gồm cả 1 và 10). Biểu thức <code>x >= 1 && x <= 10</code> sẽ luôn đánh giá là <code>true</code>.",
    "source": "Cộng Đồng (Tích hợp từ Github Issue #1)",
    "topic": "community",
    "id": 99100
  }
];
