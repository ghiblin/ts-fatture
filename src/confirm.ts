import { Page } from "puppeteer";
import { checkErrors, clickButton } from "./utils";

export async function confirm(page: Page) {
  await clickButton(page, "Conferma");

  await checkErrors(page);
}
