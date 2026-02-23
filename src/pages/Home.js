import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      <h2 className="home__title">Home</h2>
      <p className="home__text">
        Welcome! This is the starting page of my semester project.
      </p>

      <div className="home__card">
        <h3 className="home__cardTitle">MVP (Week 1)</h3>
        <ul className="home__list">
          <li>Project structure (components/pages/assets)</li>
          <li>Header, MainContent, Footer components</li>
          <li>Basic styling</li>
          <li>SPA theory answers in README</li>
        </ul>
      </div>
    </main>
  );
}