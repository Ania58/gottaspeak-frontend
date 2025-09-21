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
import ScrollToTop from "./components/routing/ScrollToTop";
import SystemStatus from "./pages/tools/SystemStatus";
import LessonViewer from "./pages/lessons/LessonViewer";
import CoursesList from "./pages/courses/CoursesList";
import CourseUnits from "./pages/courses/CourseUnits";
import UnitLessons from "./pages/courses/UnitLessons";

function App() {

  return (
    <>
      <Router>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path ="/" element={<HomePage />} />
          <Route path="materials" element={<MaterialsList />} />
          <Route path="materials/:type/:slug" element={<MaterialDetails />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:level" element={<CourseUnits />} />
          <Route path="/courses/:level/units/:unit" element={<UnitLessons />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lessons" element={<LessonJoin />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/lessons/:level/:unit/:lesson" element={<LessonViewer />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
