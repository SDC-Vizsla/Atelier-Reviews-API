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
    let startTime = performance.now();

    if (!req.query.product_id || req.query.product_id > 1000011) {
      return res.sendStatus(500);
    } else {
      let page = req.query.page || 1;
      let count = req.query.count || 5;
      let product_id = req.query.product_id;

      //figure out how to sort newest and relevant before sending in res.send(queryResponse)
      let sort = req.query.sort;

      connectDatabase()
        .then((sequelize) => {
          connectReviewsTable(sequelize)
            .then((reviewsData) => {
              connectReviewPhotosTable(sequelize)
                .then((reviewPhotosData) => {
                  reviewsData.hasMany(reviewPhotosData, {foreignKey: 'review_id'});
                  reviewPhotosData.belongsTo(reviewsData, {foreignKey: 'review_id'});

                  let queryResponse = {
                    product: product_id,
                    page: page,
                    count: count,
                    results: []
                  };

                  reviewsData.findAll({
                    where: {
                      product_id: product_id
                    },
                    include: [{
                      model: reviewPhotosData
                    }],
                    limit: count,
                    offset: (page - 1) * count,
                    order: [['helpfulness', 'DESC']]
                  })
                    .then((reviews) => {
                      reviews.map((review) => {
                        let reviewTemp = {
                          review_id: review.id,
                          rating: review.rating,
                          summary: review.summary,
                          recommend: review.recommend,
                          response: review.response,
                          body: review.body,
                          date: review.date,
                          reviewer_name: review.reviewer_name,
                          helpfulness: review.helpfulness,
                          photos: []
                        };

                        review.review_photos.map((photo) => {
                          let photoTemp = {
                            id: photo.id,
                            url: photo.url
                          };

                          reviewTemp.photos.push(photoTemp);
                        });

                        //sort the reviews here if sort params is defined
                        //relevance -> content length
                        //newest -> post date
                        reviewTemp.photos.sort((a, b) => a.id - b.id);
                        queryResponse.results.push(reviewTemp);
                      });

                      let endTime = performance.now();
                      let time = ((endTime - startTime)/1000).toFixed(3);
                      console.log('time lapsed during search query: ', time);

                      res.send(queryResponse);
                    })
                    .catch((err) => {
                      console.error('Error retrieving reviews:', err);
                      res.sendStatus(500);
                    });
                })
                .catch((err) => console.error('Error connecting to "review_photos" table!: ', err))
            })
            .catch((err) => console.error('Error connecting to "reviews" table!: ', err));
        })
        .catch((err) => console.error('Error connecting to database!: ', err));
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

// const testFunction = () => {
//   connectDatabase()
//     .then((sequelize) => {
//       connectCharacteristicReviewsTable(sequelize)
//         .then((data) => {
//           data.findAll({where: {
//             id: 10
//           }})
//             .then((result) => {
//               console.log('this is the result: ', result[0].dataValues);
//               console.log(new Date().toISOString());
//             })
//             .catch((err) => {
//               console.error(err);
//             })
//         })
//         .catch((err) => {
//           console.error(err);
//         })
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// testFunction();

