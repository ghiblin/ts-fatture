import { Page } from "puppeteer";
import { getErrorMessage } from "./get-error-message";

const LOGIN_PAGE = "https://sistemats4.sanita.finanze.it/simossHome/login.jsp";
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR = "#j_password";
const BUTTON_SELECTOR = "input[type=submit][name=conferma]";

export async function login(page: Page) {
  try {
    console.log(`page.goto: ${LOGIN_PAGE}`);
    await page.goto(LOGIN_PAGE);

    // wait for page loading
    console.log(`wait for selector '${USERNAME_SELECTOR}'`);
    await page.waitForSelector(USERNAME_SELECTOR);

    console.log(`typing username`);
    await page.type(USERNAME_SELECTOR, process.env.USERNAME);
    console.log(`typing password`);
    await page.type(PASSWORD_SELECTOR, process.env.PASSWORD);

    // wait for button
    console.log(`waiting for selector '${BUTTON_SELECTOR}'`);
    await page.waitForSelector(BUTTON_SELECTOR);
    console.log(`clicking on button '${BUTTON_SELECTOR}'`);
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
