require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// allow our app to use json from the body that gets passed up to it 
app.use(express.json());

const posts = [
    {
        username: 'Smith',
        title: 'Post 1'
    }, 
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // if we have an authHeader, then return the authHeader token portion or return 'undefined'
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.send(403)
        req.user = user
        next()
    })
}

app.listen(3000);