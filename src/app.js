const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geoCode')
const forecast = require('./utils/forecast')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Created by Alakh Dwivedi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Alakh Dwivedi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'I hope this is helpful',
        name: 'Alakh Dwivedi',
        title: 'Help'
    })
})

// app.get('/help', (req, res) => {
//     res.send({
//         name: 'Alakh',
//         age: 23
//     })
// })


// app.get('/about', (req, res) => {
//     res.send('<h1>About Application!</h1>')
// })

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Search term empty'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address is empty'
        })
    }
    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })


    // res.send({
    //     forecast: 'It\'s about to rain',
    //     location: 'Pune',
    //     address: req.query.address
    // })
})
// app.com
// app.com/help
// app.com/about

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '40 help',
        name: 'Alakh Dwivedi',
        message: 'Help article not found!'
    })
})

// If all the routes are unmatched so * is a wild card character is used to identify unamtched url
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alakh Dwivedi',
        message: 'Page Not Found'
    })
})

app.listen(3000, () => {
    console.log('Server is up!')
})