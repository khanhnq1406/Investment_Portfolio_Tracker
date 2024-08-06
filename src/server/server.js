const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const route = require("./routes");

const connectDatabase = require("./utils/database");
connectDatabase();

app.use(cors());
app.use(express.json());

//use midleware to get data
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Define routes and middleware
route(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
