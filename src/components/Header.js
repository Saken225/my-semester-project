import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">Semester Project</div>
      <nav className="header__nav">
        <span className="header__link header__link--active">Home</span>
      </nav>
    </header>
  );
}