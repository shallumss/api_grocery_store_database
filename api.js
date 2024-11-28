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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



router.use((request, response, next) => {
    console.log('middleware');
    next();
});


router.route('/movies').get((request, response) => {
    dboperation.getMovies().then(result => {
        response.json(result[0]);
    });
});

router.route('/test').get((req, res) => {
    res.send('Test route is working!');
});





var port = process.env.PORT || 8090;
app.listen(port, '0.0.0.0', () => {
    console.log('API is running at port ' + port);
});




dboperation.getMovies().then(result => {
    console.log(result);
}).catch(err => {
    console.error('Error:', err);
});