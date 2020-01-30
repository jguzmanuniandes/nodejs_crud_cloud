const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config/settings');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, config.secretToken)

        const user = await User.findOne({
            where: {
                id: decoded.id,
                token
            }
        })
        
        if(user) {
            req.token = token
            req.user = user
            next()
        }else {
            throw new Error()
        }
    } catch (e) {
        res.status(401).send({ error: 'Unable to identify, please login again' })
    }
}

const authWithCookie = async (req, res, next) => {
    try {
        const token = req.cookies.authToken
        const decoded = jwt.verify(token, config.secretToken)

        const user = await User.findOne({
            where: {
                id: decoded.id,
                token
            }
        })
        
        if(user) {
            req.token = token
            req.user = user
            next()
        }else {
            throw new Error()
        }
    } catch (e) {
        res.status(401).send({ error: 'Unable to identify, please login again' })
    }
}

module.exports = auth