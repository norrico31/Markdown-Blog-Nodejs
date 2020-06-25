const express = require('express');
const Article = require('../model/article');
const router = express.Router();

const saveArticleAndRedirect = (path) => {
    return async (req, res) => {
        let article = req.article

        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)

        } catch (err) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}

router.get('/new', (req, res) => {
    res.render('articles/new', {
        article: new Article()
    });
})

// replace :id to :slug to use slug
router.get('/:slug', async(req, res) => {
    try {
        const articleID = await Article.findOne({ slug: req.params.slug }); // use findOne to use slug (NOT findbyid)
        if(articleID == null) {
            return res.redirect('/');
        } else {
            res.render('articles/show', { article: articleID })
        }
    } catch(err) {
        console.log({err})
    }
})


// POST METHOD
router.post('/', async(req, res, next) => {
    try {

        req.article = new Article()
        next()

    } catch(err) {
        console.log({ err })
    }
    
}, saveArticleAndRedirect('new'))
  
// PUT or EDIT METHOD
router.put('/:id', async (req, res, next) => {
    try {
        req.article = await Article.findById(req.params.id)
        next();
    } catch(err) {
        console.log({ err })
    }
}, saveArticleAndRedirect('edit'))
  

// get the ID
router.get('/edit/:id', async(req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', { article: article }); 
    } catch(err) {
        console.log({ err });
    }
})


// delete
router.delete('/:id', async(req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch(err) {
        console.log({ err });
    }
})



module.exports = router;