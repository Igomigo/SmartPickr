import { SEARCH_URL } from "../constants/urls";

export const buildSearchUrl = (searchTerm: string) => {
  const encoded = encodeURIComponent(searchTerm.trim());
  return `${SEARCH_URL}/?query=${encoded}`;
};
