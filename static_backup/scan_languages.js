const fs = require('fs');
const path = require('path');

const enDir = 'f:\\موقع شركة التسويق الطبيه\\stitch_digital_health_agency_ui_ux\\website\\en';
const arDir = 'f:\\موقع شركة التسويق الطبيه\\stitch_digital_health_agency_ui_ux\\website';

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;

console.log('--- SCANNING ENGLISH PAGES FOR ARABIC CHARACTERS ---');
try {
  const enFiles = fs.readdirSync(enDir);
  enFiles.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(enDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Strip script and style
      let cleanContent = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
      cleanContent = cleanContent.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
      
      const matches = cleanContent.match(arabicRegex);
      if (matches) {
        console.log(`Found ${matches.length} Arabic characters in English page: ${file}`);
        // Find context
        const firstMatch = arabicRegex.exec(cleanContent);
        if (firstMatch) {
          const idx = firstMatch.index;
          const start = Math.max(0, idx - 30);
          const end = Math.min(cleanContent.length, idx + 30);
          const context = cleanContent.slice(start, end).replace(/\n/g, ' ');
          console.log(`  Context: ... ${context} ...`);
        }
      }
    }
  });
} catch (e) {
  console.error('Error scanning English files:', e.message);
}

console.log('\n--- SCANNING ARABIC PAGES FOR ENGLISH WORDS IN DISPLAYED TEXT ---');
try {
  const arFiles = fs.readdirSync(arDir);
  arFiles.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(arDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Strip comments, script, style
      let cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
      cleanContent = cleanContent.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
      cleanContent = cleanContent.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
      
      // Strip HTML tags
      const textOnly = cleanContent.replace(/<[^>]+>/g, ' ');
      
      // Find English words [a-zA-Z]{2,}
      const engWords = textOnly.match(/\b[a-zA-Z]{2,}\b/g) || [];
      const filtered = engWords.filter(w => !['amp', 'gt', 'lt', 'quot', 'nbsp'].includes(w.toLowerCase()));
      
      if (filtered.length > 0) {
        const unique = Array.from(new Set(filtered));
        console.log(`Found ${filtered.length} English words (unique: ${unique.join(', ')}) in Arabic page: ${file}`);
      }
    }
  });
} catch (e) {
  console.error('Error scanning Arabic files:', e.message);
}
