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
// UserSignup function to call stored procedure
async function userSignup(username, email, password, firstName, lastName, phone, dob, profilePicture) {
    try {
        let pool = await sql.connect(config);

        // Call the stored procedure
        let result = await pool.request()
            .input('Username', sql.VarChar(50), username)
            .input('Email', sql.VarChar(100), email)
            .input('Password', sql.VarChar(255), password)  // Password should be hashed before passing
            .input('FirstName', sql.VarChar(50), firstName)
            .input('LastName', sql.VarChar(50), lastName)
            .input('Phone', sql.VarChar(15), phone)
            .input('DOB', sql.Date, dob)
            .input('ProfilePicture', sql.VarChar(255), profilePicture || null)
            .execute('UserSignup');
        
        return result.recordset;  // Return result if needed
    } catch (error) {
        console.error('Error calling UserSignup procedure:', error);
        throw new Error('Failed to sign up user');
    }
}

/////////////
//////////////


module.exports = {  

    getMovies: getMovies ,
    getMoviesByRatingDescending: getMoviesByRatingDescending,
    userSignup : userSignup
}