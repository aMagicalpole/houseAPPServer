var express = require('express');
var router = express.Router();

let conn = require('../conn/conn')

router.all("*", (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    next()
})

/* GET home page. */
router.get('/like', function (req, res) {

    let sql = `SELECT * from house`
    conn.query(sql, (err, data) => {
        res.send({ data })
    })



});

module.exports = router;
