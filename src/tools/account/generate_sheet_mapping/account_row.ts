export default class AccountRow {
  code: string;

  name: string;

  indent: number;

  constructor(code: string, name: string, indent: number) {
    this.code = code;
    this.name = name.trim();
    this.indent = indent;
  }
}
