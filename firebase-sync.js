import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAr4JqnVE7APrts4-MdBNjfnHlumqmqaaо",
  authDomain: "vaasan-kadut.firebaseapp.com",
  projectId: "vaasan-kadut",
  storageBucket: "vaasan-kadut.firebasestorage.app",
  messagingSenderId: "208957467093",
  appId: "1:208957467093:web:45d7a63c5b355db7c8f55c",
  measurementId: "G-0NY9K19543"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const db = getFirestore(app);


async function tallennaPilveen(data) {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Kirjaudu ensin sisään.");
  }

  await setDoc(doc(db, "users", user.uid, "data", "cycling"), {
    ...data,
    updatedAt: new Date().toISOString()
  });
}
async function lataaPilvesta() {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Kirjaudu ensin sisään.");
  }

  const snapshot = await getDoc(
    doc(db, "users", user.uid, "data", "cycling")
  );

  return snapshot.exists() ? snapshot.data() : null;
}
window.tallennaPilveen = tallennaPilveen;
window.lataaPilvesta = lataaPilvesta;