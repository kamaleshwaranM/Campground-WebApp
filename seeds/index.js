const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places}=require('./seedHelpers')


const mongoDB = 'mongodb://127.0.0.1:27017/yelpCamp';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
 //Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',()=>console.log("Database Connected"));

const makeTitle = array=>array[Math.floor(Math.random()*array.length)]

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++) {
        const random = Math.floor(Math.random()*1000);
        const price =  Math.floor(Math.random()*20 )+10;
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${makeTitle(descriptors)} ${makeTitle(places)}`,
            description:'Paris is one of the most beautiful cities in the world. It is known worldwide for the Louvre Museum.',
            price,
            geometry:{
              type: "Point",
              coordinates : [cities[random].longitude,cities[random].latitude]
            },
            author:'631ae9ba262beb61979e6234',
            images:[
              {
                url: 'https://res.cloudinary.com/kamaleshm0304/image/upload/v1663604149/yelp/gqbehety2hvxeeabeciv.jpg',
                filename: 'yelp/gqbehety2hvxeeabeciv'
              }
            ]
        })
        await camp.save();
    }
}
seedDB().then(()=>mongoose.connection.close());