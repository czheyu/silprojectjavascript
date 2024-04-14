const fs = require("fs");
const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname+ "/index.html");
});
app.get("/api/messagesget", (req, res) => {
  res.send(require("./data.json")); //need
});

app.post("/api/messagesend", function (req, res) {
  handlePost(req.body, res); //need
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function readData() {
  return JSON.parse(fs.readFile("data.json"));
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
