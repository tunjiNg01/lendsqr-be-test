import {Knex}from "knex";

const knex: Knex = require('knex')({
    client: 'mysql',
    connection: {
      host : `localhost`,
      port : `3306`,
      user : `demoUser`,
      password : `password123`,
      database : `democredit`
    },
    // debug:true,
    // asyncStackTraces: true,
    useNullAsDefault: true
   
  });

// if(process.env.NODE_ENV === "development"){
// }


// if(process.env.NODE_ENV === "production"){
// }

export default knex


