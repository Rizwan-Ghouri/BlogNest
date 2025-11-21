import {
  Toast,
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "../../firebase.js";
const formField = document.querySelectorAll("form input");
const SignUpbtn = document.getElementById("signUpbtn");

const [signupEmail, signupPassword] = formField;
console.log(signupEmail, signupPassword);

const signUp = () => {
  event.preventDefault();
  SignUpbtn.innerText = "loading...";
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      SignUpbtn.innerText = "Create Account";
      // Signed up
      const user = userCredential.user;
      Toast.fire({
        icon: "success",
        title: "Signup successfully",
      });
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      SignUpbtn.innerText = "Create Account";
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
      // ..
    });
};

SignUpbtn.addEventListener("click", signUp);

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "/index.html";
  }
});
