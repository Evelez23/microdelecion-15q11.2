// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "microdelecion-15q11.firebaseapp.com",
  projectId: "microdelecion-15q11",
  storageBucket: "microdelecion-15q11.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const savePatient = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, "patients"), {
      ...patientData,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
