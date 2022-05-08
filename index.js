const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihfxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try {
        await client.connect();
        const bookCollection = client.db('warehouse').collection('book');
   app.get('/book',async(req,res)=>{
    const query = {};
    const cursor = bookCollection.find(query);
    const books = await cursor.toArray();
    // const books = await cursor.limit(3).toArray();
    res.send(books);
   });

   app.get('/book/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: ObjectId(id)};
       const book = await bookCollection.findOne(query);
       res.send(book);
   });

   app.get('/bookCount', async(req, res)=>{
       const query ={};
       const cursor = bookCollection.find(query);
       const count = await cursor.count();
    //    res.json(count)
       res.send({count})
   })

   //POST
   app.post('/book', async(req,res)=>{
    const newBook = req.body;
    const result = await bookCollection.insertOne(newBook);
    res.send(result);
});

//Delete
app.delete('/book/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await bookCollection.deleteOne(query);
    res.send(result);
});

    }
    finally{

    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running a new wareHouse..')
});

app.listen(port,()=>{
    console.log('Listening to port', port)
})