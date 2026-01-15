// Mock Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "demo-key",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
