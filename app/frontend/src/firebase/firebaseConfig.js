const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDhfk198F2ZUgT89ON9brPk5x96rHqfjvA',
  authDomain: 'hackathon-8dd5b.firebaseapp.com',
  projectId: 'hackathon-8dd5b',
  storageBucket: 'hackathon-8dd5b.appspot.com',
  messagingSenderId: '97407855709',
  appId: '1:97407855709:web:b9972d85d09d144eaff1b4',
  measurementId: 'G-1VRV2K96RS'
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

module.exports = { auth, db };
