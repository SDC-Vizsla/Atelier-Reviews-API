require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const pool = new Pool({
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.EXISTDB,
  password: process.env.PASSWORD,
  port: process.env.PORT
});


// Function to create database
const createDatabase = async () => {
  try {
    const client = await pool.connect();

    const queryDBExists = `SELECT datname FROM pg_database WHERE datname = '${process.env.DATABASE}'`
    const queryDBExistsResult = await client.query(queryDBExists);

    if (queryDBExistsResult.rows.length === 0) {
      await client.query(`CREATE DATABASE ${process.env.DATABASE}`);
      console.log(`Database "${process.env.DATABASE}" created!`);
    } else {
      console.log(`Database "${process.env.DATABASE}" already exists!`);
    }

    client.release();
  } catch(err) {
    console.error('Error creating database: ', err);
  } finally {
    createSchema();
  }
};


// Function to create schema & tables
const createSchema = async () => {
  try {
    const newPool = new Pool ({
      user: process.env.USERNAME,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT
    });

    const client = await newPool.connect();

    const querySchemaExist = `
      SELECT 1
      FROM information_schema.schemata
      WHERE schema_name = '${process.env.SCHEMA}'
    `;

    const querySchemaExistResult = await client.query(querySchemaExist);

    if (querySchemaExistResult.rows.length === 0) {
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.SCHEMA}`);

      console.log(`Schema "${process.env.SCHEMA}" created!`);
    } else {
      console.log(`Schema "${process.env.SCHEMA}" already exists!`);
    }

    const createReviewsTable = `CREATE TABLE IF NOT EXISTS ${process.env.SCHEMA}.reviews (
      id SERIAL PRIMARY KEY,
      product_id INT UNIQUE,
      rating INT,
      date VARCHAR(25) DEFAULT CURRENT_TIMESTAMP,
      summary VARCHAR(200),
      body VARCHAR(1000),
      recommend BOOLEAN DEFAULT FALSE,
      reported BOOLEAN DEFAULT FALSE,
      reviewer_name VARCHAR(60),
      reviewer_email VARCHAR(320),
      response VARCHAR(320),
      helpfulness INT
    )`;

    const createReviewPhotosTable = `CREATE TABLE IF NOT EXISTS ${process.env.SCHEMA}.review_photos (
      id SERIAL PRIMARY KEY,
      review_id INT,
      url VARCHAR(2048),
      FOREIGN KEY (review_id) REFERENCES ${process.env.SCHEMA}.reviews (id)
    )`;

    const createCharacteristicsTable = `CREATE TABLE IF NOT EXISTS ${process.env.SCHEMA}.characteristics (
      id SERIAL PRIMARY KEY,
      product_id INT,
      name VARCHAR(7),
      FOREIGN KEY (product_id) REFERENCES ${process.env.SCHEMA}.reviews (product_id)
    )`;

    const createCharacteristicReviewsTable = ` CREATE TABLE IF NOT EXISTS ${process.env.SCHEMA}.characteristic_reviews (
      id SERIAL PRIMARY KEY,
      characteristic_id INT,
      review_id INT,
      value INT,
      FOREIGN KEY (characteristic_id) REFERENCES ${process.env.SCHEMA}.characteristics (id),
      FOREIGN KEY (review_id) REFERENCES ${process.env.SCHEMA}.reviews (id)
    )`;

    await client.query(`DROP TABLE IF EXISTS ${process.env.SCHEMA}.reviews, ${process.env.SCHEMA}.review_photos, ${process.env.SCHEMA}.characteristics, ${process.env.SCHEMA}.characteristic_reviews`, async (err) => {
      if (err) {
        console.error ('error dropping tables!: ', err);
      } else {
          await client.query(createReviewsTable, (err) => {
          if (err) {
            console.error('error creating "reviews" table!: ', err);
          } else {
            console.log('Table "reviews" created!');
          }
        });

        await client.query(createReviewPhotosTable, (err) => {
          if (err) {
            console.error('error creating "review_photos" table!: ', err);
          } else {
            console.log('Table "review_photos" created!');
          }
        });

        await client.query(createCharacteristicsTable, (err) => {
          if (err) {
            console.error('error creating "characteristics" table!: ', err);
          } else {
            console.log('Table "characteristics" created');
          }
        });

        await client.query(createCharacteristicReviewsTable, (err) => {
          if (err) {
            console.error('error creating "characteristic_reviews"');
          } else {
            console.log('Table "characteristic_reviews" created!');
          }
        })
      }
    });

    client.release();
  } catch (err) {
    console.error('error in "createSchema" function: ', err);
  } finally {
    pool.end();
    transformReviewsData();
  }
};


// Function to transform data
const transformReviewsData = async () => {
  const fromPath = path.join(__dirname, './CSV/reviews.csv');
  const toPath = path.join(__dirname, './CSV/reviewsTemp.csv');

  console.log('reviews transforming...');

  if (fs.existsSync(toPath)) {
    fs.unlink(toPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
    });
  }

  fs.writeFileSync(toPath, '');

  const writeStream = fs.createWriteStream(toPath, { flag: 'a' });

  fs.createReadStream(fromPath)
    .pipe(csv())
    .on('data', (data) => {
      let time = new Date(parseInt(data.date)).toISOString();
      data.date = time;
      writeStream.write(
        `${data.id},${data.product_id},${data.rating},"${data.date}","${data.summary}","${data.body}",${data.recommend},${data.reported},"${data.reviewer_name}","${data.reviewer_email}","${data.response}",${data.helpfulness}\n`
      );
    })
    .on('end', async () => {
      console.log(`Data transformed, location: ${toPath}`);
      await loadData();
    });
};


// Function to load data
const loadData = async () => {
  try {
    const newPool = new Pool ({
      user: process.env.USERNAME,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT
    });

    const client = await newPool.connect();



  } catch (err) {
    console.error('error in "loadData" function: ', err);
  } finally {
    console.log('data finished loading!');
  }
};


createDatabase();