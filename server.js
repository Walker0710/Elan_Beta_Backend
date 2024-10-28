const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const registerRoute = require('./routes/registerRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/register', registerRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
