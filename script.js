// ---------------- FIREBASE CONFIG ----------------
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

// ---------------- MODALS ----------------
loginBtn.onclick = () => {
  loginModal.style.display = "flex";
};

signupBtn.onclick = () => {
  signupModal.style.display = "flex";
};

// ---------------- SIGNUP ----------------
function signup() {
  auth.createUserWithEmailAndPassword(
    signupEmail.value,
    signupPassword.value
  )
  .then(() => {
    signupModal.style.display = "none";
  })
  .catch(err => alert(err.message));
}

// ---------------- LOGIN ----------------
function login() {
  auth.signInWithEmailAndPassword(
    loginEmail.value,
    loginPassword.value
  )
  .then(() => {
    loginModal.style.display = "none";
  })
  .catch(err => alert(err.message));
}

// ---------------- GOOGLE LOGIN ----------------
googleLoginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(err => alert(err.message));
};

// ---------------- LOGOUT ----------------
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// ---------------- PROFILE DROPDOWN TOGGLE ----------------
userProfile.onclick = (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("d-none");
};

// ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ----------------
document.addEventListener("click", (e) => {
  if (
    !e.target.closest("#userProfile") &&
    !e.target.closest("#profileDropdown")
  ) {
    profileDropdown.classList.add("d-none");
  }
});

// ---------------- AUTH STATE ----------------
auth.onAuthStateChanged(user => {

  // 🔒 Protect profile page
  if (!user && window.location.pathname.includes("profile.html")) {
    window.location.href = "index.html";
  }

  if (user) {
    // Hide auth buttons
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    googleLoginBtn.style.display = "none";

    // Show profile icon
    userProfile.src = user.photoURL
      ? user.photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`;

    profileName.innerText = user.displayName || user.email;

    userProfile.classList.remove("d-none");
  } else {
    // Show auth buttons
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    googleLoginBtn.style.display = "inline-block";

    // Hide profile UI
    userProfile.classList.add("d-none");
    profileDropdown.classList.add("d-none");
  }
});