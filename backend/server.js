const app = require("express")();
const env = require("dotenv");
const { newuser } = require("./router/newuser");
const { token } = require("./router/token");
const bodyParser = require("body-parser");
const cors = require('cors');
const { decodeToken } = require("./router/tokenDecode");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

env.config();

var users = [{ user: "hari", password: "hari" }];
let posts = [
    {
        user: "hari",
        UserId: 1,
        id: 1,
        image: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4013002.1999209207!2d75.6466699008283!3d10.815332748372574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0x559475cc463361f0!2sTamil%20Nadu!5e0!3m2!1sen!2sin!4v1716453320517!5m2!1sen!2sin",
        title: "Tamilnadu",
        subject: "Tamil Nadu covers an area of 130,058 km2 (50,216 sq mi), and is the eleventh largest state in India. The bordering states are Kerala to the west, Karnataka to the north west and Andhra Pradesh to the north. To the east is the Bay of Bengal and the state encircles the union territory of Puducherry.",
        content: `Tamil Nadu is a state in southern India. It covers more than 50,200 square miles (130,000 square km). Tamil people constitute the majority of the state's population, and Tamil is the state's official language. Tamil Nadu's capital is Chennai, which is an industrial centre, but the state is essentially agricultural.`,
    },
];
app.post("/signup", async (req, res) => {
    try {
        const newUser = users.find(user => user.user === req.body.user);
        if (!newUser) {
            const result = await new Promise((resolve, reject) => {
                newuser(req.body, (result) => {
                    users.push(result);
                    resolve(result);
                });
            });
            const tokens = await token(req.body.user);
            res.send({ error: false, token: tokens });
        }
    } catch (err) {
        res.send({ error: true });
    }
});

app.post("/login", async (req, res) => {
    try {
        const currentUser = users.find(user => user.user === req.body.user);
        if (currentUser && currentUser.user === req.body.user && currentUser.password === req.body.password) {
            const tokens = await token(req.body.user);
            res.send({ error: false, token: tokens });
        }
    } catch (err) {
        res.send({ error: true });
    }
});

app.post("/token", async (req, res) => {
    try {
        if (req.body.token) {
            const decode = await decodeToken(req.body.token);
            const forum = posts.filter(item => item.user === decode);
            res.send({ error: false, forum });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});

app.post("/general", async (req, res) => {
    try {
        res.send({ forum: posts });
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});

app.post("/newPost", async (req, res) => {
    try {
        const decode = await decodeToken(req.body.token);
        const id = posts[posts.length - 1].id + 1;
        if (decode) {
            const newpost = {
                user: decode,
                id: id,
                image: req.body.image,
                title: req.body.title,
                subject: req.body.subject,
                content: req.body.content,
                date: new Date(),
                likes: [],
                comment: [],
            }
            posts.push(newpost);
            res.send({ error: false });
        } else {
            res.send({ error: true });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});

app.post("/edit", async (req, res) => {
    try {
        const decode = await decodeToken(req.body.token);
        if (decode) {
            const id = req.body.id;
            const postIndex = posts.findIndex(post => post.id === id);
            if (postIndex !== -1) {
                const updatedPost = {
                    user: decode,
                    id: id,
                    image: req.body.image,
                    title: req.body.title,
                    subject: req.body.subject,
                    content: req.body.content,
                    date: new Date(),
                    likes: [],
                    comment: []
                };
                posts[postIndex] = updatedPost;
                res.send({ error: false });
            } else {
                res.status(404).send({ error: true, message: "Post not found" });
            }
        } else {
            res.send({ error: true, message: "Invalid token" });
        }
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});

app.post("/delete", async (req, res) => {
    try {
        const id = req.body.id;
        posts = posts.filter(item => item.id !== id);
        res.send({ error: false });
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});

app.post("/findOne", async (req, res) => {
    console.log(req.body)
    try {
        const id = req.body.id;
        const item = posts.find(item => item.id === +id);
        console.log(item)
        res.send({error: false, item: item});
    } catch (err) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("server is running on port", port);
});
