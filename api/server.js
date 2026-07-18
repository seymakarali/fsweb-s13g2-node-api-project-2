const express = require('express');
const cors = require('cors');
const server = express();
const postsRouter = require('./posts/posts-router');

server.use(express.json());
server.use(cors());
server.use('/api/posts', postsRouter);

module.exports = server;