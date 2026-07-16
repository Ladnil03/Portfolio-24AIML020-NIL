import './App.css'
import Header from "./components/Header";
import About from "./components/About";
import Skill from "./components/Skill";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header />
      <About />
      <Skill />
      <Footer />
    </div>
  );
}

export default App;