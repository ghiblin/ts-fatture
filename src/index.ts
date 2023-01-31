import * as puppeteer from "puppeteer";
import { getErrorMessage } from "./get-error-message";
import { login } from "./login";
import { navigateToFormPage } from "./navigate-to-form-page";
import { parseCsvFile } from "./parse-csv-file";
import { processInvoice } from "./process-invoice";

async function main() {
  const invoices = await parseCsvFile();
  console.log(`invoices: ${JSON.stringify(invoices, null, 2)}`);

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  try {
    await login(page);

    await navigateToFormPage(page);

    for (const invoice of invoices) {
      console.log(`processing ${JSON.stringify(invoice, null, 2)}`);
      await processInvoice(page, invoice);
    }
  } catch (error: unknown) {
    console.error(getErrorMessage(error), (error as any).stack);
    // await page.pdf({ path: "error.pdf", format: "a4" });
  }

  await page.waitForTimeout(5000);
  await browser.close();
}
main();
