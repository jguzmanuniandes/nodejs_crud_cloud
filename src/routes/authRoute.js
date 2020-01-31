const express = require('express')
const router = new express.Router()

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/settings');
const User = require('../models/user')
const auth = require('../middleware/auth')
const service = require('../services/getData')

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    let user = await User.findOne({where: {email}})
    if(user) {
        if(bcryptjs.compareSync(password, user.password)) {
            let id = user.id
            const token = jwt.sign({id, email}, config.secretToken, {expiresIn: '1d'})
            res.cookie(config.cookieAuth, token, {maxAge: 86400000})
            user.token = token
            user.save()
            res.redirect('/')
        }else {
            console.log('Wrong password!')
            return res.render('login', {error: "Wrong credentials!"})
        }
    }
})

router.get('/logout', auth, async (req, res) => {
    req.user.token = null
    req.user.save()
    res.clearCookie(config.cookieAuth);
    res.render('index', {undefined, undefined})
})

router.post('/logout', auth, async (req, res) => {
    req.user.token = null
    req.user.save()
    res.clearCookie(config.cookieAuth);
    res.send('Logout!')
})

module.exports = router