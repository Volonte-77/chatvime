
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA18MzyZfOUPcyXto0bCoiv-RqtqDAa4QM",
  authDomain: "tutorechat.firebaseapp.com",
  projectId: "tutorechat",
  storageBucket: "tutorechat.appspot.com",
  messagingSenderId: "405161159381",
  appId: "1:405161159381:web:c782aa166224d830c6505c"
};


const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore();
export const storage=getStorage();