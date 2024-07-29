// eslint-disable-next-line import/no-named-as-default
import AccountElement from "@/tools/account/generate_account_json/account_element";

// 對應 parentCode, 如果是6100, name 前面都加上推銷費用
// 如果是6200,  name 前面都加上管理費用,  如果是6300,  name 前面都加上6300研究發展費用
export default function adjustAccountElements(
  accountElements: AccountElement[],
) {
  const adjustedAccountElements = accountElements.map((accountElement) => {
    if (accountElement.parentCode === "6100") {
      // eslint-disable-next-line no-param-reassign
      accountElement.name = `推銷費用 - ${accountElement.name}`;
    } else if (accountElement.parentCode === "6200") {
      // eslint-disable-next-line no-param-reassign
      accountElement.name = `管理費用 - ${accountElement.name}`;
    } else if (accountElement.parentCode === "6300") {
      // eslint-disable-next-line no-param-reassign
      accountElement.name = `研究發展費用 - ${accountElement.name}`;
    }
    return accountElement;
  });
  return adjustedAccountElements;
}
