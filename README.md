# ISunFa 的小工具集

## 目錄

- [1. generate-account-json](#1-generate-account-json)

## 1. generate-account-json

> 指令

```shell
npm run generate-account-json
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
