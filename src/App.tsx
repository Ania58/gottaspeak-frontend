import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MaterialsList from "./pages/materials/MaterialsList";
import MaterialDetails from "./pages/materials/MaterialDetails";


function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="materials" element={<MaterialsList />} />
          <Route path="materials/:type/:slug" element={<MaterialDetails />} />
          <Route index element={<div className="p-6">Home</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
