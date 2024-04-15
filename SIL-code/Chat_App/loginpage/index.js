var url = "https://czheyuchatapp.onrender.com";
url =
  "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";

function submit() {
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

  fetch(apiUrl, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.result == "success") {
        localStorage.setItem("loggedin", true);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        alert("Login Success, redirecting to chat page.");
        window.location.href = url + "/";
      } else if (data.result == "failed") {
        alert("Username or password is incorrect");
      }
    });
  enableAll();
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

window.onload = function () {
  console.log("page loaded");
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
      console.log("user or pass empty");
    }
  };
  const register = document.getElementById("register");
  register.onclick = function () {
    window.location.href = url + "/register";
  };
};
