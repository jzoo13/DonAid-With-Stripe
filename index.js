
/*
  
    Author: Julio Cuellar
    Spring 2021
    DonAid - MEAN Full Stack Web Application
*/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const database = require("./database.js");

const app = express();

app.set("view engine", "ejs");

//stripe secret key, technically should not be visiable but since test mode for now leaving it here
const stripe = require('stripe')('sk_test_51IwKxxCPDHCt0gFzntvd3FwTP6ZBBEQh2TFbUFpQh6LM0uVsltYneHuI0wpzamfezb9tY8CVVKj2fJ2J2XG9UJuT00oXn82yEN')

//middleware
app.use(express.json());
app.use(express.static("./public"));

//endpoint routing users
const userRoutes = require("./routes/user.js");
app.use("/api/user", userRoutes);

//endpoint routing campaigns
const campaignRoutes = require("./routes/campaign.js");
app.use("/api/campaign", campaignRoutes);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));



//LEAVING THIS STRIPE ENDPOINT integration here for now.  Will move to routes later
app.post('/create-checkout-session', async (req, res) => {

  //console.log(JSON.stringify(req.body));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'DonAid Donation',
          },
          unit_amount: req.body.amount*100, 
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://final-project-with-stripe.jzoo13.repl.co/#!/payment_success',
    cancel_url: 'https://final-project-with-stripe.jzoo13.repl.co/#!/',
  });

  res.json({ id: session.id });
});

app.listen(3005, ()=> console.log("server started"));
