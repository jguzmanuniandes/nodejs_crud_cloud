const express = require('express')
const router = new express.Router()

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/settings');
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/login', (req, res) => {
    const {email, password} = req.body

    User.findOne({
        where: {
            email
        }
    }).then((user) => {
        if(bcryptjs.compareSync(password, user.password)) {

            let id = user.id
            let email = user.email

            const token = jwt.sign({id, email}, config.secretToken, {expiresIn: '1d'})
            res.cookie(config.cookieAuth, token, {maxAge: 86400000})
            user.token = token
            user.save()

            return res.send({id, email, token})
        }else {
            return res.status(400).send('Wrong password!')
        }
    }).catch((err) => {
        console.log('Something went wrong!')
        return res.status(400).send('Something went wrong!')
    })
})

router.post('/logout', auth, async (req, res) => {
    req.user.token = null
    req.user.save()
    res.clearCookie(config.cookieAuth);
    res.send('Logout!')
})

module.exports = router