var express = require('express');
var app = express();
var index = require('./routes/index');
var events = require('./routes/events');
var calendar = require('./routes/calendar');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded:true}));

app.use("/events", events);
app.use("/index", index);
app.use("/", calendar);

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function(){
    console.log("listening on 3000")
});

module.exports = app;