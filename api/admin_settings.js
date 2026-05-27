export default async function handler(req, res) {
    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const FILE_PATH = "admin_settings.json";

    if (!GITHUB_PAT || !GITHUB_REPO) {
        return res.status(500).json({ error: "Chưa cấu hình GITHUB_PAT hoặc GITHUB_REPO" });
    }

    try {
        // Xử lý request GET: Trả về trạng thái hiện tại từ Github API
        if (req.method === 'GET') {
            const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
            const response = await fetch(getUrl, {
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) throw new Error("Không thể lấy file settings");
            
            const data = await response.json();
            // content được mã hóa base64
            const contentDecoded = Buffer.from(data.content, 'base64').toString('utf8');
            const cleanContent = contentDecoded.replace(/^\uFEFF/, '');
            const settings = JSON.parse(cleanContent);
            return res.status(200).json({ settings, sha: data.sha });
        }

        // Xử lý request POST: Cập nhật file trên Github (yêu cầu Token Admin)
        if (req.method === 'POST') {
            const { token, autoApprove, sha } = req.body;
            
            const envToken = process.env.ADMIN_TOKEN_SECRET;
            if (!envToken || token !== envToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const newContent = { auto_approve: autoApprove };
            const encodedContent = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');

            const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
            const putRes = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `admin: Update auto-approve setting to ${autoApprove}`,
                    content: encodedContent,
                    sha: sha // Phải truyền sha cũ để Github cho phép ghi đè
                })
            });

            if (!putRes.ok) throw new Error("Không thể cập nhật file settings");
            return res.status(200).json({ message: "Đã lưu cài đặt." });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
