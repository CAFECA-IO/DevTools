// ToDo (20240625 - Murky): This file is too messy and unclean, need to refactor
// Info (20240625 - Murky): Two class for different purpose
/* eslint-disable max-classes-per-file */
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import Node from "@/tools/account/generate_account_json/node";
import AccountElement from "@/tools/account/generate_account_json/account_element";
import buildAccountTree from "@/tools/account/generate_account_json/build_account_tree";
import { createAccountElementsForSeederByBFS } from "@/tools/account/generate_account_json/create_account_elements_for_seeder";
import { saveToJson } from "@/lib/utils/common";

const csvPath = path.resolve(__dirname, "../../../raw_data/tifrs_accounts.csv");
const treeJsonPath = path.resolve(
  __dirname,
  "../../../outputs/account_tree.json",
);
const accountElementsJsonPath = path.resolve(
  __dirname,
  "../../../outputs/account.json",
);

function parseCSV(filePath: string) {
  return new Promise((resolve, reject) => {
    const records: string[][] = [];
    fs.createReadStream(filePath)
      .pipe(
        parse({
          encoding: "utf8",
          delimiter: ",",
          trim: false,
          skip_empty_lines: true,
        }),
      )
      .on("data", (data) => records.push(data))
      .on("end", () => resolve(records))
      .on("error", (err) => reject(err));
  });
}

parseCSV(csvPath)
  // Info: (20240625 - Murky) data 是 string[][], 但是用promise的時候typescript偵測不到type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .then((data: any) => {
    const tree = buildAccountTree(data);
    return tree;
  })
  .then((tree: Node) => {
    saveToJson<Node>(treeJsonPath, tree);
    const accountElements = createAccountElementsForSeederByBFS(tree);
    return accountElements;
  })
  .then((accountElements: AccountElement[]) => {
    saveToJson<AccountElement[]>(accountElementsJsonPath, accountElements);
  })
  .catch((err) => {
    // Debug: (20240625 - Murky) Debug
    // eslint-disable-next-line no-console
    console.error(err);
  });
