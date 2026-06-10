import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router";
import UnderConstruction from "./components/UnderConstruction/UnderConstruction";

function App() {
  return (
    <>
      <Sidebar />
      <main className="lg:ml-54 mt-37 lg:mt-0 min-h-screen lg:pt-0  p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={"Test"} />
          <Route path="/under-construction" element={<UnderConstruction />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
