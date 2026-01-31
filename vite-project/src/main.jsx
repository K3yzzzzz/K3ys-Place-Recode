import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import "./styles/index.css";

import { LoginWall } from "./components/LoginWall.jsx";
import { Navbar } from "./components/Navbar.jsx";

import { Home } from "./pages/Home.jsx";
import { Games } from "./pages/Games.jsx";
import { Apps } from "./pages/Apps.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Login } from "./pages/Login.jsx";

function Layout({ children, loggedIn }) {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  const hideLoginWall = loggedIn || location.pathname === "/login";

  return (
    <>
      {!hideLoginWall && <LoginWall />}
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Layout loggedIn={loggedIn}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// ---------- Render ----------
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
