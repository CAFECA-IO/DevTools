# Dev-tools

## 目錄

- [1. generate-account-json](#1-generate-account-json)

## 1. generate_account_json

> 指令

```shell
npm run generate_account_json
```

> 功能

- 產生 account.json, 可以用來建立 ISunFa 的 account seeder
- 產生 account_tree.json, 可以用來看 ISunFa 的 account 的階層結構

> 事前準備

- 請至[IFRSs 後中英文會計項目對照表](https://mops.twse.com.tw/server-java/t203sb04)下載 tifrs-20200630, 個別, 一般的對照表
- 把檔名改成 `tifrs_accounts.csv`
- 把檔案放到 `src/raw_data` 資料夾
- 執行指令
- 結果會出現在 `src/outputs` 資料夾

## 2. generate_sheet_mapping

> 指令

```shell
npm run generate_sheet_mapping
```

> 功能

- 產生 sheet_mapping.json, 可以用來建立 ISunFa 的 sheet_mapping seeder

> 事前準備

- 前往[公開資訊觀測站XBRL財報建檔工具暨分類標準下載](https://siitest.twse.com.tw/nas/taxonomy/taxonomy.html)下載[EXCEL_ifrs.zip](https://siitest.twse.com.tw/nas/taxonomy/EXCEL_ifrs.zip)
- 解壓縮之後找到`/tifrs-20200630/tifrs-ci-ir-2020-06-30.xls` 並把他改名成`tifrs-ci-ir.xls`後放在`src/raw_data`資料夾
- 執行指令
- 結果會出現在 `src/outputs` 資料夾
