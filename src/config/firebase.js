import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB05f2GUwHjqPF1rbr4TIfQOigvPjgaNt4",
  authDomain: "fittrack-ab748.firebaseapp.com",
  projectId: "fittrack-ab748",
  storageBucket: "fittrack-ab748.appspot.com",
  messagingSenderId: "129911431278",
  appId: "1:129911431278:web:5b7de2ea5ee449d317867f",
  databaseURL: "https://fittrack-ab748-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
