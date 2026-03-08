/**
 * Antigravity Ranking Algorithm (Experimental)
 *
 * Inspired by the Hacker News gravity formula but extended with:
 * - Style vector match score
 * - Time-decay "gravity" that pulls older popular items down
 * - Velocity (momentum) bonus for items trending upward recently
 * - Antigravity lift for new items that bypasses pure popularity
 *
 * Formula: score = (styleMatch * W_style + velocity * W_velocity) / (ageHours + 2)^GRAVITY
 *
 * The antigravity effect: items with recent interaction spikes get a
 * momentum multiplier that temporarily overcomes the age penalty,
 * pushing them above stale high-popularity items.
 */

const GRAVITY = 1.8;       // Higher = faster decay for old items
const W_STYLE = 0.5;       // Weight for style match
const W_VELOCITY = 0.3;    // Weight for trending momentum
const W_BASE = 0.2;        // Weight for base popularity

/**
 * Calculate item age in hours from created_at / timestamp field.
 * Defaults to 48h if no timestamp available (neutral aging).
 */
const getAgeHours = (product) => {
  const ts = product.created_at || product.createdAt || product.timestamp;
  if (!ts) return 48;
  const ageMs = Date.now() - new Date(ts).getTime();
  return Math.max(0.5, ageMs / (1000 * 60 * 60)); // minimum 0.5h to avoid division issues
};

/**
 * Velocity score: measures how quickly an item is gaining traction.
 * Uses recent_interactions vs total_interactions ratio as a proxy
 * for momentum. Falls back to popularity if interaction data is absent.
 */
const getVelocity = (product) => {
  const total = product.total_interactions || product.popularity_score || product.popularity || 1;
  const recent = product.recent_interactions || product.interaction_count || 0;
  if (recent === 0) return 0.1; // new items get a tiny base velocity (antigravity lift)
  return Math.min(1, recent / Math.max(1, total));
};

/**
 * Main ranking function.
 * @param {Array} products  - Array of product objects
 * @param {Array} tags      - Style tags from user analysis
 * @returns {Array}         - Sorted array with antigravity score attached
 */
const rankProducts = (products, tags) => {
  return products.map(product => {
    // 1. Style match score [0, 1]
    const tagList = product.tags || [];
    const styleMatch = tags.includes(product.style) ? 1.0
      : tagList.some(t => tags.includes(t)) ? 0.5
      : 0.1;

    // 2. Base popularity [0, 1]
    const pop = product.popularity_score || product.popularity || 5;
    const baseScore = Math.min(1, pop / 10);

    // 3. Velocity / momentum [0, 1]
    const velocity = getVelocity(product);

    // 4. Age in hours (for gravitational decay)
    const ageHours = getAgeHours(product);

    // 5. Weighted numerator
    const numerator = (styleMatch * W_STYLE) + (velocity * W_VELOCITY) + (baseScore * W_BASE);

    // 6. Antigravity score: gravity pulls down old items, velocity resists it
    const antigravityScore = numerator / Math.pow(ageHours + 2, GRAVITY);

    return {
      ...product,
      score: parseFloat(antigravityScore.toFixed(6)),
      _debug: { styleMatch, velocity, baseScore, ageHours, antigravityScore }
    };
  })
  .sort((a, b) => b.score - a.score);
};

module.exports = { rankProducts, GRAVITY, getAgeHours, getVelocity };
