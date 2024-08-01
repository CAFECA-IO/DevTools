import Node from "@/tools/account/generate_account_json/node";

function determineGainLossProfit(currentEName: string): string {
  const indexOfGain = currentEName.toLowerCase().indexOf("gain");
  const indexOfLoss = currentEName.toLowerCase().indexOf("loss");

  if (indexOfGain !== -1 && indexOfLoss !== -1) {
    return indexOfGain < indexOfLoss ? "gain" : "loss";
  }

  if (indexOfGain !== -1) return "gain";
  if (indexOfLoss !== -1) return "loss";

  return "profit";
}

function determineEquityLiability(
  currentEName: string,
  elementId: string,
): string {
  if (currentEName.toLowerCase() === "liabilities and equity") return "other";
  if (
    currentEName.toLowerCase().includes("equity") &&
    !currentEName.toLowerCase().includes("liabilities")
  )
    return "equity";
  if (
    currentEName.toLowerCase().includes("liability") ||
    currentEName.toLowerCase().includes("liabilities")
  ) {
    return currentEName.toLowerCase().includes("non-current") ||
      elementId.toLowerCase().includes("noncurrent")
      ? "nonCurrentLiability"
      : "currentLiability";
  }
  return "other";
}

function determineAsset(currentEName: string, elementId: string): string {
  return currentEName.toLowerCase().includes("non-current") ||
    elementId.toLowerCase().includes("noncurrent")
    ? "nonCurrentAsset"
    : "currentAsset";
}

function determineCategory(node: Node): string {
  const currentEName = node.accountEName.toLowerCase();
  const currentElementId = node.elementId.toLowerCase();

  if (node.reportKind === "現金流量表") return "cashFlow";
  if (node.reportKind === "權益變動表") return "changeInEquity";

  if (currentEName.toLowerCase().includes("comprehensive"))
    return "otherComprehensiveIncome";

  if (
    currentEName.toLowerCase().includes("gain") ||
    currentEName.toLowerCase().includes("loss") ||
    currentEName.toLowerCase().includes("profit")
  ) {
    return determineGainLossProfit(currentEName.toLowerCase());
  }

  if (currentEName.toLowerCase().includes("income")) return "income";
  if (currentEName.toLowerCase().includes("expense")) return "expense";
  if (currentEName.toLowerCase().includes("cost")) return "cost";
  if (currentEName.toLowerCase().includes("revenue")) return "revenue";

  if (
    currentEName.toLowerCase().includes("equity") ||
    currentEName.toLowerCase().includes("liability") ||
    currentEName.toLowerCase().includes("liabilities")
  ) {
    return determineEquityLiability(
      currentEName.toLowerCase(),
      currentElementId,
    );
  }

  if (currentEName.toLowerCase().includes("asset")) {
    return determineAsset(currentEName.toLowerCase(), currentElementId);
  }

  return "other";
}

function getDefaultTypeDebitLiquidityBaseOnCategoryAndParent(
  category: string,
  parentType: string | null,
  parentDebit: boolean | null,
  parentLiquidity: boolean | null,
  node: Node,
) {
  const defaultValues = {
    type: parentType === "other" ? null : parentType,
    debit: parentDebit,
    liquidity: parentType === "other" ? null : parentLiquidity,
  };

  let returnValue: {
    type: string;
    debit: boolean;
    liquidity: boolean;
  };
  switch (category) {
    case "changeInEquity":
    case "cashFlow":
    case "otherComprehensiveIncome":
    case "income":
    case "revenue":
      returnValue = {
        type: defaultValues.type || category,
        debit: defaultValues.debit ?? false,
        liquidity: defaultValues.liquidity ?? true,
      };
      break;
    case "gain":
    case "profit":
      returnValue = {
        type: defaultValues.type || "gainOrLoss",
        debit: defaultValues.debit ?? false,
        liquidity: defaultValues.liquidity ?? true,
      };
      break;
    case "loss":
      returnValue = {
        type: defaultValues.type || "gainOrLoss",
        debit: defaultValues.debit ?? true,
        liquidity: defaultValues.liquidity ?? true,
      };
      break;
    case "expense":
    case "cost":
      returnValue = {
        type: defaultValues.type || category,
        debit: defaultValues.debit ?? true,
        liquidity: defaultValues.liquidity ?? true,
      };
      break;
    case "equity":
      returnValue = {
        type: defaultValues.type || "equity",
        debit: defaultValues.debit ?? false,
        liquidity: defaultValues.liquidity ?? false,
      };
      break;
    case "nonCurrentLiability":
    case "currentLiability":
      returnValue = {
        type: defaultValues.type || "liability",
        debit: defaultValues.debit ?? false,
        liquidity: category === "currentLiability",
      };
      break;
    case "nonCurrentAsset":
    case "currentAsset":
      returnValue = {
        type: defaultValues.type || "asset",
        debit: defaultValues.debit ?? true,
        liquidity: category === "currentAsset",
      };
      break;
    default:
      returnValue = {
        type: defaultValues.type || "other",
        debit: defaultValues.debit ?? true,
        liquidity: defaultValues.liquidity ?? true,
      };
      break;
  }
  if (
    (node.accountCName.includes("備抵") ||
      node.accountCName.includes("累計") ||
      node.accountCName.includes("退回") ||
      node.accountCName.includes("折讓")) &&
    !node.accountCName.includes("減損迴轉")
  ) {
    returnValue.debit = !returnValue.debit;
  }

  // Info: (20240709 - Murky) 損失應該要是debit
  if (
    (/損失$/.test(node.accountCName) ||
      /損失\(利益\)$/.test(node.accountCName)) &&
    !/利益及損失$/.test(node.accountCName)
  ) {
    returnValue.debit = true;
  }

  // Info: (20240709 - Murky) 利益應該要是credit
  if (/利益$/.test(node.accountCName)) {
    returnValue.debit = false;
  }
  return returnValue;
}

export default function determineTypeDebitLiquidity(
  node: Node,
  parentType: string | null,
  parentDebit: boolean | null,
  parentLiquidity: boolean | null,
) {
  const category = determineCategory(node);
  const defaultValue = getDefaultTypeDebitLiquidityBaseOnCategoryAndParent(
    category,
    parentType,
    parentDebit,
    parentLiquidity,
    node,
  );
  return defaultValue;
}
