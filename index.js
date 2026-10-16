const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const urlModel = require("./url_model");

const Counter = require("./conterModel");
const Base62 = require("./base62");
const rateLimiter = require("express-rate-limit");
const redis=require("./redis")

const app = express();
app.use(express.json());

//Create the limiter
const rateLimitation = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    status: "Failed",
    message: "Too many requests, try again in a minute",
  },
});

//create a function that will connection to the database
async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connections successfully");
  } catch (err) {
    console.log("Failed to connect", err);
  }
}
dbConnection();

app.post("/short", rateLimitation, async (req, res) => {
  const { url } = req.body;

  try {
    if (!url) return res.status(400).json({ message: "Url is missing" });

    //URL Validation
    new URL(url);

    //add the default logic to each user
    const counter = await Counter.findOneAndUpdate(
      { _id: "url" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }, //full updated
    );

    //short the code -> secret code
    let shortcode = Base62(counter.seq);

    //update the main url model
    await new urlModel({ fullUrl: url, shortUrl: shortcode }).save();

    return res
      .status(201)
      .json({ status: "success", url: `${process.env.BASE_URL}/${shortcode}` });
  } catch (err) {
    console.log("Message failed", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return res.status(400).json({ message: "Only http/https URLs allowed" });
  }
});

//Redirection logic
//"http://localhost:4500/1791975227661"
//Implement redis caching logic

app.get("/:shortUrl", async (req, res) => {
 
  try {
    const { shortUrl } = req.params; //secret code

     let key=`url${shortUrl}`
      
      //IF THE REQUEST PRESENT IN CACHE
      console.time("redis")
      let cached=await redis.get(key)
      console.timeEnd("redis")
      if(cached){
        console.log('Cache Hit')
      return res.redirect(cached)
      }

    const checkingUrl = await urlModel  //DB QUEARY
      .findOne({ shortUrl })
      .select("fullUrl")
      .lean();

    if (!checkingUrl) {
      return res.status(400).json({ status: "failed", message: "Invalid Url" });
    }

   
   
    //SET THE DATA IN CACHING FOR AN HOUR
    await redis.set(key,checkingUrl.fullUrl,'EX',3600)

    //redirect logic
    res.redirect(checkingUrl.fullUrl);
  } catch (err) {
    console.log("Error", err);
    return res
      .status(500)
      .json({ status: "Failed", message: "Sorry for the inconvience" });
  }
});

let port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
