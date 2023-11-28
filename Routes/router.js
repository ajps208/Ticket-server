const express=require('express')
const router=new express.Router()
const userController=require('../Controller/userController')
const eventController=require('../Controller/eventController')
const orderController=require('../Controller/orderController')
const jwtMiddileware = require('../Middilewares/jwtMiddileware')
const multerConfig = require('../Middilewares/multerMiddileware')


// register
router.post('/user/register',userController.register)


// login
router.post('/user/login',userController.login)

// add event(need admin jwt)
router.post('/events/addevent',multerConfig.single("image"),eventController.addEvents)

// get all events
router.get('/events/getevents',eventController.getEvents)

// get one events
router.get('/events/oneevent',eventController.oneEvents)

// get all sports events
router.get('/events/getsports',eventController.getSportsEvents)

// get all other events
router.get('/events/getotherevents',eventController.getOtherEvents)

// make payment
router.post('/events/payment',jwtMiddileware,orderController.paymentDone)

module.exports=router