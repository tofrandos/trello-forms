import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { Navigate } from "react-router-dom";

  const firebaseConfig = {
      apiKey: "AIzaSyCA8DDUxaSoG0fWXypvTIGKfi2K8pTOyQI",
      authDomain: "trello-forms-4b1e4.firebaseapp.com",
      projectId: "trello-forms-4b1e4",
      storageBucket: "trello-forms-4b1e4.appspot.com",
      messagingSenderId: "869809350975",
      appId: "1:869809350975:web:83bb620a6a87385fb98b8a",
      measurementId: "G-6028WEKYST"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  export {
    auth,
    db,
    signInWithGoogle,
    logout,
  };