import { Page } from 'puppeteer';
import path from 'node:path';
import * as os from 'os';
import {
  FOLDER, getBrowser, login, YEAR,
} from './common';

const goToStubsPage = async (page: Page): Promise<void> => {
  const goToStubsMenuButton = await page.waitForXPath('//button[contains(text(),"給与明細")]');
  const [, goToStubsListPageButton] = await Promise.all([
    goToStubsMenuButton?.click(),
    page.waitForXPath('//a[text()="明細照会"]'),
  ]);
  const [, submitYearButton, yearInput] = await Promise.all([
    goToStubsListPageButton?.click(),
    page.waitForXPath('//input[@value="年指定" and @type="button"]'),
    page.waitForXPath('//input[@value="年指定" and @type="button"]/../input[@type="text"]'),
  ]);
  while (await (await yearInput?.getProperty('value'))?.jsonValue() !== YEAR) {
    await yearInput?.type('');
    await yearInput?.type(YEAR);
  }
  await Promise.all([
    submitYearButton?.click(),
    page.waitForNavigation({ waitUntil: 'load' }),
  ]);

  // eslint-disable-next-line no-restricted-syntax
  for (const button of (await page.$x('//input[@value="閲覧" and @type="button"]'))) {
    await button.click();
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(10000);
  await page.browser().close();
};

const handler = async (): Promise<void> => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-underscore-dangle
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.join(os.homedir(), FOLDER),
  });
  await login(page);
  await goToStubsPage(page);
};

export { handler };
