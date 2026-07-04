/**
 * Content-Based Recommendation Engine
 * Thuật toán: TF-IDF weighted vector + Cosine Similarity
 * Dữ liệu đặc trưng: tags (weight 5), developer (weight 3), categories (weight 1), publisher (weight 1)
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

  addTerms(game.tags, 5);        // tags — trọng số cao nhất
  addTerms(game.categories, 1);  // categories — trọng số trung bình
  addTerm(game.developer, 3);    // developer
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
 * Chỉ trả về game có % tương thích >= 50%
 * @param {Array} purchasedGames - game đã mua (dùng làm profile)
 * @param {Array} allGames - toàn bộ danh sách game
 * @param {number} n - số lượng gợi ý tối đa
 * @returns {Array} top N game gợi ý (có recommendationInfo)
 */
export function getPersonalizedRecommendations(purchasedGames, allGames, n = 40) {
  if (!purchasedGames || purchasedGames.length === 0) return [];
  if (!allGames || allGames.length === 0) return [];

  const purchasedIds = new Set(purchasedGames.map((g) => g.id));

  // Build lookup sets for purchased attributes once to optimize search
  const purchasedDevelopers = new Set(
    purchasedGames
      .map((g) => g.developer?.toLowerCase().trim())
      .filter(Boolean)
  );
  const purchasedPublishers = new Set(
    purchasedGames
      .map((g) => g.publisher?.toLowerCase().trim())
      .filter(Boolean)
  );
  const purchasedTags = new Set(
    purchasedGames
      .flatMap((g) => g.tags || [])
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean)
  );
  const purchasedCategories = new Set(
    purchasedGames
      .flatMap((g) => g.categories || [])
      .map((c) => c.toLowerCase().trim())
      .filter(Boolean)
  );

  // Tổng hợp vector từ tất cả game đã mua (profile vector)
  const profileVec = {};
  purchasedGames.forEach((game) => {
    const vec = buildFeatureVector(game);
    Object.entries(vec).forEach(([term, weight]) => {
      profileVec[term] = (profileVec[term] || 0) + weight;
    });
  });

  // Tính raw cosine similarity cho tất cả game chưa mua
  const rawScored = allGames
    .filter((g) => !purchasedIds.has(g.id))
    .map((game) => ({
      game,
      rawScore: cosineSimilarity(profileVec, buildFeatureVector(game)),
    }))
    .filter((s) => s.rawScore > 0)
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, n);

  if (rawScored.length === 0) return [];

  // Min-max normalization để chuyển sang % [0, 100]
  // Dùng top game làm max, 0 làm min để % phản ánh đúng độ tương đồng tương đối
  const maxScore = rawScored[0].rawScore;
  const minScore = rawScored[rawScored.length - 1].rawScore;
  const range = maxScore - minScore || maxScore; // tránh chia 0

  return rawScored
    .map(({ game, rawScore }) => {
      // Scale: top game ~ 95%, bottom ~ 50%
      const normalizedPct = Math.round(50 + ((rawScore - minScore) / range) * 45);
      const percentage = Math.min(98, Math.max(50, normalizedPct));

      const matches = {
        developer: game.developer && purchasedDevelopers.has(game.developer.toLowerCase().trim()) ? game.developer : null,
        publisher: game.publisher && purchasedPublishers.has(game.publisher.toLowerCase().trim()) ? game.publisher : null,
        tags: (game.tags || []).filter((t) => purchasedTags.has(t.toLowerCase().trim())),
        categories: (game.categories || []).filter((c) => purchasedCategories.has(c.toLowerCase().trim())),
      };

      return {
        ...game,
        recommendationInfo: { score: percentage, matches },
      };
    });
}

/**
 * Nhóm danh sách game theo danh mục chính (categories[0])
 * @param {Array} games - danh sách game (đã có recommendationInfo)
 * @returns {Array<{category: string, games: Array}>} mảng nhóm theo danh mục
 */
export function groupByCategory(games) {
  const map = new Map();

  games.forEach((game) => {
    const cat = (game.categories && game.categories[0]) || 'Khác';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(game);
  });

  // Sắp xếp nhóm theo số game nhiều nhất trước
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, games]) => ({ category, games }));
}
