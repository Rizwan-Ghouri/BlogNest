import {
  Toast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  //   addDoc,
  getDocs,
} from "../../firebase.js";
const logoutbtn = document.getElementById("logoutbtn");
const showTodo = document.getElementById("todoShow");
const loader = document.getElementById("loader");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
  const menu = document.querySelector('.navbar ul');
    menu.classList.toggle('active');
});


const logOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      Toast.fire({
        icon: "success",
        title: "Logout successfully",
      });
    })
    .catch((error) => {
      // An error happened.
      Toast.fire({
        icon: "error",
        title: "Logout is not successfully",
      });
    });
};
logoutbtn.addEventListener("click", logOut);

const getTodo = async () => {
  loader.style.display = "block";
  showTodo.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Todos"));
  querySnapshot.forEach((doc) => {
    const { userName, title, imageURL, description } = doc.data();
    showTodo.innerHTML += `
      <div class="todo-card" id="todosOutput">
      <p class="title"><span class="dot"></span>@${userName}${userName.length}</p>
          <div class="hero">
            <img
            src="${imageURL}"
            alt="Travel photo"
            />
          </div>
          <div class="meta">
            <p class="title">${title}</p>
            <p class="desc">
            ${description}
            </p>
          </div>
        </div>
    `;
  });
  loader.style.display = "none";
};
getTodo();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "../../index.html";
  }
});
