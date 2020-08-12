var express = require('express');
var router = express.Router();

// url入力ページ(トップページ)
router.get('/', async (req, res, next) => {
  res.render('index', {
    title: 'Code Typing',
    description: 'URL先のコードでタイピング練習ができるサイトです．',
    input_explain: 'URLを入力してください．'
  });
});

module.exports = router;
