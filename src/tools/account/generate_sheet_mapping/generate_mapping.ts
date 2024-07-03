import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import AccountRow from "@/tools/account/generate_sheet_mapping/account_row";
import { countLeadingSpaces, saveToJson } from "@/lib/utils/common";

xlsx.set_fs(fs);

const xlsxPath = path.resolve(__dirname, "../../../raw_data/tifrs-ci-ir.xls");
const workbook = xlsx.readFile(xlsxPath);
const balanceSheetFromXls = workbook.Sheets["資產負債表"];
const rawBalanceSheet = xlsx.utils.sheet_to_json(balanceSheetFromXls, {
  header: 0,
  raw: false,
}) as Array<{ [key: string]: string | undefined }>;

const accountRows: AccountRow[] = rawBalanceSheet.map((row) => {
  const name = row["項目名稱"] || "";
  const leadingSpace = countLeadingSpaces(name);
  const code = row["項目代號"] || "";

  const accountRow = new AccountRow(code, name, leadingSpace);
  return accountRow;
});

const outputPath = path.resolve(
  __dirname,
  "../../../outputs/account_rows.json",
);
saveToJson<AccountRow[]>(outputPath, accountRows);
