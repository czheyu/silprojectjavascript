function sendClicked() {
  console.log("send button clicked, posting message");
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;
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
      '<div class="chat-message">' +
      data.data[i].value +
      '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-secondary">' +
      data.data[i].username +
      '</span></div>';
  }
  return formated;
}

window.onload = function () {
  console.log("page loaded.");
  const sendbutton = document.getElementById("sendbutton");
  sendbutton.onclick = function () {
    sendClicked();
  };
  //start get cycle
  getCycle();
};
