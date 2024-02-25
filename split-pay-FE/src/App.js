import "../src/App.css";
import React, { useEffect, useContext } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import StatusPage from "./pages/StatusPage";
import MainLayout from "./layouts/MainLayout";
import { GoogleLogin } from '@react-oauth/google';
import { Context } from "./contexts/context";
import Axios from "axios";
 
function App() {
  const {state, dispatch} = useContext(Context);
  const {user, isLeader} = state;
  
  function handleSuccess(response) {
    console.log("response: ", response);
    // dispatch({type: "SET_USER_ID", payload: response.profileObj.googleId});
  }
  console.log("user: ", user)
  useEffect(() => {
    if (user) {
      Axios.get(`http://localhost:8000/groups/${user}`).then(response => {
        console.log(response.data);
      }).catch(err => (console.log(err.message)))
    }
  },[user])
  return (
    <BrowserRouter>
      {user ? (
        <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/groups" element={<GroupsPage />} /> 
          <Route path="/payment" element={<PaymentPage />} /> 
          <Route path="/status" element = {<StatusPage />}/> 
        </Routes>
      </MainLayout>
      ) : (
        <GoogleLogin onSuccess={handleSuccess} onError={(error) => console.log(error)} />

      )}
      
    </BrowserRouter>
  );
}

export default App;
