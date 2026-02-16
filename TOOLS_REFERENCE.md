# AI Dimsum MCP Tools - Quick Reference

## Available Tools (7 total)

### 🔍 Search Tool

#### `dimsum_text_search`
Search for Cantonese words/characters in the corpus.

**Parameters:**
```typescript
{
  keyword: string,        // Required: Search keyword
  table_name: string,     // Required: "cantonese_corpus_all"
  limit?: number,         // Optional: Max results
  supabase_url?: string   // Optional: Custom URL
}
```

**Example:**
```javascript
{
  "keyword": "為",
  "table_name": "cantonese_corpus_all",
  "limit": 5
}
```

---

### 📚 Catalog Tools

#### `dimsum_get_corpus_apps`
Get list of all corpus applications.

**Parameters:** None

**Example:**
```javascript
{}
```

---

#### `dimsum_get_corpus_categories`
Get list of all corpus categories.

**Parameters:** None

**Example:**
```javascript
{}
```

---

#### `dimsum_get_corpus_category`
Get details of a specific category.

**Parameters:**
```typescript
{
  name: string  // Required: Category name (e.g., "zyzd")
}
```

**Example:**
```javascript
{
  "name": "zyzd"
}
```

---

#### `dimsum_get_corpus_item`
Get a specific corpus item.

**Parameters:**
```typescript
{
  unique_id?: string,  // Optional: Item UUID
  data?: string        // Optional: Item data field
}
```

**Note:** Must provide either `unique_id` OR `data`

**Examples:**
```javascript
// By unique_id
{
  "unique_id": "550e8400-e29b-41d4-a716-446655440000"
}

// By data
{
  "data": "為"
}
```

---

#### `dimsum_get_random_item`
Get a random item from a corpus.

**Parameters:**
```typescript
{
  corpus_name: string  // Required: Corpus name (e.g., "zyzdv2", "yyjq")
}
```

**Example:**
```javascript
{
  "corpus_name": "zyzdv2"
}
```

---

#### `dimsum_get_all_items`
Get all items from a corpus with pagination.

**Parameters:**
```typescript
{
  corpus_name: string,      // Required: Corpus name
  cursor?: number,          // Optional: Pagination cursor
  limit?: number,           // Optional: Max results
  lifecycle_stage?: string  // Optional: Filter by stage
}
```

**Lifecycle Stages:**
- `draft`: Not yet processed
- `normalized`: Automated normalization completed
- `cleaned`: Manual cleaning completed
- `active`: In routine checks

**Examples:**
```javascript
// Basic
{
  "corpus_name": "yyjq",
  "limit": 10
}

// With pagination
{
  "corpus_name": "yyjq",
  "cursor": 20,
  "limit": 10
}

// With filter
{
  "corpus_name": "yyjq",
  "lifecycle_stage": "active",
  "limit": 10
}
```

---

## Common Usage Patterns

### 1. Search for a Word
```
User: "搜索粤语词'为'的信息"
Tool: dimsum_text_search
Parameters: { keyword: "为", table_name: "cantonese_corpus_all" }
```

### 2. Browse Categories
```
User: "有哪些语料库类别？"
Tool: dimsum_get_corpus_categories
Parameters: {}
```

### 3. Get Category Details
```
User: "告诉我 zyzd 类别的详细信息"
Tool: dimsum_get_corpus_category
Parameters: { name: "zyzd" }
```

### 4. Random Word Practice
```
User: "给我一个随机的粤语词来练习"
Tool: dimsum_get_random_item
Parameters: { corpus_name: "zyzdv2" }
```

### 5. Browse Corpus Items
```
User: "列出 yyjq 语料库的前20个项目"
Tool: dimsum_get_all_items
Parameters: { corpus_name: "yyjq", limit: 20 }
```

### 6. Lookup Specific Item
```
User: "查看这个字的详细信息"
Tool: dimsum_get_corpus_item
Parameters: { data: "為" }
```

---

## Response Data Structures

### Corpus Item Structure
```typescript
{
  unique_id: string,
  data: string,
  note: {
    meaning: string[],
    pinyin: string[],
    [key: string]: any
  },
  category: string,
  tags: string[],
  created_at?: string,
  updated_at?: string
}
```

### Category Structure
```typescript
{
  id: number,
  name: string,
  description: string
}
```

### App Structure
```typescript
{
  id: number,
  name: string,
  description: string
}
```

---

## Error Handling

### Common Errors

**Missing Required Parameter:**
```json
{
  "error": "必须提供 unique_id 或 data 参数"
}
```

**Invalid Table Name:**
```json
{
  "error": "AI Dimsum API error: 400 Bad Request"
}
```

**Not Found:**
```json
{}  // Empty object returned
```

---

## Tips & Best Practices

### 1. **Use V2 Endpoints**
The tools use V2 endpoints (`/v2/corpus_item`, etc.) which return single objects instead of arrays for better usability.

### 2. **Pagination**
When using `dimsum_get_all_items`:
- Start with `cursor: 0` and a reasonable `limit` (e.g., 20)
- Use the count of returned items + cursor for next page
- Continue until no more results

### 3. **Text Search**
- Supports both traditional and simplified Chinese
- Use `limit` to control result size
- Results are ordered by relevance

### 4. **Lifecycle Filtering**
Use `lifecycle_stage` to get only high-quality data:
- `active`: Best quality, routine checks passed
- `cleaned`: Good quality, manually cleaned
- `normalized`: Processed but not verified

### 5. **Error Recovery**
- If a tool returns `{}`, the item/category wasn't found
- Check parameter names and values
- Verify corpus names exist before querying

---

## Testing Commands

### Using curl (direct API)
```bash
# Text search
curl "https://beta.backend.aidimsum.com/v2/text_search?keyword=為&table_name=cantonese_corpus_all&limit=5"

# Get categories
curl "https://beta.backend.aidimsum.com/corpus_categories"

# Get specific category
curl "https://beta.backend.aidimsum.com/v2/corpus_category?name=zyzd"

# Get random item
curl "https://beta.backend.aidimsum.com/random_item?corpus_name=zyzdv2"
```

### Using MCP (through client)
```
# In Cursor or Claude Desktop
"使用 dimsum_text_search 搜索'为'"
"使用 dimsum_get_categories 列出所有类别"
"使用 dimsum_get_random_item 从 zyzdv2 获取随机词"
```

---

## Corpus Names Reference

### Known Corpus Names
- `zyzdv2`: 粤语字典 V2
- `yyjq`: 粤语金曲 (Cantonese Songs)
- `cantonese_corpus_all`: All Cantonese corpus (for search)

### How to Find More
```javascript
// Get all categories first
dimsum_get_corpus_categories({})

// Then use category names as corpus_name in other tools
```

---

## API Documentation

Full API documentation: https://beta.backend.aidimsum.com/docs

Base URL: `https://beta.backend.aidimsum.com`
