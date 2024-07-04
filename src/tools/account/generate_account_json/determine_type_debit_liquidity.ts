import Node from "@/tools/account/generate_account_json/node";

function determineGainLossProfit(currentEName: string): string {
  const indexOfGain = currentEName.indexOf("gain");
  const indexOfLoss = currentEName.indexOf("loss");

  if (indexOfGain !== -1 && indexOfLoss !== -1) {
    return indexOfGain < indexOfLoss ? "gain" : "loss";
  }

  if (indexOfGain !== -1) return "gain";
  if (indexOfLoss !== -1) return "loss";

  return "profit";
}

function determineEquityLiability(currentEName: string): string {
  if (currentEName.includes("equity")) return "equity";
  if (currentEName.includes("liability")) {
    return currentEName.includes("non-current")
      ? "nonCurrentLiability"
      : "currentLiability";
  }
  return "other";
}

function determineAsset(currentEName: string): string {
  return currentEName.includes("non-current")
    ? "nonCurrentAsset"
    : "currentAsset";
}

function determineCategory(node: Node): string {
  const currentEName = node.accountEName.toLowerCase();

  if (node.reportKind === "現金流量表") return "cashFlow";
  if (node.reportKind === "權益變動表") return "changeInEquity";

  if (currentEName.includes("comprehensive")) return "otherComprehensiveIncome";

  if (
    currentEName.includes("gain") ||
    currentEName.includes("loss") ||
    currentEName.includes("profit")
  ) {
    return determineGainLossProfit(currentEName);
  }

  if (currentEName.includes("income")) return "income";
  if (currentEName.includes("expense")) return "expense";
  if (currentEName.includes("cost")) return "cost";
  if (currentEName.includes("revenue")) return "revenue";

  if (currentEName.includes("equity") || currentEName.includes("liability")) {
    return determineEquityLiability(currentEName);
  }

  if (currentEName.includes("asset")) {
    return determineAsset(currentEName);
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
    type: parentType,
    debit: parentDebit,
    liquidity: parentLiquidity,
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
        liquidity: defaultValues.liquidity ?? category === "currentLiability",
      };
      break;
    case "nonCurrentAsset":
    case "currentAsset":
      returnValue = {
        type: defaultValues.type || "asset",
        debit: defaultValues.debit ?? true,
        liquidity: defaultValues.liquidity ?? category === "currentAsset",
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
