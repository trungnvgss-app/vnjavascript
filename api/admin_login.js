export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    // Hardcode for demonstration/personal project
    // In production, these should be environment variables: process.env.ADMIN_EMAIL, process.env.ADMIN_PASS
    const validEmail = email === 'mioomni.gss@gmaill.com' || email === 'mioomni.gss@gmail.com';
    const validPassword = password === 'G-ss@123';

    if (validEmail && validPassword) {
        return res.status(200).json({ token: 'mio-admin-token-gss' });
    } else {
        return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
    }
}
