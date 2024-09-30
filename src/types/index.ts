export interface License {
  name: string;
  keyword: string;
  description: string;
  logo?: string | null; // Make logo optional or nullable
  popularProjects?: Array<{ name: string; logo: string }>; // Optional
  details?: string; // Optional
  attributes?: { [key: string]: boolean }; // Optional
  officialWebsite?: string | null; // Optional or nullable
  fullText: string;
}
