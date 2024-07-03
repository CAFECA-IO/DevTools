export default class Node {
  code: string;

  reportKind: string;

  accountCName: string;

  accountEName: string;

  elementId: string;

  children: Node[] = [];

  constructor(
    reportKind: string,
    code: string,
    accountCName: string,
    accountEName: string,
    elementId: string,
  ) {
    this.code = code;
    this.reportKind = reportKind;
    this.accountCName = accountCName;
    this.accountEName = accountEName;
    this.elementId = elementId;
  }
}
