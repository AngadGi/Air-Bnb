const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const data = require('./data.js');
const routeKey = "5b3ce3597851110001cf6248f8ed17be56a548e59d1371e289c130c3";

let Mongo_URL = "mongodb://127.0.0.1:27017/Air_bnb";

main().then( () => {
  console.log("connected to DataBase");
}).catch((err)=>{
  console.log(err);
})

async function main() {
  await mongoose.connect(Mongo_URL);
}

const getCoordinates = async (location, country) => {
  const query = location+', '+country;
  console.log("Query:", query);
  try {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${routeKey}&text=${query}`;
    const response = await fetch(url);  // ✅ Use native fetch
    const data = await response.json();
    // console.log("API Response:", data);

    if (data.features && data.features.length > 0) {
      return data.features[0].geometry;  // { type: "Point", coordinates: [lon, lat] }
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
  return { type: "Point", coordinates: [0, 0] }; // Default if not found
};


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDB = async () => {
  await Listing.deleteMany({});
  console.log(routeKey);

  const modifiedData = [];
  
  for (const obj of initData.data) {
    const geometry = await getCoordinates(obj.location, obj.country);
    modifiedData.push({ ...obj, owner: "67cde3e8d6524cb09fc4bf1e", geometry });

    // await sleep(700); // Wait 0.7 seconds (to stay under 100 requests/min)
  }

  await Listing.insertMany(modifiedData);
  console.log("Data was initialized");
};

initDB();