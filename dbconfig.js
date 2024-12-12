require('dotenv').config();  // Read .env file if present

const config = {    
    user: 'shallum',
    password: 'Rfvg@qwerty123456??',
    server: 'shallum.database.windows.net' , // Azure SQL Server address
    database:  'store', // Database name you created in Azure

    options: {
        trustedConnection: false,  // Azure doesn't support trusted connection
        encrypt: true,             // Required for Azure SQL Database
        enableArithAbort: true,
        trustServerCertificate: true // Required for Azure SQL Database
    },

    authentication: {
        type: 'default',
        options: {
            userName: 'shallum',
            password: 'Rfvg@qwerty123456??'
        }
    },
    port: 1433 // Standard Azure SQL Database port

   
};



module.exports = config;
