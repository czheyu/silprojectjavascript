var url = "https://czheyuchatapp.onrender.com";

//url = "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001"



function submit(){
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
  .then((data) => {
    if (data.result == "success") {
      appendAlert("Register Success, redirecting to login page in 5 seconds.", "success");
      sleep(5000);
      window.location.href = url + "/chat/login";
    } else if (data.result == "username taken") {
      appendAlert("Username is taken, try another username.", "danger");
    }
  });
  enableAll();
}


function disableAll(){
    const usernamebox = document.getElementById("username");
    const passwordbox = document.getElementById("password");
    const sumbitbut = document.getElementById("submit");
    usernamebox.disabled = true;
    passwordbox.disabled = true;
    sumbitbut.disabled = true;
  }

function enableAll(){
  const usernamebox = document.getElementById("username");
  const passwordbox = document.getElementById("password");
  const sumbitbut = document.getElementById("submit");
  usernamebox.disabled = false;
  passwordbox.disabled = false;
  sumbitbut.disabled = false;
}


function appendAlert(message, type){
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '     <button type="button" onclick="this.parentNode.remove();" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
};


window.onload = function (){
  console.log("page loaded");
  const sendbutton = document.getElementById("submit");
  sendbutton.onclick = function () {
    console.log("clicked")
    if (document.getElementById("username").value=="" || document.getElementById("password").value==""){
      return
    }
    disableAll();
    submit();
  };
  const login = document.getElementById("login");
  login.onclick = function () {
    window.location.href = url + "chat/login";
  };
}


