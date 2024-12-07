var config = require('./dbconfig');
const sql = require('mssql'); 




async function getMovies() {
    try {
        let pool = await sql.connect(config);
        // Call the stored procedure
        let result = await pool.request()
            .execute('getMovie');
        
        return result.recordset;  // This will return the data fetched from the procedure
    } catch (error) {
        console.error('Error calling stored procedure:', error);
        throw new Error('Failed to fetch movies from the database');
    }
}
////query for getting the movies from the database desecnind order


async function getMoviesByRatingDescending() {
    try {
        let pool = await sql.connect(config);
        // Call the stored procedure
        let result = await pool.request()
            .execute('GetMoviesByRatingDescending');
        
        return result.recordset;  // This will return the data fetched from the procedure
    } catch (error) {
        console.error('Error calling stored procedure:', error);
        throw new Error('Failed to fetch movies from the database');
    }
}



///////////
///////////
/////////////
// UserSignup function to call the stored procedure
async function userSignup(
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
) {
    try {
        let pool = await sql.connect(config);

        // Call the stored procedure with all required inputs
        let result = await pool.request()
            .input('UserName', sql.VarChar(100), username)
            .input('Email', sql.VarChar(150), email)
            .input('Password', sql.VarChar(255), password) // Password should be hashed before passing
            .input('FirstName', sql.VarChar(50), firstName)
            .input('LastName', sql.VarChar(50), lastName)
            .input('Phone', sql.VarChar(15), phone || null) // Optional
            .input('DOB', sql.Date, dob || null) // Optional
            .input('ProfilePicture', sql.VarChar(255), profilePicture || null) // Optional
            .input('Country', sql.VarChar(100), country)
            .input('City', sql.VarChar(100), city)
            .input('State', sql.VarChar(100), state || null) // Optional
            .input('House', sql.VarChar(255), house)
            .input('PostalCode', sql.VarChar(20), postalCode)
            .execute('UserSignup');

        return result.recordset; // Return the result if needed
    } catch (error) {
        console.error('Error calling UserSignup procedure:', error);
        throw new Error('Failed to sign up user');
    }
}


//////////////
async function userLogin(loginIdentifier, password) {
    try {
        let pool = await sql.connect(config);

        // Call the UserLogin stored procedure
        let result = await pool.request()
            .input('LoginIdentifier', sql.NVarChar(100), loginIdentifier)
            .input('Password', sql.NVarChar(255), password) // Plain text password
            .execute('UserLogin');

        if (result.recordset.length > 0 && result.recordset[0].user_id) {
            return { success: true, userId: result.recordset[0].user_id };
        } else {
            // Check for specific error codes to determine the failure reason
            if (result.error.number === 50001) {
                return { success: false, message: 'Invalid email/username.' };
            } else if (result.error.number === 50002) {
                return { success: false, message: 'Invalid password.' };
            } else {
                // Handle other unexpected errors
                console.error('Error during user login:', result.error);
                return { success: false, message: 'Login failed. Please try again later.' };
            }
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
}

/////////////
//////////////


module.exports = {  

    getMovies: getMovies ,
    getMoviesByRatingDescending: getMoviesByRatingDescending,
    userSignup : userSignup ,
    userLogin : userLogin   
}