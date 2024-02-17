import Header from "./components/Header"; 
import Footer from "./components/Footer";
import "../src/App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
function App() {
  return (
    <BrowserRouter>
      <Header /> 
      <Footer />
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/groups" element={<GroupsPage />} /> 
        <Route path="/payment" element={<PaymentPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
