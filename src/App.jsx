import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home, Register, Login, Dashboard } from "@/pages";
import Layout from "@/layout";
import { useAuth } from "@/libs/useAuth";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
const removePreloader = () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => preloader.remove(), 2500);
  }
};

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    removePreloader();
  }, []);

  return (
    <Router>
      <div id="preloader">
        <div className="loader-container">
          <div className="estival-ring"></div>

          <img
            src="/estival_logo.jpg"
            alt="Estival Logo"
            className="estival-logo"
          />

          <h1 className="estival-title">
            <span>E</span>
            <span>S</span>
            <span>T</span>
            <span>I</span>
            <span>V</span>
            <span>A</span>
            <span>L</span>
          </h1>

          <p className="loading-text">Loading the Fest...</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />

            <Route
              path="/register/:slug"
              element={
                  <Register />
              }
            />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/admin/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
