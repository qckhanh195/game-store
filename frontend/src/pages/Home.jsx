import { useState, useEffect } from 'react';
import axios from 'axios';
import GameCard from '../components/GameCard';
import { Search } from 'lucide-react';

export default function Home() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  // Danh sách một số tag phổ biến để làm bộ lọc mẫu
  const sampleTags = ['Action', 'RPG', 'Strategy', 'Adventure', 'Simulation', 'Casual'];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/games`, {
          params: { page, limit: 12, search, tag }
        });
        if (response.data.success) {
          setGames(response.data.data);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách game:", error);
      }
    };

    // Tạo hiệu ứng delay nhỏ khi gõ chữ tìm kiếm (Debounce)
    const delayDebounceFn = setTimeout(() => {
      fetchGames();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, tag]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Thanh Tìm kiếm và Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search popular games..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Khối filter tag bằng nút */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
          <button 
            className={`px-4 py-1.5 rounded-full text-sm ${tag === '' ? 'bg-blue-600' : 'bg-gray-800'}`}
            onClick={() => { setTag(''); setPage(1); }}
          >
            All
          </button>
          {sampleTags.map(t => (
            <button
              key={t}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${tag === t ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => { setTag(t); setPage(1); }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid danh sách game */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Phân trang (Pagination) */}
      <div className="flex justify-center mt-12 gap-4">
        <button
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="py-2 text-gray-400">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}