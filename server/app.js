require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/wristshots', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB can't connect"))

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', require('./routes/'))

app.use((err, req, res, next) => {
  console.log('Error caught by error handler')
  console.log(err)
  let status = err.status || 500
  let message = err.msg || "Internal server error"
  res.status(status).json({ message });
});

const PORT = 3000;
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) })