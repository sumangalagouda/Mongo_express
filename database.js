const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();

app.use(express.json());

const dburl = process.env.MONGO_URI;

const client = new MongoClient(dburl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(" Connected to MongoDB!");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
  }
}
run().catch(console.dir);


app.post("/api/bookings", async (req, res) => {
  const { id,name, email, event, ticketType } = req.body;

  try {
    const database = client.db("college");
    const synergiaCollection = database.collection("Synergia_Event");

    await synergiaCollection.insertOne({
        id,
      name,
      email,
      event,
      ticketType,

      createdAt: new Date().toISOString().split("T")[0]
    });

    console.log(" Booking inserted successfully!");
    res.json({ success: true, message: "Booking added successfully!" });
  } catch (error) {
    console.error(" Error inserting booking:", error);
    res.status(500).json({ success: false, message: "Failed to insert booking." });
  }
});

//GET	/api/bookings	Get all bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const database = client.db("college");
        const synergiaCollection = database.collection("Synergia_Event");

        const bookings = await synergiaCollection.find({}).toArray();
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error(" Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings." });
    }
});

//GET	/api/bookings/:id	Get booking by ID
app.get("/api/bookings/:id",async (req,res)=>{
            const database = client.db("college");
            const synergiaCollection = database.collection("Synergia_Event");
            const bid=req.params.id

    try {
        const booking = await synergiaCollection.findOne({ id:parseInt(bid) });
        if (booking) {
            res.json({ success: true, data: booking });
        } else {
            res.status(404).json({ success: false, message: "Booking not found." });
        }
    } catch (error) {
        console.error(" Error fetching booking:", error);
        res.status(500).json({ success: false, message: "Failed to fetch booking." });
    }
})

//PUT	/api/bookings/:id	Update participant details

app.put("/api/bookings/:id",async (req,res)=>{
    const database = client.db("college");
    const synergiaCollection = database.collection("Synergia_Event");
    const bid=req.params.id
    const { name, email, event, ticketType } = req.body;

    try {
        const result = await synergiaCollection.updateOne(
            { id: parseInt(bid) },
            { $set: { name, email, event, ticketType } }
        );
        if (result.modifiedCount > 0) {
            res.json({ success: true, message: "Booking updated successfully!" });
        } else {
            res.status(404).json({ success: false, message: "Booking not found." });
        }
    } catch (error) {
        console.error(" Error updating booking:", error);
        res.status(500).json({ success: false, message: "Failed to update booking." });
    }
});


//DELETE	/api/bookings/:id	Delete/cancel booking
app.delete("/api/bookings/:id",async (req,res)=>{
    const database = client.db("college");
    const synergiaCollection = database.collection("Synergia_Event");
    const bid=req.params.id
    try {
        const result = await synergiaCollection.deleteOne({ id: parseInt(bid) });
        if (result.deletedCount > 0) {
            res.json({ success: true, message: "Booking deleted successfully!" });
        } else {
            res.status(404).json({ success: false, message: "Booking not found." });
        }
    } catch (error) {
        console.error(" Error deleting booking:", error);
        res.status(500).json({ success: false, message: "Failed to delete booking." });
    }
});


//GET	/api/bookings/search?email=xyz	Search booking by email
app.get("/api/bookings/search",async (req,res)=>{
    const database = client.db("college");
    const synergiaCollection = database.collection("Synergia_Event");
    const email=req.query.email
    try {
        const bookings = await synergiaCollection.find({ email: email }).toArray();
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error(" Error searching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to search bookings." });
    }
});

//GET	/api/bookings/filter?event=Synergia
app.get("/api/bookings/filter",async (req,res)=>{
    const database = client.db("college");
    const synergiaCollection = database.collection("Synergia_Event");
    const event=req.query.event
    try {
        const bookings = await synergiaCollection.find({ event: event }).toArray();
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error(" Error filtering bookings:", error);
        res.status(500).json({ success: false, message: "Failed to filter bookings." });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
