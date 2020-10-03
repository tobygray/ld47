const express = require('express');

const router = express.Router();

/* GET editor page. */
router.get('/', (req, res, _next) => {
  res.render('editor', { title: 'Turbo Waffle editor' });
});

module.exports = router;
