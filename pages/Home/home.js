import {
  Toast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  getDocs,
} from "../../firebase.js";
const logoutbtn = document.getElementById("logoutbtn");
const showTodo = document.getElementById("todoShow");
const loader = document.getElementById("loader");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
  const menu = document.querySelector(".navbar ul");
  menu.classList.toggle("active");
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
        title: error,
      });
    });
};
logoutbtn.addEventListener("click", logOut);

const getTodo = async () => {
  loader.style.display = "block";
  showTodo.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Todos"));
  if (querySnapshot.empty) {
    showTodo.innerHTML = `
    <div class="todo-card" style="width: 100%; id="todosOutput">
    <p class="title" style="width: auto; font-size: 25px;">You are offline</p>
    </div>
    `;
  } else {
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
  }
    loader.style.display = "none";
};
getTodo();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "../../index.html";
  }
});
