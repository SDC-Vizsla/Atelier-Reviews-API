const {Reviews, ReviewPhotos, Characteristics, CharacteristicReviews} = require('./models.js');

// Set up table relationships
Reviews.hasMany(ReviewPhotos, { foreignKey: 'review_id' });
ReviewPhotos.belongsTo(Reviews, { foreignKey: 'review_id' });

module.exports = {
  getReviews: (req, res) => {
    let startTime = performance.now();

    if (!req.query.product_id || req.query.product_id > 1000011) {
      return res.sendStatus(500);
    } else {
      let page = req.query.page || 1;
      let count = req.query.count || 5;
      let product_id = req.query.product_id;

      // Figure out how to sort newest and relevant before sending in res.send(queryResponse)
      let sort = req.query.sort;

      Reviews.findAll({
        where: {
          product_id: product_id
        },
        include: [{
          model: ReviewPhotos
        }],
        limit: count,
        offset: (page - 1) * count,
        order: [['helpfulness', 'DESC']]
      })
        .then((reviews) => {
          let queryResponse = {
            product: product_id,
            page: page,
            count: count,
            results: []
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
              photos: []
            };

            review.dataValues.review_photos.map((photo) => {
              let photoTemp = {
                id: photo.id,
                url: photo.url
              };

              reviewTemp.photos.push(photoTemp);
            });

            // Sort the reviews here if sort param is defined
            // relevance -> content length
            // newest -> post date
            reviewTemp.photos.sort((a, b) => a.id - b.id);

            queryResponse.results.push(reviewTemp);
          });

          let endTime = performance.now();
          let time = ((endTime - startTime) / 1000).toFixed(3);
          console.log('time elapsed during search query: ', time);

          res.send(queryResponse);
        })
        .catch((err) => {
          console.error('Error retrieving reviews:', err);
          res.sendStatus(500);
        });
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