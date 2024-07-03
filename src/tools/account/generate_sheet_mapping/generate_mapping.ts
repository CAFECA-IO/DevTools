import xlsx from "xlsx";
import fs from 'fs';
import path from "path";
xlsx.set_fs(fs)

const xlsxPath = path.resolve(__dirname, '../../raw_data/tifrs-ci-ir.xls');
const workbook = xlsx.readFile(xlsxPath);
console.log(workbook.SheetNames);