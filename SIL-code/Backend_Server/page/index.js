function sendClicked() {
  console.log("send button clicked");
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
  console.log(data);
}
window.onload = function () {
  console.log("page loaded.");
  const sendbutton = document.getElementById("sendbutton");
  sendbutton.onclick = function () {
    sendClicked();
  };
};
