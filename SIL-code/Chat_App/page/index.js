var lastgetdata = {};
var cooldownget = 2500
var url = "https://czheyuchatapp.onrender.com";
//url ="https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";
function sendClicked() {
  if (
    document.getElementById("message").value == "" ||
    localStorage.getItem("username") == ""
  ) {
    alert("Username or message is empty.");
    return;
  }
  console.log("send button clicked, posting message");
  const message = document.getElementById("message").value;

  document.getElementById("message").value = "";
  const type = "message";
  const value = message;
  const apiUrl = url + "/api/messagesend";
  const data = {
    type: type,
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    value: value,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const chatcontainer = document.getElementById("chat-container");
  chatcontainer.innerHtml =
    '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="m-0 p-0 fs-6">' +
    localStorage.getItem("username") +
    "</p></div></br>" +
    '<div class="m-0 p-0 d-flex flex-row-reverse"><div class="d-inline-flex m-0 p-1 rounded bg-secondary text-white"><p class="m-0 p-0 fs-6">' +
    value +
    "</p></div></div></br>\n";
  console.log(
    '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="m-0 p-0 fs-6">' +
      localStorage.getItem("username") +
      "</p></div></br>" +
      '<div class="m-0 p-0 d-flex flex-row-reverse"><div class="d-inline-flex m-0 p-1 rounded bg-secondary text-white"><p class="m-0 p-0 fs-6">' +
      value +
      "</p></div></div></br>\n",
  );
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response.ok);
      }
    })
    .then((data) => {
      console.log(data);
      console.log(lastgetdata);
      if (lastgetdata != data) {
        updateChat(data);
      } else {
        console.log("data is the same, did not redisplay.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateChat(data) {
  console.log("about to call formatting data");
  let formatted = format(data);
  console.log("data formatted");
  const chatContainer = document.getElementById("chat-container");
  //const chatMessage = document.createElement("div");
  //chatMessage.classList.add("chat-message");
  //chatMessage.innerHTML = data;
  //chatContainer.appendChild(chatMessage);

  chatContainer.innerHTML = formatted;
}

//https://javascript.plainenglish.io/how-to-really-implement-the-sleep-function-in-javascript-621b4ed1e618
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCycle() {
  console.log("getting data...");
  getdata();
  await sleep(cooldownget);
  getCycle();
}

function getdata() {
  const apiUrl = url + "/api/messagesget";
  const data = {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  };
  console.log(data);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log("fetching");
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response.ok);
      }
    })
    .then((data) => {
      if (lastgetdata != data) {
        console.log("data is not last get data, calling updatechat");
        updateChat(data);
      } else {
        console.log("data is the same, did not redisplay.");
      }
    });
}

function format(data) {
  //data is a {}
  let formated = "";
  for (let i = 0; i < data.data.length; i++) {
    if (i != 0) {
      formated += "\n";
    }
    if (data.data[i].username == localStorage.getItem("username")) {
      formated +=
        '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="m-0 p-0 fs-6">' +
        data.data[i].username +
        "</p></div></br>" +
        '<div class="m-0 p-0 d-flex flex-row-reverse"><div class="d-inline-flex m-0 p-1 rounded bg-primary text-white"><p class="m-0 p-0 fs-6">' +
        data.data[i].value +
        "</p></div></div></br>\n";
    } else {
      formated +=
        '<div class="m-0 p-0 d-flex"><p class="m-0 p-0 fs-6">' +
        data.data[i].username +
        "</p></div></br>" +
        '<div class="d-flex m-0 p-0"><div class="d-inline-flex m-0 p-1 rounded bg-success text-white"><p class="m-0 p-0 fs-6">' +
        data.data[i].value +
        "</p></div></div></br>\n";
    }
  }
  return formated;
}

window.onload = function () {
  if (
    !localStorage.getItem("loggedin") ||
    !localStorage.getItem("password") ||
    !localStorage.getItem("username")
  ) {
    console.log(localStorage.getItem("loggedin"));
    console.log(localStorage.getItem("password"));
    console.log(localStorage.getItem("username"));
    window.location.href = url + "/login";
  }
  console.log("page loaded.");
  var password = localStorage.getItem("password");
  var username = localStorage.getItem("username");
  let sendbutton = document.getElementById("sendbutton");
  sendbutton.onclick = function () {
    sendClicked();
  };
  const logindisplay = document.getElementById("logindisplay");
  logindisplay.innerHTML = "Logged in as <strong>" + username + "</strong>";
  let logout = document.getElementById("logoutbutton");
  logout.onclick = function () {
    window.location.href = url + "/login";
  };
  let sendinput = document.getElementById("message");

  // Execute a function when the user presses a key on the keyboard
  sendinput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("sendbutton").click();
    }
  });
  const slider = document.getElementById("getrange");
  const output = document.getElementById("getrangedisplay");
  output.innerHTML = "Current get cooldown: " + String(slider.value / 10) + "s"; // Display the default slider value
  
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    cooldownget = this.value*100;
    output.innerHTML = "Current get cooldown: " + String(this.value / 10) + "s"; // Display the updated slider value
  };
  //start get cycle
  getCycle();
};
