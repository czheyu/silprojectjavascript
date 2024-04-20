const fs = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const path = require("path");
app.use(express.json());


app.get("/", (req, res) => {
  console.log("GET / called");
  res.sendFile(__dirname + "/home/index.html");
});

app.get("/style.css", (req, res) => {
  console.log("GET /style.css called");

  res.sendFile(__dirname + "/home/style.css");
});


app.get("/chat", (req, res) => {
  console.log("GET /chat called");
  res.sendFile(__dirname + "/chatpage/index.html");
});

app.get("/chat/index.js", (req, res) => {
  console.log("GET /chat/index.js called");

  res.sendFile(__dirname + "/chatpage/index.js");
});

app.get("/chat/login", (req, res) => {
  console.log("GET /chat/login called");

  res.sendFile(__dirname + "/loginpage/index.html");
});

app.get("/chat/login/index.js", (req, res) => {
  console.log("GET /chat/login/index.js called");

  res.sendFile(__dirname + "/loginpage/index.js");
});

app.get("/chat/register", (req, res) => {
  console.log("GET /chat/register called");

  res.sendFile(__dirname + "/registerpage/index.html");
});

app.get("/chat/register/index.js", (req, res) => {
  console.log("GET /chat/register/index.js called");

  res.sendFile(__dirname + "/registerpage/index.js");
});



app.post("/api/messagesget", (req, res) => {
  console.log("POST /api/messagesget called");
  if (checkuser(req.body.password, req.body.username)) {
    console.log("getted msg")
    res.send(require("./data.json")); //need
  } else {
    console.log("wrong password or username- msgget");
  }
});

app.post("/api/messagesend", (req, res) => {
  console.log("POST /api/messagesend called");

  if (checkuser(req.body.password, req.body.username)) {
    handlePost(req.body, res); //need
  }
});

app.post("/api/login", (req, res) => {
  console.log("POST /api/login called");
  const loginattempt = checkuser(req.body.password, req.body.username);
  res.send(loginattempt); //need
  console.log("Attempted to login: "+"\n"+loginattempt+ "\nusername: "+req.body.password+"\npassword: "+ req.body.username);
});

app.post("/api/register", (req, res) => {
  console.log("POST /api/register called");
  res.send(checkregis(req.body.password, req.body.username));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
      console.log("Done writing");
    },
  );
  return '{"result":"success"}';
}
function handlePost(req, res) {
  const jsondata = require("./data.json");
  console.log(require("./data.json"));
  writeData(
    req.type,
    req.username,
    req.value,
    jsondata,
    //'{"countaccess": 0,"data": [{ "id": 1,"username": "zheyu","type": "message","value": "hi" }]}',
  );

  return require("./data.json");
}

function writeData(type, username, value, data) {
  let dataarray = data;
  try {
    let dataadding = {
      id: dataarray.countaccess,
      username: username,
      type: type,
      value: value,
    };
    dataarray["data"].push(dataadding);
    dataarray.countaccess++;
    fs.writeFile(
      path.join(__dirname, "/data.json"),
      JSON.stringify(dataarray),
      (err) => {
        // Checking for errors
        if (err) throw err;

        // Success
        console.log("Done writing");
      },
    );
    return "success";
  } catch (as) {
    console.log(as);
    return "error";
  }
}
