require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize');

sequelize = new Sequelize(`postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`);

module.exports = {
  sequelize: sequelize,
  Reviews: sequelize.define('reviews', {
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
  }),
  ReviewPhotos: sequelize.define('review_photos', {
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
  }),
  Characteristics: sequelize.define('characteristics', {
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
  }),
  CharacteristicReviews: sequelize.define('characteristic_reviews', {
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
  })
}

