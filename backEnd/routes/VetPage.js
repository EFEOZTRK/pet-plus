import express from "express";
import fetch from "node-fetch" 

const router = express.Router();

router.post("/vets", async (req, res) => {
  const { lat, lng } = req.body; // User location 
  
  try {
    // Url with queries . it needs to be done like this
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=veterinary&key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();  
    return res.json( data.results );
  }
   catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch vets" });
  }
});

export default router;
