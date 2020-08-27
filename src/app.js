const express = require('express');

const app = express();
//app.use(express.json());
app.use(express.json());


app.use('/login', require("./routes/login"));
app.use('/user', require("./routes/user"));
app.use('/register', require("./routes/register"));


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`app listening on http://localhost:${port}`));