var lastgetdata = {};
var lastnotifyablemsg = {};
var lastparticipants = [];
var lastallusers = []
var cooldownget = 2500
var forcescroll = false
var url = "https://czheyuchatapp.onrender.com";
//url ="https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";
var replying = false;
var showdateunhover = false;
var replyingtoID;
//var chatID;

function getlastmsg(data){
  let searching = true;
  let searchindex = data.length-1;
  while (searching&&searchindex>=0){
    if(data[searchindex].type == "message"){
      msg = data[searchindex].value;
      searching = false;
    } else {
      searchindex--;
    }
  }
  return data[searchindex];
}; 

function deletechat(){
  const apiurl = url + "/api/deletechat"
  const data = {
    "chatid":chatID,
    "username": localStorage.getItem('username'),
    "password": localStorage.getItem('password')
  }
  const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  fetch(apiurl, options )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data)=>{
      if(data.result == "success"){
        window.location.href = url + "/chatlist";
      }else{
        alert('error, cannot delete chat');
      }
  });
}

function getusercanbeadded(participants){

  const apiurl = url + "/api/getusers"
  const data = {
    "username": localStorage.getItem('username'),
    "password": localStorage.getItem('password')
  }
  const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  fetch(apiurl, options )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data)=>{
      if(data!=lastallusers){
        lastallusers = data
        displaytodropdownadd(data,participants);
      }
  });
}

function dropdownchooseremove(buttonitem) {
  document.getElementById("userchooseremove").innerHTML = buttonitem.innerHTML;
}

function dropdownchooseadd(buttonitem) {
  document.getElementById("userchooseadd").innerHTML = buttonitem.innerHTML;
}

function displaytodropdownremove(data){
  //data is ["asdad","asfafa"]
  let html = ""
  const username = localStorage.getItem('username');
  const dropdownremove = document.getElementById("dropdownremove");
  for(let i = 0; i < data.length; i++){
    if(data[i] != username)
    html += `<button class="dropdown-item" type="button" onclick="dropdownchooseremove(this);">${data[i]}</button>`;
  }
  dropdownremove.innerHTML = html;
}

function displaytodropdownadd(data,participants){
  
  //data is ["asdad","asfafa"]
  const username = localStorage.getItem('username');
  let html = ""
  const dropdownadd = document.getElementById("dropdownadd");
  for(let i = 0; i < data.length; i++){
    if(data[i] != username && !participants.includes(data[i]))
    html += `<button class="dropdown-item" type="button" onclick="dropdownchooseadd(this);">${data[i]}</button>`;
  }
  dropdownadd.innerHTML = html;
}

function removeuser(){
  //console.log("remove user clicked");
  const selecteduser = document.getElementById('userchooseremove');
  if(selecteduser.innerHTML=="" || selecteduser.innerHTML == "choose user"|| selecteduser.innerHTML == localStorage.getItem('username')){
    //console.log("no user selected");
    return

  }
  const apiurl = url + "/api/removefromchat"
  const data = {
    "chatid":chatID,
    "usernametoremove":selecteduser.innerHTML,
    "username": localStorage.getItem('username'),
    "password": localStorage.getItem('password')
  }
  selecteduser.innerHTML = "choose user";
  const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  //console.log(data)
  fetch(apiurl, options )
    .then((response) => {
      if (response.ok) {
        return getparticipants();

      }
    })
    .then((participants) =>{
      getusercanbeadded(participants);
    
  });
}

function adduser(){
  const chatuserchoosen = document.getElementById('userchooseadd');
  if(chatuserchoosen.innerHTML=="choose user"){
    return
    
  }
  const apiurl = url + "/api/invitetochat"
  const data = {
    "chatid":chatID,
    "usernametoinvite":chatuserchoosen.innerHTML,
    "username": localStorage.getItem('username'),
    "password": localStorage.getItem('password')
  }
  chatuserchoosen.innerHTML = "choose user";
  const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  //console.log(data)
  fetch(apiurl, options )
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => {
      //console.log(data)
      const participantsdisplay = document.getElementById('participantsdisplay');
      participantsdisplay.innerHTML = "Participants: <strong>" + data.result + "</strong>"
      displaytodropdownremove(data.result);
      
    return getparticipants();
  })
  .then((participants) =>{
      getusercanbeadded(participants);

  });
}

async function getparticipants(){
  const apiUrl = url + "/api/getuserinchat";
  const data = {
    chatid:chatID,
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
  return await fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if(data!=lastparticipants){
        lastparticipants = data;
        const participantsdisplay = document.getElementById('participantsdisplay');
        participantsdisplay.innerHTML = "Participants: <strong>" + data.result + "</strong>"
        displaytodropdownremove(data.result);
      }
      return data.result;
    });
}

function sendClicked() {
  if (
    document.getElementById("message").value == "" ||
    localStorage.getItem("username") == ""
  ) {
    return;
  }
  const message = document.getElementById("message").value;

  document.getElementById("message").value = "";
  const type = "message";
  const value = message;
  const apiUrl = url + "/api/messagesend";
  const data = {
    chatid:chatID,
    type: type,
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    value: value,
    replying: replying,
    replyingtoID: replyingtoID,
  };
  cancelReply();
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
      if (!(JSON.stringify(lastgetdata) == JSON.stringify(data)) ){
        lastgetdata = data;
        lastnotifyablemsg = getlastmsg(data.data);
        updateChat(data);
      }
    });
  document.getElementById("message").focus();
}

function sendDelete(id){

  const apiUrl = url + "/api/deletemsg";
  const data = {
    chatid:chatID,
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    id: id
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

      if (!(JSON.stringify(lastgetdata) == JSON.stringify(data)) ){
        lastgetdata = data;
        let tempsaveforcescollstate = forcescroll;
        forcescroll = false
        updateChat(data);
        forcescroll = tempsaveforcescollstate;
      }
    });
}

function replyTo(id,message,user){
  replying = true;
  replyingtoID = id;
  const replydiv = document.getElementById("replydiv");
  const replyp = document.getElementById("replyp");
  replydiv.style.display = "flex";
  replyp.innerHTML = "Replying to <strong>" + user + ": " + shorten(message)+"</strong>";
  document.getElementById("message").focus();
}

function cancelReply(){
  replying = false;
  replyingtoID = null;
  const replydiv = document.getElementById("replydiv");
  const replyp = document.getElementById("replyp");
  replydiv.style.display = "none";
  replyp.innerHTML = ""
  document.getElementById("message").focus();

}

function updateChat(data) {
  let formatted = format(data);
  const chatContainer = document.getElementById("chat-container");
  //const chatMessage = document.createElement("div");
  //chatMessage.classList.add("chat-message");
  //chatMessage.innerHTML = data;
  //chatContainer.appendChild(chatMessage);

  chatContainer.innerHTML = formatted;
  if (forcescroll){
  scrolldown();
  }
}

//https://javascript.plainenglish.io/how-to-really-implement-the-sleep-function-in-javascript-621b4ed1e618
function sleep(ms) {
  
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCycle() {


  getdata();
  let participants = await getparticipants();
  getusercanbeadded(participants);
  for (let i = 0; i < 200; i++){
    document.querySelector('.progress-bar').style.width = (i/2) + '%';
    await sleep(cooldownget/200);
  }
  getCycle();
}

function getdata() {
  const apiUrl = url + "/api/messagesget";
  const data = {
    chatid: chatID,
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
      } else {
      }
    })
    .then((data) => {
      if (!(JSON.stringify(lastgetdata) == JSON.stringify(data)) ){
        lastnotifyablemsg = getlastmsg(data.data);
        lastgetdata = data;
        updateChat(data);
        

        if (!document.hasFocus()&&getlastmsg(data.data)!=lastnotifyablemsg){
          if (!("Notification" in window)) {
             // Check if the browser supports notifications
             alert("This browser does not support desktop notification");
           } else if (Notification.permission === "granted") {
             // Check whether notification permissions have already been granted;
             // if so, create a notification
             
             const notification = new Notification("New Message",{
               body: `${lastnotifyablemsg.username}: ${lastnotifyablemsg.value}`
             });
             // …
           } else if (Notification.permission !== "denied") {
             // We need to ask the user for permission
             Notification.requestPermission().then((permission) => {
               // If the user accepts, let's create a notification
               if (permission === "granted") {

                  const notification = new Notification("New Message",{
                    body: `${lastnotifyablemsg.username}: ${lastnotifyablemsg.value}`
                  });
                 // …
               }
             });
           }
         }
      } else {
        //console.log("data is the same, did not redisplay.");
      }
    });
}

function getUserMsgById(data,id){
  for (let i = 0; i < data.length; i++){
    if (data[i].id == id){
      return {deleted: data[i].type == "deleted",username: data[i].username, message: data[i].value}
    }
  }
  return false
}

function shorten(text){
  return text.slice(0,10) + "...";

}

function format(data) {
  //data is a {}
  let previous_username = "";
  let formated = "";
  for (let i = 0; i < data.data.length; i++) {
    if (i != 0) {
      formated += "\n";
    }
    //2024-04-20T14:43:32.376Z
    if(data.data[i].type == "alert"){
      formated += `<div class="text-light d-flex justify-content-center"><p>${data.data[i].value}</p></div>`
      continue
    }
    
    let datearray = data.data[i].date.split("T");
    let date = datearray[0];
    let time = datearray[1];
    let datearrayspecific = date.split("-");
    let year = datearrayspecific[0];
    let yeartwodigit = year.substring(2);
    let month = datearrayspecific[1];
    let day = datearrayspecific[2];
    
    let timearray = time.split(":");
    let hour = timearray[0];
    let minute = timearray[1];
    let secondandminisecond = timearray[2];
    let second = secondandminisecond.substring(0, 2);
    let minisecond = secondandminisecond.substring(3,6);
    let datewhennothover = `${yeartwodigit}/${month}/${day}-${hour}:${minute}:${second}`;
    let datewhenhover = `${year}/${month}/${day}-${hour}:${minute}:${second}.${minisecond}`;

    let replyingto = getUserMsgById(data.data,data.data[i].replyingtoID);

    if (data.data[i].username == localStorage.getItem("username")) {
      if (previous_username != data.data[i].username){
        formated +=
          '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="m-0 p-0 fs-6 lead text-light">' +
          data.data[i].username +
          "</p></div>";
      }
      if(data.data[i].replying)
      {      
        if(replyingto.deleted){

          formated +=
            '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="text-light m-0 p-0 fs-6">' +
            `replying to <a href="#${data.data[i].replyingtoID}">${replyingto.username}: <strong>original message deleted</strong></a>` +
            "</p></div>";
        }else{
          formated +=
          '<div class="m-0 p-0 d-flex flex-row-reverse"><p class="text-light m-0 p-0 fs-6">' +
          `replying to <a href="#${data.data[i].replyingtoID}">${replyingto.username}: <strong>${shorten(replyingto.message)}</strong></a>` +
          "</p></div>";
        }
        }
      if (data.data[i].type == "deleted"){
        if(showdateunhover){
        formated +=
          `<div class="m-1 p-0 mw-75 d-flex flex-row-reverse" ` +
          `onmouseleave="const simplep = this.children[1];`+
          `const detailedp = this.children[2];`+
          `simplep.style.display = 'flex';`+
          `detailedp.style.display = 'none';" `+

          `onmouseover="const simplep = this.children[1];`+
          `const detailedp = this.children[2];`+
          `simplep.style.display = 'none';`+
          `detailedp.style.display = 'flex';`+`">`+
          `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-secondary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
          "original message deleted" +
          `</p></div></div><p class="text-light" style="display: flex;">${datewhennothover}</p><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
        }else{
          
        
        
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex flex-row-reverse" ` +
            `onmouseleave="`+
            `const detailedp = this.children[1];`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="`+
            `const detailedp = this.children[1];`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-secondary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            "original message deleted" +
            `</p></div></div><p class="text-light" style="display:  none;">${datewhennothover}</p><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
        }
      }else if(data.data[i].type == "message"){
        if(showdateunhover){
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex flex-row-reverse" ` +
            `onmouseleave="const simplep = this.children[3];`+
            `const detailedp = this.children[4];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'none';`+
            `const deletebuttonelement = this.children[2];`+
            `deletebuttonelement.style.display = 'none';`+
            `simplep.style.display = 'flex';`+
            `detailedp.style.display = 'none';" `+
            
            `onmouseover="const simplep = this.children[3];`+
            `const detailedp = this.children[4];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'flex';`+
            `const deletebuttonelement = this.children[2];`+
            `deletebuttonelement.style.display = 'flex';`+
            `simplep.style.display = 'none';`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-primary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            data.data[i].value +
            `</p></div></div>`+
              '<button style="display: none;" '+
              'onclick="replyTo( '+
              data.data[i].id+
              `,'`+
              data.data[i].value+
              `','`+
              data.data[i].username+
              `');" `+
              `class="btn m-0 p-0 btn-outline-success" `+
              `type="button">reply</button>`+
              `<button style="display: none;" data-bs-id="${data.data[i].id}" data-bs-html='`+
                `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-primary text-white mw-100"><p class="text-light m-0 p-0 fs-6 text-break">` +
                data.data[i].value +
                `</p></div></div>`+
            `' data-bs-toggle="modal" data-bs-target="#confirmdelete" class="btn m-0 p-0 btn-outline-danger" type="button">delete</button><p class="text-light" style="display: flex;">${datewhennothover}</p><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
          
      }else{
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex flex-row-reverse" ` +
            `onmouseleave="`+
            `const detailedp = this.children[3];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'none';`+
            `const deletebuttonelement = this.children[2];`+
            `deletebuttonelement.style.display = 'none';`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="`+
            `const detailedp = this.children[3];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'flex';`+
            `const deletebuttonelement = this.children[2];`+
            `deletebuttonelement.style.display = 'flex';`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-primary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            data.data[i].value +
            `</p></div></div>`+
              '<button style="display: none;" '+
              'onclick="replyTo( '+
              data.data[i].id+
              `,'`+
              data.data[i].value+
              `','`+
              data.data[i].username+
              `');" `+
              `class="btn m-0 p-0 btn-outline-success" `+
              `type="button">reply</button>`+
              `<button style="display: none;" data-bs-id="${data.data[i].id}" data-bs-html='`+
                `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-primary text-white mw-100"><p class="text-light m-0 p-0 fs-6 text-break">` +
                data.data[i].value +
                `</p></div></div>`+
            `' data-bs-toggle="modal" data-bs-target="#confirmdelete" class="btn m-0 p-0 btn-outline-danger" type="button">delete</button><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
          }
      }
    } else {
      if (previous_username != data.data[i].username){
        formated +=
          '<div class="m-0 p-0 d-flex"><p class="text-light m-0 p-0 fs-6 lead">' +
          data.data[i].username +
          "</p></div>";
      }      
      if(data.data[i].replying)
      {      
        if(replyingto.deleted){

          formated +=
            '<div class="m-0 p-0 d-flex"><p class="text-light m-0 p-0 fs-6">' +
            `replying to <a href="#${data.data[i].replyingtoID}">${replyingto.username}: <strong>original message deleted</strong></a>` +
            "</p></div>";
        }else{
          formated +=
          '<div class="m-0 p-0 d-flex"><p class="text-light m-0 p-0 fs-6">' +
          `replying to <a href="#${data.data[i].replyingtoID}">${replyingto.username}: <strong>${shorten(replyingto.message)}</strong></a>` +
          "</p></div>";
        }
        }
      if (data.data[i].type == "deleted"){

        if(showdateunhover){
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex" ` +
            `onmouseleave="const simplep = this.children[1];`+
            `const detailedp = this.children[2];`+
            `simplep.style.display = 'flex';`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="const simplep = this.children[1];`+
            `const detailedp = this.children[2];`+
            `simplep.style.display = 'none';`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-secondary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            "original message deleted" +
            `</p></div></div><p class="text-light" style="display: flex;">${datewhennothover}</p><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
        }else{



          formated +=
            `<div class="m-1 p-0 mw-75 d-flex" ` +
            `onmouseleave="`+
            `const detailedp = this.children[1];`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="`+
            `const detailedp = this.children[1];`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-secondary text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            "original message deleted" +
            `</p></div></div><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;
        }
        

      }else if(data.data[i].type == "message"){
        if(showdateunhover){
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex" ` +
            `onmouseleave="const simplep = this.children[2];`+
            `const detailedp = this.children[3];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'none';`+
            `simplep.style.display = 'flex';`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="const simplep = this.children[2];`+
            `const detailedp = this.children[3];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'flex';`+
            `simplep.style.display = 'none';`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-success text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            data.data[i].value +
            `</p></div></div>`+
              '<button style="display: none;" '+
              'onclick="replyTo( '+
              data.data[i].id+
              `,'`+
              data.data[i].value+
              `','`+
              data.data[i].username+
              `');" `+
              `class="btn m-0 p-0 btn-outline-success" `+
              `type="button">reply</button><p class="text-light" style="display: flex;">${datewhennothover}</p><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;

        }else{
          formated +=
            `<div class="m-1 p-0 mw-75 d-flex" ` +
            `onmouseleave="`+
            `const detailedp = this.children[2];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'none';`+
            `detailedp.style.display = 'none';" `+

            `onmouseover="`+
            `const detailedp = this.children[2];`+
            `const replybuttonelement = this.children[1];`+
            `replybuttonelement.style.display = 'flex';`+
            `detailedp.style.display = 'flex';`+`">`+
            `<div class="d-flex m-1 p-0"><div class="text-wrap d-inline-flex m-0 p-1 rounded bg-success text-white mw-100"><a id="${data.data[i].id}"></a><p class="text-light m-0 p-0 fs-6 text-break">` +
            data.data[i].value +
            `</p></div></div>`+
              '<button style="display: none;" '+
              'onclick="replyTo( '+
              data.data[i].id+
              `,'`+
              data.data[i].value+
              `','`+
              data.data[i].username+
              `');" `+
              `class="btn m-0 p-0 btn-outline-success" `+
              `type="button">reply</button><p class="text-light" style="display: none;">${datewhenhover}</p></div>\n`;

            
        }
        
      }
    }
    previous_username = data.data[i].username;

  }
  formated += "<br><br><br><br>";

  return formated;
}

function scrolldown(){
  const body = document.getElementById("body")
  window.scrollTo(0, body.scrollHeight);

}

function getchatnamebyid(id){

  const apiUrl = url + "/api/chatnamebyid";
  const data = {
    chatid: id,
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
  //console.log("fetching chatname");
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        //console.log(response.ok);
      }
    }).then((data) => {
      const chatnamedisplay = document.getElementById("chatnamedisplay");
      chatnamedisplay.innerHTML = `Chat: <button type="button" class="btn btn-outline-light rounded" data-bs-toggle="modal" data-bs-target="#chat"><strong>${data.result}</strong></button>`;
      const chatmenutitle = document.getElementById("chatmenutitle");
      chatmenutitle.innerHTML = `Chat: <strong>${data.result}</strong>`;
    });
  return;
}

function setEvents(){
  //var password = localStorage.getItem("password");
  var username = localStorage.getItem("username");

  let sendbutton = document.getElementById("sendbutton");
  sendbutton.onclick = function () {
    sendClicked();
  };
  getchatnamebyid(chatID);
  
  const logindisplay = document.getElementById("logindisplay");
  logindisplay.innerHTML = "Logged in as <strong>" + username + "</strong>";

  const userdisplay = document.getElementById("userdisplay");
  userdisplay.innerHTML = "<strong>" + username + "</strong>";

  let logout = document.getElementById("logoutbutton");
  logout.onclick = function () {
    window.location.href = url + "/chat/login";
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

  const forcescrollbutton = document.getElementById("forcescrollbutton");
  forcescrollbutton.onclick = function () {
    forcescroll = !forcescroll;
    if (forcescroll) {
      forcescrollbutton.innerHTML = "Disable force scroll";
    } else {
      forcescrollbutton.innerHTML = "Enable force scroll";
    }
  }

  const deleteModal = document.getElementById('confirmdelete')
  if (deleteModal) {
    deleteModal.addEventListener('show.bs.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const id = button.getAttribute('data-bs-id');
      const html = button.getAttribute('data-bs-html');


      // Update the modal's content.
      const modalConfirm = deleteModal.querySelector('.deletebutton');
      const showcase = deleteModal.querySelector('.confirmtext');

      modalConfirm.onclick = function () {sendDelete(parseInt(id));}
      showcase.innerHTML = html;
    })
  }
  const adduserbutton = document.getElementById("adduserbutton");
  adduserbutton.onclick = function(){
    adduser();
  }
  const removeuserbutton = document.getElementById("removeuserbutton");
  removeuserbutton.onclick = function(){
    removeuser();
  }

  const  deletechatbutton = document.getElementById("deletechat");
  deletechatbutton.onclick = function(){
    deletechat();
  }
  
  let participants = getparticipants();
  getusercanbeadded(participants);

}

window.onload = function () {
  if (
    localStorage.getItem("loggedin") == null ||
    localStorage.getItem("password") == null ||
    localStorage.getItem("username") == null
  ) {
    window.location.href = url + "/chat/login";
  }
  //console.log("page loaded.");

  document.getElementById("message").focus();

  setEvents();
  getdata();
  scrolldown();
  document.getElementById("forcescrollbutton").click();
  getCycle();
};
