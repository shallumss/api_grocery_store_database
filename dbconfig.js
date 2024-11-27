const config = {    
    user: 'test',
    password: 'Rfvg@qwerty',
    server: 'shallum.database.windows.net', // Azure SQL Server address
    database: 'IMDB_Top_1000', // Database name you created in Azure

    options: {
        trustedConnection: false,  // Azure doesn't support trusted connection
        encrypt: true,             // Required for Azure SQL Database
        enableArithAbort: true,
    },

    port: 1433,  // Default port for Azure SQL Database
};

module.exports = config;
