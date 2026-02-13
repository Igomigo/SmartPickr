import { JIJI_SEARCH_URL } from "../../../constants";

/**
 *
 * @param searchText
 * @param baseUrl - Optional base URL, defaults to jiji.ng search page
 * @returns {string} The URL for the search text
 * @description
 * This function returns the URL for the search text.
 * The URL is constructed using the search text and the base URL.
 * The base URL is the base URL for the Jiji search page.
 * The search text is the search text for the Jiji search page.
 */
const getSearchUrl = (
  searchText: string,
  baseUrl: string = JIJI_SEARCH_URL
): string => {
  // Encode the search text to handle spaces and special characters
  const encodedSearchText = encodeURIComponent(searchText);
  return `${baseUrl}?query=${encodedSearchText}`;
};

export default getSearchUrl;
