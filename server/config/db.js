const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add any additional options here
    };

    const connection = await mongoose.connect("mongodb+srv://nareshvunnam57:fdjhFLM7ZbqtwuA@cluster0.3d62rfk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", connectionOptions);

    // Log connection status
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    // Log any connection errors
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
