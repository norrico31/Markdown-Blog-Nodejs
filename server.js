const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const db = require('./config/Key').MongoURI;
const methodOverride = require('method-override');

let Article = require('./model/article');
let app = express();

// VIEW ENGINE
app.set('view engine', 'ejs');

// TO OVERRIDE THE POST METHOD
app.use(methodOverride('_method')); 

// BODY PARSER
app.use(express.urlencoded({ extended: false }));

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(() => console.log('Connected to DB!'))
.catch((err) => console.log({ err }))

app.get('/', async(req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles })
})

// ROUTES
app.use('/articles', articleRouter);


let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[server.js]: running on PORT ${PORT}`));