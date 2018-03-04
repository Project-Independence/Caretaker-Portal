importScripts("https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js");

var config = {
    apiKey: "AIzaSyALjVa5DXtXiZFhSHddwO-8_wVx7JyUuEQ",
    authDomain: "project-independence-1909b.firebaseapp.com",
    databaseURL: "https://project-independence-1909b.firebaseio.com",
    projectId: "project-independence-1909b",
    storageBucket: "project-independence-1909b.appspot.com",
    messagingSenderId: "425223397877"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
