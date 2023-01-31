import * as path from "path";
import * as fs from "fs";
import { parse } from "csv-parse";
import { InvoiceData } from "./process-invoice";

const headers = [
  "N° Fattura",
  "Data",
  "Paziente ",
  "Visita",
  "Fattura",
  "Enpab 4% (=contributo integrativo)",
  "Marca da bollo",
  "Commissione",
  "Contributo soggettivo 5%",
  "Imposta sostitutiva (P.IVA 5%)",
  "Utile",
  "Tipo di Pagamento",
  "CF",
  "Tracciabilità",
];

function parseDate(data: string): string {
  const [month, day, year] = data.split("/");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/20${year}`;
}

export function parseCsvFile(): Promise<InvoiceData[]> {
  return new Promise(function (resolve, reject) {
    const csvFilePath = path.resolve(__dirname, "../fatture.csv");

    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

    parse(
      fileContent,
      {
        delimiter: ";",
        columns: headers,
      },
      (error, result: Record<string, string>[]) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        const invoces: InvoiceData[] = result
          .filter((r) => r["Data"] !== "Data")
          .map((r) => ({
            emisisonDate: parseDate(r["Data"]),
            invoiceNumber: parseInt(r["N° Fattura"]),
            taxCode: r["CF"],
            amount: parseFloat(r["Fattura"].replaceAll(',','.')),
          }));
        resolve(invoces);
      }
    );
  });
}
