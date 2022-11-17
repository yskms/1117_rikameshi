// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqEIEpWXxTC1WeIwMbnngIbxu5Pdip6-A",
  authDomain: "rikameshi.firebaseapp.com",
  projectId: "rikameshi",
  storageBucket: "rikameshi.appspot.com",
  messagingSenderId: "673861617326",
  appId: "1:673861617326:web:4a87024f94ef3733e64f3f",
  measurementId: "G-TZYXFTV814"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp; //ここだけ追記＆appから名前変えたよ
