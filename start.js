require('dotenv').config();
const mongoose = require('mongoose');

/* With mongoose 9.1.4, those two options are not supported anymore so its crashing just updated to below
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});*/

mongoose.connect(process.env.DATABASE);

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require('./models/Registration');

const app = require('./app');

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
