const express = require('express');
const morgan = require('morgan'); // logger that will log all the http requests that come from the front-end
const bodyParser = require('body-parser'); // parses the data in the proper format
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); //the server needs to implement a cors policy. the webpages we visit make frequent requests to load images, fonts, or api to get the data from many different places across the internet. If these requests or assets go unchecked, the security of our browser may be at risk

// Models
const User = require('./models/User');


dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database')
    }
});

// Middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.json('Hello Amazon Clone')
});

app.post('/', (req, res) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  user.save((err) => {
      if(err) {
          res.json(err)
      } else {
        res.json('successfully saved user')
      }
  })
})

// Require API's
const userRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const ownerRoutes = require('./routes/owners');
const paymentRoutes = require('./routes/payments');
const orderRoutes = require('./routes/orders');
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', ownerRoutes);
app.use('/api', paymentRoutes);
app.use('/api', orderRoutes);


app.listen(3000, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Listening on port 3000")
    }
})