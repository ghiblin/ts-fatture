import { Page } from "puppeteer";

const MENU_SELECTOR = '#navlist a[title="Gestione dati spesa 730"]';
export async function navigateToFormPage(page: Page) {
  console.log(`navigate to form page....`);
  await page.waitForSelector(MENU_SELECTOR);

  // Click "Gestione dati spesa 730"
  const links = await page.$$(MENU_SELECTOR);
  if (!links.length) {
    throw new Error(`Failed to find link '${MENU_SELECTOR}'`);
  }
  console.log(`Clicking on link 'Gestione dati spesa 730'...`);
  await links[0].click();
}
