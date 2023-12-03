const express=require('express')
const router=new express.Router()
const userController=require('../Controller/userController')
const eventController=require('../Controller/eventController')
const orderController=require('../Controller/orderController')
const adminController=require('../Controller/adminController')
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

// add order
router.post('/order/addorder',jwtMiddileware,orderController.addOrder)

// edit event
router.put('/event/editevent',jwtMiddileware,eventController.editEvents)

// edit event
router.post('/order/send-email',orderController.sendEmail)

// get order
router.get('/order/getorder',jwtMiddileware,orderController.getOrdersOfUser)


// Admin register
// router.post('/admin/register',adminController.register)

// Admin login
router.post('/admin/login', adminController.login);

// delete event
router.delete('/events/delete/:eventid', eventController.deleteEvent);

// get all order data
router.get('/order/alldetails',orderController.getCompleteOrder)

// get all search events
router.get('/events/searchevent',eventController.getSearchEvents)

// send otp
router.post('/user/send-otp',userController.sendOtp)

// change password
router.put('/user/change',userController.changePassword)

module.exports=router