import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function GameCard({ game }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all group flex flex-col h-full">
      <Link to={`/game/${game.id}`} className="overflow-hidden block">
        <img 
          src={game.header_img} 
          alt={game.name} 
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link to={`/game/${game.id}`}>
            <h3 className="font-bold text-lg text-white hover:text-blue-400 line-clamp-1">{game.name}</h3>
          </Link>
          <div className="flex flex-wrap gap-1 mt-2">
            {game.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-800">
          <span className="text-green-400 font-semibold">{game.price}</span>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            onClick={() => addToCart(game)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}