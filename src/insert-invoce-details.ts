import { Page } from "puppeteer";
import { getErrorMessage } from "./get-error-message";
import {
  checkErrors,
  clickButton,
  openSelect,
  selectOption,
  typeInput,
} from "./utils";

type InvoiceDetails = {
  amount: number;
};

const TYPE_POS = 3;
const AMOUNT_POS = 4;
const VAT_POS = 7;

const FIELDSET_PATH = "//fieldset[contains(., 'Dettaglio di spesa')]";
const INPUT_PATH = (pos: number) => `(//table//input)[${pos}]`;
const ADD_PARH = "Aggiungi";
const NEXT_PATH = "Avanti";

const TYPE_OPTION = "SP - Prestazioni sanitarie";

export async function insertInvoiceDetails(
  page: Page,
  { amount }: InvoiceDetails
) {
  try {
    console.log(`Waiting for fieldset select...`);
    await page.waitForXPath(FIELDSET_PATH);

    // await page.waitForXPath(INPUT_PATH(TYPE_POS));
    console.log(`Clicking on type select...`);
    await openSelect(page, INPUT_PATH(TYPE_POS));
    console.log(`Selecting option '${TYPE_OPTION}'`);
    await selectOption(page, TYPE_OPTION);

    console.log(`Typing amount ${amount}...`);
    await typeInput(
      page,
      INPUT_PATH(AMOUNT_POS),
      amount.toFixed(2).replace(".", ",")
    );

    console.log(`Typing VAT rate...`);
    await typeInput(page, INPUT_PATH(VAT_POS), "0");

    console.log(`Clicking add button...`);
    await clickButton(page, ADD_PARH);

    await page.waitForNavigation();

    console.log(`Clicking next button...`);
    await clickButton(page, NEXT_PATH);

    await checkErrors(page);

    // console.log(`Waiting for navigation...`);
    // await page.waitForNavigation();
  } catch (error: unknown) {
    console.error(
      `Failed to insert invoice details: ${getErrorMessage(error)}`,
      (error as any).stack
    );
    throw error;
  }
}
