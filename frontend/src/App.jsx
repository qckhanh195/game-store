import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Navbar from './components/Navbar'; // Import Navbar đã tách

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Gọi Component Navbar ở đây */}
        <Navbar />

        {/* Các trang hiển thị */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}