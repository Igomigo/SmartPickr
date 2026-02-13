/**
 * Returns the actual item like product title text, etc
 */
export const getSingleItemFromSelector = (selector: string) => {
  return document.querySelector(selector)?.textContent.trim();
};

export const getAllItemsFromSelector = (selector: string) => {
  return Array.from(document.querySelectorAll(selector));
}