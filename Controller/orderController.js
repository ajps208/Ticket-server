const stripe = require('stripe')('sk_test_51OGkHMSHKWNdPynwPbHJ3ooGAfotOzjfQmG7CDeZR83nWdQF6XXYzlvsfpPFklzeCapMhsAdZ3wk2T5govj0hoAR00iMDnXJne');
const orders=require("../Model/orderSchema")
const events=require('../Model/eventSchema')
const users=require('../Model/userSchema')

const nodemailer=require("nodemailer")
const email=process.env.email
const pass=process.env.pass


// payment
exports.paymentDone = async (req, res) => {
    const userId = req.payload;
    const { ticketprice, noOfTickets, seat, ticket } = req.body;
    const seatname = ticket.seat[seat];

    console.log(ticketprice, noOfTickets, seat, ticket);
    console.log("seat:", ticket._id);

    const description = `Date: ${ticket.date},\n Seat: ${seatname}\n,No of Tickets: ${noOfTickets}`;
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
   

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: ticket.name,
                            description: description,
                        },
                        unit_amount: ticketprice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            
            success_url: `https://ticket-book-ajith.vercel.app/success?ticket=${encodeURIComponent(JSON.stringify(ticket))}&payment_id={CHECKOUT_SESSION_ID}&seatno=${seat}&noOfTickets=${noOfTickets}&userId=${userId}&ticketprice=${ticketprice}&date=${encodeURIComponent(formattedDate)}`,
            cancel_url: `https://ticket-book-ajith.vercel.app/cancel`,
        });

        console.log("session", session.id);
        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//addOrder
exports.addOrder=async(req,res)=>{
    console.log("inside the add order");
    const userId=req.payload
    const{eventId,paymentId,noOfTickets,ticketprice,orderdate}=req.body
    
    try {
        const existingdate=await orders.findOne({orderDate:orderdate})
        if(existingdate){
            res.status(406).json("Order already exists !!!")
        }else{
        const addOrderData=new orders({userId,eventId,paymentId,qty:noOfTickets,orderPrice:ticketprice,orderDate:orderdate}) 
        await addOrderData.save()
        res.status(200).json(addOrderData)}
    } catch (error) {
        console.log(error);
        res.status(401).json(`Request failed: ${error}`)
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:"gcthostelgcthostel789@gmail.com",
      pass: "aivpikwikxkgqmyh"
    },
  });
  
 exports.sendEmail = async (req,res) => {
    console.log(email);
    console.log("inside the mail");
  
      const {to,subject, html } = req.body;
     
    const mailOptions = {
      from: 'strangedr653@gmail.com',
      to,
      subject,
      html,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

//   get orders
exports.getOrdersOfUser=async(req,res)=>{
    console.log("inside the get orders");
    const userId=req.payload
    try {
        const result=await orders.find({userId:userId})
        res.status(200).json(result)
        // console.log(result);

    } catch (error) {
        console.log(error);
        res.status(401).json(`Request failed: ${error}`)

    }
}

// get complete order data
exports.getCompleteOrder = async (req, res) => {
    console.log("inside complete order data");
    try {
        const result = await orders.aggregate([
            // {
            //     $match: {
            //         userId: { $exists: true, $ne: null },
            //         eventId: { $exists: true, $ne: null },
            //     },
            // },
            {
                $addFields: {
                    userIdObj: { $toObjectId: '$userId' },
                    eventIdObj: { $toObjectId: '$eventId' },
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventIdObj',
                    foreignField: '_id',
                    as: 'eventData',
                },
            },
            {
                $unwind: {
                    path: '$eventData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userIdObj',
                    foreignField: '_id',
                    as: 'userData',
                },
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    username: '$userData.username',
                    email: '$userData.email',
                    paymentId: '$paymentId',
                    eventName: '$eventData.name',
                    qty: '$qty',
                    orderPrice: '$orderPrice',
                    orderDate: '$orderDate',
                },
            },
        ]);

        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(`Internal Server Error: ${error.message}`);
    }
};



