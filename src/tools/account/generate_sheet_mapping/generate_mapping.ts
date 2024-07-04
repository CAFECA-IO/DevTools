import path from "path";
import Sheet from "@/tools/account/generate_sheet_mapping/sheet";
import BalanceSheet from "@/tools/account/generate_sheet_mapping/balance_sheet";
import IncomeStatementSheet from "@/tools/account/generate_sheet_mapping/income_statement";

const xlsxPath = path.resolve(__dirname, "../../../raw_data/tifrs-ci-ir.xls");
const generatedSheet = ["balance_sheet", "income_statement"];

generatedSheet.forEach((sheetName) => {
  const outputPath = path.resolve(
    __dirname,
    `../../../outputs/${sheetName}_mapping.json`,
  );

  let sheet: Sheet<unknown, unknown>;

  switch (sheetName) {
    case "balance_sheet":
      sheet = new BalanceSheet(xlsxPath, outputPath);
      break;
    case "income_statement":
      sheet = new IncomeStatementSheet(xlsxPath, outputPath);
      break;
    default:
      throw new Error(`Unknown sheet name: ${sheetName}`);
  }

  sheet.generateOutputData();
  sheet.saveOutputData();
});
