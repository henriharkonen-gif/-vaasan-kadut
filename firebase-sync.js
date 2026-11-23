import { yhdistaAjot } from "./sync-merge.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAr4JqnVE7APrts4-MdBNjfnhlumqmqaao",
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

  const ref = doc(db, "users", user.uid, "data", "cycling");
  const snapshot = await getDoc(ref);
  const pilvi = snapshot.exists() ? snapshot.data() : null;
  const yhdistetty = yhdistaAjot(data, pilvi);

  await setDoc(ref, {
    ...yhdistetty,
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
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const pilvi = await lataaPilvesta();
      const paikallinen = {
        done: JSON.parse(localStorage.getItem("vaasa_done_v2") || "{}"),
        rideLog: JSON.parse(localStorage.getItem("vaasa_ride_log_v1") || "[]")
      };
      console.log("PILVIVERTAILU:", {
        pilvenKadut: Object.keys(pilvi?.done || {}).length,
        laitteenKadut: Object.keys(paikallinen.done).length,
        pilvenAjot: pilvi?.rideLog?.length || 0,
        laitteenAjot: paikallinen.rideLog.length
      });
    } catch (e) {
      console.warn("Pilvitietojen tarkistus epäonnistui:", e.message);
    }
  }
  const btn = document.getElementById("loginBtn");
  if (!btn) return;
  btn.textContent = user ? "✓ Kirjauduttu" : "Kirjaudu sisään";
  btn.style.backgroundColor = user ? "#198754" : "";
  btn.style.color = user ? "white" : "";
});