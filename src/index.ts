const express = require('express');
const mongoose = require ('mongoose');
const app = express();
const PORT =8080;

const MONGO_URI = 'mongodb://admin:password@localhost:27017/xclone?authSource=admin';

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err: String) => console.error('Connection error:', err));

app.use(express.json());




// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     logger.log('server runnung at ')
