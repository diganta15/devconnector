const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;

connectDB()
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});