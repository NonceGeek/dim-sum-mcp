import { z } from 'zod';
import type { ToolDefinition } from '../../mcp/types';

const DIMSUM_BASE_URL = 'https://beta.backend.aidimsum.com';

// Tool 1: Text Search (Enhanced)
const textSearchParams = z.object({
  keyword: z.string().describe('搜索关键词（必填）'),
  table_name: z.string().describe('要搜索的表名（当前支持 "cantonese_corpus_all"）'),
  limit: z.number().optional().describe('返回结果的最大数量'),
  supabase_url: z.string().optional().describe('自定义 Supabase URL'),
});

async function fetchDimsum(endpoint: string, params: Record<string, unknown>): Promise<unknown> {
  const url = new URL(`${DIMSUM_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`AI Dimsum API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const searchTools: ToolDefinition[] = [
  {
    name: 'dimsum_text_search',
    description: '点心文字搜索工具，支持繁体和简体中文字符搜索。可以在粤语语料库中搜索字词。',
    parameters: textSearchParams,
    handler: async (args: unknown) => {
      const params = textSearchParams.parse(args);
      return fetchDimsum('/v2/text_search', params);
    },
  },
];
