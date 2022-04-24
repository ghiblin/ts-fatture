import { Page } from "puppeteer";
import { getErrorMessage } from "./get-error-message";

const SELECTMENU_OPTIONS_PATH = (option: string) =>
  `//li[contains(@class,"ui-selectonemenu-item") and text() = "${option}"]`;
const ERROR_PATH = "//div[contains(@style,'color: red')]";
const BUTTON_PATH = (label: string) =>
  `//input[@type="submit" and @value="${label}"]`;

export async function selectOption(page: Page, label: string) {
  const options = await page.$x(SELECTMENU_OPTIONS_PATH(label));
  if (!options.length) throw new Error(`Option '${label}' not found`);
  await options[0].click();
}

export async function typeInput(page: Page, xpath: string, value: string) {
  await page.waitForXPath(xpath);
  const inputs = await page.$x(xpath);
  if (!inputs.length) {
    throw new Error(`Failed to retrieve input with xpath '${xpath}'`);
  }
  await inputs[0].type(value);
}

export async function openSelect(page: Page, xpath: string) {
  await page.waitForXPath(xpath);
  const selects = await page.$x(xpath);
  if (!selects.length) {
    throw new Error(`Failed to retrieve select with xpath '${xpath}'`);
  }
  await selects[0].click();
}

export async function clickButton(page: Page, label: string) {
  const buttons = await page.$x(BUTTON_PATH(label));
  if (!buttons.length) {
    throw new Error(`Buttons with path '${label}' not found`);
  }
  await buttons[0].click();
}

export async function checkErrors(page: Page) {
  let message: string | undefined;
  try {
    await page.waitForXPath(ERROR_PATH, { timeout: 1000 });
    const errors = await page.$x(ERROR_PATH);
    const handle = await errors[0].getProperty("textContent");
    message = await handle.jsonValue();
  } catch (err: unknown) {
    console.log(`checking for errors: ${getErrorMessage(err)}`);
  }
  if (typeof message === "string" && message.trim()) {
    console.log(`Find error: ${message}`);
    throw new Error(message);
  }
}
