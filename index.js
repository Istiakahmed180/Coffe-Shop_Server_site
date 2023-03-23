const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// -------- MongoDB User Info---------
// user: coffeShop
// pass: BazLlSQHfPxd2UCm

const uri =
  "mongodb+srv://coffeShop:BazLlSQHfPxd2UCm@cluster0.nzbnhmd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    hotCoffeCollections = client
      .db("coffeShop")
      .collection("hotCoffeCollections");
    icedCoffeCollections = client
      .db("coffeShop")
      .collection("icedCoffeCollections");

    app.get("/hot_coffe", async (req, res) => {
      const query = {};
      const cursor = hotCoffeCollections.find(query);
      const sort = hotCoffeCollections.find(query).limit(6);
      const coffes = await cursor.toArray();
      const sortCoffes = await sort.toArray();
      res.send({ coffes, sortCoffes });
    });

    app.get("/hot_coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hotCoffeCollections.findOne(query);
      res.send(result);
    });

    app.get("/iced_coffe", async (req, res) => {
      const query = {};
      const cursor = icedCoffeCollections.find(query);
      const sort = icedCoffeCollections.find(query).limit(3);
      const coffes = await cursor.toArray();
      const sortCoffes = await sort.toArray();
      res.send({ coffes, sortCoffes });
    });

    app.get("/iced_coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await icedCoffeCollections.findOne(query);
      res.send(result);
    });

    app.post("/post_req", async (req, res) => {
      const body = req.body;
      const result = await hotCoffeCollections.insertOne(body);
      res.send(result);
    });

    app.post("/iced_post_req", async (req, res) => {
      const body = req.body;
      const result = await icedCoffeCollections.insertOne(body);
      res.send(result);
    });

    app.delete("/hot_coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hotCoffeCollections.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.delete("/iced_coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await icedCoffeCollections.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Coffe shop server running");
});

app.listen(port, () => {
  console.log("Coffe shop server running on port", port);
});
