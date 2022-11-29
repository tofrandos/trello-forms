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

  const getForm = (formID, apiKey) => {
    
    function initiate() {
      gapi.client
        .init({
          apiKey: apiKey,
        })
  
        .then(function () {
          return gapi.client.request({
            path: `https://forms.googleapis.com/v1/forms/${formID}/`,
          });
        })
  
        .then(
          (response) => {
            let formSchema = response.result.items;
            setForm(formSchema);
          },
          function (err) {
            return [false, err];
          }
        );
    }
    gapi.load("client", initiate);
  };
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    getForm(process.env.formID, process.env.apiKey);
  }, [user, loading]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <ul>
          {form && form.length > 0 && form.map((formItem, index) => (
            <li key={formItem.formId}>{formItem.formId}</li>
          ))}
        </ul>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;