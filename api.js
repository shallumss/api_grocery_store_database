const dboperation = require('./dboperation');
var Db =      require('./dboperation');


const { getMoviesByRatingDescending, getMovies,userSignup } = require('./dboperation');


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
        response.json(result);
    });
});

/// indm decsinding order movies route 
router.route('/movies/ratingasc').get(async(request, response) => {
    dboperation.getMoviesByRatingDescending().then((result) => {
        response.json(result);
    });
});




////////////////
/////////////
// New POST route for user signup
router.route('/signup').post(async (req, res) => {
    const { username, email, password, firstName, lastName, phone, dob, profilePicture } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !firstName || !lastName || !phone || !dob) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Call the userSignup function from dboperation.js
        await dboperation.userSignup(username, email, password, firstName, lastName, phone, dob, profilePicture);

        res.status(201).json({
            success: true,
            message: 'Signup successful!',
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'Signup failed. Please try again.',
        });
    }
});
////////////////
/////////////

router.route('/test').get((req, res) => {
    res.send('Test route is working!');
});





var port = process.env.PORT || 8090;
app.listen(port, '0.0.0.0', () => {
    console.log('API is running at port ' + port);
});




