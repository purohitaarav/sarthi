# Bhagavad Gita Data Ingestion Guide

This guide explains how to use the data ingestion script to populate your Turso database with Bhagavad Gita content from HTML files.

## Overview

The `data-ingest.js` script parses HTML files containing Bhagavad Gita chapters and verses, extracts the content, and inserts it into your Turso database.

## Prerequisites

1. **Install dependencies**
   ```bash
   npm install
   ```
   This installs `cheerio` for HTML parsing.

2. **Set up Turso database**
   ```bash
   npm run setup-turso
   ```
   This creates the database schema.

3. **Prepare HTML files**
   - Create a folder named `gita-data` in the project root
   - Add HTML files named `1.html` to `18.html` (one for each chapter)

## Folder Structure

```
sarthi/
├── gita-data/              # Create this folder
│   ├── 1.html             # Chapter 1
│   ├── 2.html             # Chapter 2
│   ├── 3.html             # Chapter 3
│   ...
│   └── 18.html            # Chapter 18
├── server/
│   └── scripts/
│       └── data-ingest.js
└── package.json
```

## HTML File Structure

The script is designed to work with various HTML structures. It looks for common patterns and CSS classes.

### Supported HTML Patterns

#### Pattern 1: Structured with Classes
```html
<!DOCTYPE html>
<html>
<head>
    <title>Chapter 1</title>
</head>
<body>
    <!-- Chapter Information -->
    <h1 class="chapter-title">Arjuna Vishada Yoga</h1>
    <h2 class="sanskrit-title">अर्जुनविषादयोग</h2>
    <p class="chapter-summary">This chapter introduces...</p>

    <!-- Verses -->
    <div class="verse">
        <p class="sanskrit">धृतराष्ट्र उवाच...</p>
        <p class="transliteration">dhṛitarāśhtra uvācha...</p>
        <p class="word-meanings">धृतराष्ट्रः = Dhritarashtra...</p>
        <p class="translation">Dhritarashtra said: O Sanjay...</p>
        <p class="purport">This verse sets the stage...</p>
    </div>

    <div class="verse">
        <!-- Next verse -->
    </div>
</body>
</html>
```

#### Pattern 2: Semantic HTML
```html
<article class="chapter">
    <header>
        <h1>Chapter 1: Arjuna Vishada Yoga</h1>
        <h2 lang="sa">अर्जुनविषादयोग</h2>
    </header>

    <section class="verse">
        <div class="sanskrit" lang="sa">धृतराष्ट्र उवाच...</div>
        <div class="english" lang="en">Dhritarashtra said...</div>
        <div class="commentary">This verse...</div>
    </section>
</article>
```

#### Pattern 3: Simple Structure
```html
<div>
    <h1>Chapter 1</h1>
    
    <div>
        <p>धृतराष्ट्र उवाच...</p>
        <p>Dhritarashtra said: O Sanjay...</p>
        <p>This verse sets the stage...</p>
    </div>
</div>
```

### CSS Classes Recognized

The script automatically detects these class names:

**Chapter Information:**
- Title: `.chapter-title`, `.chapter-name`, `h1`
- Sanskrit: `.sanskrit-title`, `.devanagari`, `[lang="sa"]`
- Transliteration: `.transliteration-title`, `.roman-title`
- Summary: `.chapter-summary`, `.summary`, `.introduction`

**Verse Information:**
- Container: `.verse`, `.shloka`, `[class*="verse"]`
- Sanskrit: `.sanskrit`, `.devanagari`, `[lang="sa"]`
- Transliteration: `.transliteration`, `.roman`, `.iast`
- Word meanings: `.word-meanings`, `.synonyms`, `.word-for-word`
- Translation: `.translation`, `.english`, `[lang="en"]`
- Purport: `.purport`, `.commentary`, `.explanation`

## Running the Ingestion

### Basic Usage

```bash
npm run ingest-gita
```

### What Happens

1. **Reads HTML files** from `gita-data/` folder (1.html to 18.html)
2. **Parses each file** using cheerio to extract:
   - Chapter title (Sanskrit, English, transliteration)
   - Chapter summary
   - Verse numbers
   - Sanskrit text
   - Transliteration
   - Word-by-word meanings
   - English translation
   - Purport/commentary
3. **Inserts data** into Turso database
4. **Shows progress** for each chapter and verse
5. **Displays statistics** at the end

### Example Output

```
🚀 Starting Bhagavad Gita data ingestion...

📁 Reading from: /Users/you/sarthi/gita-data

📖 Processing Chapter 1 (1.html)...
  📖 Found 47 verses
  ✅ Inserted chapter 1 (ID: 1)
  📝 Inserted verses 1 to 47

📖 Processing Chapter 2 (2.html)...
  📖 Found 72 verses
  ✅ Inserted chapter 2 (ID: 2)
  📝 Inserted verses 1 to 50
  📝 Inserted verses 51 to 72

...

============================================================
📊 INGESTION COMPLETE
============================================================
✅ Chapters processed: 18/18
✅ Verses inserted: 700
❌ Errors: 0
⏱️  Duration: 12.34s
============================================================

🎉 All chapters and verses successfully ingested!
```

## Customizing the Script

If your HTML structure is different, you can modify the selectors in `data-ingest.js`:

### Modify Chapter Title Extraction

```javascript
// In parseHTMLFile function
chapterData.title_english = $('your-custom-selector').text().trim();
```

### Modify Verse Extraction

```javascript
// In parseHTMLFile function
const verseElements = $('your-verse-selector').toArray();
```

### Modify Field Extraction

```javascript
// In extractVerseData function
verse.sanskrit_text = $verse.find('your-sanskrit-selector').text().trim();
```

## Data Sources

### Where to Get HTML Files

1. **Vedabase.io**
   - Visit https://vedabase.io/en/library/bg/
   - Save each chapter as HTML
   - Rename files to 1.html, 2.html, etc.

2. **Bhagavad Gita API**
   - Use https://bhagavadgita.io/api
   - Fetch JSON data and convert to HTML
   - Or modify the script to work with JSON directly

3. **Other Sources**
   - Holy Bhagavad Gita (https://www.holy-bhagavad-gita.org/)
   - Gita Supersite
   - Any website with structured Gita content

### Converting from Other Formats

If you have data in other formats:

**From JSON:**
```bash
# Use the existing migrate-turso script
npm run migrate-turso ./data/gita.json
```

**From CSV:**
- Convert CSV to JSON first
- Then use migrate-turso script

**From API:**
- Fetch data from API
- Save as HTML or JSON
- Use appropriate ingestion method

## Troubleshooting

### No verses found
- Check HTML structure matches expected patterns
- Add console.log to see what selectors are matching
- Verify HTML files are valid

### Missing data
- Some fields are optional (transliteration, word meanings, purport)
- Script will insert empty strings for missing fields
- Check HTML to ensure data is present

### File not found errors
- Ensure `gita-data` folder exists in project root
- Verify files are named correctly (1.html to 18.html)
- Check file permissions

### Database errors
- Run `npm run setup-turso` first
- Check `.env` file has correct `TURSO_DATABASE_URL`
- Verify database connection

### Parsing errors
- Validate HTML files are well-formed
- Check for special characters or encoding issues
- Try parsing one file at a time to isolate issues

## Verifying the Data

After ingestion, verify the data was inserted correctly:

### Using API
```bash
# Get all chapters
curl http://localhost:5000/api/gita/chapters

# Get specific chapter with verses
curl http://localhost:5000/api/gita/chapters/1/verses

# Get specific verse
curl http://localhost:5000/api/gita/chapters/2/verses/47

# Search verses
curl "http://localhost:5000/api/gita/search?q=karma"

# Get statistics
curl http://localhost:5000/api/gita/stats
```

### Using SQL
```bash
# If using local file database
sqlite3 server/database/gita.db

# Check chapter count
SELECT COUNT(*) FROM chapters;

# Check verse count
SELECT COUNT(*) FROM verses;

# Check specific chapter
SELECT * FROM chapters WHERE chapter_number = 1;

# Check verses in chapter
SELECT COUNT(*) FROM verses WHERE chapter_id = 1;
```

## Performance Tips

1. **Batch Processing** - Script uses batch inserts (50 verses at a time)
2. **File Size** - Smaller HTML files parse faster
3. **Clean HTML** - Remove unnecessary markup for faster parsing
4. **Database** - Use local file for development, Turso cloud for production

## Next Steps

After successful ingestion:

1. **Verify data** - Check a few chapters and verses manually
2. **Test API** - Use the API endpoints to fetch data
3. **Build frontend** - Create UI to display the content
4. **Integrate with AI** - Use verses in spiritual guidance responses
5. **Add features** - Implement search, bookmarks, daily verse, etc.

## Example: Creating HTML from Vedabase

If you're scraping from Vedabase.io, here's a simple approach:

1. Visit chapter page (e.g., https://vedabase.io/en/library/bg/1/)
2. Right-click → "Save As" → Save as HTML
3. Rename to chapter number (e.g., 1.html)
4. Repeat for all 18 chapters
5. Place in `gita-data` folder
6. Run ingestion script

## Support

If you encounter issues:
1. Check the console output for specific errors
2. Verify HTML structure matches expected patterns
3. Test with a single chapter first
4. Review the script code and adjust selectors as needed

---

**Ready to ingest!** Place your HTML files in `gita-data/` and run `npm run ingest-gita`
