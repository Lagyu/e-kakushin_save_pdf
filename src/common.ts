import puppeteer, { Browser, Page } from 'puppeteer';
import { config } from 'dotenv';

config();

const CUSTOMER_CODE = process.env['customerCode'] || '';
const USER_ID = process.env['userId'] || '';
const USER_PW = process.env['password'] || '';
const YEAR = process.env['year'] || '';
const HEADLESS = process.env['headless'] === 'true' || false;
const FOLDER = process.env['downloadFolder'] || '';

const getBrowser = async (): Promise<Browser> => puppeteer.launch({
  headless: HEADLESS,
  ignoreHTTPSErrors: true,
});

const login = async (page: Page): Promise<void> => {
  const landingPageUrl = 'https://www.e-kakushin.com/login/';
  const goToLoginButtonSelector = 'button#login-page';
  const [, goToLoginButton] = await Promise.all([
    page.goto(landingPageUrl),
    page.waitForSelector(goToLoginButtonSelector),
  ]);

  const loginButtonSelector = 'button#btn-login';

  const [, loginButton] = await Promise.all([
    goToLoginButton?.click(),
    page.waitForSelector(loginButtonSelector),
  ]);

  await page.type('#customer-code', CUSTOMER_CODE);
  await page.type('#user-code', USER_ID);
  await page.type('input[name=password]', USER_PW);

  await Promise.all([
    loginButton?.click(),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
};

export {
  getBrowser, login, YEAR, FOLDER,
};
