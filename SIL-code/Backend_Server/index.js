const fs = require("fs");
const express = require("express");

const app = express();
const port = 5000;

app.get("/api/messages", (req, res) => {
  res.send(readData());
});

app.post("/api/messages", (req, res) => {
  res.send(writeData(req.body));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function readData() {
    let dataarray = require("./data.json");
    return dataarray;
}

function writeData(data) {
  try {
    let dataarray = require("./data.json");
    dataarray.data.push(data);
    dataarray.countaccess++;
    fs.writeFileSync("./data.json", JSON.stringify(dataarray));
    return "success";
  } catch {
    return "error";
  }
}
