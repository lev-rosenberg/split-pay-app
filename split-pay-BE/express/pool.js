const {Pool} = require('pg'); 
//conn pool object for config!
const pool = new Pool({
    user: "postgres",
    host: 'final-project-396.czauaqw2uc55.us-east-2.rds.amazonaws.com',
    database: 'postgres',
    password: "cs396-sjl",
    port: 5432
});

module.exports = pool; 