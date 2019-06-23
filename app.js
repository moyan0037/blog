const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const moment = require('moment')
const mysql = require('mysql')



//连接数据库
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root-199728",
  database: "node-test"
});
// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')

app.use('/node_modules', express.static('node_modules'))

//注册中间件  处理post数据
app.use(bodyParser.urlencoded({ extended: false }))

//请求首页
app.get('/', (req, res) => {
  res.render('index', {})
})

//请求注册页
app.get('/register', (req, res) => {
  res.render('./user/register', {});
})

//请求登录页面
app.get('/login', (req, res) => {
  res.render('./user/login', {});
})




/**
 * ------------------------------------
 *          开始实现业务逻辑
 * ------------------------------------
 */

//用户注册API接口
app.post('/register', (req, res) => {

  //获取post传过来的数据  需要先注册中间件
  let data = req.body;



  //定义 查询数据库里是否有这个用户
  const sqlStr1 = 'select count(*) as count from blog_user where username=?'

  //定义 执行插入操作
  const sqlStr1_1 = 'insert into blog_user set ?'


  //判断表单是否为空
  if (data.username.trim().length <= 0 || data.password.trim().length <= 0 || data.nickname.trim().length <= 0) {
    return res.send({ mes: "输入不能为空!", status: 5001 })
  }

  //执行数据查询
  conn.query(sqlStr1, data.username, (err, result) => {


    if (err) return res.send({ mes: "用户名查重失败", status: 501 })


    //如果count 不等于0  表示数据库已经有这个用户 
    if (result[0].count !== 0) return res.send({ mes: "用户名已经存在", status: 502 })



    //需要加上注册时间  借助  moment
    data.ctime = moment().format('YYYY-MM-DD HH:mm:ss');


    //执行数据库插入语句
    conn.query(sqlStr1_1, data, (err, result) => {

      if (err) return res.send({ mes: '注册失败', status: 504 })
      if (result.affectedRows !== 1) return res.send({ mes: '注册失败', status: 504 })

      //注册成功返回
      res.send({ mes: "注册新用户成功!", status: 200 })
    })
  })

})




/**
 * ------------------------
 * 登录功能API接口
 * ------------------------
 */

app.post('/login', (req, res) => {
  //获取post传过来的数据  需要先注册中间件
  let data = req.body;

  //定义sql语句
  const sqlStr2 = 'select * from blog_user where username=? and password=?'

  //执行查询语句
  conn.query(sqlStr2, [data.username, data.password], (err, result) => {

    if (err) return res.send({ mes: "登录失败", status: 501 });
    if (result.length !== 1) return res.send({ mes: "登录失败", status: 501 });
    res.send({ mes: "登录成功", status: 200 })

  })

})









app.listen(3000, () => {
  console.log("running ···")
})