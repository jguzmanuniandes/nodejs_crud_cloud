const User = require('../models/user')
const Event = require('../models/event')

module.exports = {
    async getUserAndEvents(token) {
        let user = await User.findOne({where: {token}})
        let events
        if(user) {
            console.log("here")
            events = await Event.findAll({
                where: {
                userId: user.id
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })
        }
        return {user, events}
    }
}