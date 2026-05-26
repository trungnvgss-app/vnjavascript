import os
import requests
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Github Action sẽ cung cấp GITHUB_TOKEN và GITHUB_REPOSITORY
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
GITHUB_REPOSITORY = os.environ.get('GITHUB_REPOSITORY')

if not GITHUB_TOKEN or not GITHUB_REPOSITORY:
    print("Lỗi: Không tìm thấy GITHUB_TOKEN hoặc GITHUB_REPOSITORY.")
    sys.exit(1)

HEADERS = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

def get_open_issues():
    url = f"https://api.github.com/repos/{GITHUB_REPOSITORY}/issues"
    params = {
        'state': 'open',
        'labels': 'community-contribution',
        'per_page': 100
    }
    
    issues = []
    page = 1
    while True:
        params['page'] = page
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code != 200:
            print(f"Lỗi fetch issues: {response.status_code}")
            print(response.text)
            break
            
        data = response.json()
        if not data:
            break
            
        issues.extend(data)
        page += 1
        
    return issues

def extract_json(body):
    # Regex để tìm chuỗi JSON nằm trong ```json ... ```
    match = re.search(r'```json\s*(\{.*?\})\s*```', body, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
    return None

def main():
    print("Đang lấy các bài đóng góp từ Github Issues...")
    issues = get_open_issues()
    
    concepts = []
    quizzes = []
    
    for issue in issues:
        # Bỏ qua Pull Requests (Github API trả về PR lẫn Issue trong cùng endpoint)
        if 'pull_request' in issue:
            continue
            
        data = extract_json(issue.get('body', ''))
        if data:
            # Gắn link Issue để biết nguồn gốc
            issue_url = issue.get('html_url')
            
            if 'concept_data' in data:
                c = data['concept_data']
                c['source'] = f"Cộng Đồng (Tích hợp từ Github Issue #{issue['number']})"
                concepts.append(c)
                
            if 'quiz_data' in data:
                for q in data['quiz_data']:
                    q['source'] = f"Cộng Đồng (Tích hợp từ Github Issue #{issue['number']})"
                    q['topic'] = "community"
                    q['id'] = 99000 + issue['number'] * 100 + quizzes.count(q) # Generate unique pseudo-ID
                    quizzes.append(q)
                    
    print(f"Đã tổng hợp {len(concepts)} concepts và {len(quizzes)} quizzes.")
    
    # Ghi ra file js_community.js
    js_content = "/* FILE NÀY ĐƯỢC TỰ ĐỘNG SINH RA BỞI GITHUB ACTION DỰA TRÊN ISSUES ĐÓNG GÓP */\n\n"
    js_content += "const COMMUNITY_CONCEPTS = " + json.dumps(concepts, indent=2, ensure_ascii=False) + ";\n\n"
    js_content += "const COMMUNITY_QUIZZES = " + json.dumps(quizzes, indent=2, ensure_ascii=False) + ";\n"
    
    # Lưu vào thư mục hiện tại của Action (hoặc chỉnh lại path nếu cần)
    out_path = "js_community.js"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Ghi thành công vào {out_path}.")

if __name__ == "__main__":
    main()
