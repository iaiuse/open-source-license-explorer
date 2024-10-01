import requests
from bs4 import BeautifulSoup
import json
import time
import os
from github import Github
from zhipuai import ZhipuAI
import schedule
import logging
from urllib.parse import quote, urlencode
import re

# 设置日志记录
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# License data structure
licenses = [
    {"name": "Academic Free License v3.0", "keyword": "AFL-3.0", "url": ""},
    {"name": "Apache License 2.0", "keyword": "Apache-2.0", "url": ""},
    {"name": "Artistic License 2.0", "keyword": "Artistic-2.0", "url": ""},
    {"name": "Boost Software License 1.0", "keyword": "BSL-1.0", "url": ""},
    {"name": "BSD 2-Clause 'Simplified' License", "keyword": "BSD-2-Clause", "url": ""},
    {"name": "BSD 3-Clause 'New' or 'Revised' License", "keyword": "BSD-3-Clause", "url": ""},
    {"name": "BSD 3-Clause Clear License", "keyword": "BSD-3-Clause-Clear", "url": ""},
    {"name": "BSD 4-Clause 'Original' or 'Old' License", "keyword": "BSD-4-Clause", "url": ""},
    {"name": "BSD Zero Clause License", "keyword": "0BSD", "url": ""},
    {"name": "Creative Commons License Family", "keyword": "CC", "url": ""},
    {"name": "Creative Commons Zero v1.0 Universal", "keyword": "CC0-1.0", "url": ""},
    {"name": "Creative Commons Attribution 4.0", "keyword": "CC-BY-4.0", "url": ""},
    {"name": "Creative Commons Attribution ShareAlike 4.0", "keyword": "CC-BY-SA-4.0", "url": ""},
    {"name": "Do What The F*ck You Want To Public License", "keyword": "WTFPL", "url": ""},
    {"name": "Educational Community License v2.0", "keyword": "ECL-2.0", "url": ""},
    {"name": "Eclipse Public License 1.0", "keyword": "EPL-1.0", "url": ""},
    {"name": "Eclipse Public License 2.0", "keyword": "EPL-2.0", "url": ""},
    {"name": "European Union Public License 1.1", "keyword": "EUPL-1.1", "url": ""},
    {"name": "GNU Affero General Public License v3.0", "keyword": "AGPL-3.0", "url": ""},
    {"name": "GNU General Public License Family", "keyword": "GPL", "url": ""},
    {"name": "GNU General Public License v2.0", "keyword": "GPL-2.0", "url": ""},
    {"name": "GNU General Public License v3.0", "keyword": "GPL-3.0", "url": ""},
    {"name": "GNU Lesser General Public License Family", "keyword": "LGPL", "url": ""},
    {"name": "GNU Lesser General Public License v2.1", "keyword": "LGPL-2.1", "url": ""},
    {"name": "GNU Lesser General Public License v3.0", "keyword": "LGPL-3.0", "url": ""},
    {"name": "ISC License", "keyword": "ISC", "url": ""},
    {"name": "LaTeX Project Public License v1.3c", "keyword": "LPPL-1.3c", "url": ""},
    {"name": "Microsoft Public License", "keyword": "MS-PL", "url": ""},
    {"name": "MIT License", "keyword": "MIT", "url": ""},
    {"name": "Mozilla Public License 2.0", "keyword": "MPL-2.0", "url": ""},
    {"name": "Open Software License 3.0", "keyword": "OSL-3.0", "url": ""},
    {"name": "PostgreSQL License", "keyword": "PostgreSQL", "url": ""},
    {"name": "SIL Open Font License 1.1", "keyword": "OFL-1.1", "url": ""},
    {"name": "University of Illinois/NCSA Open Source License", "keyword": "NCSA", "url": ""},
    {"name": "The Unlicense", "keyword": "Unlicense", "url": ""},
    {"name": "zlib License", "keyword": "Zlib", "url": "https://en.wikipedia.org/wiki/Zlib_License"}
]

# 从环境变量中获取 API 密钥
zhipuai_api_key = os.environ.get('ZHIPUAI_API_KEY')
github_api_key = os.environ.get('GITHUB_API_KEY')

print(f"ZHIPUAI_API_KEY: {'*' * len(zhipuai_api_key) if zhipuai_api_key else 'Not set'}")
print(f"GITHUB_API_KEY: {'*' * len(github_api_key) if github_api_key else 'Not set'}")

if not github_api_key:
    raise ValueError("GITHUB_API_KEY is not set in the environment variables")

# 初始化必要的客户端
client = ZhipuAI(api_key=zhipuai_api_key)
github_client = Github(github_api_key)

def fetch_spdx_licenses():
    url = "https://spdx.org/licenses/licenses.json"
    response = requests.get(url)
    return response.json()['licenses']

def google_search_wikipedia(license_name):
    """通过Google站内搜索获取维基百科许可证链接"""
    query = f"site:en.wikipedia.org {license_name}"
    search_url = f"https://www.google.com/search?{urlencode({'q': query})}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(search_url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # 查找第一个包含维基百科链接的结果
        for link in soup.find_all('a', href=True):
            href = link['href']
            match = re.search(r'/url\?q=(https://en.wikipedia.org/wiki/[^&]+)', href)
            if match:
                wikipedia_url = match.group(1)
                return wikipedia_url
    return None

def fetch_wikipedia_info(license_name):
    """从维基百科解析许可证信息"""
    wikipedia_url = google_search_wikipedia(license_name)
    if wikipedia_url:
        response = requests.get(wikipedia_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            info = {}

            # 获取logo
            logo_tag = soup.select_one('.infobox .image img')
            if logo_tag and 'src' in logo_tag.attrs:
                info['logo'] = f"https:{logo_tag['src']}" if logo_tag['src'].startswith("//") else logo_tag['src']
            else:
                info['logo'] = None

            # 获取简介
            intro_paragraphs = soup.select('.mw-parser-output > p')
            intro = ''
            for para in intro_paragraphs:
                if para.text.strip():
                    intro = para.get_text().strip()
                    break
            info['intro'] = intro if intro else None

            # 获取历史信息
            history_section = soup.find('span', {'id': 'History'})
            if history_section:
                history_content = ''
                for sibling in history_section.parent.find_next_siblings():
                    if sibling.name == 'p':
                        history_content += sibling.get_text().strip() + '\n'
                    elif sibling.name == 'h2':
                        break
                info['history'] = history_content.strip() if history_content else None
            else:
                info['history'] = None

            return info, wikipedia_url
    return {}, None

def fetch_github_popular_projects(license_key):
    query = f"license:{license_key} stars:>1000"
    repositories = github_client.search_repositories(query=query, sort="stars", order="desc")
    return [{"name": repo.full_name, "url": repo.html_url, "stars": repo.stargazers_count} for repo in repositories[:5]]

def generate_license_summary(license_info):
    prompt = f"""作为一位精通开源软件许可的专家，请为以下许可证创建一个简洁的摘要，概括其核心内容和主要特点。许可证信息如下：

名称: {license_info['name']}
SPDX描述: {license_info['spdx_description']}
维基百科简介: {license_info['wikipedia_intro']}
TLDRLegal分析: {license_info['tldrlegal_analysis']}

请提供一个超过500字的中文摘要，不超过1000字，涵盖许可证的核心特点、主要权限和限制。确保摘要简洁明了，便于快速理解。"""

    response = client.chat.completions.create(
        model="glm-4",
        messages=[
            {"role": "system", "content": "你是一个专业的开源软件许可专家，擅长简明扼要地总结许可证的核心内容。"},
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content.strip()

def fetch_logo(license_name):
    """尝试从维基百科或Google搜索获取logo"""
    # 先尝试从维基百科获取
    info, _ = fetch_wikipedia_info(license_name)
    if info.get('logo'):
        return info['logo']

    # 如果从维基百科获取失败，尝试Google搜索
    search_query = f"{license_name} logo filetype:png"
    search_url = f"https://www.google.com/search?q={quote(search_query)}&tbm=isch"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(search_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        img_tags = soup.find_all('img')
        if img_tags:
            for img in img_tags:
                if 'src' in img.attrs and img['src'].startswith('http'):
                    return img['src']

    return None

def scrape_tldrlegal_info(license_name):
    url = f"https://tldrlegal.com/license/{license_name.lower().replace(' ', '-')}"
    logging.info(f"Fetching TLDRLegal info from: {url}")
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    cans = soup.find_all(class_="label label-success")
    cannots = soup.find_all(class_="label label-danger")

    allowed_actions = [can.get_text(strip=True) for can in cans]
    prohibited_actions = [cannot.get_text(strip=True) for cannot in cannots]

    logging.debug(f"Allowed actions: {allowed_actions}")
    logging.debug(f"Prohibited actions: {prohibited_actions}")

    analysis_prompt = f"""
分析以下开源许可证 "{license_name}" 的信息，并为各个方面评分（1-5分，5分最高）：

允许的行为：
{', '.join(allowed_actions)}

禁止的行为：
{', '.join(prohibited_actions)}

请为以下方面评分并简要解释（确保每个评分都在单独的行上，格式为"方面: 分数 - 解释"）。评分标准如下：

1. 商业使用友好度：
   1分：完全禁止商业使用
   3分：允许有限的商业使用，但有严格限制
   5分：完全允许商业使用，没有限制

2. 修改代码自由度：
   1分：不允许修改代码
   3分：允许有限的修改，但有严格限制
   5分：完全允许自由修改代码

3. 分发限制程度：
   1分：严格限制分发，几乎不允许分发
   3分：允许有限的分发，但有一些限制
   5分：几乎没有分发限制

4. 私有使用自由度：
   1分：不允许私有使用
   3分：允许有限的私有使用，但有一些限制
   5分：完全允许自由的私有使用

5. 专利保护强度：
   1分：没有专利保护条款
   3分：有一些专利保护，但范围有限
   5分：强有力的专利保护条款

6. Copyleft强度：
   1分：没有Copyleft条款
   3分：有一些Copyleft要求，但不是很严格
   5分：强Copyleft，要求所有派生作品都必须使用相同许可证

请根据以上标准为每个方面评分，并确保评分不超过5分。
最后在结尾输出一个JSON结构，格式如下（请确保JSON的键为英文）：

```json
{{
  "commercial": 分数,
  "modification": 分数,
  "distribution": 分数,
  "private": 分数,
  "patent": 分数,
  "copyleft": 分数
}}
```

"""

    logging.debug(f"Sending prompt to ZhipuAI: {analysis_prompt}")

    response = client.chat.completions.create(
        model="glm-4",
        messages=[
            {"role": "system", "content": "你是一个专业的开源许可证分析专家。"},
            {"role": "user", "content": analysis_prompt}
        ],
    )

    analysis_result = response.choices[0].message.content
    logging.debug(f"Received analysis from ZhipuAI: {analysis_result}")

    compatibility = {
        "commercial": 0,
        "modification": 0,
        "distribution": 0,
        "private": 0,
        "patent": 0,
        "copyleft": 0
    }

    # 查找JSON块
    json_match = re.search(r'```json\s*(.*?)\s*```', analysis_result, re.DOTALL)
    if json_match:
        try:
            json_data = json.loads(json_match.group(1))
            compatibility.update(json_data)
            logging.info(f"Extracted compatibility scores from JSON: {compatibility}")
        except json.JSONDecodeError:
            logging.error("Failed to parse JSON data")
    else:
        # 如果没有找到JSON块，使用原来的解析逻辑
        for line in analysis_result.split('\n'):
            for key in compatibility.keys():
                if key in line.lower():
                    match = re.search(r'(\d+)', line)
                    if match:
                        score = int(match.group(1))
                        compatibility[key] = score
                        logging.debug(f"Extracted score for {key}: {score}")

    logging.info(f"Final compatibility scores: {compatibility}")

    # 移除JSON块
    analysis_result = re.sub(r'```json\s*.*?\s*```', '', analysis_result, flags=re.DOTALL)

    # 将评分标准说明添加到 tldrlegal_analysis
    tldrlegal_analysis = analysis_result.strip()

    return compatibility, tldrlegal_analysis

def process_license(license):
    try:
        spdx_info = license
        # 通过 Google 搜索获取维基百科信息
        wikipedia_info, wikipedia_url = fetch_wikipedia_info(license.get('name', ''))
        if not wikipedia_info:
            wikipedia_info = {'intro': None, 'history': None, 'logo': None}
            wikipedia_url = None

        github_projects = fetch_github_popular_projects(license.get('keyword', ''))
        compatibility, tldrlegal_analysis = scrape_tldrlegal_info(license.get('name', ''))

        # 获取Logo
        logo = wikipedia_info.get('logo') if wikipedia_info.get('logo') else fetch_logo(license.get('name', ''))

        license_info = {
            "name": license.get('name', 'Unknown'),
            "keyword": license.get('keyword', 'Unknown'),
            "spdx_description": spdx_info.get('description', 'No description available'),
            "wikipedia_intro": wikipedia_info.get('intro'),
            "logo": logo,
            "history": wikipedia_info.get('history'),
            "compatibility": compatibility,
            "tldrlegal_analysis": tldrlegal_analysis,
            "popular_projects": github_projects,
            "full_text_url": spdx_info.get('reference', wikipedia_url if wikipedia_url else 'No reference available'),
        }

        license_info["summary"] = generate_license_summary(license_info)
        return license_info
    except Exception as e:
        logging.error(f"Error in process_license for {license.get('name', 'Unknown')}: {str(e)}")
        return None

def validate_data(license_data):
    required_fields = ["name", "keyword", "summary", "compatibility", "popular_projects", "full_text_url"]
    for license in license_data:
        if not all(field in license for field in required_fields):
            logging.warning(f"Warning: Missing required fields in license {license['name']}")

    # 可以添加更多的验证逻辑，比如检查数值范围、字符串长度等

def save_license_data(file_path, license_data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(license_data, f, ensure_ascii=False, indent=2)

def update_license_data(licenses):
    license_data = []
    spdx_licenses = fetch_spdx_licenses()

    for license in licenses:
        try:
            spdx_license = next((l for l in spdx_licenses if l['licenseId'] == license['keyword']), None)
            if spdx_license:
                # 将 SPDX 描述添加到许可证中
                license['description'] = spdx_license.get('detailsUrl', 'No description available')
                license['reference'] = spdx_license.get('reference', 'No reference available')
            else:
                license['description'] = 'No description available'
                license['reference'] = 'No reference available'

            license_info = process_license(license)
            if license_info:
                license_data.append(license_info)
                logging.info(f"Processed {license['name']}")
            else:
                logging.warning(f"Failed to process {license['name']}")
            time.sleep(1)  # Rate limiting
        except Exception as e:
            logging.error(f"Error processing {license['name']}: {str(e)}")

    validate_data(license_data)
    save_license_data('src/data/licenses.json', license_data)
    logging.info("License data updated successfully")

# 设置定期更新任务
schedule.every().day.at("00:00").do(update_license_data, licenses)

if __name__ == "__main__":
    update_license_data(licenses)
    while True:
        schedule.run_pending()
        time.sleep(1)