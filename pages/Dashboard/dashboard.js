import {
  Toast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "../../firebase.js";
const logoutbtn = document.getElementById("logoutbtn");

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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "../../index.html";
  }
});

// -----------------------------------------------------------------------------------
const todoTitle = document.getElementById("todotitle");
const todoImage = document.getElementById("todoImage");
const todoDesc = document.getElementById("todoDesc");
const addTodoBtn = document.getElementById("addtodobtn");
const showTodo = document.getElementById("todoShow");
const showPost = document.getElementById("Add_Post");
const hidePost = document.getElementById("frm");
const loader = document.getElementById("loader");
const heading = document.getElementById("heading");
const showUserName = document.getElementById("showUserName");
let isEdit = null;
let currentUser = null;
loader.style.display = "none";

// show menu
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
  const menu = document.querySelector(".navbar ul");
  menu.classList.toggle("active");
});
// show form
showPost.addEventListener("click", () => {
  hidePost.style.display =
    hidePost.style.display === "block" ? "none" : "block";
});

// access userid and email
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  }
});

// add Data
const addTodo = async () => {
  event.preventDefault();
  if (!currentUser) {
    alert("User not logged in");
    return;
  }

  if (isEdit) {
    return; // Update mode me addTodo NA chalay
  }

  if (
    todoTitle.value !== "" ||
    todoImage.value !== "" ||
    todoDesc.value !== ""
  ) {
    let fullEmail = currentUser.email; // e.g. "abc@gmail.com"
    let userName = fullEmail.match(/^[a-zA-Z]+/)[0];
    let todoObj = {
      title: todoTitle.value,
      imageURL: todoImage.value,
      description: todoDesc.value,
      userId: currentUser.uid,
      userName: userName,
    };
    try {
      const docRef = await addDoc(collection(db, "Todos"), todoObj);
      console.log("Document written with ID: ", docRef.id);
      getTodo();
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      hidePost.style.display = "none";
    }
  } else {
    Toast.fire({
      icon: "error",
      title: "Please input filled",
    });
  }
};
addTodoBtn.addEventListener("click", addTodo);

// Read get data
const getTodo = async () => {
  loader.style.display = "block";
  showTodo.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Todos"));
  querySnapshot.forEach((doc) => {
    const { userId, userName, title, imageURL, description } = doc.data();
    // jo user ho wohi apni post dekhe sake or edit delete kar sake
    if (currentUser.uid === userId) {
      showUserName.innerText = `@${userName}${userName.length}`;
      showUserName.style.display = "block";
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
            <div class="UDbtndiv">
              <button class="addbtn" id="edittodobtn" onclick="editData('${doc.id}',this)">Edit</button>
              <button class="logout-btn" id="deltodobtn" onclick="deleteData('${doc.id}',this)">Delete</button>
            </div>
          </div>
        </div>
    `;
    }
  });
  loader.style.display = "none";
};
getTodo();

// Edit Data
window.editData = async (id, e) => {
  hidePost.style.display = "block";
  addTodoBtn.innerText = "Update Post";
  heading.innerText = "Update Post";
  try {
    let editData = await getDoc(doc(db, "Todos", id));
    // console.log(editData.data());
    let { title, imageURL, description } = editData.data();
    todoTitle.value = title;
    todoImage.value = imageURL;
    todoDesc.value = description;
    isEdit = id;
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error,
    });
  }
};

// update Data
const updateData = async () => {
  if (!isEdit) {
    return; // Jab edit mode OFF ho to update NA chalay
  }
  try {
    let updateObj = {
      title: todoTitle.value,
      imageURL: todoImage.value,
      description: todoDesc.value,
    };
    await updateDoc(doc(db, "Todos", isEdit), updateObj);
    isEdit = null;
    todoTitle.value = "";
    todoImage.value = "";
    todoDesc.value = "";
    getTodo();
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error,
    });
  } finally {
    hidePost.style.display = "none";
    addTodoBtn.innerText = "Add Post";
    heading.innerText = "Add Post";
  }
};
addTodoBtn.addEventListener("click", updateData);

// Delete Function
window.deleteData = async (id, del) => {
  // console.log("Del",id,del);
  del.innerText = "Deleting...";
  try {
    await deleteDoc(doc(db, "Todos", id));
    getTodo();
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error,
    });
  }
};
