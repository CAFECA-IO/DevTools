import Node from "@/tools/account/generate_account_json/node";
import AccountElement from "@/tools/account/generate_account_json/account_element";
import determineTypeDebitLiquidity from "@/tools/account/generate_account_json/determine_type_debit_liquidity";
import { ROOT_LEVEL } from "@/constants/account";

function isForUser(node: Node, type: string, level: number) {
  const allowTypes = [
    "asset",
    "liability",
    "equity",
    "revenue",
    "cost",
    "income",
    "expense",
    "gainOrLoss",
    "otherComprehensiveIncome",
  ];

  if (
    node.children.length === 0 &&
    allowTypes.includes(type) &&
    level >= ROOT_LEVEL
  ) {
    return true;
  }

  return false;
}

function createAccountElement(
  node: Node,
  parent: Node,
  root: Node,
  type: string,
  debit: boolean,
  liquidity: boolean,
  forUser: boolean,
  level: number,
): AccountElement {
  const name = node.accountCName.trim();
  return new AccountElement(
    type,
    debit,
    liquidity,
    node.code,
    name,
    forUser,
    parent.code,
    root.code,
    level,
  );
}

function checkForDuplicateCodes(
  accounts: AccountElement[],
  doubleCheck: Set<string>,
): void {
  accounts.forEach((account) => {
    if (doubleCheck.has(account.code)) {
      // Info: (20240625 - Murky) Debugging Purpose
      // eslint-disable-next-line no-console
      console.log(`Double check duplicated code: ${account.code}`);
    }
    doubleCheck.add(account.code);
  });
}

export function createAccountElementsForSeederByBFS(
  rootNode: Node,
): AccountElement[] {
  const accountsForSeeder: AccountElement[] = [];
  const codeSet = new Set<string>();
  const doubleCheck = new Set<string>();

  const queue: {
    node: Node;
    parent: Node;
    root: Node;
    parentType: string | null;
    parentDebit: boolean | null;
    parentLiquidity: boolean | null;
    level: number;
  }[] = [];

  rootNode.children.forEach((child) =>
    queue.push({
      node: child,
      parent: child,
      root: child,
      parentType: null,
      parentDebit: null,
      parentLiquidity: null,
      level: 0,
    }),
  );

  while (queue.length > 0) {
    const {
      node,
      parent,
      root,
      parentType,
      parentDebit,
      parentLiquidity,
      level,
    } = queue.shift()!;

    const { type, debit, liquidity } = determineTypeDebitLiquidity(
      node,
      parentType,
      parentDebit,
      parentLiquidity,
    );
    const forUser = isForUser(node, type, level);

    const account = createAccountElement(
      node,
      parent,
      root,
      type,
      debit,
      liquidity,
      forUser,
      level,
    );

    if (!codeSet.has(account.code)) {
      accountsForSeeder.push(account);
      codeSet.add(account.code);
    } else {
      // Info: (20240625 - Murky) Debugging Purpose
      // eslint-disable-next-line no-console
      console.log(`Duplicated code: ${account.code}, name: ${account.name}`);
    }

    if (level >= ROOT_LEVEL) {
      node.children.forEach((child) =>
        queue.push({
          node: child,
          parent: node,
          root,
          parentType: type,
          parentDebit: debit,
          parentLiquidity: liquidity,
          level: level + 1,
        }),
      );
    } else {
      node.children.forEach((child) =>
        queue.push({
          node: child,
          parent: node,
          root: child,
          parentType: type,
          parentDebit: debit,
          parentLiquidity: liquidity,
          level: level + 1,
        }),
      );
    }
  }

  checkForDuplicateCodes(accountsForSeeder, doubleCheck);
  return accountsForSeeder;
}

export function createAccountElementsForSeederByDFS(rootNode: Node) {
  const accountsForSeeder: AccountElement[] = [];

  const codeSet = new Set<string>();
  function dfsCreateAccountElement(
    node: Node,
    parent: Node,
    root: Node,
    parentType: string | null,
    parentDebit: boolean | null,
    parentLiquidity: boolean | null,
    level: number = 0,
  ) {
    const { type, debit, liquidity } = determineTypeDebitLiquidity(
      node,
      parentType,
      parentDebit,
      parentLiquidity,
    );
    const forUser = isForUser(node, type, level);
    const account = createAccountElement(
      node,
      parent,
      root,
      type,
      debit,
      liquidity,
      forUser,
      level,
    );

    if (!codeSet.has(account.code)) {
      accountsForSeeder.push(account);
      codeSet.add(account.code);
    } else {
      // Info: (20240625 - Murky) Debugging Purpose
      // eslint-disable-next-line no-console
      console.log(`Duplicated code: ${account.code}, name: ${account.name}`);
    }

    node.children.forEach((child) =>
      dfsCreateAccountElement(
        child,
        node,
        root,
        type,
        debit,
        liquidity,
        level + 1,
      ),
    );
  }

  rootNode.children.forEach((child) =>
    dfsCreateAccountElement(child, rootNode, rootNode, null, null, null, 0),
  );

  // help me check if any code is duplicated
  const doubleCheck = new Set<string>();
  checkForDuplicateCodes(accountsForSeeder, doubleCheck);
  return accountsForSeeder;
}
