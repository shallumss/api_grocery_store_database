var config = require('./dbconfig');
const sql = require('mssql'); 


async function getMovies() { 

        try {
            let pool = await sql.connect(config);
            let movies = await pool.request().query("SELECT * from Top_1000");
            return movies.recordsets;
        }

        catch(error) {
            console.log(error);
        }


}
////query for getting the movies from the database desecnind order

async function getMoviesByRatingDescending() {
    try {
        let pool = await sql.connect(config);
        let movies = await pool
            .request()
            .query('SELECT * FROM Movies ORDER BY imdbRating DESC');
        return movies.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {  

    getMovies: getMovies ,
    getMoviesByRatingDescending: getMoviesByRatingDescending
}