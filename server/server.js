require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require(path.join(__dirname, './controller.js'));

let app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get('/reviews/', (req, res) => {
  routes.getReviews(req, res);
});

app.get('/reviews/meta', (req, res) => {
  routes.getReviewsMeta(req, res);
});

app.post('/reviews/', (req, res) => {
  routes.postReview(req, res);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  routes.upvoteReview(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  routes.reportReview(req, res);
});

app.listen(process.env.APIPORT);
console.log(`Listening at localhost:${process.env.APIPORT}`);