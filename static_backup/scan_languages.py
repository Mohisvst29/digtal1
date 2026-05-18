import os
import re

en_dir = r"f:\موقع شركة التسويق الطبيه\stitch_digital_health_agency_ui_ux\website\en"
ar_dir = r"f:\موقع شركة التسويق الطبيه\stitch_digital_health_agency_ui_ux\website"

arabic_regex = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')

print("--- SCANNING ENGLISH PAGES FOR ARABIC CHARACTERS ---")
for file in os.listdir(en_dir):
    if file.endswith('.html'):
        path = os.path.join(en_dir, file)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove script tags and style tags content to avoid matching non-displayed text
        clean_content = re.sub(r'<script.*?>.*?</script>', '', content, flags=re.DOTALL)
        clean_content = re.sub(r'<style.*?>.*?</style>', '', clean_content, flags=re.DOTALL)
        
        matches = arabic_regex.findall(clean_content)
        if matches:
            print(f"Found {len(matches)} Arabic characters in English page: {file}")
            # print first 5 matches or sample contexts
            for m in re.finditer(arabic_regex, clean_content):
                start = max(0, m.start() - 30)
                end = min(len(clean_content), m.end() + 30)
                context = clean_content[start:end].replace('\n', ' ')
                print(f"  Context: ... {context} ...")
                break

print("\n--- SCANNING ARABIC PAGES FOR ENGLISH WORDS IN DISPLAYED TEXT ---")
for file in os.listdir(ar_dir):
    if file.endswith('.html'):
        path = os.path.join(ar_dir, file)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We want to check for English words inside elements (e.g. not inside tags, script, style)
        # Let's strip script, style, comments, and tags
        clean_content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        clean_content = re.sub(r'<script.*?>.*?</script>', '', clean_content, flags=re.DOTALL)
        clean_content = re.sub(r'<style.*?>.*?</style>', '', clean_content, flags=re.DOTALL)
        
        # Now remove tags but keep their inner text (by replacing tags with space)
        text_only = re.sub(r'<[^>]+>', ' ', clean_content)
        
        # Find any English words (sequences of a-zA-Z)
        # Filter out common things like Google Font names, etc. that might appear, but let's check
        eng_words = re.findall(r'\b[a-zA-Z]{2,}\b', text_only)
        # Let's clean up words that are actually inside text and not HTML entity leftovers like amp, gt, lt, etc.
        words_to_show = []
        for w in eng_words:
            if w.lower() not in ['amp', 'gt', 'lt', 'quot', 'nbsp']:
                words_to_show.append(w)
        if words_to_show:
            unique_eng = set(words_to_show)
            print(f"Found {len(words_to_show)} English words (unique: {unique_eng}) in Arabic page: {file}")
