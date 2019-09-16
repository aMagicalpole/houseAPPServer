var express = require('express');
var router = express.Router();
var conn = require('../conn/conn')

// 处理跨域请求
router.all('*', function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next()
})

let checkCodeNum;
// 生成验证码
// 按参数生成指定位数的随机数
function checkCodeCreat(n) {
  let str = '';
  for (var i = 0; i < n; i++) {
    str = str + Math.floor(Math.random() * 10)
  }
  return str
}

// 登录
router.post('/login', function (req, res) {
  // 获取密码用户名
  let { acc, pwd } = req.body;
  let sql = `SELECT * FROM \`user\` where \`acc\`='${acc}' and \`pwd\` = '${pwd}'`
  // INSERT INTO `user` (`pwd`, `acc`) VALUES ('123456', '123')

  conn.query(sql, (err, result) => {
    if (err) console.log('[SELECT ERROR] - ', err.message);
    if (result.length === 1) {
      res.send({ code: 1, message: '登录成功！' })
    } else {
      res.send({ code: 0, message: '账户名或密码错误' })
    }
  })

});

// 注册
router.post('/registor', function (req, res) {
  // 获取密码用户名
  let { acc, pwd, checkCode } = req.body;
  console.log(checkCode, checkCodeNum);

  // 验证验证码是否正确
  if (checkCode === checkCodeNum) {
    // 验证用户名是否被注册
    let sqlCheck = `SELECT * FROM \`user\` where \`acc\`='${acc}'`
    // 执行sql语句
    conn.query(sqlCheck, (err, result) => {
      if (err) console.log('[SELECT ERROR] - ', err.message);
      // 当查询数据等于0时则未注册
      if (result.length === 0) {
        console.log(result)
        // 当用户名未被注册才能注册
        let sql = `INSERT INTO \`user\` (\`pwd\`, \`acc\`) VALUES ('${pwd}', '${acc}')`
        conn.query(sql, (err, result) => {
          if (err) console.log('[SELECT ERROR] - ', err.message);
          if (result.affectedRows === 1) {
            res.send({ code: 1, message: '注册成功!' })
          } else {
            res.send({ code: 0, message: '登录失败！' })
          }
        })

      } else {
        res.send({ code: 0, message: '您的用户名已被注册' })
      }
    })
  } else {
    res.send({ code: 0, message: '您的验证码错误' })
  }


});

// 用户获取验证码
router.get('/valitecode', function (req, res) {
  // 生成六位验证码
  checkCodeNum = checkCodeCreat(6);
  // 发送验证码
  res.send({ checkCode: checkCodeNum })
})



module.exports = router;
