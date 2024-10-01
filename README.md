以下是完整的 `README.md`，包含了 Python 组件安装说明、本地测试命令、如何创建 `.env.local` 文件、以及如何部署到 Vercel 的步骤。
# 开源许可证探索器

## 项目介绍

**开源许可证探索器** 是一个工具，旨在帮助用户选择和比较不同的开源许可证。它为开发者、项目管理者、法律顾问以及学生和研究者提供了一个快速、简便的方式来查看开源许可证的详细信息、特性评分、使用案例等。

## 主要功能

- **协议比较**: 并排比较多个协议的特性，直观了解各个协议在不同维度上的表现。
- **快速筛选**: 根据商业使用、修改、分发、私有使用等多个维度快速筛选合适的许可证。
- **详细信息**: 提供每个协议的详细说明，包括允许的行为、禁止的行为以及法律注意事项。
- **可视化展示**: 使用评分系统和图表展示协议的特性，让用户一目了然。
- **实时数据**: 动态展示热门项目，了解当前有哪些项目使用了某个特定协议。
- **协议推荐**: 根据用户输入的项目特征自动推荐合适的协议。

## 用户分析

- **开发者**: 为自己的项目选择最合适的开源协议。
- **项目管理者**: 了解不同协议对项目发展的影响。
- **法律顾问**: 快速了解各种开源协议的细节，以确保项目符合法律要求。
- **学生/研究者**: 学习和研究不同开源协议的使用和限制。

## 核心功能

1. **协议比较**: 支持多个协议的并排比较，帮助用户快速了解差异。
2. **快速筛选**: 提供多维度的筛选条件，帮助用户根据实际需求找到合适的协议。
3. **详细信息**: 每个协议的详细说明，涵盖许可范围、使用条件、法律条款等。
4. **可视化展示**: 使用图表展示协议评分，让用户更容易理解不同协议的特性。
5. **实时数据**: 展示使用该协议的热门项目，实时获取项目的星数、贡献者数量等信息。
6. **协议推荐**: 根据用户的项目需求推荐最适合的开源协议。

## 项目展示

- **主页面**：展示多个开源协议的卡片布局，卡片包含许可证的简短描述、评分、使用案例等信息。
- **详情页面**：每个许可证的详细评分分析、使用注意事项以及热门项目展示。

## 项目架构

- **前端技术栈**: React.js
- **后端技术栈**: Python、Flask
- **数据获取**: GitHub API、SPDX、TLDRLegal

## 部署步骤

### 环境依赖

1. **安装 Node.js 和 pnpm**
   确保您安装了 `Node.js` 和 `pnpm`，用于管理项目的前端依赖。

2. **安装 Python**
   您需要安装 `Python 3.x` 以运行许可证数据抓取脚本。

### 设置 `.env.local` 文件

在项目根目录创建一个 `.env.local` 文件，内容如下：

```bash
ZHIPUAI_API_KEY=your_zhipuai_api_key
GITHUB_API_KEY=your_github_api_key
```

请替换 `your_zhipuai_api_key` 和 `your_github_api_key` 为实际的 ZhipuAI 和 GitHub API 密钥。

### Python 依赖安装

1. 使用 `pip` 安装项目依赖，以下是所需的 Python 组件：

```bash
pip install zhipuai github schedule beautifulsoup4 PyGithub python-dotenv
```

2. 这些依赖包括：

- `zhipuai`: 用于与 Zhipu AI 交互。
- `PyGithub`: 通过 GitHub API 获取许可证使用数据。
- `schedule`: 用于定时执行数据抓取任务。
- `beautifulsoup4`: 用于解析网页内容，获取协议信息。
- `python-dotenv`: 用于加载 `.env` 文件中的环境变量。

### 本地运行

1. **启动抓取**

   运行以下命令启动 Python 脚本进行许可证数据抓取：

   ```bash
   pnpm run scraper
   ```

   脚本会抓取许可证的详细信息，并将其保存为 JSON 文件，供前端使用。

2. **启动前端**

   安装前端依赖并启动开发服务器：

   ```bash
   pnpm run build && pnpm run dev
   ```

   前端启动成功后，访问 `http://localhost:3000` 即可查看项目。

### 部署到 Vercel

1. **创建 Vercel 项目**

   如果您没有 Vercel 账号，请先创建一个 [Vercel 账号](https://vercel.com/) 并登录。

2. **连接 GitHub 仓库**

   在 Vercel 仪表盘中，点击 "New Project" 并选择 GitHub 作为源代码提供者。选择您的项目仓库 `open-source-license-explorer` 并点击 "Import"。

3. **设置环境变量**

   在 Vercel 仪表盘的项目设置中，找到 "Environment Variables"，并添加以下环境变量：

   - `ZHIPUAI_API_KEY`：您的 Zhipu AI API 密钥。
   - `GITHUB_API_KEY`：您的 GitHub API 密钥。

4. **部署项目**

   在 Vercel 中导入项目后，Vercel 会自动检测到项目并启动构建。完成构建后，Vercel 会为您的项目提供一个公共 URL，您可以通过该 URL 访问您的项目。

5. **触发脚本运行**

   部署成功后，您可以通过 Vercel 平台上的 "Cron Jobs" 或其他定时任务管理工具，定期触发 `pnpm run scraper` 来更新许可证数据。

## JSON 数据生成

为了获取开源许可证的详细信息，我们使用了 Python 脚本从多个 API 和网站获取数据并生成 JSON 文件。

1. **生成许可证 JSON 数据**

   在项目根目录运行以下 Python 脚本来生成许可证的 JSON 文件。

   ```bash
   pnpm run scraper
   ```

2. **脚本功能**

   - `fetch_spdx_licenses()`：从 SPDX 获取所有许可证的基本信息。
   - `fetch_github_popular_projects(license_key)`：获取使用指定许可证的热门 GitHub 项目信息。
   - `scrape_tldrlegal_info(license_name)`：从 TLDRLegal 获取许可证的简化条款和评分。
   - `process_license(license)`：处理每个许可证，合并多个来源的信息，生成最终的 JSON 数据。

## 贡献指南

欢迎任何形式的贡献！您可以通过以下方式参与项目：

- 提交 issue，反馈问题或建议。
- 提交 pull request，贡献代码或修复 bug。
- 在社交媒体上分享并推广这个项目。

## 许可证

本项目使用 MIT 许可证。详细信息请查看 [LICENSE](./LICENSE) 文件。

---

项目仓库：[open-source-license-explorer](https://github.com/iaiuse/open-source-license-explorer)

---

通过这个 `README.md`，用户将了解如何安装依赖、运行项目、生成许可证 JSON 数据以及如何部署到 Vercel。