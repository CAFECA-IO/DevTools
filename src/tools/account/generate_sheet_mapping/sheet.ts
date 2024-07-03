import { saveToJson } from "@/lib/utils/common";
import xlsx from "xlsx";
import fs from "fs";

export default abstract class Sheet<T, U> {
  xlsxPath: string;

  workbook: xlsx.WorkBook;

  sheet: xlsx.WorkSheet;

  rawSheet: T[];

  outputData: U[] = [];

  outputPath: string;

  constructor(xlsxPath: string, outputPath: string, sheetName: string) {
    xlsx.set_fs(fs);
    this.xlsxPath = xlsxPath;
    this.workbook = xlsx.readFile(xlsxPath);
    this.sheet = this.workbook.Sheets[sheetName];
    this.rawSheet = xlsx.utils.sheet_to_json(this.sheet, {
      header: 0,
      raw: false,
    }) as T[];
    this.outputPath = outputPath;
  }

  abstract generateOutputData(): U[];

  saveOutputData(): void {
    saveToJson<U[]>(this.outputPath, this.outputData);
  }
}
