window.onload() = function (){
  const sendbutton = document.getElementById("submit");
  sendbutton.onclick = function () {
    if (document.getElementById("username").value && document.getElementById("password").value){
      return
    }
    disableAll();
    submit();
  };
  const register = document.getElementById("register");
  register.onclick = function () {
    window.location.href = "https://czheyuchatapp.onrender.com/register";
  };
}


function submit(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const apiUrl = "https://czheyuchatapp.onrender.com/api/login";
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
        alert("Register Success, redirecting to chat page.")
        window.location.href = "https://czheyuchatapp.onrender.com/";
      } else if(data.result == "failed"){
        alert("Username or password is incorrect");
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