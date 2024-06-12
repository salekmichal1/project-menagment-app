// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAS5xeqvV7DCyzjIhdPC-pxqdH57rXQv-k',
  authDomain: 'managme-database.firebaseapp.com',
  projectId: 'managme-database',
  storageBucket: 'managme-database.appspot.com',
  messagingSenderId: '575552668909',
  appId: '1:575552668909:web:d306e625ec3918ab4eb8e4',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const projectDatabase = getFirestore();

export { projectDatabase };
