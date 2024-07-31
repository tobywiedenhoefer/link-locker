import Link from "../types/link.type";

export function filterLinkSubstring(link: Link, searchTerm: string): boolean {
  if (searchTerm.length === 0) {
    return true;
  }
  const queryColumns = [link.name, link.url, ...link.tags];
  const found = queryColumns.some((val) => {
    return val.includes(searchTerm);
  });
  return found;
}
