var url = "https://czheyuchatapp.onrender.com";

//url = "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001"



function submit(){

  const submitbutton = document.getElementById("submit");

  submitbutton.innerHTML = ` <div class="spinner-border" style="height:20px;width:20px;" role="status"> <span class="visually-hidden">Loading...</span> </div>`;

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const apiUrl = url + "/api/register";
  const data = {
    username: username,
    password: password
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
  .then(async(data) => {
    if (data.result == "success") {
      const submitbutton = document.getElementById("submit");

      submitbutton.innerHTML = `register`;


      showModal(
        "Register Success, redirecting to login page in 5 seconds.",
        "Success",
      );
      await sleep(5000);
      window.location.href = url + "/chat/login";
    } else if (data.result == "username taken") {
      showModal("Username is taken, try another username.", "Error");
    
    }
  });
  enableAll();

  submitbutton.innerHTML = 
    `register`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function disableAll(){
    const usernamebox = document.getElementById("username");
    const passwordbox = document.getElementById("password");
    const submitbut = document.getElementById("submit");
    usernamebox.disabled = true;
    passwordbox.disabled = true;
    submitbut.disabled = true;
  }

function enableAll(){
  const usernamebox = document.getElementById("username");
  const passwordbox = document.getElementById("password");
  const submitbut = document.getElementById("submit");
  usernamebox.disabled = false;
  passwordbox.disabled = false;
  submitbut.disabled = false;
}


function showModal(message, title) {
  const ModalLable = document.getElementById("ModalLable");
  const ModalBody = document.getElementById("ModalBody");
  ModalLable.innerHTML = title;
  ModalBody.innerHTML = message;

  document.getElementById("showmodal").click();
}


window.onload = function (){
  console.log("page loaded.");
  const sendbutton = document.getElementById("submit");
  sendbutton.onclick = function () {
    console.log("clicked")
    if (document.getElementById("username").value=="" || document.getElementById("password").value==""){
      showModal("Username or Password empty.", "error");
      return
    }
    disableAll();
    submit();
  };
  const login = document.getElementById("login");
  login.onclick = function () {
    window.location.href = url + "/chat/login";
  };

  const hasFocus = (ele) => ele === document.activeElement;
  const usernameinput = document.getElementById("username");
  const passwordinput = document.getElementById("password");
  const registerbutton = document.getElementById("submit");
  document.addEventListener("keydown", function (event) {
    if (event.key == "Enter" && hasFocus(usernameinput)) {
      event.preventDefault();
      passwordinput.focus();
    } else if (event.key == "Enter" && hasFocus(passwordinput)) {
      event.preventDefault();
        registerbutton.click();
    }
  });
}


