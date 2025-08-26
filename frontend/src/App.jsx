import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

// import NavBar from "./components/NavBar";
import Wizard from "./pages/Wizard";
import AdminPage from "./pages/AdminPage";
import DataPage from "./pages/DataPage";

function NavBar() {
  return (
    <header className="topbar">
      <div className="brand">ZEALTHY</div>
      <nav className="navlinks">
        <Link to="/">Onboarding</Link>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ScrollToTop />
      <main className="page">
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/data" element={<DataPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
