const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../public/content');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

// We have 9 articles (excluding future-of-svg)
const uniqueImages = {
  'svg-basics': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  'svg-vs-png': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  'svg-optimization': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
  'svg-animation': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
  'svg-icons-guide': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
  'svg-in-web': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80',
  'svg-editor-guide': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
  'svg-to-png-guide': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
  'svg-js-interaction': 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80'
};

files.forEach(file => {
  if (file.includes('future-of-svg')) return;

  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const slug = file.split('.')[0];
  const imgUrl = uniqueImages[slug];

  if (!imgUrl) return; // just in case

  // Remove the old injected image if it exists
  content = content.replace(/!\[Article Illustration\]\(.*?\)\n*/g, '');

  // Insert the new image after the first heading
  const lines = content.split('\n');
  let firstHeadingIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      firstHeadingIndex = i;
      break;
    }
  }

  if (firstHeadingIndex !== -1) {
    lines.splice(firstHeadingIndex + 2, 0, `![Article Illustration](${imgUrl})\n`);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${file} with unique image`);
  } else {
    fs.writeFileSync(filePath, `![Article Illustration](${imgUrl})\n\n` + content);
    console.log(`Prepended to ${file} with unique image`);
  }
});

console.log('Done!');
