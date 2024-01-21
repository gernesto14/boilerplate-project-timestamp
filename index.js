// index.js
// where your node app starts

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path"; // Import the 'path' module
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
// Set the 'public' folder as the location for serving static files
app.use(express.static(path.join(__dirname, "public")));

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date?", (req, res) => {
  let { date } = req.params;
  let parsedDate;

  // Convert from UNIX to UTC
  function unixToUtc(unixTimestampMillis) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(unixTimestampMillis);
    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate().toString().padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    const dateString = `${dayOfWeek}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;

    return dateString;
  }

  // Convert from UTC to UNIX
  function utcToUnix(utcDateString) {
    const date = new Date(utcDateString);
    return date.getTime();
  }

  // If no date is provided, return the current date in both Unix and UTC
  if (!date) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // Check if the date is a Unix timestamp (number only)
  if (/^\d+$/.test(date)) {
    // Convert string to number
    parsedDate = new Date(parseInt(date));
  } else {
    // Try parsing the date string
    parsedDate = new Date(date);
  }

  // Check if the date is valid
  if (isNaN(parsedDate)) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ utc: unixToUtc(parsedDate), unix: utcToUnix(parsedDate) });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
