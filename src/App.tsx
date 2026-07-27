import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router";
import UnderConstruction from "./components/UnderConstruction/UnderConstruction";
import "./services/firebase"; // Ensure Firebase is initialized
import Biography from "./components/Biography/Biography.tsx";
import Series from "./components/Series/Series";
import SeriesDetail from "./components/Series/SeriesDetail.tsx";

const App: React.FC = () => {
  return (
    <>
      <Sidebar />
      <main className="lg:ml-54 mt-37 lg:mt-0 min-h-screen lg:pt-0  p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series-detail" element={<SeriesDetail />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
