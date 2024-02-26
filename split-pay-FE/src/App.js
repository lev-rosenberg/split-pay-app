import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import StatusPage from "./pages/StatusPage";
import MainLayout from "./layouts/MainLayout";
import { GoogleLogin } from '@react-oauth/google';
import { Context } from "./contexts/userContext";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import "../src/App.css";

function App() {
  const { state, dispatch } = useContext(Context);
  const { userId } = state;
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userObject = jwtDecode(token);
      const { sub: userId } = userObject;
      dispatch({ type: "SET_USER_ID", payload: userId });
      setSignedIn(true);
    }
  }, []);

  function handleSuccess(response) {
    localStorage.setItem('token', response.credential);
    const userObject = jwtDecode(response.credential);
    const { name, email, sub } = userObject;
    const body = {
      userID: sub,
      userName: name,
      email: email,
      hasAcceptedTerms: false,
      amountOwed: 0
    };
    Axios.post("http://localhost:8000/users", body)
      .then(response => {
        dispatch({ type: "SET_USER_ID", payload: sub });
        setSignedIn(true);
      })
      .catch(err => console.log(err.message));
  }

  return (
    <BrowserRouter>
      {signedIn ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/status" element={<StatusPage />} />
          </Routes>
        </MainLayout>
      ) : (
        <GoogleLogin onSuccess={handleSuccess} onError={error => console.log(error)} />
      )}
    </BrowserRouter>
  );
}

export default App;
