const mysql=require('mysql2');
    const conection=mysql.createConnection({
        host: 'bkydrk4ponfwfc4ncupc-mysql.services.clever-cloud.com',
        user:'upazfcyz17b1sfww',
        password: 'thWjMX6d3GO3dGldMS3W',
        database: 'bkydrk4ponfwfc4ncupc',
        port:3306
    });
    conection.connect((err)=>{
        if(err){
            console.error('error to connect DB:', err);
            return;
        }
        console.log('DB connected successfully');
    });

module.exports = conection;