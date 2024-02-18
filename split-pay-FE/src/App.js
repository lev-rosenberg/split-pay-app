import Header from "./components/Header"; 
import Footer from "./components/Footer";
import "../src/App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import StatusPage from "./pages/StatusPage";
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
        <Route path="/status" element = {<StatusPage />}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
