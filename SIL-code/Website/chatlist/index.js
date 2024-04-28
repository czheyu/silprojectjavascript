var url = "https://czheyuchatapp.onrender.com";
//url = "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";
var lastdata = "";

function createchatfunct(){
  const chatnamebox = document.getElementById('chatnamebox').value;
  if(chatnamebox.length<1){
    return 
  }
  createchat(chatnamebox);
  document.getElementById('chatnamebox').value = "";
}

function format(data){
  //data is in array of ids [{id:1,name:"hi"}] etc
  let formatted = "";
  for(let i=0;i<data.length;i++){
    if(data[i].lastmessage.username){
      formatted += `<div class="m-1 p-0 mw-100 d-flex border border-outline-light"><button type="button" class="w-100 btn btn-outline-light rounded" onclick="window.location = '${url}/chatapp/${data[i].id}'"><div class="w-100 h-100"><h2>${data[i].name}</h2>${data[i].lastmessage.username}: <strong>${data[i].lastmessage.value}</strong></div></button></div>`
    } else {
      formatted += `<div class="m-1 p-0 mw-100 d-flex border border-outline-light"><button type="button" class="w-100 btn btn-outline-light rounded" onclick="window.location = '${url}/chatapp/${data[i].id}'"><div class="w-100 h-100"><h2>${data[i].name}</h2><strong>${data[i].lastmessage.value}</strong></div></button></div>`
    }
  }
  return formatted
}

function displaychats(data){
  //data is in array of ids [{id:1,name:"hi"}] etc

  const chatlist = document.getElementById("chatlist");
  const chatlistdiv = document.getElementById("chatlistdiv");
  
  chatlistdiv.innerHTML= format(data);
}

function createchat(chatname){

  const apiUrl = url + "/api/createchat";
  const data = {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    chatname: chatname,
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
      if (response.ok) {
        return response.json()
      }
    })
  .then((data)=>{
    if(data.result=="success"){
    
      getchatdata();
    }
  })
}

function getchatdata(){

  const apiUrl = url + "/api/getchats";
  const data = {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
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
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
        console.log("got chats");
      if(data!=lastdata){
        lastdata = data
        displaychats(data);

      }

    });

}

async function getcycle(){
  while (true){
    getchatdata();
    await new Promise(r => setTimeout(r, 5000));
  }
}


window.onload = function () {
  if (
    localStorage.getItem("loggedin") == null ||
    localStorage.getItem("password") == null ||
    localStorage.getItem("username") == null
  ) {
    window.location.href = url + "/chat/login";
  }
  console.log("page loaded.");
  
  var username = localStorage.getItem("username");


  const logindisplay = document.getElementById("logindisplay");
  logindisplay.innerHTML = "Logged in as <strong>" + username + "</strong>";

  let logout = document.getElementById("logoutbutton");
  logout.onclick = function () {
    window.location.href = url + "/chat/login";
  };

  getchatdata();
  getcycle();
}