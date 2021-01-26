require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');


const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const enVal = process.env;
const stage = require('./config')[environment];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (environment != 'production') {
    app.use(logger('dev'));
}
    try {
         mongoose.connect(enVal.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
        console.log("MongoDB Conected")
    } catch (err) {
        console.error('err.message');
        console.error(err.message);
        process.exit(1);
    }


app.get('/', function(req, res) {
    res.send('hello node.js');
});

app.use('/api/v1', routes(router));

const PORT = enVal.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Server running at at localhost:${PORT}`)
});
module.exports = app;