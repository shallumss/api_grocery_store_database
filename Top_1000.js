class Top_1000 {
    constructor(
        Poster_Link,
        Series_Title,
        Released_Year,
        Certificate,
        Runtime,
        Genre,
        IMDB_Rating,
        Overview,
        Meta_score,
        Director,
        Star1,
        Star2,
        Star3,
        Star4,
        No_of_Votes,
        Gross
    ) {
        this.Poster_Link = Poster_Link;       // URL for the poster
        this.Series_Title = Series_Title;     // Movie/Series Title
        this.Released_Year = Released_Year;   // Release Year
        this.Certificate = Certificate;       // Age certificate
        this.Runtime = Runtime;               // Runtime of the movie
        this.Genre = Genre;                   // Genre(s)
        this.IMDB_Rating = IMDB_Rating;       // IMDB rating
        this.Overview = Overview;             // Overview of the movie/series
        this.Meta_score = Meta_score;         // Meta critic score
        this.Director = Director;             // Director name
        this.Star1 = Star1;                   // Lead actor/actress 1
        this.Star2 = Star2;                   // Lead actor/actress 2
        this.Star3 = Star3;                   // Lead actor/actress 3
        this.Star4 = Star4;                   // Lead actor/actress 4
        this.No_of_Votes = No_of_Votes;       // Number of votes
        this.Gross = Gross;                   // Gross earnings
    }

    // Example method to format movie information
    getFormattedDetails() {
        return `
Title: ${this.Series_Title}
Year: ${this.Released_Year}
Rating: ${this.IMDB_Rating}
Director: ${this.Director}
Stars: ${this.Star1}, ${this.Star2}, ${this.Star3}, ${this.Star4}
Genre: ${this.Genre}
Overview: ${this.Overview}
Gross Earnings: ${this.Gross || 'N/A'}
Votes: ${this.No_of_Votes}
        `;
    }
}

module.exports = Top_1000;

