import "dotenv/config";
import { Page } from "puppeteer";
import { confirm } from "./confirm";
import { getErrorMessage } from "./get-error-message";
import { insertInvoiceDetails } from "./insert-invoce-details";
import { insertInvoceInfo, InvoiceInfo } from "./insert-invoice-info";
// import { navigateToFormPage } from "./navigate-to-form-page";

export type InvoiceData = InvoiceInfo & { amount: number };

export async function processInvoice(page: Page, invoice: InvoiceData) {
  try {
    // await navigateToFormPage(page);

    await insertInvoceInfo(page, {
      invoiceNumber: invoice.invoiceNumber,
      emisisonDate: invoice.emisisonDate,
      taxCode: invoice.taxCode,
    });

    await insertInvoiceDetails(page, { amount: invoice.amount });

    await confirm(page);
  } catch (error: unknown) {
    console.error(getErrorMessage(error), (error as any).stack);
    // await page.pdf({ path: "error.pdf", format: "a4" });
  }
}
