const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
// await client.close();
// midddleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmmhgrv.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeClaction = client.db("coffeeDB").collection("coffee");

    app.get('/coffees', async(req, res)=>{
        const cursor = coffeeClaction.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query= {_id: new ObjectId(id)};
        const result = await coffeeClaction.findOne(query);
        res.send(result)
    })

    app.post('/coffees', async(req, res)=>{
        const newCoffees = req.body;
        console.log(newCoffees)
        const result = await coffeeClaction.insertOne(newCoffees);
        res.send(result);
    })

    app.put('/coffees/:id', async(req, res) =>{
        const id = req.params.id;
        const filter ={_id : new ObjectId(id)};
        const options = { upsert: true };
        const updateCoffee = req.body;
        const coffee = {
            $set: {
                name: updateCoffee.name,
                quantity: updateCoffee.quantity, 
                supplier: updateCoffee.supplier, 
                taste: updateCoffee.taste, 
                category: updateCoffee.category, 
                details: updateCoffee.details,
                photo: updateCoffee.photo
            },
          };
        const result = await coffeeClaction.updateOne(filter, coffee, options);
        res.send(result);
    })

    app.delete('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query= {_id: new ObjectId(id)};
        const result = await coffeeClaction.deleteOne(query);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World! coffee stare')
})

app.listen(port,()=> {
    console.log(`coffee server is running : ${port}`)
})