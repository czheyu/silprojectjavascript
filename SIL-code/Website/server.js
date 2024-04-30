const fs = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const { GoogleGenerativeAI,  HarmCategory,
      HarmBlockThreshold } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env['KEY']);
const generationConfig = {
  stopSequences: ["\\?STOP_GENERATION#$\\"],
  maxOutputTokens: 200,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig, safetySettings });

const path = require("path");
app.use(express.json());

var url = "https://czheyuchatapp.onrender.com";
//url = "https://9f385a7a-d4b2-4c35-b8fc-9937e0c39c58-00-zrl36mrg5918.picard.replit.dev:3001";

app.get("/", (req, res) => {
  //console.log("GET / called");
  res.sendFile(__dirname + "/home/index.html");
});

app.get("/style.css", (req, res) => {
  //console.log("GET /style.css called");

  res.sendFile(__dirname + "/home/style.css");
});

app.get("/chatlist", (req, res) => {
  //console.log("GET /chatlist called");
  res.sendFile(__dirname + "/chatlist/index.html");
});
app.get("/chatlist/index.js", (req, res) => {
  //console.log("GET /chatlist/index.js called");
  res.sendFile(__dirname + "/chatlist/index.js");
});

app.get("/chat", (req, res) => {
  res.redirect(url + "/chatlist");
});

app.get("/chatapp/:chatid", (req, res) => {
  //console.log("GET /chat called");

  res.send(
    fs
      .readFileSync(__dirname + "/chatpage/index.html", "utf8")
      .replaceAll("CHATIDREPLACE", req.params.chatid),
  );
  //send jsfile that sets var chatid to req.params.chatid
});

app.get("/chatapp/:chatid/index.js", (req, res) => {
  //console.log("GET /chat/:chatid/index.js called");

  res.sendFile(__dirname + "/chatpage/index.js");
});

app.get("/chat/login", (req, res) => {
  //console.log("GET /chat/login called");

  res.sendFile(__dirname + "/loginpage/index.html");
});

app.get("/chat/login/index.js", (req, res) => {
  //console.log("GET /chat/login/index.js called");

  res.sendFile(__dirname + "/loginpage/index.js");
});

app.get("/chat/register", (req, res) => {
  console.log("GET /chat/register called");

  res.sendFile(__dirname + "/registerpage/index.html");
});

app.get("/chat/register/index.js", (req, res) => {
  //console.log("GET /chat/register/index.js called");

  res.sendFile(__dirname + "/registerpage/index.js");
});

app.post("/api/deletemsg", (req, res) => {
  //console.log("POST /chat/deletemsg called");
  if (
    checkuser(req.body.password, req.body.username) &&
    checkaccess(req.body.chatid, req.body.password, req.body.username)
  ) {
    res.send(
      deleteMessage(
        req.body.chatid,
        req.body.id,
        req.body.username,
        req.body.password,
      ),
    ); //need
  } else {
    //console.log("wrong password or username- msgget");
  }
});

app.post("/api/messagesget", (req, res) => {
  if (
    checkuser(req.body.password, req.body.username) &&
    checkaccess(req.body.chatid, req.body.password, req.body.username)
  ) {
    res.send(getchatdatabyid(req.body.chatid)); //need
  } else {
    //console.log("wrong password or username- msgget");
  }
});

app.post("/api/messagesend", (req, res) => {
  //console.log("POST /api/messagesend called");
  if (
    checkuser(req.body.password, req.body.username) &&
    checkaccess(req.body.chatid, req.body.password, req.body.username)
  ) {
    const posted = handlePost(req.body.chatid, req.body, res)
    res.send(posted.result); //need
    if(req.body.value.indexOf("@ai")>-1){
      writeairesponse(aiprompt(req.body.value,req.body.chatid),req.body.chatid,posted.id);
    }else if(req.body.value.indexOf("/clearai")>-1){
        clearchataihist(req.body.chatid);
    }

  }
});

app.post("/api/login", (req, res) => {
  //console.log("POST /api/login called");
  const loginattempt = checkuser(req.body.password, req.body.username);
  res.send(loginattempt); //need
  //console.log("Attempted to login: " +"\n" + loginattempt + "\nusername: " + req.body.password + "\npassword: " + req.body.username,);
});

app.post("/api/register", (req, res) => {
  //console.log("POST /api/register called");
  res.send(checkregis(req.body.password, req.body.username));
});

app.post("/api/getchats", (req, res) => {
  //console.log("POST /api/getchats called");
  if (checkuser(req.body.password, req.body.username)) {
    res.send(getallchatsbyuser(req.body.username)); //need
  } else {
    //console.log("wrong password or username- msgget");
  }
});

app.post("/api/createchat",(req,res) => {
  //console.log("POST /api/createchat called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(createchat(req.body.username,req.body.chatname));
  }
  
});
app.post("/api/chatnamebyid",(req,res) =>{
  //console.log("POST /api/chatnamebyid called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(chatnamebyid(req.body.chatid,req.body.username))
  }
  
});

app.post("/api/getuserinchat",(req,res) =>{
  //console.log("POST /api/getuserinchat called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(getusersinchat(req.body.chatid,req.body.username))
  }
});

app.post("/api/invitetochat",(req,res) =>{
  //console.log("POST /api/invitetochat called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(invitetochat(req.body.chatid,req.body.usernametoinvite,req.body.username))
  }

});

app.post("/api/removefromchat",(req,res) =>{
  //console.log("POST /api/removefromchat called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(removefromchat(req.body.chatid,req.body.usernametoremove,req.body.username))
  }

});

app.post("/api/getusers",(req,res) =>{
  //console.log("POST /api/getusers called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"){
    res.send(getusers())
  }

});

app.post("/api/deletechat",(req,res) =>{
  //console.log("POST /api/deletechat called");
  if(JSON.parse(checkuser(req.body.password,req.body.username)).result == "success"&&checkaccess(req.body.chatid,req.body.password,req.body.username)){
    res.send(deletechat(req.body.chatid,req.body.username))
  }

});

//for cronjob:
app.get("/cron",(req,res) =>{
  res.send("cronjobed");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function clearchataihist(chatid){
  const entiredata = require("./data.json");
  console.log("clearchataihist called:");
  console.log(entiredata.chats[entiredata.chats.indexOf(getchatdatabyid(chatid))].ai_chat_history);

  console.log(entiredata.chats[entiredata.chats.indexOf(getchatdatabyid(chatid))].ai_chat_history[1].parts);
  
  entiredata.chats[entiredata.chats.indexOf(getchatdatabyid(chatid))].ai_chat_history = [];
  fs.writeFileSync(__dirname + "/data.json", JSON.stringify(entiredata));
  return;
}

function checkNoBlank(data,chatdata,chatid){
  let tobemodified = chatdata;
  let newdata = [];
  // data is [{role:"user",parts:[{text:"hi"}]},{},{},{}]
  for(let i=1;i<data.length+1;i++){
    if(i%2==0){
      //even
      
      
    }else{
      //odd
      console.log(data)
      console.log(data[i])
      console.log(data[i+1])
      console.log(data[i].role)

      console.log(data[i].parts)
      if(data[i].parts!=undefined){
        if(data[i].parts.length!=0&&data[i+1].parts.length!=0){
          if(data[i].parts[0].text!=""&&data[i+1].parts[0].text!=""){
            newdata.push(data[i],data[i+1]);
            continue;
          }
        }
      }
    }
  }
  tobemodified.ai_chat_history = newdata;
  pushdatatochatbychatid(
  require("./data.json").chats.indexOf(chatdata),
  tobemodified,
  chatid,
  );
  return newdata;
}

async function aiprompt(msg,chatid) {
  let chatdata;
  chatdata = getchatdatabyid(chatid);
  let tobemodified = chatdata;
  const chat = model.startChat({
    history:await checkNoBlank(tobemodified.ai_chat_history,chatdata,chatid),
    generationConfig: {
      maxOutputTokens: 200,
    },
  });
  chatdata = getchatdatabyid(chatid);
  tobemodified = chatdata
  // For text-only input, use the gemini-pro model



  return await chat.sendMessage(msg)
  .then((chat)=>{
    return chat.response
  })
  .then((response)=>{
    console.log(response.text());
    return response.text();
  })
  .then(async (response)=>{
    const text = await response;
    console.log(text)  ;
    if(text != "" ){
       tobemodified.ai_chat_history.push(      
        {
           role:"user",
           parts: [{ text: msg }],
        },
       {
          role: "model",
          parts: [{ text: text }],
       },
       );
      console.log(tobemodified)
     pushdatatochatbychatid(
      require("./data.json").chats.indexOf(chatdata),
      tobemodified,
      chatid,
    );
    return text.replaceAll("<","&lt").replaceAll(">","&gt");
    } else {console.log("error")}
  })
}

async function writeairesponse (response,chatid,promptid){
  let chatdata = getchatdatabyid(chatid);
  writeData(
    "ai",
    "@ai",
    await response,
    true,
    await promptid,
    await chatdata,
    chatid,
  );
}

function generatechatid(listofcurrentids){
  //8 digit- meaning ~1bil ids
  let newid;
  let found = false;
  while(found==false){
    newid = Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000);
    if(!listofcurrentids.includes(newid)){
       found=true
    }
  }
  return newid
}

function deletechat(chatid,username){
  let data = require('./data.json');
  for(let i = 0; i<data.chats.length; i++){
    if(data.chats[i].id == chatid){
      console.log(username+" deleted chat: "+data.chats[i].name+"(id:"+data.chats[i].id+")");
      data.chatids.splice(data.chatids.indexOf(chatid),1);
      data.chats.splice(i,1);
      data.chatscount -= 1;
      fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data));
      return JSON.stringify({result: "success"})
    }
  }
  return JSON.stringify({result: "error"})

}

function getusers(){
  const userdata = require('./userdata.json');
  let userdataarray = [];
  for (let i = 0; i < userdata.users.length; i++){
    userdataarray.push(userdata.users[i].username);
  }
  return userdataarray;
}

function removefromchat(id,usernametoremove,username){
    const data = require("./data.json");
    for (let i = 0; i < data.chats.length; i++) {
      if (data.chats[i].id == id && data.chats[i].users.includes(username)&& data.chats[i].users.includes(usernametoremove)) {
        data.chats[i].users.splice(data.chats[i].users.indexOf(usernametoremove),1);
        const alert = {"id":data.chats[i].countaccess,"type":"alert","value":`${usernametoremove} was removed by ${username}`};

        data.chats[i].countaccess += 1;

        data.chats[i].data.push(alert);
        fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data));
        console.log(`${username}removed ${usernametoremove} from chat: ${data.chats[i].name} (id:${data.chats[i].id})`);
      }
    }
  return getusersinchat(id,username);
}

function createchat(user, chatname) {
  const entiredata = require("./data.json");
  const chatid = generatechatid(entiredata.chatids);

  const data = {
    users: [user],
    id: chatid,
    name: chatname,
    countaccess: 1,
    ai_chat_history:[],
    data: [{"id":0,"username":"","type":"alert","value":`Chat Created by ${user}`,"date":new Date().toISOString(),"replying":false,"replyingtoID":null}],
  };
  console.log("created chat: "+chatname+"(id:"+chatid+")");

  entiredata.chatids.push(chatid);
  entiredata.chatscount += 1;

  entiredata.chats.push(data);
  fs.writeFileSync(__dirname+"/data.json", JSON.stringify(entiredata));
  return JSON.stringify({result: "success"});
}

function chatnamebyid(id,user){
  const data = require("./data.json")
  for(let i = 0; i<data.chats.length; i++){
    if (data.chats[i].id == id && data.chats[i].users.includes(user)){
      return `{"result": "${data.chats[i].name}"}`
    }
  }
  return false
}

function invitetochat(chatid, usernametoinvite,user) {
  const data = require("./data.json");
  for (let i = 0; i < data.chats.length; i++) {
    if (data.chats[i].id == chatid && data.chats[i].users.includes(user)&& !data.chats[i].users.includes(usernametoinvite)) {
      data.chats[i].users.push(usernametoinvite);
      const alert = {"id":data.chats[i].countaccess,"type":"alert","value":`${usernametoinvite} was added by ${user}`};
      
      data.chats[i].countaccess += 1;

      data.chats[i].data.push(alert);
      
      fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data));
      console.log(`${username} added ${usernametoremove} from chat: ${data.chats[i].name} (id:${data.chats[i].id})`);
    }
  }
  return getusersinchat(chatid,user);
}

function getusersinchat(id,user) {
  const data = require("./data.json")
  let response = "["
  for(let i = 0; i<data.chats.length; i++){
    if (data.chats[i].id == id && data.chats[i].users.includes(user)){
      for (let j = 0; j<data.chats[i].users.length; j++){
        response += '"'+data.chats[i].users[j] + '"';
        if (j != data.chats[i].users.length-1){
          response += ',';

        }
      }
      response += "]"
      //console.log(`{"result": ${response}}`)
      return `{"result": ${response}}`

    }
  }

  return false
}

function pushdatatochatbychatid(index, data, chatid) {
  const entiredata = require("./data.json");
  entiredata.chats[index] = data;
  fs.writeFileSync(__dirname + "/data.json", JSON.stringify(entiredata));
  return;
}

function getallchatsbyuser(username) {
  const data = require("./data.json");
  const chats = data.chats;
  let listofchats = [];
  for (let i = 0; i < chats.length; i++) {
    if (chats[i].users.includes(username)) {
      listofchats.push({id:chats[i].id,name:chats[i].name,lastmessage:chats[i].data[chats[i].data.length-1]});
    }
  } //return list of ids
  return listofchats;
}

function checkaccess(chatid, pass, user) {
  const chatdata = getchatdatabyid(chatid);
  if (chatdata == null) {
    return false;
  }
  if (chatdata.users.includes(user)) {
    return true;
  }
}

function getchatdatabyid(id) {
  const data = require("./data.json");
  const chats = data.chats;
  for (let i = 0; i < chats.length; i++) {
    if (chats[i].id == id) {
      return chats[i];
    }
  }
  return null;
}

function deleteMessage(chatid, id, user, pass) {
  const data = getchatdatabyid(chatid);
  if (data == null) {
    return '{"result":false}';
  }
  for (let i = 0; i < data.data.length; i++) {
    if (
      data.data[i].id == id &&
      data.data[i].username == user &&
      JSON.parse(checkuser(pass, user)).result == "success"
    ) {
      data.data[i].type = "deleted";
      data.data[i].value = null;
      pushdatatochatbychatid(
        require("./data.json").chats.indexOf(data),
        data,
        chatid,
      );
      return getchatdatabyid(chatid);
    }
  }
}

function checkuser(pass, user) {
  const jsonuserdata = require("./userdata.json");
  for (let i = 0; i < jsonuserdata.users.length; i++) {
    if (
      jsonuserdata.users[i].username == user &&
      jsonuserdata.users[i].password == pass
    ) {
      return '{"result":"success"}';
    }
  }
  return '{"result":"failed"}';
}

function checkregis(pass, user) {
  if (user == "select user") {
    return '{"result":"username taken"}';
  }
  let jsonuserdata = require("./userdata.json");
  for (let i = 0; i < jsonuserdata.users.length; i++) {
    if (jsonuserdata.users[i].username == user) {
      return '{"result":"username taken"}';
    }
  }

  //if runs till here: means username isnt taken
  jsonuserdata = require("./userdata.json");
  jsonuserdata.users.push({
    id: jsonuserdata.usercount,
    username: user,
    password: pass,
  });
  jsonuserdata.usercount++;
  fs.writeFile(
    path.join(__dirname, "/userdata.json"),
    JSON.stringify(jsonuserdata),
    (err) => {
      // Checking for errors
      if (err) throw err;

      // Success
    },
  );
  return '{"result":"success"}';
}

function handlePost(chatid, reqbody, res) {
  const jsondata = getchatdatabyid(chatid);
  if (jsondata == null) {
    return '{"result":false}';
  }
  const id = writeData(
    reqbody.type,
    reqbody.username,
    reqbody.value.replaceAll("<","&lt").replaceAll(">","&gt"),
    reqbody.replying,
    reqbody.replyingtoID,
    jsondata,
    chatid,
  );

  return {result:getchatdatabyid(chatid),id:id}
}

function writeData(
  type,
  username,
  value,
  replying,
  replyingtoID,
  data,
  chatid,
) {
  let dataarray = data;
  let id = dataarray.countaccess
  let dataadding = {
    id: id,
    username: username,
    type: type,
    value: value,
    date: new Date().toISOString(),
    replying: replying,
    replyingtoID: replyingtoID,
  };
  dataarray["data"].push(dataadding);
  dataarray.countaccess++;
  pushdatatochatbychatid(
    require("./data.json").chats.indexOf(dataarray),
    dataarray,
    chatid,
  );
  return id
}
