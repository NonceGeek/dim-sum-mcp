# Dimsum MCP Workers

Cloudflare Workers 版本的 AI Dimsum MCP 服务器，提供粤语语料库的 MCP 工具支持。

## 项目说明

本项目是一个 MCP (Model Context Protocol) 服务器，用于访问 [AI Dimsum API](https://beta.backend.aidimsum.com/docs/html)，让 AI 助手能够查询粤语语料库数据。

## 功能特性

### 🔍 搜索工具

- **dimsum_text_search**: 文字搜索，支持繁体和简体中文字符搜索

### 📚 目录工具

- **dimsum_get_corpus_apps**: 获取所有可用的语料库应用程序
- **dimsum_get_corpus_categories**: 获取所有语料库类别
- **dimsum_get_corpus_category**: 按名称获取特定类别
- **dimsum_get_corpus_item**: 获取特定的语料库项目
- **dimsum_get_random_item**: 获取随机语料库项目
- **dimsum_get_all_items**: 获取所有语料库项目（支持分页）

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

服务器将在 `http://localhost:8787` 启动。

### 3. 部署到 Cloudflare Workers

```bash
# 登录 Cloudflare
npx wrangler login

# 部署
npm run deploy
```

部署后会得到一个 Worker URL，例如：
```
https://dimsummcp.your-subdomain.workers.dev
```

💡🤔 如果在生产环境下，建议给 Workers URL 配上自己的域名。

## MCP 客户端配置

### Cursor

在 Cursor 的 MCP 设置中添加：

```json
{
  "mcpServers": {
    "dimsum": {
      "command": "node",
      "args": ["/absolute/path/to/dim-sum-mcp/mcp-bridge.js"],
      "env": {
        "SERVER_URL": "https://dimsummcp.your-subdomain.workers.dev/mcp"
      }
    }
  }
}
```

### Claude Desktop

配置文件位置：
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dimsum": {
      "command": "node",
      "args": ["/absolute/path/to/dim-sum-mcp/mcp-bridge.js"],
      "env": {
        "SERVER_URL": "https://dimsummcp.your-subdomain.workers.dev/mcp"
      }
    }
  }
}
```

### 本地开发配置

使用本地开发服务器时：

```json
{
  "mcpServers": {
    "dimsum": {
      "command": "node",
      "args": ["/absolute/path/to/dim-sum-mcp/mcp-bridge.js"],
      "env": {
        "SERVER_URL": "http://localhost:8787/mcp"
      }
    }
  }
}
```

---

## 使用示例

配置完成后，你可以在对话中直接使用这些工具：

### 搜索粤语字词

```
用户: 帮我搜索粤语词"为"的信息
AI: 使用 dimsum_text_search 工具搜索...
```

### 获取随机粤语词

```
用户: 给我一个随机的粤语词
AI: 使用 dimsum_get_random_item 从 zyzdv2 语料库获取...
```

### 浏览语料库类别

```
用户: 有哪些粤语语料库类别？
AI: 使用 dimsum_get_corpus_categories 获取列表...
```

---

## 工具详解

### 1. dimsum_text_search

在粤语语料库中搜索字词。

**参数：**
- `keyword` (必填): 搜索关键词
- `table_name` (必填): 表名，目前支持 "cantonese_corpus_all"
- `limit` (可选): 返回结果数量限制
- `supabase_url` (可选): 自定义 Supabase URL

**返回示例：**
```json
[
  {
    "unique_id": "uuid",
    "data": "為",
    "note": {
      "meaning": ["作为", "能够"],
      "pinyin": ["wai4"]
    },
    "category": "zyzd",
    "tags": ["word"]
  }
]
```

### 2. dimsum_get_corpus_categories

获取所有可用的语料库类别。

**返回示例：**
```json
[
  {
    "id": 1,
    "name": "zyzd",
    "description": "粤语字典"
  },
  {
    "id": 2,
    "name": "yyjq",
    "description": "粤语金曲"
  }
]
```

### 3. dimsum_get_corpus_item

通过 unique_id 或 data 获取特定语料项。

**参数：**
- `unique_id` (可选): 唯一标识符
- `data` (可选): 数据字段

**注意：** 必须提供 `unique_id` 或 `data` 之一。

### 4. dimsum_get_random_item

从指定语料库获取随机项目。

**参数：**
- `corpus_name` (必填): 语料库名称，如 "zyzdv2", "yyjq"

### 5. dimsum_get_all_items

获取语料库中的所有项目，支持分页和过滤。

**参数：**
- `corpus_name` (必填): 语料库名称
- `cursor` (可选): 游标位置
- `limit` (可选): 返回数量限制
- `lifecycle_stage` (可选): 生命周期阶段过滤
  - `draft`: 草稿
  - `normalized`: 已规范化
  - `cleaned`: 已清理
  - `active`: 活跃状态

---

## 技术栈

- **Cloudflare Workers**: 边缘计算平台
- **TypeScript**: 类型安全
- **Zod**: 数据验证
- **MCP Protocol**: Model Context Protocol

---

## 开发

### 项目结构

```
dim-sum-mcp/
├── src/
│   ├── index.ts              # Workers 入口
│   ├── mcp/
│   │   ├── server.ts         # MCP 服务器实现
│   │   └── types.ts          # 类型定义
│   ├── tools/
│   │   ├── search/           # 搜索工具
│   │   └── catalog/          # 目录工具
│   └── types/
│       └── index.ts          # 类型定义
├── mcp-bridge.js             # stdio 到 HTTP 桥接
├── package.json
├── wrangler.toml             # Cloudflare Workers 配置
└── tsconfig.json
```

### 类型检查

```bash
npm run typecheck
```

### 添加新工具

1. 在 `src/tools/` 下创建新的工具定义
2. 使用 Zod 定义参数 schema
3. 实现 handler 函数
4. 在 `src/index.ts` 中注册工具

---

## API 数据源

本项目使用 [AI Dimsum API](https://beta.backend.aidimsum.com) 作为数据源。

API 文档: https://beta.backend.aidimsum.com/docs

---

## 许可证

MIT

---

## 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [AI Dimsum API Documentation](https://beta.backend.aidimsum.com/docs)
- [Cloudflare Workers](https://workers.cloudflare.com/)
