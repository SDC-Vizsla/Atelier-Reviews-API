require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// CSV file path
const filePath = '/tmp/data/reviews.csv';

// Function to load data from CSV to the database
loadReviewsData = async () => {
  const client = await pool.connect();

  await client.query('CREATE SCHEMA IF NOT EXISTS reviewschema');

  await client.query('CREATE TABLE IF NOT EXISTS reviewschema.reviews (id INT, product_id INT, rating INT, date VARCHAR, summary VARCHAR, body VARCHAR, recommend VARCHAR, reported VARCHAR, reviewer_name VARCHAR, reviewer_email VARCHAR, response VARCHAR, helpfulness INT)');

  await client.query(`COPY reviewschema.reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '${filePath}' DELIMITER ',' CSV HEADER;`, (err, response) => {
    err ? console.log('error: ', err) : console.log(response)
  });
};

// Call the function to load the data
loadReviewsData();