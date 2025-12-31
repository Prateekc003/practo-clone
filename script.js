// ----------------- FIREBASE CONFIG -----------------
const firebaseConfig = {
  apiKey: "AIzaSyCL7kYmoIX_1xYXWx2mCRml22Zc135jdaw",
  authDomain: "healthmate-98998.firebaseapp.com",
  projectId: "healthmate-98998",
  storageBucket: "healthmate-98998.appspot.com",
  messagingSenderId: "267854546283",
  appId: "1:267854546283:web:690e0552716c2fe2c0b82e"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

  // ----------------- MODALS -----------------
  function openModal(id) {
    document.getElementById(id).style.display = "flex";
  }
  function closeModal(id) {
    document.getElementById(id).style.display = "none";
  }

  // Attach modal buttons
  document.getElementById("loginBtn")?.addEventListener("click", () => openModal("loginModal"));
  document.getElementById("signupBtn")?.addEventListener("click", () => openModal("signupModal"));
  document.querySelectorAll(".btn-close").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  // ----------------- SIGNUP -----------------
  window.signup = function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    if (!name || !email || !password) return alert("Please fill all fields");

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return db.collection("users").doc(user.uid).set({ name, email });
      })
      .then(() => {
        alert("Sign up successful!");
        closeModal("signupModal");
        window.location.href = "dashboard.html";
      })
      .catch((err) => alert(err.message));
  };

  // ----------------- LOGIN -----------------
  window.login = function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) return alert("Please fill all fields");

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login successful!");
        closeModal("loginModal");
        window.location.href = "dashboard.html";
      })
      .catch((err) => alert(err.message));
  };

  // ----------------- GOOGLE LOGIN -----------------
  window.loginWithGoogle = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        db.collection("users").doc(user.uid).set(
          { name: user.displayName, email: user.email },
          { merge: true }
        ).then(() => {
          alert("Login with Google successful!");
          window.location.href = "dashboard.html";
        });
      })
      .catch((err) => alert(err.message));
  };

  // Attach Google button click
  document.getElementById("googleLoginBtn")?.addEventListener("click", loginWithGoogle);

  // ----------------- LOGOUT -----------------
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    auth.signOut()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((err) => alert(err.message));
  });

  // ----------------- AUTH STATE -----------------
  auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes("dashboard.html")) {
      db.collection("users").doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            document.getElementById("userName").innerText = doc.data().name;
          }
        });
    } else if (!user && window.location.pathname.includes("dashboard.html")) {
      window.location.href = "index.html";
    }
  });

  // ----------------- REMINDERS -----------------
  window.setReminder = function () {
    const name = document.getElementById("tabletName").value.trim();
    const time = document.getElementById("tabletTime").value;
    if (!name || !time) return alert("Enter tablet name and time");

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerText = `${name} at ${time}`;
    document.getElementById("reminderList").appendChild(li);

    const user = auth.currentUser;
    if (user) {
      db.collection("users").doc(user.uid).collection("reminders").add({ name, time });
    }
  };

  // ----------------- APPOINTMENTS -----------------
  window.bookAppointment = function () {
    const doctor = document.getElementById("appointmentDoctor").value.trim();
    const date = document.getElementById("appointmentDate").value;
    if (!doctor || !date) return alert("Enter doctor name and date");

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerText = `${doctor} on ${date}`;
    document.getElementById("appointmentList").appendChild(li);

    const user = auth.currentUser;
    if (user) {
      db.collection("users").doc(user.uid).collection("appointments").add({ doctor, date });
    }
  };

});