require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// allow our app to use json from the body that gets passed up to it 
app.use(express.json());

// In a production app, you will probably want to store this in a database, since doing this will clear out the data in the array every time the server restarts.  But using this now for demo purposes:
let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

// allow deletion of refresh tokens
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

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
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}


app.listen(4000); 