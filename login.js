import {
  Toast,
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "./firebase.js";
const formField = document.querySelectorAll("form input");
const loginBtn = document.getElementById("loginBtn");
const forgetPassbtn = document.getElementById("forgetPass");
const googlebtn = document.getElementById("googlebtn");
const provider = new GoogleAuthProvider();


const [loginEmail, loginPassword] = formField;

const login = (event) => {
  event.preventDefault();
  loginBtn.innerText = "Loading...";
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      // Signed in
      loginBtn.innerText = "Login";
      const user = userCredential.user;
      console.log(user.uid);
      Toast.fire({
        icon: "success",
        title: "login successfully",
      });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      loginBtn.innerText = "Login";
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    });
};

loginBtn.addEventListener("click", login);

const googleSignIn = ()=>{
  event.preventDefault();
  googlebtn.innerText = "loading..."
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    googlebtn.innerText = "Continue with Google"
    console.log(user);
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    googlebtn.innerText = "Continue with Google"
     Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    

    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // // ...
  });

}

googlebtn.addEventListener("click",googleSignIn)

const forgetPass = ()=>{
  sendPasswordResetEmail(auth, loginEmail.value)
  .then(() => {
    // Password reset email sent!
    // ..
    Toast.fire({
        icon: "success",
        title: "Password sent check email",
      });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    // ..
  });

}

forgetPassbtn.addEventListener("click",forgetPass);

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/pages/Home/home.html";
  }
});
