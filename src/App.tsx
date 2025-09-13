import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import MaterialsList from "./pages/materials/MaterialsList";
import MaterialDetails from "./pages/materials/MaterialDetails";
import ContactPage from "./pages/contact/ContactPage";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/home/HomePage";
import LessonJoin from "./pages/lessons/LessonJoin";
import NotFound from "./pages/common/NotFound";
import PrivacyPage from "./pages/common/PrivacyPage";
import TermsPage from "./pages/common/TermsPage";

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
          <Route path="*" element={<NotFound />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
