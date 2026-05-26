const fs = require('fs');

const dataFile = 'js_data.js';
let content = fs.readFileSync(dataFile, 'utf8');

// The new blocks
const BLOCKS = [
  {
    id: 'basic',
    title: '1️⃣ Nền Tảng Cốt Lõi (Basic)',
    icon: '🧱',
    color: '#3B82F6',
    summary: 'Khai báo biến, kiểu dữ liệu, vòng lặp, câu lệnh điều kiện.',
    concepts: []
  },
  {
    id: 'data-structures',
    title: '2️⃣ Hàm & Cấu Trúc (Data Structures)',
    icon: '📦',
    color: '#10B981',
    summary: 'Array, Object, ES6+, Hàm mũi tên.',
    concepts: []
  },
  {
    id: 'dom',
    title: '3️⃣ Thao Tác DOM (DOM)',
    icon: '🖥️',
    color: '#F59E0B',
    summary: 'Lựa chọn phần tử, Lắng nghe sự kiện, Thay đổi giao diện.',
    concepts: []
  },
  {
    id: 'advanced',
    title: '4️⃣ Tư Duy Nâng Cao (Advanced)',
    icon: '🧠',
    color: '#8B5CF6',
    summary: 'Scope, Closure, Prototype, từ khóa this, OOP.',
    concepts: []
  },
  {
    id: 'async',
    title: '5️⃣ Xử Lý Bất Đồng Bộ (Async)',
    icon: '⚡',
    color: '#EF4444',
    summary: 'Promise, Async/Await, Event Loop, Fetch API.',
    concepts: []
  },
  {
    id: 'ecosystem',
    title: '6️⃣ Công Cụ Thực Chiến (Ecosystem)',
    icon: '🛠️',
    color: '#6B7280',
    summary: 'NPM, Git, Framework cơ bản.',
    concepts: []
  }
];

// Extract old CONCEPT_DATA using eval (we know it's safe local code)
// We need to carefully parse it without losing QUIZ_DATA.
// Since the file is well-structured, we can extract it.
let parts = content.split('const QUIZ_DATA =');
if (parts.length === 2) {
  let oldDataStr = parts[0].replace('const CONCEPT_DATA =', '').trim();
  if (oldDataStr.endsWith(';')) oldDataStr = oldDataStr.slice(0, -1);
  
  let oldData;
  try {
    oldData = eval('(' + oldDataStr + ')');
    
    oldData.forEach(topic => {
      topic.concepts.forEach(c => {
        if (topic.id === 'types') BLOCKS[0].concepts.push(c); // basic
        else if (topic.id === 'async') BLOCKS[4].concepts.push(c); // async
        else if (['scope', 'closure', 'this', 'prototype'].includes(topic.id)) BLOCKS[3].concepts.push(c); // advanced
        else BLOCKS[1].concepts.push(c); // default fallback
      });
    });

    let newConceptStr = JSON.stringify(BLOCKS, null, 2);
    content = 'const CONCEPT_DATA = ' + newConceptStr + ';\n\nconst QUIZ_DATA =' + parts[1];
    
    fs.writeFileSync(dataFile, content, 'utf8');
    console.log('Restructured js_data.js successfully!');
  } catch(e) {
    console.error('Error evaling:', e);
  }
} else {
  console.error('Split failed!', parts.length);
}
