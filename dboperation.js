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


module.exports = {  

    getMovies: getMovies ,
    getMoviesByRatingDescending: getMoviesByRatingDescending
}