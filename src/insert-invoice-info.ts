import { Page } from "puppeteer";
import { getErrorMessage } from "./get-error-message";
import {
  checkErrors,
  clickButton,
  openSelect,
  selectOption,
  typeInput,
} from "./utils";

export type InvoiceInfo = {
  emisisonDate: string;
  invoiceNumber: number;
  taxCode: string;
};

const VAT_NUMBER_POS = 1;
const EMISSION_DATE_POS = 2;
const DISPOSITIVO_POS = 3;
const DOCUMENT_NUMBER_POS = 4;
const PAYMENT_DATE_POS = 6;
const TAX_CODE_POS = 7;
const TRACKING_POS = 8;
const DOCUMENT_TYPE_POS = 9;

const LINK_PATH = "//a[contains(., 'Inserimento spese sanitarie')]";
const INPUT_PATH = (pos: number) => `(//table//input)[${pos}]`;
const NEXT_PATH = "Avanti";

export async function insertInvoceInfo(page: Page, info: InvoiceInfo) {
  try {
    console.log(`wait for XPath ${LINK_PATH}`);
    await page.waitForXPath(LINK_PATH);

    console.log(`Looking for link 'Inserimento spese sanitarie'...`);
    const links = await page.$x(LINK_PATH);

    if (!links.length) {
      throw new Error(`Link with path '${LINK_PATH}' not found`);
    }
    console.log(`Clicking on 'Inserimento spese sanitarie'...`);
    await links[0].click();

    console.log(`Waiting for navigation...`);
    await page.waitForNavigation();

    // Insert VAT Number
    console.log(`Typing Vat number ${process.env.VAT_NUMBER}...`);
    await typeInput(page, INPUT_PATH(VAT_NUMBER_POS), process.env.VAT_NUMBER);
    // Insert Emission Date
    console.log(`Typing emission date ${info.emisisonDate}...`);
    await typeInput(page, INPUT_PATH(EMISSION_DATE_POS), info.emisisonDate);

    // Insert Dispositivo
    console.log(`Typing dispositivo 1...`);
    await typeInput(page, INPUT_PATH(DISPOSITIVO_POS), "1");

    // Insert Document Number
    console.log(`Typing document number ${info.invoiceNumber}...`);
    await typeInput(
      page,
      INPUT_PATH(DOCUMENT_NUMBER_POS),
      String(info.invoiceNumber)
    );

    // Insert Payment Date
    console.log(`Typing payment date ${info.emisisonDate}...`);
    await typeInput(page, INPUT_PATH(PAYMENT_DATE_POS), info.emisisonDate);

    const taxCodeInput = await page.$x(INPUT_PATH(TAX_CODE_POS));
    taxCodeInput[0].click();
    await page.waitForTimeout(1000);

    // Insert tax code
    console.log(`Typing tax code ${info.taxCode}...`);
    // await typeInput(page, INPUT_PATH(TAX_CODE_POS), "");
    await typeInput(page, INPUT_PATH(TAX_CODE_POS), info.taxCode);

    // Select Tracking: it's not a select
    console.log(`Clicking on tracking select...`);
    await openSelect(page, INPUT_PATH(TRACKING_POS));
    console.log(`Selecting option 'SI'...`);
    await selectOption(page, "SI");

    // Select Document Type
    console.log(`Clicking on document type...`);
    await openSelect(page, INPUT_PATH(DOCUMENT_TYPE_POS));
    console.log(`Selection option 'Fattura'...`);
    await selectOption(page, "Fattura");

    console.log(`Clicking next button...`);
    await clickButton(page, NEXT_PATH);

    console.log(`Checking for errors...`);
    await checkErrors(page);

    // console.log(`Waiting for navigation...`);
    // await page.waitForNavigation();
  } catch (error: unknown) {
    console.error(
      `Failed to insert info: ${getErrorMessage(error)}`,
      (error as any).stack
    );
    throw error;
  }
}
