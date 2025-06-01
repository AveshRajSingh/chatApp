import dotenv from 'dotenv';
// Load environment variables first, before other imports
dotenv.config();

import express from 'express';
import connectDB from './db/index.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
//database connection
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Database connection failed:', error.message);
});

app.use(cors({
  origin:['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Chat Application Backend');
});

app.use('/public', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

//user routes
import userRoutes from './routes/user.route.js';
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Log environment variables for debugging (excluding sensitive values)
  console.log("Environment:", process.env.NODE_ENV);
  console.log("ACCESS_TOKEN_EXPIRY is set:", !!process.env.ACCESS_TOKEN_EXPIRY);
  console.log("ACCESS_TOKEN_SECRET is set:", !!process.env.ACCESS_TOKEN_SECRET);
});