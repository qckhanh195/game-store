/**
 * Content-Based Recommendation Engine
 * Thuật toán: TF-IDF weighted vector + Cosine Similarity
 * Dữ liệu đặc trưng: tags (weight 3), categories (weight 2), developer (weight 2)
 */

/**
 * Xây dựng bag-of-words có trọng số cho 1 game
 * @param {Object} game
 * @returns {Object} { term: weightedCount }
 */
function buildFeatureVector(game) {
  const vector = {};

  const addTerms = (terms, weight) => {
    if (!Array.isArray(terms)) return;
    terms.forEach((term) => {
      const key = term.toLowerCase().trim();
      if (!key) return;
      vector[key] = (vector[key] || 0) + weight;
    });
  };

  const addTerm = (term, weight) => {
    if (!term || typeof term !== 'string') return;
    const key = term.toLowerCase().trim();
    if (!key) return;
    vector[key] = (vector[key] || 0) + weight;
  };

  addTerms(game.tags, 3);        // tags — trọng số cao nhất
  addTerms(game.categories, 2);  // categories — trọng số trung bình
  addTerm(game.developer, 2);    // developer
  addTerm(game.publisher, 1);    // publisher

  return vector;
}

/**
 * Tính Cosine Similarity giữa 2 vector
 * @param {Object} vecA
 * @param {Object} vecB
 * @returns {number} similarity [0, 1]
 */
function cosineSimilarity(vecA, vecB) {
  const keysA = Object.keys(vecA);
  if (keysA.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  // Dot product — chỉ duyệt terms của A
  keysA.forEach((key) => {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dot += a * b;
    normA += a * a;
  });

  // Norm của B
  Object.values(vecB).forEach((b) => {
    normB += b * b;
  });

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Lấy N game tương tự nhất với targetGame
 * @param {Object} targetGame - game đang xem
 * @param {Array} allGames - toàn bộ danh sách game
 * @param {number} n - số lượng gợi ý
 * @returns {Array} top N game tương tự (không bao gồm targetGame)
 */
export function getSimilarGames(targetGame, allGames, n = 8) {
  if (!targetGame || !allGames || allGames.length === 0) return [];

  const targetVec = buildFeatureVector(targetGame);

  const scored = allGames
    .filter((g) => g.id !== targetGame.id)
    .map((game) => ({
      game,
      score: cosineSimilarity(targetVec, buildFeatureVector(game)),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);

  return scored.map((s) => s.game);
}

/**
 * Gợi ý cá nhân hoá dựa trên danh sách game đã mua/tương tác
 * Tổng hợp vector của tất cả game đã mua, tìm game tương đồng nhất
 * @param {Array} purchasedGames - game đã mua
 * @param {Array} allGames - toàn bộ danh sách game
 * @param {number} n - số lượng gợi ý
 * @returns {Array} top N game gợi ý
 */
export function getPersonalizedRecommendations(purchasedGames, allGames, n = 16) {
  if (!purchasedGames || purchasedGames.length === 0) return [];
  if (!allGames || allGames.length === 0) return [];

  const purchasedIds = new Set(purchasedGames.map((g) => g.id));

  // Tổng hợp vector từ tất cả game đã mua (profile vector)
  const profileVec = {};
  purchasedGames.forEach((game) => {
    const vec = buildFeatureVector(game);
    Object.entries(vec).forEach(([term, weight]) => {
      profileVec[term] = (profileVec[term] || 0) + weight;
    });
  });

  // Lấy game chưa mua, tính similarity với profile
  const scored = allGames
    .filter((g) => !purchasedIds.has(g.id))
    .map((game) => ({
      game,
      score: cosineSimilarity(profileVec, buildFeatureVector(game)),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);

  return scored.map((s) => s.game);
}
