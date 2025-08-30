import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route index element={<div className="p-6">Home</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
