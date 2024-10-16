const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("CONNECTED TO MONGODB")  
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/campgrounds', async (req,res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new',(req,res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async(req,res) => {
  const { campground } = req.body;
  const newCampground = new Campground(campground)
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`)
})

app.get('/campgrounds/:id', async(req,res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  res.render('campgrounds/show', { campgrounds })
})

app.get('/campgrounds/:id/edit', async(req,res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  res.render('campgrounds/edit', {campgrounds});
})

app.put('/campgrounds/:id', async(req,res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async(req,res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log("CONNECTED TO PORT 3000")
})