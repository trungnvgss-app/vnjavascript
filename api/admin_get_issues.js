export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { token } = req.body;
    if (token !== 'mio-admin-token-gss') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_PAT || !GITHUB_REPO) {
        return res.status(500).json({ error: "Chưa cấu hình GITHUB_PAT hoặc GITHUB_REPO" });
    }

    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/issues?state=open&labels=community-contribution`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Github API lỗi: ${response.statusText}`);
        }

        const issues = await response.json();
        
        // Filter out issues that already have 'approved' label
        const pending = issues.filter(issue => 
            !issue.labels.some(l => l.name === 'approved')
        ).map(issue => {
            return {
                number: issue.number,
                title: issue.title,
                body: issue.body,
                created_at: issue.created_at
            };
        });

        return res.status(200).json({ issues: pending });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
