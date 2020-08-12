var express = require('express');
var router = express.Router();

// url入力ページ(トップページ)
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'code_typingへようこそ' });
});

module.exports = router;
