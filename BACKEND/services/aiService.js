/**
 * AI Style Detection Service (mock — no API key required)
 * Deterministically maps an image path to a style bucket using a
 * simple djb2 hash so the same image always returns the same tags.
 * Replace the body with a real CLIP / Google Vision call when an API key is available.
 */

const STYLE_BUCKETS = [
  ['streetwear', 'casual', 'denim'],
  ['formal', 'elegant', 'black-tie'],
  ['sportswear', 'active', 'comfortable'],
  ['vintage', 'retro', 'chic'],
  ['summer', 'beach', 'casual'],
  ['minimalist', 'clean', 'monochrome'],
  ['bohemian', 'earthy', 'layered'],
];

/**
 * djb2 hash — fast, deterministic, good distribution.
 * @param {string} str
 * @returns {number} unsigned 32-bit integer
 */
const djb2Hash = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash >>> 0; // Keep as unsigned 32-bit
  }
  return hash;
};

const detectStyle = async (imagePath) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = djb2Hash(imagePath || 'default') % STYLE_BUCKETS.length;
      resolve(STYLE_BUCKETS[index]);
    }, 200); // Reduced delay for faster experience
  });
};

module.exports = { detectStyle };

