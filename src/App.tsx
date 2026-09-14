import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router";
import UnderConstruction from "./components/UnderConstruction/UnderConstruction";
import "./services/firebase"; // Ensure Firebase is initialized
import Biography from "./components/Biography/Biography.tsx";
import Series from "./components/Series/Series";
import SeriesDetail from "./components/Series/SeriesDetail.tsx";
import Exhibits from "./components/Exhibits/Exhibits.tsx";
import { Contact } from "./components/Contact/Contact.tsx";
import Reviews from "./components/Reviews/Reviews";
import Login from "./components/Login/Login.tsx";
import MySeries from "./components/MySeries/MySeries.tsx";
import MyBiography from "./components/MyBiography/MyBiography.tsx";
import MyReviews from "./components/MyReviews/MyReviews.tsx";
import MyExhibits from "./components/MyExhibits/MyExhibits.tsx";
import PasswordReset from "./components/PasswordReset/PasswordReset.tsx";

const App: React.FC = () => {
  return (
    <>
      <Sidebar />
      <main className="lg:ml-54 mt-37 lg:mt-0 min-h-screen lg:pt-0  p-5 text-brand-primary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series-detail/:name" element={<SeriesDetail />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myseries" element={<MySeries />} />
          <Route path="/myexhibits" element={<MyExhibits />} />
          <Route path="/myreviews" element={<MyReviews />} />
          <Route path="/mybiography" element={<MyBiography />} />
          <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
