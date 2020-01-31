const express = require('express');
const app = express();

const body_parser = require('body-parser');

const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const path = require('path')

const userRoute = require('./routes/userRoute')
const eventRoute = require('./routes/eventRoute')
const authRoute = require('./routes/authRoute')

const sequelize = require('./db/sequelize')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const service = require('./services/getData')

console.log(publicDirectoryPath)
console.log(viewsPath)
console.log(partialsPath)

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(body_parser.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/', authRoute)
app.use('/users', userRoute)
app.use('/events', eventRoute)

sequelize.sync()
//sequelize.sync({alter: true})
//sequelize.sync({force: true})

app.get('', async (req, res) => {
    if(req.cookies.authToken)
        res.render('index', await service.getUserAndEvents(req.cookies.authToken))
    else
        res.render('index', {undefined, undefined})
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/create', async (req, res) => {
    res.render('create', await service.getUserAndEvents(req.cookies.authToken))
})

app.listen(8080, (err, result) => {
    console.log('Server is running');
});