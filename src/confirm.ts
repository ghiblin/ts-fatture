import { Page } from "puppeteer";
import { checkErrors, clickButton } from "./utils";

export async function confirm(page: Page) {
  console.log(`Confirming...`);
  await clickButton(page, "Conferma");

  console.log(`Checking for errors...`);
  await checkErrors(page);

  // console.log(`Wating for navigation...`);
  // await page.waitForNavigation();
}
