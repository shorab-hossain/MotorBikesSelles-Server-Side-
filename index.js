const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mbzhc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        console.log('database collected')
        const database = client.db('motorbike');

        //userCollection
        const userCollection = database.collection('user');
         //get api for userCollection
         app.get('/user',async(req,res) =>{
            const cursor = userCollection.find({});
            const user =await cursor.toArray();
            res.send(user);
        })
       //post api For userCollection
        app.post('/user',async(req,res) =>{
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            // console.log('added user', result);
            // console.log('got new user', req.body);
            res.send(result)
        }) 
        //put user
        app.put('/user/admin',async(req,res) =>{
            const user = req.body;
            console.log('put',user);
            const filter ={email: user.email};
            const updateDoc ={$set:{role:'admin'}};
            const result = await userCollection.updateOne(filter,updateDoc);
            res.json(result);
        })
        //admin
        const mainUserCollection = database.collection('mainUser')

        //news collection
        const newsCollection = database.collection('news');
        //post api for newsCollection 
        app.post('/news',async(req,res)=>{
            const news = req.body;
            const result = await newsCollection.insertOne(news);
            res.json(result)
        })

        //get api for newsCollection
        app.get('/news',async(req,res) =>{
            const cursor = newsCollection.find({});
            const news = await cursor.toArray();
            res.send(news)
        })

        //Review collection
        const reviewCollection = database.collection('review');
        //post api for reviewCollection
        app.post('/review',async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result)
        });
        //get api for review collection
        app.get('/review',async(req,res) =>{
            // const email = req.query.email;
            // const query = {email:email}
            // console.log(query)
            // const result = await reviewCollection.find(query).toArray();
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
        })
        
        //bike collection
        const bikeCollection = database.collection('Bikes')

         // post api for bikeCollection 
        app.post('/Bikes',async(req,res) =>{
            const newBike = req.body;
            console.log('hit the post api',newBike)
            const Bikes = await dataCollection.insertOne(cardBike);
            res.send(Bikes)
        })

        // get api for bikeCollection
        app.get('/Bikes',async(req,res) =>{
            const cursor = bikeCollection.find({});
            const Bikes = await cursor.toArray();
            res.send(Bikes)
        })
        //get single api for bikeCollection
        app.get('/Bikes/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)}
            console.log(query)
            const Bikes = await bikeCollection.findOne(query)
            res.send(Bikes)
        })

          //delete api
          app.delete('/user/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query)
            console.log('delete user with id', id);
            res.json(result);
        })
       

    }
    finally{
            // await client.close();
    }
}



run().catch(console.dir);

app.get('/',(req,res) =>{
    res.send('Running My cardServer')
})

app.listen(port,() =>{
    console.log('Server is Running Now',port);
})