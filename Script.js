const firebaseConfig = {
  apiKey: "AIzaSyAtJKG2p4mfbxYLqVZHcu7t_YOSx15ts14",
  authDomain: "soshial-9932a.firebaseapp.com",
  projectId: "soshial-9932a",
  storageBucket: "soshial-9932a.appspot.com",
  messagingSenderId: "678676776751",
  appId: "1:678676776751:web:165b761716f6df2b3f03da",
  measurementId: "G-4LL3LE15P9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const userId = "Alpraa"; // ثابت مؤقتًا، يمكن ربطه بـ Firebase Auth لاحقًا
document.getElementById("username").textContent = userId;

async function loadUser() {
  const userRef = db.collection("users").doc(userId);
  const docSnap = await userRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    document.getElementById("coinCount").textContent = data.coins || 0;
  } else {
    await userRef.set({ coins: 0, name: userId });
    document.getElementById("coinCount").textContent = 0;
  }
}
loadUser();

async function createPost() {
  const content = document.getElementById("newPost").value.trim();
  if (!content) return alert("اكتب شيئًا أولاً");
  await db.collection("posts").add({
    user: userId,
    caption: content,
    timestamp: Date.now()
  });
  alert("✅ تم نشر المنشور");
  document.getElementById("newPost").value = "";
  loadPosts();
}

async function loadPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";
  const snap = await db.collection("posts").orderBy("timestamp", "desc").get();
  snap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.caption}`;
    postList.appendChild(div);
  });
}
loadPosts();

async function startLive() {
  await db.collection("live_streams").doc(userId).set({
    streamer: userId,
    viewers: 0,
    startedAt: Date.now()
  });
  alert("📺 تم بدء البث المباشر");
}

async function sendGift() {
  await db.collection("gifts").add({
    from: userId,
    to: "targetUser",
    name: "🌹 وردة",
    price: 50,
    timestamp: Date.now()
  });
  alert("🎁 تم إرسال الهدية");
}
