import { z } from 'zod';
import type { ToolDefinition } from '../../mcp/types';

const DIMSUM_BASE_URL = 'https://beta.backend.aidimsum.com';

// Tool 1: Get Corpus Apps
const getCorpusAppsParams = z.object({});

// Tool 2: Get Corpus Categories
const getCorpusCategoriesParams = z.object({});

// Tool 3: Get Specific Corpus Category
const getCorpusCategoryParams = z.object({
  name: z.string().describe('类别名称（必填），例如 "zyzd"'),
});

// Tool 4: Get Corpus Item
const getCorpusItemParams = z.object({
  unique_id: z.string().optional().describe('语料项的唯一标识符'),
  data: z.string().optional().describe('语料项的数据字段'),
});

// Tool 5: Get Random Corpus Item
const getRandomItemParams = z.object({
  corpus_name: z.string().describe('语料库名称（必填），例如 "zyzdv2", "yyjq"'),
});

// Tool 6: Get All Corpus Items
const getAllItemsParams = z.object({
  corpus_name: z.string().describe('语料库名称（必填），例如 "yyjq"'),
  cursor: z.number().optional().describe('游标位置，表示从游标后检索数据'),
  limit: z.number().optional().describe('返回结果的最大数量'),
  lifecycle_stage: z.string().optional().describe('按生命周期阶段过滤。可选值：draft, normalized, cleaned, active'),
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

export const catalogTools: ToolDefinition[] = [
  {
    name: 'dimsum_get_corpus_apps',
    description: '获取所有可用的点心语料库应用程序列表。',
    parameters: getCorpusAppsParams,
    handler: async () => {
      return fetchDimsum('/corpus_apps', {});
    },
  },
  {
    name: 'dimsum_get_corpus_categories',
    description: '获取所有可用的点心语料库类别列表。',
    parameters: getCorpusCategoriesParams,
    handler: async () => {
      return fetchDimsum('/corpus_categories', {});
    },
  },
  {
    name: 'dimsum_get_corpus_category',
    description: '按名称获取特定的点心语料库类别详细信息。',
    parameters: getCorpusCategoryParams,
    handler: async (args: unknown) => {
      const params = getCorpusCategoryParams.parse(args);
      return fetchDimsum('/v2/corpus_category', params);
    },
  },
  {
    name: 'dimsum_get_corpus_item',
    description: '通过 unique_id 或 data 字段获取特定的语料库项目。必须提供 unique_id 或 data 参数之一。',
    parameters: getCorpusItemParams,
    handler: async (args: unknown) => {
      const params = getCorpusItemParams.parse(args);
      if (!params.unique_id && !params.data) {
        throw new Error('必须提供 unique_id 或 data 参数');
      }
      return fetchDimsum('/v2/corpus_item', params);
    },
  },
  {
    name: 'dimsum_get_random_item',
    description: '从指定的语料库中获取一个随机的语料项目。',
    parameters: getRandomItemParams,
    handler: async (args: unknown) => {
      const params = getRandomItemParams.parse(args);
      return fetchDimsum('/random_item', params);
    },
  },
  {
    name: 'dimsum_get_all_items',
    description: '从指定的语料库中获取所有语料项目。支持分页和按生命周期阶段过滤。',
    parameters: getAllItemsParams,
    handler: async (args: unknown) => {
      const params = getAllItemsParams.parse(args);
      return fetchDimsum('/all_items', params);
    },
  },
];
