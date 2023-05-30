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
    if (!req.query.product_id || req.query.product_id > 1000011) {
      return res.status(500).send('Internal Server Error');
    } else {
      let page = req.query.page || 1;
      let count = req.query.count || 5;
      let sort = req.query.sort || [['helpfulness', 'DESC']];
      let product_id = req.query.product_id;

      connectDatabase()
        .then((sequelize) => {
          connectReviewsTable(sequelize)
            .then((reviewsData) => {
              connectReviewPhotosTable(sequelize)
                .then((reviewPhotosData) => {
                  reviewsData.hasMany(reviewPhotosData, {foreignKey: 'review_id'});
                  reviewPhotosData.belongsTo(reviewsData, {foreignKey: 'review_id'});

                  let response = {};



                  reviewsData.findAll({
                    where: {
                      product_id: product_id
                    },
                    limit: count,
                    offset: (page - 1) * count,
                    order: sort
                  })
                    .then((reviews) => {
                      res.send(reviews);
                    })
                    .catch((err) => {
                      console.error('Error retrieving reviews:', err);
                      res.status(500).send('Internal Server Error');
                    });



                })
                .catch((err) => console.error('Error connecting to "review_photos" table!: ', err))
            })
            .catch((err) => console.error('Error connecting to "reviews" table!: ', err));
        })
        .catch((err) => console.error('Error connecting to database!: ', err));


      // connectDatabase()
      //   .then((sequelize) => {
      //     connectReviewsTable(sequelize)
      //       .then((reviewsData) => {
      //         connectReviewPhotosTable(sequelize)
      //           .then((reviewPhotosData) => {
      //             // reviewsData.hasMany(reviewPhotosData, {foreignKey});
      //             reviewsData.hasMany(ReviewPhoto, { foreignKey: 'review_id' });
      //             reviewPhotosData.belongsTo(Review, { foreignKey: 'review_id' });
      //             let result = {};
      //           })
      //           .catch((err) => console.error('Error connecting to "review_photos" table!: ', err));
      //       })
      //       .catch((err) => console.error('Error connecting to "reviews" table!: ', err));
      //   })
      //   .catch((err) => console.error('Error connecting to database!: ', err));
    }
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

