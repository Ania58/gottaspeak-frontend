import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MaterialsList from "./pages/materials/MaterialsList";
import MaterialDetails from "./pages/materials/MaterialDetails";
import ContactPage from "./pages/contact/ContactPage";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/home/HomePage";
import LessonJoin from "./pages/lessons/LessonJoin";

function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path ="/" element={<HomePage />} />
          <Route path="materials" element={<MaterialsList />} />
          <Route path="materials/:type/:slug" element={<MaterialDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lessons" element={<LessonJoin />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
