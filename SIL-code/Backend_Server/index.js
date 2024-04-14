const fs = require("fs");
const express = require("express");

const app = express();
const port = 5000;
app.use(express.urlencoded({ extended: false }));

app.get("/api/messages", (req, res) => {
  res.send(readData());
});

app.post("/api/messagesend", function (req, res) {
  console.log(req.body);
  writeData(req.body.type, req.body.username, req.body.value);
  res.send(readData());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function readData() {
  let dataarray = require("./data.json");
  return dataarray;
}

function writeData(type, username, value) {
  try {
    let dataarray = JSON.parse(require("./data.json"));
    let data = {
      id: dataarray.countaccess,
      username: username,
      type: type,
      value: value,
    };
    dataarray["data"].push(data);
    dataarray.countaccess++;
    fs.writeFile("./data.json", JSON.stringify(dataarray));
    return "success";
  } catch (as) {
    console.log(as);
    return "error";
  }
}
