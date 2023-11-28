const stripe = require('stripe')('sk_test_51OGkHMSHKWNdPynwPbHJ3ooGAfotOzjfQmG7CDeZR83nWdQF6XXYzlvsfpPFklzeCapMhsAdZ3wk2T5govj0hoAR00iMDnXJne');

exports.paymentDone = async (req, res) => {
    const userId = req.payload;
    const { ticketprice, noOfTickets, seat, ticket } = req.body;
    const seatname = ticket.seat[seat];

    console.log(ticketprice, noOfTickets, seat, ticket);
    console.log("seat:", ticket._id);

    const description = `Date: ${ticket.date},\n Seat: ${seatname}\n,No of Tickets: ${noOfTickets}`;

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
            success_url: `http://localhost:3000/success?ticket=${encodeURIComponent(JSON.stringify(ticket))}&payment_id={CHECKOUT_SESSION_ID}&seatname=${encodeURIComponent(seatname)}&noOfTickets=${noOfTickets}&userId=${userId}&ticketprice=${ticketprice}`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        console.log("session", session.id);
        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
