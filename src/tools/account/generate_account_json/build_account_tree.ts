import Node from "@/tools/account/generate_account_json/node";
import {
  MISSING_CODE_MARKERS,
  SPECIAL_ACCOUNT_ASSIGNMENT,
  SPECIAL_ACCOUNT_MAPPING,
} from "@/constants/account";
import { countLeadingSpaces } from "@/lib/utils/common";

export default function buildAccountTree(records: string[][]): Node {
  const root = new Node("", "", "", "", "");
  const maxLength = records.length;
  let counter = 1;
  function createNode(node: Node, currentLeadingSpaces: number) {
    while (counter < maxLength) {
      const currentLine = records[counter];
      const currentLineLeadingSpaces = countLeadingSpaces(currentLine[7]);

      if (currentLineLeadingSpaces <= currentLeadingSpaces) {
        return;
      }

      const child = new Node(
        currentLine[5],
        currentLine[6],
        currentLine[7],
        currentLine[8],
        currentLine[9],
      );
      node.children.push(child);

      counter += 1;
      createNode(child, currentLineLeadingSpaces);
    }
  }

  function flatLiabilitiesAndEquity(node: Node) {
    const liabilityAndEquityNode = node.children.find(
      (n) => n.elementId === "ifrs-full_EquityAndLiabilitiesAbstract",
    );

    if (!liabilityAndEquityNode) {
      return;
    }
    for (let i = 0; i < liabilityAndEquityNode?.children.length || 0; i += 1) {
      const child = liabilityAndEquityNode.children.shift();
      if (child) {
        node.children.push(child);
      }
    }
  }

  function assignMissingCode(node: Node, depth: number): string {
    node.children.forEach((child) => assignMissingCode(child, depth + 1));

    if (node.code.length > 0) {
      return node.code;
    }

    let totalNode = node.children.find(
      (child) =>
        child.accountCName.trim() === `${node.accountCName.trim()}合計` ||
        child.accountCName.trim() === `${node.accountCName.trim()}總計` ||
        child.accountCName.trim() === `${node.accountCName.trim()}淨額` ||
        child.accountCName.trim() === `${node.accountCName.trim()}總額`,
    );
    let mappingCode: string | undefined;

    if (!totalNode) {
      const mappingName = SPECIAL_ACCOUNT_MAPPING.get(node.accountCName.trim());
      totalNode = node.children.find(
        (child) => child.accountCName.trim() === mappingName,
      );
      mappingCode =
        totalNode?.code ||
        SPECIAL_ACCOUNT_ASSIGNMENT.get(node.accountCName.trim()) ||
        undefined;
    }

    const childCode = assignMissingCode(node.children[0], depth + 1);
    const code =
      totalNode?.code ||
      mappingCode ||
      `${childCode.slice(0, 4)}${MISSING_CODE_MARKERS[depth]}`;

    // Info: (20240625 - Murky) I need to change the code from original node
    // eslint-disable-next-line no-param-reassign
    node.code = code;

    // Info: (20240625 - Murky) I need to change the code from original node
    // eslint-disable-next-line no-param-reassign
    node.children = node.children.filter((child) => child !== totalNode);
    return childCode;
  }

  createNode(root, -1);
  flatLiabilitiesAndEquity(root);
  assignMissingCode(root, 0);
  return root;
}
