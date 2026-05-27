export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    // Đọc từ biến môi trường (Netlify Environment Variables)
    const envEmail = process.env.ADMIN_EMAIL;
    const envPass = process.env.ADMIN_PASS;
    const envToken = process.env.ADMIN_TOKEN_SECRET;

    // Chống bypass nếu server chưa được cấu hình biến môi trường
    if (!envEmail || !envPass || !envToken) {
        return res.status(500).json({ error: 'Lỗi máy chủ: Chưa cấu hình biến môi trường bảo mật.' });
    }

    const validEmail = email === envEmail;
    const validPassword = password === envPass;

    if (validEmail && validPassword) {
        return res.status(200).json({ token: envToken });
    } else {
        return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
    }
}
