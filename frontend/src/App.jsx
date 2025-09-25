import { Routes, Route, Link } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Playground from "./pages/Playground";
import T from "./pages/T";

import "./App.css";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/t" element={<T />} />
            </Routes>
        </>
    );
}

export default App;
