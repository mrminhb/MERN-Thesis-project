const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY)
const { verifyTokenAndAuthorization } = require('./token');


router.post("/payment", verifyTokenAndAuthorization, (req, res) => {
    //create a payment 
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, 
    (stripeErr, stripeRes) => {
        if(stripeErr) { 
            res.status(500).json(stripeErr); 
            return;
        }
        else if(stripeRes) { 
            res.status(200).json(stripeRes); 
            return;
        }
    })
})

module.exports = router