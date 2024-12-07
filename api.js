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
app.use('/store', router);
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
// POST route for user signup
router.route('/signup').post(async (req, res) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        dob,
        profilePicture,
        country,
        city,
        state,
        house,
        postalCode
    } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !firstName || !lastName || !country || !city || !house || !postalCode) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    try {
        // Call the userSignup function
        await dboperation.userSignup(
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
            dob,
            profilePicture,
            country,
            city,
            state,
            house,
            postalCode
        );

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

///////// login route 

router.route('/login').post(async (req, res) => {
    const { loginIdentifier, password } = req.body;

    // Validate input
    if (!loginIdentifier || !password) {
        return res.status(400).json({
            success: false,
            message: 'Both login identifier (email/username) and password are required.',
        });
    }

    try {
        // Call the userLogin function
        const loginResult = await dboperation.userLogin(loginIdentifier, password);

        if (loginResult.success) {
            // Send the user_id along with the success message
            res.status(200).json({
                success: true,
                userId: loginResult.userId, // Return the user_id in the response
                message: 'Login successful!',
            });
        } else {
            // Return failure response when credentials are incorrect
            res.status(401).json({
                success: false,
                message: loginResult.message || 'Login failed. Please check your credentials and try again.',
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.',
        });
    }
});

///////////////product info route 
router.get('/products', async (req, res) => {
    try {
        // Call the getProductDetails function
        const products = await dboperation.getProductDetails();

        // Send the product details as a response
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error('Error in /products route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product details. Please try again later.',
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




