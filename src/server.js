require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8000;
async function start() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      autoIndex: false,
    });

    mongoose.connection.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      process.exit(1);
    });

    app
      .listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Listing on port ${port}`);
      })
      .on('error', (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
      });
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);
    mongoose.connection.close();
    process.exit(1);
  }
}

start();
