const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb'); 
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


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
    // await client.connect();

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

    app.delete("/items/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/items/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result);
    })

    app.put('/items/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatedItem = req.body;
      const SingleItem = {
        $set: {
          image: updatedItem.image,
          item_name: updatedItem.item_name,
          subcategory_Name: updatedItem.subcategory_Name,
          short_description: updatedItem.short_description,
          price: updatedItem.price,
          rating: updatedItem.rating,
          customization: updatedItem.customization,
          processing_time: updatedItem.processing_time,
          stockStatus: updatedItem.stockStatus
        }
      }
      const result = await craftCollection.updateOne(filter, SingleItem, options);
      res.send(result)
    })
    // dfjasdklfj
    // dfjasdklfj
    // dfjasdklfj

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