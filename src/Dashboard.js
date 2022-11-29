import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { gapi } from "gapi-script";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const getForm = async (formID) => {

    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setToken(data.accessToken);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }

    fetch('https://forms.googleapis.com/v1/forms/'+formID,
    {
      method: "GET",
      headers: new Headers({'Authorization': 'Bearer '+ token})
    }).then( (res) => {
      return res.json();
    }).then( function(val) {
      console.log(val);
    })
  }

  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
    getForm("1zoVckMu2d2XJ-wCsOrBqto3A01qQYvjHMqpsiP-lNA8");



  }, [user, loading]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;