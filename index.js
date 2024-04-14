const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;

app.use(userRoutes);

app.get('/', (req, res) => {
    res.json({Messsage: 'NCF Repository Backend Running!'});
});

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});
