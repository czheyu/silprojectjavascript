const fs = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const path = require("path");
app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / called");
  res.sendFile(__dirname + "/page/index.html");
});

app.get("/login", (req, res) => {
  console.log("GET /login called");

  res.sendFile(__dirname + "/loginpage/index.html");
});

app.get("/login/index.js", (req, res) => {
  console.log("GET /login/index.js called");

  res.sendFile(__dirname + "/loginpage/index.js");
});

app.get("/register", (req, res) => {
  console.log("GET /register called");

  res.sendFile(__dirname + "/registerpage/index.html");
});

app.get("/register/index.js", (req, res) => {
  console.log("GET /register/index.js called");

  res.sendFile(__dirname + "/registerpage/index.js");
});

app.get("/index.js", (req, res) => {
  console.log("GET /index.js called");

  res.sendFile(__dirname + "/page/index.js");
});

app.post("/api/messagesget", (req, res) => {
  console.log("POST /api/messagesget called");
  if (checkuser(req.body.password, req.body.username)) {
    res.send(require("./data.json")); //need
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
  res.send(checkuser(req.body.password, req.body.username)); //need
});

app.post("/api/register", (req, res) => {
  console.log("POST /api/register called");
  res.send(checkregis(req.body.password, req.body.username));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function checkuser(pass, user) {
  const jsonuserdata = JSON.parse(require("./userdata.json"));
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
  const jsonuserdata = JSON.parse(require("./userdata.json"));
  for (let i = 0; i < jsonuserdata.users.length; i++) {
    if (jsonuserdata.users[i].username == use) {
      return '{"result":"username taken"}';
    }
  }
  //if runs till here: means username isnt taken
  jsonuserdata = JSON.parse(require("./userdata.json"));
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
