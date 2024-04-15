function sendClicked() {
  console.log("send button clicked, posting message");
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;
  document.getElementById("username").value = "";
  document.getElementById("message").value = "";
  const type = "message";
  const value = message;
  const apiUrl =
    "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev/api/messagesend";
  const data = {
    type: type,
    username: username,
    value: message,
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
      console.log(data);
      updateChat(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateChat(data) {
  let formatted = format(data);
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
  await sleep(2500);
  getCycle();
}

function getdata() {
  const apiUrl =
    "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev/api/messagesget";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      updateChat(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function format(data) {
  //data is a {}
  let formated = "";
  for (let i = 0; i < data.data.length; i++) {
    if (i != 0) {
      formated += "\n";
    }
    formated +=
      '<div class="m-0 p-0 d-inline-flex"><p class="m-0 p-0 fs-6">'+
      data.data[i].username+
      '</p></div></br>'+
      '<div class="d-inline-flex p-1 rounded bg-primary text-white">' +
      data.data[i].value +
      '</div></br>\n';
  }
  return formated;
}

window.onload = function () {
  console.log("page loaded.");
  const sendbutton = document.getElementById("sendbutton");
  sendbutton.onclick = function () {
    sendClicked();
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

  //start get cycle
  getCycle();
};
