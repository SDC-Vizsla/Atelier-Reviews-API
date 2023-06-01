const {Reviews, ReviewPhotos, Characteristics, CharacteristicReviews, sequelize} = require('./models.js');

// Set up table relationships
Reviews.hasMany(ReviewPhotos, { foreignKey: 'review_id' });
ReviewPhotos.belongsTo(Reviews, { foreignKey: 'review_id' });
Characteristics.hasMany(CharacteristicReviews, { foreignKey: 'characteristic_id' });
CharacteristicReviews.belongsTo(Characteristics, { foreignKey: 'characteristic_id' });
Reviews.hasMany(CharacteristicReviews, { foreignKey: 'review_id' });
CharacteristicReviews.belongsTo(Reviews, { foreignKey: 'review_id' });

module.exports = {
  getReviews: (req, res) => {
    const startTime = performance.now();

    if (!req.query.product_id || req.query.product_id > 1000011) {
      return res.sendStatus(500);
    }

    const product_id = req.query.product_id;
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const sort = req.query.sort;

    Reviews.findAll({
      where: {
        product_id: product_id,
        reported: false
      },
      include: [
        {
          model: ReviewPhotos,
        },
      ],
      limit: count,
      offset: (page - 1) * count,
      order: [["helpfulness", "DESC"]],
    })
      .then((reviews) => {
        let queryResponse = {
          product: product_id,
          page: page,
          count: count,
          results: [],
        };

        reviews.map((review) => {
          let reviewTemp = {
            review_id: review.dataValues.id,
            rating: review.dataValues.rating,
            summary: review.dataValues.summary,
            recommend: review.dataValues.recommend,
            response: review.dataValues.response,
            body: review.dataValues.body,
            date: review.dataValues.date,
            reviewer_name: review.dataValues.reviewer_name,
            helpfulness: review.dataValues.helpfulness,
            photos: [],
          };

          review.dataValues.review_photos.map((photo) => {
            let photoTemp = {
              id: photo.id,
              url: photo.url,
            };

            reviewTemp.photos.push(photoTemp);
          });

          reviewTemp.photos.sort((a, b) => a.id - b.id);
          queryResponse.results.push(reviewTemp);
        });

        if (sort === "newest") {
          queryResponse.results.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        } else if (sort === "relevant") {
          queryResponse.results.sort((a, b) => b.body.length - a.body.length);
        }

        res.send(queryResponse);

        const endTime = performance.now();
        const time = ((endTime - startTime) / 1000).toFixed(3);
        console.log("time elapsed during search query: ", time);
      })
      .catch((err) => {
        console.error("Error retrieving reviews!:", err);
        res.sendStatus(500);
      });
  },
  getReviewsMeta: (req, res) => {
    const startTime = performance.now();

    if (!req.query.product_id || req.query.product_id > 1000011) {
      return res.sendStatus(500);
    }

    const product_id = req.query.product_id;

    Reviews.findAll({
      where: {
        product_id: product_id,
      },
      attributes: [
        "rating",
        "recommend",
        [sequelize.fn("COUNT", sequelize.col("rating")), "ratingCount"],
        [sequelize.fn("SUM", sequelize.literal("CASE WHEN recommend = true THEN 1 ELSE 0 END")), "recommendTrueCount"],
        [sequelize.fn("SUM", sequelize.literal("CASE WHEN recommend = false THEN 1 ELSE 0 END")), "recommendFalseCount"],
      ],
      group: ["rating", "recommend"],
    })
      .then((reviews) => {
        let metaResponse = {
          product_id: product_id,
          ratings: {},
          recommended: {},
          characteristics: {},
        };

        reviews.forEach((review) => {
          const rating = review.dataValues.rating.toString();
          const ratingCount = review.dataValues.ratingCount;
          const recommend = review.dataValues.recommend ? true : false;
          const recommendCount = recommend ? parseInt(review.dataValues.recommendTrueCount) : parseInt(review.dataValues.recommendFalseCount);

          metaResponse.ratings[rating] = ratingCount.toString();

          if (recommend) {
            metaResponse.recommended.true = (metaResponse.recommended.true || 0) + recommendCount;
          } else {
            metaResponse.recommended.false = (metaResponse.recommended.false || 0) + recommendCount;
          }
        });

        if (metaResponse.recommended.true) {
          metaResponse.recommended.true = metaResponse.recommended.true.toString();
        }
        if (metaResponse.recommended.false) {
          metaResponse.recommended.false = metaResponse.recommended.false.toString();
        }

        Characteristics.findAll({
          where: {
            product_id: product_id,
          },
          include: [
            {
              model: CharacteristicReviews,
              attributes: ["value"],
            },
          ],
          attributes: ["id", "name"],
          group: [
            "characteristics.id",
            "characteristics.name",
            "characteristic_reviews.id",
            "characteristic_reviews.value",
          ],
        })
          .then((characteristics) => {
            characteristics.forEach((characteristic) => {
              const charId = characteristic.dataValues.id;
              const charName = characteristic.dataValues.name;
              const charAverage = parseFloat(characteristic.dataValues.characteristic_reviews[0].dataValues.value).toFixed(16);

              metaResponse.characteristics[charName] = {
                id: charId,
                value: charAverage.toString(),
              };
            });

            res.send(metaResponse);

            const endTime = performance.now();
            const time = ((endTime - startTime) / 1000).toFixed(3);
            console.log("time elapsed during search query: ", time);
          })
          .catch((err) => {
            console.error("Error retrieving characteristic reviews!:", err);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error("Error retrieving reviews!:", err);
        res.sendStatus(500);
      });
  },
  postReview: (req, res) => {
    const startTime = performance.now();

    if (
      !req.body.product_id ||
      !req.body.rating ||
      !req.body.summary ||
      !req.body.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.photos ||
      !req.body.characteristics
    ) {
      return res.sendStatus(400);
    }

    const product_id = req.body.product_id;
    const rating = req.body.rating;
    const summary = req.body.summary;
    const body = req.body.body;
    const recommend = req.body.recommend || false;
    const name = req.body.name;
    const email = req.body.email;
    const photos = req.body.photos;
    const characteristics = req.body.characteristics;

    Reviews.count()
      .then((reviewCount) => {
        // Create the review in the Reviews table
        Reviews.create({
          id: reviewCount + 1,
          product_id: product_id,
          rating: rating,
          date: new Date().toISOString(),
          summary: summary,
          body: body,
          recommend: recommend,
          reviewer_name: name,
          reviewer_email: email,
          response: null,
          helpfulness: 0
        })
          .then((review) => {
            if (photos.length > 0) {
              ReviewPhotos.count()
                .then((photoCount) => {
                  photos.map((photo) => {
                    ReviewPhotos.create({
                      id: photoCount += 1,
                      review_id: review.dataValues.id,
                      url: photo
                    })
                      .catch((err) => console.error('Error creating new review photos!: ', err));
                  })
                })
                .catch((err) => console.error('Error counting review_photos rows!: ', err));
            }

            CharacteristicReviews.count()
              .then((characteristicReviewsCount) => {
                let temp = Object.keys(characteristics);

                if (temp.length > 0) {
                  temp.map((char_id) => {
                    CharacteristicReviews.create({
                      id: characteristicReviewsCount += 1,
                      characteristic_id: parseInt(char_id),
                      review_id: review.dataValues.id,
                      value: characteristics[char_id]
                    })
                      .catch((err) => console.error('Error creating new Characteristics Review!', err));
                  })
                }

                res.sendStatus(201);

                const endTime = performance.now();
                const time = ((endTime - startTime) / 1000).toFixed(3);
                console.log("time elapsed during search query: ", time);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error('Error creating new Review!: ', err));
      })
      .catch((err) => console.error('Error counting reviews rows!: ', err));
  },
  upvoteReview: (req, res) => {
    const startTime = performance.now();

    if (!req.params.review_id) {
      return res.sendStatus(400);
    }

    Reviews.increment(
      {helpfulness: 1},
      {where: {id: Number(req.params.review_id)}}
    )
      .then(() => {
        res.sendStatus(204);

        const endTime = performance.now();
        const time = ((endTime - startTime) / 1000).toFixed(3);
        console.log("time elapsed during search query: ", time);
      })
      .catch((err) => console.error('Error upvoting review!: ', err));
  },
  reportReview: (req, res) => {
    const startTime = performance.now();

    Reviews.update(
      {reported: true},
      {where: { id: Number(req.params.review_id) }}
    )
      .then(() => {
        res.sendStatus(204);

        const endTime = performance.now();
        const time = ((endTime - startTime) / 1000).toFixed(3);
        console.log("time elapsed during search query: ", time);
      })
      .catch((err) => console.error('Error reporting review!: ', err));
  }
};