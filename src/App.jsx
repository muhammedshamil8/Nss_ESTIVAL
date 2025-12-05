import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Register, Login, Dashboard } from '@/pages';
import Layout from '@/layout';
import { useAuth } from "@/libs/useAuth";
import { AnimatePresence } from "framer-motion";

const removePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 1200);
  }
};

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    removePreloader();
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>

          <Route element={<Layout />}>

            <Route path="/" element={<Home />} />

            <Route path="/register/:slug" element={<Register />} />

          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={user ? <Dashboard /> : <Navigate to="/admin/login" />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AnimatePresence>
    </Router>
  );
}
