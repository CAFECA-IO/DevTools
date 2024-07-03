import fs from "fs";

export function countLeadingSpaces(str: string) {
  // Info: (20240625 - Murky) 資料內有全形空格
  // eslint-disable-next-line no-irregular-whitespace
  const spaceCount = str.search(/\S/);
  return spaceCount;
}

export function saveToJson<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
