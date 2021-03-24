const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const orderRouters = require('./api/routes/orders');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

//mongodb connection 
mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW +
    '@orderservice.gwc7k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        // useMongoClient: true
        useUnifiedTopology: true,
        useNewUrlParser: true

    })

//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

    res.header('Access-Control-Allo-Origin', '*');
    res.header('Access-Control-Allo-Origin', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {

        res.header('Access-Control-Allo-Origin', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//Routers which handles requests
app.use('/orders', orderRouters);

app.use((req, res, next) => {


    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({

        error: {
            message: error.message
        }
    })
});

module.exports = app;