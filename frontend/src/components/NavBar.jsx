import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">ZEALTHY</Link>
        <nav className="nav-links">
            <Link to="/">Onboarding</Link>
        </nav>
      </div>
    </header>
  );
}
