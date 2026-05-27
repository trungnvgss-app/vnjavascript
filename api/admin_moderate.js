export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { token, issueNumber, action } = req.body;
    
    const envToken = process.env.ADMIN_TOKEN_SECRET;
    if (!envToken || token !== envToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_PAT || !GITHUB_REPO) {
        return res.status(500).json({ error: "Chưa cấu hình GITHUB_PAT hoặc GITHUB_REPO" });
    }

    try {
        if (action === 'approve') {
            // Add 'approved' label to trigger Github Action
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}/labels`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ labels: ['approved'] })
            });

            if(!response.ok) throw new Error("Lỗi khi gắn nhãn approved");
            return res.status(200).json({ message: 'Đã duyệt thành công!' });
            
        } else if (action === 'reject') {
            // Close the issue
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: 'closed' })
            });
            
            if(!response.ok) throw new Error("Lỗi khi đóng Issue");
            return res.status(200).json({ message: 'Đã từ chối bài đóng góp.' });
            
        } else {
            return res.status(400).json({ error: 'Hành động không hợp lệ' });
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
