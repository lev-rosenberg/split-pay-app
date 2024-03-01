import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import StatusPage from "./pages/StatusPage";
import JoinPage from "./pages/JoinPage";
import MainLayout from "./layouts/MainLayout";
import { GoogleLogin } from '@react-oauth/google';
import { Context } from "./contexts/userContext";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import "../src/App.css";

function App() {
  const { state, dispatch } = useContext(Context);
  const [signedIn, setSignedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('split-pay-login-token');
    if (token) {
      const userObject = jwtDecode(token);
      const { sub: userId } = userObject;
      dispatch({ type: "SET_USER_ID", payload: userId });
      setSignedIn(true);
    } else {
      setSignedIn(false);
    };
  }, [state.signedIn]);

  function handleSuccess(response) {
    localStorage.setItem('split-pay-login-token', response.credential);
    const userObject = jwtDecode(response.credential);
    const { name, email, sub } = userObject;
    const body = {
      userID: sub,
      userName: name,
      email: email
    };
    Axios.post(`${process.env.REACT_APP_API_URL}/users`, body)
      .then(response => {
        dispatch({ type: "SET_USER_ID", payload: sub });
        dispatch({ type: "SET_SIGNED_IN", payload: true });
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
            <Route path="/join/:groupID" element={<JoinPage />} />
          </Routes>
        </MainLayout>
      ) : (
        <GoogleLogin onSuccess={handleSuccess} onError={error => console.log(error)} />
      )}
    </BrowserRouter>
  );
}

export default App;
