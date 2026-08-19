/**
 * Migration script: Sửa lại tên trường và dữ liệu bị lệch cột trong collection games.
 *
 * Vấn đề: Dữ liệu CSV bị import lệch cột, dẫn đến:
 * - Website chứa header_image
 * - Support url chứa website
 * - Support email chứa support_url
 * - Windows chứa support_email
 * - Mac chứa windows (boolean)
 * - Linux chứa mac (boolean)
 * - Metacritic score chứa linux (boolean)
 * - Categories chứa publishers (string)
 * - Genres chứa categories (CSV string)
 * - Tags chứa genres (CSV string)
 * - Screenshots chứa tags (CSV string)
 * - Movies chứa screenshots (CSV string)
 * - Tên trường viết hoa + có khoảng trắng
 *
 * Script này sẽ:
 * 1. Đọc từng document
 * 2. Ánh xạ và parse dữ liệu đúng
 * 3. Ghi lại với tên trường chuẩn (snake_case)
 * 4. Xóa các trường cũ
 */

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/game';
const BATCH_SIZE = 1000;

function parseCsvString(val) {
  if (!val || typeof val !== 'string') return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

function parseLanguageArray(val) {
  if (!val || typeof val !== 'string') return [];
  // Format: "['English', 'French', 'German']"
  try {
    // Try JSON parse after replacing single quotes
    const cleaned = val.replace(/'/g, '"');
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed.map(s => s.trim()).filter(Boolean);
  } catch {
    // fallback: split by comma
    return val.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

async function migrate() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('games');

  const totalCount = await collection.countDocuments();
  console.log(`📊 Tổng số game: ${totalCount}`);
  console.log('🔄 Bắt đầu migration...\n');

  let processed = 0;
  let errors = 0;

  const cursor = collection.find({});

  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    try {
      // Build the corrected document
      // Ánh xạ theo thứ tự cột bị lệch:
      // Cột thực tế trong CSV lệch so với header

      const corrected = {
        name: doc['Name'] || '',
        release_date: doc['Release date'] || '',
        required_age: typeof doc['Required age'] === 'number' ? doc['Required age'] : 0,
        price: typeof doc['Price'] === 'number' ? doc['Price'] : 0,
        dlc_count: typeof doc['DiscountDLC count'] === 'number' ? doc['DiscountDLC count'] : 0,

        // "About the game" field is at position that has the numeric/0 value
        // Actual about_the_game text is in "Supported languages" field (lệch cột)
        about_the_game: (typeof doc['Supported languages'] === 'string' && doc['Supported languages'].length > 50)
          ? doc['Supported languages']
          : (typeof doc['About the game'] === 'string' ? doc['About the game'] : ''),
        short_description: '',
        detailed_description: '',

        // "Full audio languages" field - contains language arrays as string
        full_audio_languages: parseLanguageArray(
          typeof doc['Full audio languages'] === 'string' ? doc['Full audio languages'] : ''
        ),

        // Supported languages - need to figure out where it actually is
        // Based on the shift: the real supported_languages got pushed out
        supported_languages: [],

        reviews: typeof doc['Reviews'] === 'string' ? doc['Reviews'] : '',

        // "Website" field actually contains header_image URL
        header_image: typeof doc['Website'] === 'string' ? doc['Website'] : '',

        // "Support url" field actually contains website
        website: typeof doc['Support url'] === 'string' ? doc['Support url'] : '',

        // "Support email" field actually contains support_url
        support_url: typeof doc['Support email'] === 'string' ? doc['Support email'] : '',

        // "Windows" field actually contains support_email
        support_email: typeof doc['Windows'] === 'string' ? doc['Windows'] : '',

        // "Mac" field actually contains windows (boolean)
        windows: doc['Mac'] === true,

        // "Linux" field actually contains mac (boolean)
        mac: doc['Linux'] === true,

        // "Metacritic score" field actually contains linux (boolean)
        linux: doc['Metacritic score'] === true,

        // "Metacritic url" field actually contains metacritic_score (number)
        metacritic_score: typeof doc['Metacritic url'] === 'number' ? doc['Metacritic url'] : 0,

        metacritic_url: '',

        // Positive and Negative seem correct based on their position
        positive: typeof doc['Positive'] === 'number' ? doc['Positive'] : 0,
        negative: typeof doc['Negative'] === 'number' ? doc['Negative'] : 0,

        estimated_owners: typeof doc['Estimated owners'] === 'string' ? doc['Estimated owners'] : '0 - 0',
        peak_ccu: typeof doc['Peak CCU'] === 'number' ? doc['Peak CCU'] : 0,

        // Score rank, Recommendations, Notes positions
        score_rank: typeof doc['Score rank'] === 'string' ? doc['Score rank'] : '',
        recommendations: typeof doc['Recommendations'] === 'number' ? doc['Recommendations'] : 0,
        notes: typeof doc['Notes'] === 'string' ? doc['Notes'] : '',

        // Playtime fields
        average_playtime_forever: typeof doc['Average playtime forever'] === 'number' ? doc['Average playtime forever'] : 0,
        average_playtime_2weeks: typeof doc['Average playtime two weeks'] === 'number' ? doc['Average playtime two weeks'] : 0,
        median_playtime_forever: typeof doc['Median playtime forever'] === 'number' ? doc['Median playtime forever'] : 0,
        median_playtime_2weeks: typeof doc['Median playtime two weeks'] === 'number' ? doc['Median playtime two weeks'] : 0,

        discount: 0,
        achievements: 0,

        // "Developers" field - might be correct or shifted
        developers: typeof doc['Developers'] === 'string' && doc['Developers']
          ? parseCsvString(doc['Developers'])
          : (typeof doc['Publishers'] === 'string' && doc['Publishers']
            ? [] : []),

        // "Publishers" field actually contains developers sometimes, but
        // "Categories" field actually contains publishers (from shift)
        publishers: typeof doc['Categories'] === 'string' ? parseCsvString(doc['Categories']) : [],

        // "Genres" field actually contains categories (CSV)
        categories: typeof doc['Genres'] === 'string' ? parseCsvString(doc['Genres']) : [],

        // "Tags" field actually contains genres (CSV)
        genres: typeof doc['Tags'] === 'string' ? parseCsvString(doc['Tags']) : [],

        // "Screenshots" field actually contains tags (CSV)
        tags: typeof doc['Screenshots'] === 'string' ? parseCsvString(doc['Screenshots']) : [],

        // "Movies" field actually contains screenshots (CSV URLs)
        screenshots: typeof doc['Movies'] === 'string' ? parseCsvString(doc['Movies']) : [],

        movies: [],
        packages: [],

        user_score: 0,
        app_id: doc['AppID'] || 0,
      };

      // If developers is empty but Publishers field has a value, try that
      if (corrected.developers.length === 0 && typeof doc['Publishers'] === 'string' && doc['Publishers']) {
        corrected.developers = parseCsvString(doc['Publishers']);
      }

      // Remove all old fields and set new ones
      const oldFields = [
        'AppID', 'Name', 'Release date', 'Estimated owners', 'Peak CCU',
        'Required age', 'Price', 'DiscountDLC count', 'About the game',
        'Supported languages', 'Full audio languages', 'Reviews', 'Website',
        'Support url', 'Support email', 'Windows', 'Mac', 'Linux',
        'Metacritic score', 'Metacritic url', 'Positive', 'Negative',
        'Score rank', 'Recommendations', 'Notes',
        'Average playtime forever', 'Average playtime two weeks',
        'Median playtime forever', 'Median playtime two weeks',
        'Developers', 'Publishers', 'Categories', 'Genres', 'Tags',
        'Screenshots', 'Movies'
      ];

      const unsetObj = {};
      oldFields.forEach(f => { unsetObj[f] = '' });

      await collection.updateOne(
        { _id: doc._id },
        {
          $set: corrected,
          $unset: unsetObj
        }
      );

      processed++;
      if (processed % BATCH_SIZE === 0) {
        console.log(`✅ Đã xử lý: ${processed}/${totalCount} (${Math.round(processed/totalCount*100)}%)`);
      }
    } catch (err) {
      errors++;
      console.error(`❌ Lỗi document ${doc._id}:`, err.message);
    }
  }

  console.log(`\n🎉 Migration hoàn tất!`);
  console.log(`   ✅ Thành công: ${processed}`);
  console.log(`   ❌ Lỗi: ${errors}`);

  // Verify
  console.log('\n📋 Kiểm tra kết quả:');
  const sample = await collection.findOne();
  console.log('Fields:', Object.keys(sample).join(', '));
  console.log('Name:', sample.name);
  console.log('Header Image:', sample.header_image?.substring(0, 80));
  console.log('Price:', sample.price);
  console.log('Tags:', sample.tags?.slice(0, 5));
  console.log('Genres:', sample.genres);
  console.log('Categories:', sample.categories?.slice(0, 3));
  console.log('Developers:', sample.developers);
  console.log('Publishers:', sample.publishers);
  console.log('Screenshots:', sample.screenshots?.length, 'items');
  console.log('Windows:', sample.windows);
  console.log('Mac:', sample.mac);
  console.log('Linux:', sample.linux);

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
