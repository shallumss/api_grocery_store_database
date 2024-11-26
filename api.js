const dboperation = require('./dboperation');
var Db =      require('./dboperation');
var Movie =   require('./Top_1000');

// now for api 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var router = express.Router();

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


router.use((request, response, next) => {
    console.log('middleware');
    next();
});


router.route('/movies').get((request, response) => {
    dboperation.getMovies().then(result => {
        response.json(result[0]);
    });
});




var port = process.env.PORT || 8090;
app.listen(port);
console.log('API is runnning at ' + port);


dboperation.getMovies().then(result => {
    console.log(result);
}).catch(err => {
    console.error('Error:', err);
});