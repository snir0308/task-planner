import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage.jsx";
import ViewOnlyBoard from "./components/ViewOnlyBoard.jsx";
import TokenVerificationPage from "./components/TokenVerificationPage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage.jsx";
import ViewOnlyBoard from "./components/ViewOnlyBoard.jsx";
import TokenVerificationPage from "./components/TokenVerificationPage.jsx";

export default function App() {
  return (
    <Router basename="/task-planner">
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
         <Route path="/edit/:boardId" element={<TokenVerificationPage />} />
         <Route path="/view/:boardId" element={<ViewOnlyBoard />} />
       </Routes>
    </Router>
  );
}
