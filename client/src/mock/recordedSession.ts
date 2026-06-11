import type { RecordedEvent, Product, Review, IComparison, IRecommendation } from "../stream/types";

/**
 * A recorded SSE session for "iphone 16 pro max" on Jiji.
 *
 * Hand-built from the real data shapes + status wording the server emits, so we
 * can develop the whole live experience without scraping. Images are stable
 * placeholders for now (picsum); real product images arrive when we wire to the
 * server in Phase 6. Status strings mirror scrape.service.ts exactly.
 */

const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/640`;

/* A pool of realistic seller reviews; each product draws a different-sized
   slice so we can test the popover's reviews list + "show all" expansion. */
const REVIEW_POOL: Review[] = [
  { comment: "Clean business, the phone was exactly as described. Will buy again." },
  { comment: "Trustworthy seller, fast delivery to Lagos. Highly recommend." },
  { comment: "Sealed and genuine, very happy with the purchase." },
  { comment: "Met at a safe spot, everything checked out. Smooth deal." },
  { comment: "Communication was great and very sincere throughout." },
  { comment: "Got my phone same day, battery health was exactly as stated." },
  { comment: "Genuine vendor — the device looks even better in person." },
  { comment: "Bought and delivered to Abuja without any stress. Recommended." },
  { comment: "He's patient and answered all my questions before I paid." },
  { comment: "Fair price and no hidden charges. Solid experience overall." },
  { comment: "Thank you so much for your kind words! Looking forward to serving you again." },
  { comment: "The packaging was neat and all the accessories were complete." },
  { comment: "I was skeptical at first but this seller is the real deal." },
  { comment: "Phone came with full warranty, everything working perfectly." },
  { comment: "Reliable and customer friendly. Five stars from me." },
  { comment: "Delivery took a little longer than expected, but the phone is great." },
  { comment: "Very professional — sent me a video of the phone before payment." },
  { comment: "Bought an iPhone from him last month, still working perfectly." },
  { comment: "Honest about the condition, no surprises when it arrived." },
  { comment: "Pleasure doing business. Will refer my friends to him." },
  { comment: "We appreciate your patronage! Don't hesitate to reach out anytime." },
  { comment: "The price was the best I found after checking many sellers." },
  { comment: "Smooth transaction, the rep that delivered was polite." },
  { comment: "Top notch service, the device is 100% original." },
  { comment: "A bit pricey but worth it for the peace of mind." },
];

const pickReviews = (count: number, offset = 0): Review[] =>
  Array.from({ length: count }, (_, i) => REVIEW_POOL[(offset + i) % REVIEW_POOL.length]);

const PRODUCTS: Product[] = [
  {
    productTitle: "New Apple iPhone 16 Pro Max 256GB — White Titanium",
    productPrice: "₦ 2,000,000",
    productImages: [img("picky-1a"), img("picky-1b"), img("picky-1c")],
    productDescription: "Brand new sealed iPhone 16 Pro Max, 256GB, White Titanium. Full warranty.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Brand New", "Internal Storage": "256 GB", Color: "White Titanium" },
    productReviews: pickReviews(22, 0),
    productRatingsScore: "4.9",
    productReviewsTotal: 22,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-white-1",
  },
  {
    productTitle: "Apple iPhone 16 Pro Max 256GB — Natural Titanium",
    productPrice: "₦ 1,850,000",
    productImages: [img("picky-2a"), img("picky-2b")],
    productDescription: "Brand new iPhone 16 Pro Max, Natural Titanium, 256GB. Best price in Ikeja.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Brand New", "Internal Storage": "256 GB", Color: "Natural Titanium" },
    productReviews: pickReviews(12, 5),
    productRatingsScore: "4.7",
    productReviewsTotal: 12,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-natural-2",
  },
  {
    productTitle: "iPhone 16 Pro Max 512GB — Desert Titanium",
    productPrice: "₦ 2,300,000",
    productImages: [img("picky-3a"), img("picky-3b"), img("picky-3c")],
    productDescription: "Sealed 512GB Desert Titanium. Apple Nigeria warranty included.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Brand New", "Internal Storage": "512 GB", Color: "Desert Titanium" },
    productReviews: pickReviews(9, 11),
    productRatingsScore: "4.8",
    productReviewsTotal: 9,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-desert-3",
  },
  {
    productTitle: "UK Used iPhone 16 Pro Max 256GB — Black Titanium",
    productPrice: "₦ 1,650,000",
    productImages: [img("picky-4a"), img("picky-4b")],
    productDescription: "Clean UK used, 256GB Black Titanium. 98% battery health, no scratches.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Foreign Used", "Internal Storage": "256 GB", Color: "Black Titanium", "Battery Health": "98%" },
    productReviews: pickReviews(18, 3),
    productRatingsScore: "4.5",
    productReviewsTotal: 18,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-uk-used-4",
  },
  {
    productTitle: "Apple iPhone 16 Pro Max 1TB — Natural Titanium",
    productPrice: "₦ 2,650,000",
    productImages: [img("picky-5a"), img("picky-5b"), img("picky-5c")],
    productDescription: "Brand new 1TB for the power users. Sealed, full warranty.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Brand New", "Internal Storage": "1 TB", Color: "Natural Titanium" },
    productReviews: pickReviews(8, 14),
    productRatingsScore: "4.6",
    productReviewsTotal: 8,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-1tb-5",
  },
  {
    productTitle: "iPhone 16 Pro Max 256GB — White (Clean)",
    productPrice: "₦ 1,720,000",
    productImages: [img("picky-6a"), img("picky-6b")],
    productDescription: "Nigerian used, barely 2 months. 256GB White, no issues, full accessories.",
    productSpecs: { Brand: "Apple", Model: "iPhone 16 Pro Max", Condition: "Nigerian Used", "Internal Storage": "256 GB", Color: "White Titanium", "Battery Health": "100%" },
    productReviews: pickReviews(14, 9),
    productRatingsScore: "4.3",
    productReviewsTotal: 14,
    productPageUrl: "https://jiji.ng/listing/iphone-16-pro-max-clean-6",
  },
];

const COMPARISON: IComparison[] = [
  {
    productTitle: PRODUCTS[0].productTitle,
    productPrice: PRODUCTS[0].productPrice,
    productImages: PRODUCTS[0].productImages,
    parsedPrice: "2000000",
    reviewSentiment: "Very Positive",
    reviewSummary: "Buyers consistently call the seller trustworthy with sealed, genuine units and fast delivery.",
    reviewCount: "22",
    keySpecs: { Condition: "Brand New", Storage: "256 GB", Color: "White Titanium" },
    pros: ["Sealed & warranty", "Strong seller reputation", "Fair price for new"],
    cons: ["Not the cheapest"],
    reliabilityScore: 92,
  },
  {
    productTitle: PRODUCTS[1].productTitle,
    productPrice: PRODUCTS[1].productPrice,
    productImages: PRODUCTS[1].productImages,
    parsedPrice: "1850000",
    reviewSentiment: "Positive",
    reviewSummary: "Good price and smooth pickups, but a thinner review history.",
    reviewCount: "12",
    keySpecs: { Condition: "Brand New", Storage: "256 GB", Color: "Natural Titanium" },
    pros: ["Lowest price for new", "Same-day pickup"],
    cons: ["Fewer reviews than top seller"],
    reliabilityScore: 84,
  },
  {
    productTitle: PRODUCTS[2].productTitle,
    productPrice: PRODUCTS[2].productPrice,
    productImages: PRODUCTS[2].productImages,
    parsedPrice: "2300000",
    reviewSentiment: "Positive",
    reviewSummary: "Praised for stocking rare configs, limited but solid feedback.",
    reviewCount: "9",
    keySpecs: { Condition: "Brand New", Storage: "512 GB", Color: "Desert Titanium" },
    pros: ["512GB option", "Warranty included"],
    cons: ["Higher price", "Few reviews"],
    reliabilityScore: 80,
  },
  {
    productTitle: PRODUCTS[3].productTitle,
    productPrice: PRODUCTS[3].productPrice,
    productImages: PRODUCTS[3].productImages,
    parsedPrice: "1650000",
    reviewSentiment: "Positive",
    reviewSummary: "Honest about condition; buyers say it looks near-new with strong battery.",
    reviewCount: "18",
    keySpecs: { Condition: "Foreign Used", Storage: "256 GB", "Battery Health": "98%" },
    pros: ["Cheapest overall", "98% battery", "Honest seller"],
    cons: ["Used, not sealed"],
    reliabilityScore: 78,
  },
  {
    productTitle: PRODUCTS[4].productTitle,
    productPrice: PRODUCTS[4].productPrice,
    productImages: PRODUCTS[4].productImages,
    parsedPrice: "2650000",
    reviewSentiment: "Positive",
    reviewSummary: "Genuine 1TB units; small sample of happy buyers.",
    reviewCount: "8",
    keySpecs: { Condition: "Brand New", Storage: "1 TB", Color: "Natural Titanium" },
    pros: ["Max storage (1TB)", "Sealed"],
    cons: ["Most expensive", "Very few reviews"],
    reliabilityScore: 76,
  },
  {
    productTitle: PRODUCTS[5].productTitle,
    productPrice: PRODUCTS[5].productPrice,
    productImages: PRODUCTS[5].productImages,
    parsedPrice: "1720000",
    reviewSentiment: "Mixed-Positive",
    reviewSummary: "Clean unit per buyers; a moderate but decent review history.",
    reviewCount: "14",
    keySpecs: { Condition: "Nigerian Used", Storage: "256 GB", "Battery Health": "100%" },
    pros: ["100% battery", "Full accessories", "Low price"],
    cons: ["Nigerian used", "Moderate reviews"],
    reliabilityScore: 72,
  },
];

const RECOMMENDATION: IRecommendation = {
  confidentPick: true,
  productTitle: PRODUCTS[0].productTitle,
  productPrice: PRODUCTS[0].productPrice,
  productImages: PRODUCTS[0].productImages,
  productPageUrl: PRODUCTS[0].productPageUrl!,
  headline: "The safest buy that still won't overpay you.",
  reasons: [
    "Brand new and sealed with warranty — zero condition risk.",
    "Strongest seller reputation in the set, with the most positive reviews.",
    "₦2,000,000 is fair for a new 256GB; you're paying for trust, not hype.",
  ],
  whyOverOthers:
    "The Natural Titanium unit is ₦150k cheaper but the seller has half the track record. The UK-used Black is the budget play, but for a flagship you'll keep for years, a sealed unit from a top-rated seller is the smarter long-term call.",
  alternative: {
    productTitle: PRODUCTS[3].productTitle,
    productPrice: PRODUCTS[3].productPrice,
    productImages: PRODUCTS[3].productImages,
    productPageUrl: PRODUCTS[3].productPageUrl!,
    reason: "If budget is the priority, this UK-used unit saves ₦350k with 98% battery.",
    whyNotFirst: "It's used rather than sealed, so there's slightly more condition risk.",
  },
};

/** The session timeline. Delays are ms to wait before emitting each event. */
export const RECORDED_SESSION: RecordedEvent[] = [
  { delay: 400, type: "status", message: "Searching for iphone 16 pro max on jiji..." },
  { delay: 1400, type: "status", message: "Found 6 listings - pulling details..." },

  { delay: 700, type: "status", message: "Checking listing 1 of 6..." },
  { delay: 1100, type: "product", product: PRODUCTS[0] },
  { delay: 600, type: "status", message: "Checking listing 2 of 6..." },
  { delay: 1000, type: "product", product: PRODUCTS[1] },
  { delay: 600, type: "status", message: "Checking listing 3 of 6..." },
  { delay: 1200, type: "product", product: PRODUCTS[2] },
  { delay: 600, type: "status", message: "Checking listing 4 of 6..." },
  { delay: 1000, type: "product", product: PRODUCTS[3] },
  { delay: 600, type: "status", message: "Checking listing 5 of 6..." },
  { delay: 1100, type: "product", product: PRODUCTS[4] },
  { delay: 600, type: "status", message: "Checking listing 6 of 6..." },
  { delay: 1000, type: "product", product: PRODUCTS[5] },

  { delay: 900, type: "status", message: "Analyzing the listings..." },
  { delay: 2200, type: "comparison", comparison: COMPARISON },
  { delay: 1600, type: "recommendation", recommendation: RECOMMENDATION },
  { delay: 400, type: "done" },
];
