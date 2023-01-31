import { Page } from "puppeteer";
import { getErrorMessage } from "./get-error-message";

const LOGIN_PAGE = "https://sistemats4.sanita.finanze.it/simossHome/login.jsp";
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR = "#j_password";
const BUTTON_SELECTOR = "input[type=submit][name=conferma]";

export async function login(page: Page) {
  try {
    await page.goto(LOGIN_PAGE);

    // wait for page loading
    await page.waitForSelector(USERNAME_SELECTOR);

    await page.type(USERNAME_SELECTOR, process.env.USERNAME);
    await page.type(PASSWORD_SELECTOR, process.env.PASSWORD);

    // wait for button
    await page.waitForSelector(BUTTON_SELECTOR);
    await page.click(BUTTON_SELECTOR);

    // check if credentials is valid
    let invalidCredentials = false;
    try {
      invalidCredentials = Boolean(
        (await page.content()).match(/Credenziali invalide/i)
      );
    } catch (error: unknown) {
      console.log(
        `checking for invalid credentials: ${getErrorMessage(error)}`
      );
    }
    if (invalidCredentials) {
      throw new Error("Invalid Credentials");
    }
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error(`Failed to login: ${message}`, (err as any).stack);
    throw err;
  }
}
