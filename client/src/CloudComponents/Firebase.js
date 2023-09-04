import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC7yW6MeP7OM614HTvl4NSy9AQ1ozQuWWA",
  authDomain: "fileuploadproject-f6d75.firebaseapp.com",
  projectId: "fileuploadproject-f6d75",
  storageBucket: "fileuploadproject-f6d75.appspot.com",
  messagingSenderId: "116726253681",
  appId: "1:116726253681:web:4104399dcdc783fb07b3d0",
  measurementId: "G-BQH5R80WGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)