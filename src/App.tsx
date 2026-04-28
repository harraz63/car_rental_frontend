import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Cars from '@/pages/Cars';
import CarDetails from '@/pages/CarDetails';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ListCar from '@/pages/ListCar';
import MyListings from '@/pages/MyListings';
import Terms from '@/pages/Terms';
import './App.css';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-dark" dir="rtl">
        <AnimatedBackground />
        <Navigation />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list-car" element={<ListCar />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(10, 10, 20, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              direction: 'ltr',
              fontFamily: 'Cairo, sans-serif',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
