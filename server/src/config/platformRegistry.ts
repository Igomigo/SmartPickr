import jijiScraper from "../scrapers/jiji";
import { mapperI } from "../services/scrape.service";

export const mapper: mapperI = { "jiji": jijiScraper };