const fs = require("fs");
const express = require("express");
const app = express();
const port = 5000;
app.use(express.json());

app.get("/api/messagesget", (req, res) => {
  res.send(readData());//need
});

app.post("/api/messagesend", function (req, res) {
  handlePost(req.body);//need
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





function readData() {
  return JSON.parse(fs.readFile("data.json"));
}

function handlePost(req) {
  fs.readFile("data.json", function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    writeData(req.type, req.username, req.value, JSON.parse(data));
  });
  fs.readFile("data.json", function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    res.send(JSON.parse(data));
  });
}

function writeData(type, username, value, data) {
  let dataarray = data;
  try {
    let data = {
      id: dataarray.countaccess,
      username: username,
      type: type,
      value: value,
    };
    dataarray["data"].push(data);
    dataarray.countaccess++;
    fs.writeFile("data.json", JSON.stringify(dataarray), (err) => {
      // Checking for errors
      if (err) throw err;

      // Success
      console.log("Done writing");
    });
    return "success";
  } catch (as) {
    console.log(as);
    return "error";
  }
}


