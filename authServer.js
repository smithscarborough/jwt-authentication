require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// allow our app to use json from the body that gets passed up to it 
app.use(express.json());

// In a production app, you will probably want to store this in a better way than using let, since it will empty out every time - store in a database instead, for example
let refreshToken = []

app.use('/token', (req, res) => {
    const refreshToken = req.body.token
})

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

app.post('/login', (req, res) => {
    // Authenticate User - this is a 'post' request since we are creating a login token
    const username = req.body.username;
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}


app.listen(4000); 