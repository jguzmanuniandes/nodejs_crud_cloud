const express = require('express')
const router = new express.Router()

const Event = require('../models/event')
const auth = require('../middleware/auth')

const service = require('../services/getData')

router.post('/create', auth, async (req, res) => {
    let event
    if(req.body.isVirtual) {
        req.body.isVirtual = true
        event = await Event.create({
            ...req.body,
            userId: req.user.id
        })
    }else {
        event = await Event.create({
            ...req.body,
            isVirtual: false,
            userId: req.user.id
        })
    }
    res.render('index', await service.getUserAndEvents(req.cookies.authToken))
})

router.get('/all', auth, async (req, res) => {
    try {        
        const events = await Event.findAll({
            where: {
              userId: req.user.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.send(events)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    try {
        const event = await Event.findOne({ where: { id, userId } })
        if (!event) {
            return res.status(404).send()
        }
        res.render('read', {user: req.user, event})
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    const {name,
      category,
      place,
      address,
      startDate,
      endDate,
      isVirtual} = req.body

    try {
        const event = await Event.update({name,
            category,
            place,
            address,
            startDate,
            endDate,
            isVirtual}, {where: {id, userId}})

        if (event[0]===0) {
            return res.status(404).send()
        }
        res.send(await Event.findOne({ where: { id, userId } }))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/update/:id', auth, async (req, res) => {
    res.render('update', {user:req.user, id: req.params.id})
})

router.post('/update/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    const {name,
      category,
      place,
      address,
      startDate,
      endDate,
      isVirtual} = req.body

    try {
        const event = await Event.update({name,
            category,
            place,
            address,
            startDate,
            endDate,
            isVirtual}, {where: {id, userId}})

        if (event[0]===0) {
            return res.status(404).send()
        }
        //res.send(await Event.findOne({ where: { id, userId } }))
        res.redirect('/')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    try {
        const event = await Event.destroy({ where: { id, userId } })

        if (event===0) {
            res.status(404).send()
        }

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/delete/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    try {
        const event = await Event.destroy({ where: { id, userId } })

        if (event===0) {
            res.status(404).send()
        }
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router