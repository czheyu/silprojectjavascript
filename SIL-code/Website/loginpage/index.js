var url = "https://czheyuchatapp.onrender.com";
//url ="https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";

function submit() {
  const submitbutton = document.getElementById("submit");

  submitbutton.innerHTML = ` <div class="spinner-border" style="height:20px;width:20px;" role="status"> <span class="visually-hidden">Loading...</span> </div>`;

  console.log("submit clicked");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const apiUrl = url + "/api/login";
  const data = {
    username: username,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log("starting to fetch");
  fetch(apiUrl, requestOptions)
    .then((response) => {
      console.log("fetched");
      return response.json();
    })
    .then(async (data) => {
      if (data.result == "success") {
        const submitbutton = document.getElementById("submit");

        submitbutton.innerHTML = `login`;

        localStorage.setItem("loggedin", true);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        showModal(
          `Login Success, redirecting to chat page in 5 seconds.\nClick <button type="button" class="btn btn-link" onclick="window.location.replace('https://czheyuchatapp.onrender.com/chatlist')">here</button> to redirect now.`,
          "Success",
        );
        await sleep(5000);
        window.location.href = url + "/chatlist";
      } else if (data.result == "failed") {
        const submitbutton = document.getElementById("submit");

        submitbutton.innerHTML = `login`;
        showModal("Username or password is incorrect.", "Error");
      }
    });

  enableAll();

  submitbutton.innerHTML = `login`;
}

function disableAll() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const submit = document.getElementById("submit");
  username.disabled = true;
  password.disabled = true;
  submit.disabled = true;
}

function enableAll() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const submit = document.getElementById("submit");
  username.disabled = false;
  password.disabled = false;
  submit.disabled = false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showModal(message, title) {
  const ModalLabel = document.getElementById("ModalLabel");
  const ModalBody = document.getElementById("ModalBody");
  ModalLabel.innerHTML = title;
  ModalBody.innerHTML = message;

  document.getElementById("showmodal").click();
}

window.onload = function () {
  const sendbutton = document.getElementById("submit");

  const usernamebox = document.getElementById("username");
  const passwordbox = document.getElementById("password");
  usernamebox.value = localStorage.getItem("username");
  passwordbox.value = localStorage.getItem("password");
  sendbutton.onclick = function () {
    if (
      document.getElementById("username").value &&
      document.getElementById("password").value
    ) {
      disableAll();
      submit();
    } else {
      showModal("Username or Password empty.", "error");
      console.log("user or pass empty");
    }
  };
  const register = document.getElementById("register");
  register.onclick = function () {
    window.location.href = url + "/chat/register";
  };

  const hasFocus = (ele) => ele === document.activeElement;
  const usernameinput = document.getElementById("username");
  const passwordinput = document.getElementById("password");
  const loginbutton = document.getElementById("submit");
  document.addEventListener("keydown", function (event) {
    if (event.key == "Enter" && hasFocus(usernameinput)) {
      event.preventDefault();
      passwordinput.focus();
    } else if (event.key == "Enter" && hasFocus(passwordinput)) {
      event.preventDefault();
      loginbutton.click();
    }
  });
};
