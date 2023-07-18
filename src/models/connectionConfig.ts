import {Knex}from "knex";
import dotenv from "dotenv"
dotenv.config()

const knex: Knex = require('knex')({
    client: 'mysql',
    connection: {
      host : `${process.env.CLOUD_DB_HOST}`,
      port : `${process.env.CLOUD_DB_PORT}`,
      user : `${process.env.CLOUD_DB_USERNAME}`,
      password : `${process.env.CLOUD_DB_PASSWORD}`,
      database : `${process.env.ClOUD_DB_NAME}`
    },
    // debug:true,
    // asyncStackTraces: true,
    useNullAsDefault: true
   
  });



export default knex


