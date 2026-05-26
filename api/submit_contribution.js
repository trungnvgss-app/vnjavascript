export default async function handler(req, res) {
    // Chỉ chấp nhận method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = req.body;
        
        // Kiểm tra biến môi trường được cài đặt trên Vercel
        const GITHUB_PAT = process.env.GITHUB_PAT;
        const GITHUB_REPO = process.env.GITHUB_REPO; // VD: "trungnvgss-app/vnjavascript"
        
        if (!GITHUB_PAT || !GITHUB_REPO) {
            return res.status(500).json({ error: "Chưa cấu hình GITHUB_PAT hoặc GITHUB_REPO trên Vercel." });
        }

        // Tạo nội dung Issue
        const keyword = payload.keyword || "Khái niệm mới";
        const issueTitle = `[Community] Đóng góp: ${keyword}`;
        const issueBody = `
Mã đóng góp tự động từ người dùng:

\`\`\`json
${JSON.stringify(payload.data, null, 2)}
\`\`\`
`;

        // Đọc cấu hình Auto-Approve từ Github (Main branch)
        let isAutoApprove = false;
        try {
            const configRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/admin_settings.json`, {
                headers: { 'Authorization': `token ${GITHUB_PAT}` }
            });
            if (configRes.ok) {
                const configData = await configRes.json();
                isAutoApprove = configData.auto_approve === true;
            }
        } catch (e) {
            console.error("Lỗi đọc admin_settings:", e);
        }

        const labels = ["community-contribution"];
        if (isAutoApprove) {
            labels.push("approved");
        }

        // Gọi GitHub API tạo Issue
        const ghResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'User-Agent': 'Vercel-Function',
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody,
                labels: labels
            })
        });

        const responseData = await ghResponse.json();

        if (ghResponse.status === 201) {
            return res.status(200).json({ message: "Đã gửi đóng góp thành công lên hệ thống Github!" });
        } else {
            console.error("Github API Error:", responseData);
            return res.status(ghResponse.status).json({ error: "Lỗi tạo Github Issue", details: responseData });
        }

    } catch (error) {
        console.error("Function Error:", error);
        return res.status(500).json({ error: "Lỗi máy chủ nội bộ", details: error.message });
    }
}
