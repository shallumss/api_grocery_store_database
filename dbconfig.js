const config = {
    user: process.env.SQL_USER || 'test',
    password: process.env.SQL_PASSWORD || 'test',
    server: process.env.SQL_SERVER || '127.0.0.1',
    database: process.env.SQL_DATABASE || 'IMDB_Top_1000',

    options: {
        trustedconnection: true,
        enableArithAbort: true,
        encrypt: false,
        instancename: process.env.SQL_INSTANCE || 'SHALLUM',
    },

    port: process.env.SQL_PORT || 1433,
};

module.exports = config;
