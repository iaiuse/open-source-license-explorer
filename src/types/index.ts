export interface License {
  name: string;
  keyword: string;
  spdx_description: string;
  wikipedia_intro: string | null;
  logo: string;
  history: string | null;
  compatibility: {
    commercial: number;
    modification: number;
    distribution: number;
    private: number;
    patent: number;
    copyleft: number;
  };
  tldrlegal_analysis: string;
  popular_projects: Array<{
    name: string;
    url: string;
    stars: number;
  }>;
  full_text_url: string;
  summary: string;
}