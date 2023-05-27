require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize');

const connectDatabase = async () => {
  return new Sequelize(`postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`);

  // try {
  //   await sequelize.authenticate();
  //   console.log('Connection has been established successfully.');
  // } catch (error) {
  //   console.error('Unable to connect to the database:', error);
  // }
};

const connectReviewsTable = async (sequelize) => {
  return sequelize.authenticate()
    .then(async () => {
      console.log('Connected to "reviews" table successfully!');

      return sequelize.define('reviews', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        product_id: {
          type: DataTypes.INTEGER
        },
        rating: {
          type: DataTypes.INTEGER
        },
        date: {
          type: DataTypes.STRING(25)
        },
        summary: {
          type: DataTypes.STRING(200)
        },
        body: {
          type: DataTypes.STRING(1000)
        },
        recommend: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        reported: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        reviewer_name: {
          type: DataTypes.STRING(60)
        },
        reviewer_email: {
          type: DataTypes.STRING(320)
        },
        response: {
          type: DataTypes.STRING(320)
        },
        helpfulness: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        }
      }, {
        schema: process.env.SCHEMA,
        tableName: "reviews",
        timestamps: false
      });
    })
    .catch((err) => {
      console.error('error establishing connection to "reviews" table!');
    });
};

const connectReviewPhotosTable = async (sequelize) => {
  return sequelize.authenticate()
    .then(async () => {
      console.log('Connected to "review_photos" table successfully!');

      return sequelize.define('review_photos', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        review_id: {
          type: DataTypes.INTEGER
        },
        url: {
          type: DataTypes.STRING(2048)
        }
      }, {
        schema: process.env.SCHEMA,
        tableName: "review_photos",
        timestamps: false
      });
    })
    .catch((err) => {
      console.error('error establishing connection to "review_photos" table!');
    });
};

const connectCharacteristicsTable = async (sequelize) => {
  return sequelize.authenticate()
    .then(async () => {
      console.log('Connected to "characteristics" table successfully!');

      return sequelize.define('characteristics', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        product_id: {
          type: DataTypes.INTEGER
        },
        name: {
          type: DataTypes.STRING(2048)
        }
      }, {
        schema: process.env.SCHEMA,
        tableName: "characteristics",
        timestamps: false
      });
    })
    .catch((err) => {
      console.error('error establishing connection to "characteristics" table!');
    });
};

const connectCharacteristicReviewsTable = async (sequelize) => {
  return sequelize.authenticate()
    .then(async () => {
      console.log('Connected to "characteristic_reviews" table successfully!');

      return sequelize.define('characteristic_reviews', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        characteristic_id: {
          type: DataTypes.INTEGER
        },
        review_id: {
          type: DataTypes.INTEGER
        },
        value: {
          type: DataTypes.INTEGER
        }
      }, {
        schema: process.env.SCHEMA,
        tableName: "characteristic_reviews",
        timestamps: false
      });
    })
    .catch((err) => {
      console.error('error establishing connection to "characteristic_reviews" table!');
    });
};

module.exports = {
  getReviews: (req, res) => {
    res.send('hi');
  },
  getReviewsMeta: (req, res) => {

  },
  postReview: (req, res) => {

  },
  upvoteReview: (req, res) => {

  },
  reportReview: (req, res) => {

  }
};

const testFunction = () => {
  connectDatabase()
    .then((sequelize) => {
      connectCharacteristicReviewsTable(sequelize)
        .then((data) => {
          data.findAll({where: {
            id: 10
          }})
            .then((result) => {
              console.log('this is the result: ', result[0].dataValues);
              console.log(new Date().toISOString());
            })
            .catch((err) => {
              console.error(err);
            })
        })
        .catch((err) => {
          console.error(err);
        })
    })
    .catch((err) => {
      console.error(err);
    });
};

// testFunction();

