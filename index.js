const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//USER NAME: 14monjurhossen
//PASS: 4AM5UJThQp8PckmZ
//console.log(process.env.DB_USER)
//console.log(process.env.DB_PASS)


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zp5qruk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const craftCollection = client.db("craftDB").collection("item")

    app.get("/items", async(req, res) => {
      const cursor = craftCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/items', async(req, res) => {
      const newItem = req.body;
      console.log(newItem)
      const result = await craftCollection.insertOne(newItem);
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
   console.log("server is running") 
})