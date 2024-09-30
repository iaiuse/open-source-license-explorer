import requests
from bs4 import BeautifulSoup
import json
import time
import os

# Function to read existing license data from file
def read_existing_licenses(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

# Function to save license data to file
def save_license_data(file_path, license_data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(license_data, f, ensure_ascii=False, indent=2)

# Function to try different URLs
def try_different_urls(license):
    attempts = []

    # 1st attempt: URL based on the full name
    attempts.append(f"https://en.wikipedia.org/wiki/{license['name'].replace(' ', '_')}")

    # 2nd attempt: URL without version number
    attempts.append(f"https://en.wikipedia.org/wiki/{license['name'].split(' v')[0].replace(' ', '_')}")

    # 3rd attempt: URL based on keyword
    attempts.append(f"https://en.wikipedia.org/wiki/{license['keyword'].replace(' ', '_')}")

    # 4th attempt: Use the custom URL if provided
    if 'url' in license and license['url']:
        attempts.append(license['url'])

    return attempts

# Function to scrape license info from Wikipedia
def scrape_license_info(licenses, file_path):
    existing_licenses = read_existing_licenses(file_path)
    existing_license_names = {license['name'] for license in existing_licenses}

    license_data = existing_licenses.copy()
    successful_licenses = []
    failed_licenses = []

    for license in licenses:
        if license['name'] in existing_license_names:
            print(f"Skipping {license['name']}, already exists in the file.")
            continue

        attempts = try_different_urls(license)
        success = False

        for attempt in attempts:
            try:
                print(f"Trying URL: {attempt}")
                response = requests.get(attempt)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')

                    # Extract license description from the first paragraph
                    description = soup.select_one('.mw-parser-output > p')
                    description_text = description.get_text().strip() if description else "No description found."

                    # Extract the logo (if available)
                    logo_tag = soup.select_one('.infobox-image img')
                    logo = f"https:{logo_tag['src']}" if logo_tag else None

                    # Extract the official URL (if available)
                    official_url_tag = soup.select_one('.infobox-data a[rel="nofollow"]')
                    official_url = official_url_tag['href'] if official_url_tag else None

                    # Fetch the full text of the license if official URL is found
                    full_text = ""
                    if official_url:
                        try:
                            full_text_response = requests.get(official_url)
                            full_text_response.raise_for_status()
                            full_text = full_text_response.text
                        except Exception as e:
                            print(f"Error fetching full text for {license['name']}: {e}")

                    # Append the license info to the list
                    license_data.append({
                        "name": license["name"],
                        "keyword": license["keyword"],
                        "description": description_text,
                        "logo": logo,
                        "fullText": full_text,
                        "officialUrl": official_url
                    })

                    successful_licenses.append(license['name'])
                    success = True
                    break

                else:
                    print(f"URL {attempt} returned status code {response.status_code}")

            except Exception as e:
                print(f"Error trying {attempt} for {license['name']}: {e}")

        if not success:
            failed_licenses.append(license['name'])

        # Wait 1 second before making the next request
        time.sleep(1)

    # Save the updated license data to file
    save_license_data(file_path, license_data)

    # Output success and failure lists
    print("\nScraping completed!")
    print(f"Successfully scraped the following licenses: {successful_licenses}")
    print(f"Failed to scrape the following licenses: {failed_licenses}")

# License data structure
licenses = [
    {"name": "Academic Free License v3.0", "keyword": "AFL-3.0", "url": ""},
    {"name": "Apache license 2.0", "keyword": "Apache-2.0", "url": ""},
    {"name": "Artistic license 2.0", "keyword": "Artistic-2.0", "url": ""},
    {"name": "Boost Software License 1.0", "keyword": "BSL-1.0", "url": ""},
    {"name": "BSD 2-clause 'Simplified' license", "keyword": "BSD-2-Clause", "url": ""},
    {"name": "BSD 3-clause 'New' or 'Revised' license", "keyword": "BSD-3-Clause", "url": ""},
    {"name": "BSD 3-clause Clear license", "keyword": "BSD-3-Clause-Clear", "url": ""},
    {"name": "BSD 4-clause 'Original' or 'Old' license", "keyword": "BSD-4-Clause", "url": ""},
    {"name": "BSD Zero-Clause license", "keyword": "0BSD", "url": ""},
    {"name": "Creative Commons license family", "keyword": "CC", "url": ""},
    {"name": "Creative Commons Zero v1.0 Universal", "keyword": "CC0-1.0", "url": ""},
    {"name": "Creative Commons Attribution 4.0", "keyword": "CC-BY-4.0", "url": ""},
    {"name": "Creative Commons Attribution ShareAlike 4.0", "keyword": "CC-BY-SA-4.0", "url": ""},
    {"name": "Do What The F*ck You Want To Public License", "keyword": "WTFPL", "url": ""},
    {"name": "Educational Community License v2.0", "keyword": "ECL-2.0", "url": ""},
    {"name": "Eclipse Public License 1.0", "keyword": "EPL-1.0", "url": ""},
    {"name": "Eclipse Public License 2.0", "keyword": "EPL-2.0", "url": ""},
    {"name": "European Union Public License 1.1", "keyword": "EUPL-1.1", "url": ""},
    {"name": "GNU Affero General Public License v3.0", "keyword": "AGPL-3.0", "url": ""},
    {"name": "GNU General Public License family", "keyword": "GPL", "url": ""},
    {"name": "GNU General Public License v2.0", "keyword": "GPL-2.0", "url": ""},
    {"name": "GNU General Public License v3.0", "keyword": "GPL-3.0", "url": ""},
    {"name": "GNU Lesser General Public License family", "keyword": "LGPL", "url": ""},
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
    {"name": "zLib License", "keyword": "Zlib", "url": "https://en.wikipedia.org/wiki/Zlib_License"}
]

# File path to store the license data
file_path = 'src/data/licenses.json'

# Scrape license information
scrape_license_info(licenses, file_path)
