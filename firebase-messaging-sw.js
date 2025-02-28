import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
    getMessaging,
    onBackgroundMessage
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-sw.js";

const firebaseConfig = {
    apiKey: "AIzaSyArM-m7dvRhtLzSZWQegitYm3X-3QCdHf8",
    authDomain: "slaptap-70c69.firebaseapp.com",
    projectId: "slaptap-70c69",
    storageBucket: "slaptap-70c69.firebasestorage.app",
    messagingSenderId: "314393069162",
    appId: "1:314393069162:web:c2234e975c0491bc2bac13",
    measurementId: "G-CMKKTDN0DE"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
    console.log("Mensagem recebida em segundo plano:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon
    });
});