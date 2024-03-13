import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();
import path from 'path';
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoute.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from "../routes/brandsRouter.js";
import reviewRouter from '../routes/reviewsRouter.js';
import ordersRouter from "../routes/ordersRouter.js";
import Order from '../model/Order.js';
import couponsRouter from '../routes/couponsRouter.js';

dbConnect();
const app = express();


// Stripe webhook

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_c179a99ffa11e10be462b1b2fd622048e3de3e3064941536988ec4d98c29fa17";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if(event.type === "checkout.session.completed") {
    //update order
    const session = event.data.object; //detailed data about the payment
    const { orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    // find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
      totalPrice: totalAmount /100,
      currency, paymentMethod, paymentStatus,
    },
    {
      new: true,
    });
  } else {
    return;
  }
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// routes
// here we are going to plug in the middlewares
// pass incoming data
app.use(express.json());
// This middleware parses the incoming request body and makes the parsed JSON data available in req.body of the subsequent middleware functions or route handlers. 
// url encoded
app.use(express.urlencoded({ extended: true }));
// serve static files
app.use(express.static("public"));
// home route
app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRouter);
app.use('/api/v1/categories/', categoriesRouter);
app.use('/api/v1/brands/', brandsRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/orders/', ordersRouter);
app.use('/api/v1/coupons/', couponsRouter);

// This middleware mounts the userRoutes router at the root path '/' of the application. This means that any requests to paths defined in userRoutes will be handled by the routes defined there. 

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
// now we have exported the app to be used in other files and we are going to use it inside the server