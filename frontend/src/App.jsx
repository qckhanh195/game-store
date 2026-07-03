import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Recommendations from './pages/Recommendations';
import Purchased from './pages/Purchased';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0F1923]">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/danh-muc" element={<Catalog />} />
            <Route path="/goi-y" element={<Recommendations />} />
            <Route path="/da-mua" element={<Purchased />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}