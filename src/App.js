import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <MainContent>
        <Home />
      </MainContent>
      <Footer />
    </div>
  );
}