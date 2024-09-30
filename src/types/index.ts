export interface License {
  name: string;
  keyword: string;
  description: string;
  logo: string | null;
  fullText: string;
  officialUrl: string | null;
  // 保留以下字段为可选，以适应可能的扩展
  popularProjects?: Array<{ name: string; logo: string }>;
  details?: string;
  attributes?: { [key: string]: boolean };
  // 添加这两个字段作为可选，以便于未来扩展
  compatibility?: {
    [key: string]: number;
  };
  projects?: string[];
}