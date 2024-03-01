import React, { useState, useContext } from "react";
import { Context } from "../contexts/userContext";
import styles from "../module-styles/GroupsPage.module.css"; 
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GroupCard({idx, group}) {
    const {groupid, groupname, leaderid} = group; 
    const { state } = useContext(Context);
    const { userId }  = state ;
    const navigate = useNavigate(); 

    function handleDeleteGroup() {
      Axios.delete(`${process.env.REACT_APP_API_URL}/groupMembers/deleteBoth/${groupid}`)
        .then(() => {
          window.location.reload(); 
        })
        .catch(err => console.log(err.message));
    };


    //function that is called when button  click happens => initiates payment split for the pertained group! 
    function handleInitiatePaymentSplit() {
      //if user clicked on group for which they are leader, transition to 
      if(leaderid === userId && group.iscurrent){
         //switch route to status to show in real-time status page for this specific group! 
         navigate("/payment", {state: {groupData: group}}); 
      } 
      //otherwise, it's a member clicking group! 
      else {
        navigate("/status", {state: {groupData: group}}); 
      }
  }

    return (
      <div 
        key = {'c' + idx} 
        className={styles["group-card"]}
        onClick={() => handleInitiatePaymentSplit(group)}>
          <h4>{groupname}</h4>
          <p>Role: {(leaderid === userId) ? "leader" : "member"}</p>
          {leaderid === userId && (
            <button 
              className={styles["delete-button"]} 
              onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent div
                handleDeleteGroup(groupid);
              }}>
              Delete
            </button>
          )}
      </div>
    );
}