const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("CONNECTED TO MONGODB")  
}

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore magnam, enim accusamus incidunt voluptate tempora quia praesentium voluptatum quasi veritatis, exercitationem deleniti dolor odit. Error, dolores. Et excepturi obcaecati dolore.',
            price
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });