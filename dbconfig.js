require('dotenv').config();  // Read .env file if present

const config = {    
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER , // Azure SQL Server address
    database:  process.env.DB_DATABASE, // Database name you created in Azure

    options: {
        trustedConnection: false,  // Azure doesn't support trusted connection
        encrypt: true,             // Required for Azure SQL Database
        enableArithAbort: true,
        trustServerCertificate: true // Required for Azure SQL Database
    },

   
};

module.exports = config;
