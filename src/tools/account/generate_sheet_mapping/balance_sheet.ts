import Sheet from "@/tools/account/generate_sheet_mapping/sheet";
import AccountRow from "@/tools/account/generate_sheet_mapping/account_row";
import { countLeadingSpaces } from "@/lib/utils/common";

export default class BalanceSheet extends Sheet<
  { [key: string]: string | undefined },
  AccountRow
> {
  sheetName = "資產負債表";

  constructor(xlsxPath: string, outputPath: string) {
    super(xlsxPath, outputPath, "資產負債表");
  }

  generateOutputData(): AccountRow[] {
    this.outputData = this.rawSheet.map((row) => {
      const name = row["項目名稱"] || "";
      const leadingSpace = countLeadingSpaces(name);
      const code = row["項目代號"] || "";

      const accountRow = new AccountRow(code, name, leadingSpace);
      return accountRow;
    });

    return this.outputData;
  }
}
