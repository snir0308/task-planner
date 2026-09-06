import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage.jsx";
import Board from "./components/Board.jsx";
import ViewOnlyBoard from "./components/ViewOnlyBoard.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/edit" element={<Board />} />
        <Route path="/view" element={<ViewOnlyBoard />} />
      </Routes>
    </Router>
  );
}
