const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { newuser } = require('./router/newuser');
const { token } = require('./router/token');
const { decodeToken } = require('./router/tokenDecode');

env.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoUri = process.env.DB_URI ;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define schemas and models
const userSchema = new mongoose.Schema({
    user: String,
    password: String,
});

const postSchema = new mongoose.Schema({
    user: String,
    UserId: Number,
    id: Number,
    image: String,
    title: String,
    subject: String,
    content: String,
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ user: req.body.user });
        if (!existingUser) {
            const newUser = new User(req.body);
            await newUser.save();
            const tokens = await token(req.body.user);
            res.send({ error: false, token: tokens });
        } else {
            res.send({ error: true, message: 'User already exists' });
        }
    } catch (err) {
        res.send({ error: true });
    }
});

app.post('/login', async (req, res) => {
    try {
        const currentUser = await User.findOne({ user: req.body.user, password: req.body.password });
        if (currentUser) {
            const tokens = await token(req.body.user);
            res.send({ error: false, token: tokens });
        } else {
            res.send({ error: true, message: 'Invalid username or password' });
        }
    } catch (err) {
        res.send({ error: true });
    }
});

app.post('/token', async (req, res) => {
    try {
        if (req.body.token) {
            const decode = await decodeToken(req.body.token);
            const forum = await Post.find({ user: decode });
            res.send({ error: false, forum });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

app.post('/general', async (req, res) => {
    try {
        const forum = await Post.find({});
        res.send({ forum });
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

app.post('/newPost', async (req, res) => {
    try {
        const decode = await decodeToken(req.body.token);
        const lastPost = await Post.findOne().sort({ id: -1 });
        const id = lastPost ? lastPost.id + 1 : 1;
        if (decode) {
            const newPost = new Post({
                user: decode,
                id,
                image: req.body.image,
                title: req.body.title,
                subject: req.body.subject,
                content: req.body.content,
                date: new Date().toISOString(),
                likes: [],
                comments: [],
            });
            await newPost.save();
            res.send({ error: false });
        } else {
            res.send({ error: true, message: 'Invalid token' });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

app.post('/edit', async (req, res) => {
    try {
        const decode = await decodeToken(req.body.token);
        if (decode) {
            const post = await Post.findOne({ id: req.body.id });
            if (post) {
                post.image = req.body.image;
                post.title = req.body.title;
                post.subject = req.body.subject;
                post.content = req.body.content;
                post.date = new Date().toISOString();
                await post.save();
                res.send({ error: false });
            } else {
                res.status(404).send({ error: true, message: 'Post not found' });
            }
        } else {
            res.send({ error: true, message: 'Invalid token' });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

app.post('/delete', async (req, res) => {
    try {
        await Post.deleteOne({ id: req.body.id });
        res.send({ error: false });
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

app.post('/findOne', async (req, res) => {
    try {
        const item = await Post.findOne({ id: req.body.id });
        res.send({ error: false, item });
    } catch (err) {
        res.status(500).send({ error: true, message: 'Internal server error' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server is running on port', port);
});

