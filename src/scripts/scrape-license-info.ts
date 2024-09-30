import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';


interface License {
  name: string;
  keyword: string;
}

interface LicenseInfo extends License {
  description: string;
  logo: string | null;
  fullText: string;
  officialUrl: string | null;
}

async function scrapeLicenseInfo(licenses: License[]): Promise<void> {
  const licenseData: LicenseInfo[] = [];

  for (const license of licenses) {
    try {
      console.log(`Scraping info for ${license.name}...`);
      
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(license.name.replace(/ /g, '_'))}`;
      const { data } = await axios.get(wikiUrl);
      const $ = cheerio.load(data);

      const summary = $('.mw-parser-output > p').first().text().trim();
      const logo = $('.infobox-image img').attr('src');
      const officialUrl = $('.infobox-data a[rel="nofollow"]').attr('href') || null;

      let fullText = '';
      if (officialUrl) {
        try {
          const { data: licenseText } = await axios.get(officialUrl);
          fullText = licenseText;
        } catch (error) {
          console.error(`Error fetching full text for ${license.name}: ${(error as Error).message}`);
        }
      }

      licenseData.push({
        name: license.name,
        keyword: license.keyword,
        description: summary,
        logo: logo ? `https:${logo}` : null,
        fullText: fullText,
        officialUrl: officialUrl
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${license.name}: ${(error as Error).message}`);
    }
  }

  fs.writeFileSync('./licenses.json', JSON.stringify(licenseData, null, 2));
  console.log('License information has been saved to licenses.json');
}

const licenses: License[] = [
  { name: 'Academic Free License v3.0', keyword: 'AFL-3.0' },
  { name: 'Apache license 2.0', keyword: 'Apache-2.0' },
  { name: 'Artistic license 2.0', keyword: 'Artistic-2.0' },
  { name: 'Boost Software License 1.0', keyword: 'BSL-1.0' },
  { name: 'BSD 2-clause "Simplified" license', keyword: 'BSD-2-Clause' },
  { name: 'BSD 3-clause "New" or "Revised" license', keyword: 'BSD-3-Clause' },
  { name: 'BSD 3-clause Clear license', keyword: 'BSD-3-Clause-Clear' },
  { name: 'BSD 4-clause "Original" or "Old" license', keyword: 'BSD-4-Clause' },
  { name: 'BSD Zero-Clause license', keyword: '0BSD' },
  { name: 'Creative Commons license family', keyword: 'CC' },
  { name: 'Creative Commons Zero v1.0 Universal', keyword: 'CC0-1.0' },
  { name: 'Creative Commons Attribution 4.0', keyword: 'CC-BY-4.0' },
  { name: 'Creative Commons Attribution ShareAlike 4.0', keyword: 'CC-BY-SA-4.0' },
  { name: 'Do What The F*ck You Want To Public License', keyword: 'WTFPL' },
  { name: 'Educational Community License v2.0', keyword: 'ECL-2.0' },
  { name: 'Eclipse Public License 1.0', keyword: 'EPL-1.0' },
  { name: 'Eclipse Public License 2.0', keyword: 'EPL-2.0' },
  { name: 'European Union Public License 1.1', keyword: 'EUPL-1.1' },
  { name: 'GNU Affero General Public License v3.0', keyword: 'AGPL-3.0' },
  { name: 'GNU General Public License family', keyword: 'GPL' },
  { name: 'GNU General Public License v2.0', keyword: 'GPL-2.0' },
  { name: 'GNU General Public License v3.0', keyword: 'GPL-3.0' },
  { name: 'GNU Lesser General Public License family', keyword: 'LGPL' },
  { name: 'GNU Lesser General Public License v2.1', keyword: 'LGPL-2.1' },
  { name: 'GNU Lesser General Public License v3.0', keyword: 'LGPL-3.0' },
  { name: 'ISC License', keyword: 'ISC' },
  { name: 'LaTeX Project Public License v1.3c', keyword: 'LPPL-1.3c' },
  { name: 'Microsoft Public License', keyword: 'MS-PL' },
  { name: 'MIT License', keyword: 'MIT' },
  { name: 'Mozilla Public License 2.0', keyword: 'MPL-2.0' },
  { name: 'Open Software License 3.0', keyword: 'OSL-3.0' },
  { name: 'PostgreSQL License', keyword: 'PostgreSQL' },
  { name: 'SIL Open Font License 1.1', keyword: 'OFL-1.1' },
  { name: 'University of Illinois/NCSA Open Source License', keyword: 'NCSA' },
  { name: 'The Unlicense', keyword: 'Unlicense' },
  { name: 'zLib License', keyword: 'Zlib' }
];

scrapeLicenseInfo(licenses);