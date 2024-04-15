window.onload() = function (){
  const sendbutton = document.getElementById("submit");
  sendbutton.onclick = function () {
    if (document.getElementById("username").value && document.getElementById("password").value){
      return
    }
    disableAll();
    submit();
  };
  const register = document.getElementById("login");
  register.onclick = function () {
    window.location.href = "czheyuchatapp.onrender.com/login";
  };
}

function submit(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const apiUrl = "https://czheyuchatapp.onrender.com/api/register";
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
      if (data.result == "success"){
        alert("Register Success, redirecting to login page.")
        window.location.href = "czheyuchatapp.onrender.com/login";
      } else if(data.result == "username taken"){
        alert("Username Taken");
      } else {
        alert("Register Failed");
      }
      
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  enableAll();
}


function disableAll(){
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const sumbit = document.getElementById("submit");
  username.disabled = true;
  password.disabled = true;
  sumbit.disabled = true;
}

function enableAll(){
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const sumbit = document.getElementById("submit");
  username.disabled = false;
  password.disabled = false;
  sumbit.disabled = false;
}