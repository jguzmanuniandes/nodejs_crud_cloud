const express = require('express')
const router = new express.Router()

const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/settings');
const User = require('../models/user')
const Event = require('../models/event')
const auth = require('../middleware/auth')

router.post('/create', async (req, res) => {
    if(validator.isEmail(req.body.email) && req.body.password===req.body.password2) {

        if(await User.findOne({where: {email:req.body.email}})) {
            return res.render('signin', {error: "Email ya existe"})
        }

        const hashedPassword = await bcryptjs.hash(req.body.password, 8)
        const userCreated = await User.create({email: req.body.email, password: hashedPassword})

        let id = userCreated.id
        let email = userCreated.email
        const token = jwt.sign({id, email}, config.secretToken, {expiresIn: '1d'})
        res.cookie(config.cookieAuth, token, {maxAge: 86400000})
        userCreated.token = token
        userCreated.save()

        const events = await Event.findAll({
            where: {
              userId: userCreated.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })

        res.render('index', {user: userCreated, events})
    }else {
        res.render('signin', {error: "Email invalido o contraseñas diferentes"})
    }
})

router.get('/me', auth, (req, res) => {
    res.send({email: req.user.email})
})

module.exports = router