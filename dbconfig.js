const config = {    

    user  : 'test' ,
    password : 'test',
    server : '127.0.0.1',
    database : 'IMDB_Top_1000',

    options: {  trustedconnection : true ,
                enableArithAbort : true,
                encrypt: false,
                instancename : 'SHALLUM'
             },

    port: 1433

    }
module.exports = config ;
