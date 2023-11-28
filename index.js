const express = require("express");
const cors = require("cors");
const app = express();
require("./services/database"); 

app.use(express.json());
app.use(cors({ origin: '*' }));

require("./routes/genericRoutes")(app);
require("./routes/customerRoutes")(app);
require("./routes/projectRoutes")(app);

// constants
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running..."));