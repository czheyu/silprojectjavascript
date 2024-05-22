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

function deleteacc(){
  if(confirm("Are you sure you want to delete your account?")){
    fetch(url + "/api/removeuser",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      }),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.clear();
          window.location.href = url + "/chat/login";
        } else {
          alert("Error: " + data.error);
        }
      });
  }
}


function truncateString(str, maxLength) { 
    if (str.length > maxLength) { 
        return str.slice(0, maxLength - 3) + '...'; 
    } 
    return str; 
} 

function format(data){
  //data is in array of ids [{id:1,name:"hi"}] etc
  let formatted = "";
  for(let i=0;i<data.length;i++){
    if(data[i].lastmessage.username){
      formatted += `<button type="button" class="w-100 btn btn-outline-light rounded list-group-item list-group-item-action bg-dark text-light" onclick="window.location = '${url}/chatapp/${data[i].id}'"><div class="w-100 h-100"><h2>${data[i].name}<p class="text-primary">(${data[i].unread})</p></h2>${data[i].lastmessage.username}: <strong>${truncateString(data[i].lastmessage.value,50)}</strong></div></button>`
    } else {
      formatted += `<button type="button" class="w-100 btn btn-outline-light rounded list-group-item list-group-item-action bg-dark text-light" onclick="window.location = '${url}/chatapp/${data[i].id}'"><div class="w-100 h-100"><h2>${data[i].name}<p class="text-primary">(${data[i].unread})</p></h2><strong>${truncateString(data[i].lastmessage.value,50)}</strong></div></button>`    }
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


async function checkLogin(username, password){

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
  console.log("starting to fetch")
  return await fetch(apiUrl, requestOptions)
    .then((response) => {
      console.log("fetched")
      return response.json();
    }).then((data)=>{
      console.log("got data")
      if(data.result=="success"){
        localStorage.setItem("username",username);
        localStorage.setItem("password",password);
      }else if (data.result == "failed") {

        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem('loggedin')
        window.location.href = url + "/chat/login";
      }
    })
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
  var password = localStorage.getItem("password");

  checkLogin(username,password);

  
 
  const logindisplay = document.getElementById("logindisplay");
  logindisplay.innerHTML = "Logged in as <strong>" + username + "</strong>";

  let logout = document.getElementById("logoutbutton");
  logout.onclick = function () {
    window.location.href = url + "/chat/login";
  };

  getchatdata();
  getcycle();
}