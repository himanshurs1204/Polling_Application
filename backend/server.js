import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import pollRoutes from './routes/pollRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import pollSocket from './sockets/pollSocket.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', pollRoutes);
app.use('/api', responseRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

pollSocket(io);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 