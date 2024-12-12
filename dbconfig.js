require('dotenv').config();  // Read .env file if present

const config = {    
    user: process.env.SQLAZURECONNSTR_DB_USER,
    password: process.env.SQLAZURECONNSTR_DB_PASSWORD,
    server: process.env.SQLAZURECONNSTR_DB_SERVER , // Azure SQL Server address
    database:  process.env.SQLAZURECONNSTR_DB_DATABASE, // Database name you created in Azure

    options: {
        trustedConnection: false,  // Azure doesn't support trusted connection
        encrypt: true,             // Required for Azure SQL Database
        enableArithAbort: true,
        trustServerCertificate: true // Required for Azure SQL Database
    },

   
};



module.exports = config;
