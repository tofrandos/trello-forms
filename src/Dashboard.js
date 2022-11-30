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
  const [form, setForm] = useState("");
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

    var data = "";

    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      data = doc.docs[0].data();
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching token");
    }

    //var response;

    fetch(`https://forms.googleapis.com/v1/forms/${formID}/`,
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data.accessToken
      }
    }).then( (res) => {
      return res.json();
    }).then( function(response){
      setForm(response);
      //console.log(response);
    })

    
  }

  useState(() => {
    getForm("1zoVckMu2d2XJ-wCsOrBqto3A01qQYvjHMqpsiP-lNA8");
  })
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
    //console.log(form);

  }, [user, loading, form]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;