import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MaterialsList from "./pages/materials/MaterialsList";
import MaterialDetails from "./pages/materials/MaterialDetails";
import ContactPage from "./pages/contact/ContactPage";
import Footer from "./components/layout/Footer";


function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="materials" element={<MaterialsList />} />
          <Route path="materials/:type/:slug" element={<MaterialDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route index element={<div className="p-6">Home</div>} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
