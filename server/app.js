const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config({ path: '.env' });

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(errorHandler);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.use(express.static(path.join(__dirname, '../client/build/')));

app.get('*', (req, res) => {
  const filename = path.join(__dirname, '../client/build/index.html');
  res.sendFile(filename);
});

const PORT = process.env.PORT || 7070;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  server.close(() => process.exit(1));
});
