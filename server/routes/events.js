// use this block for development
// var googleConfig = {
//  clientID: '718685232216-44kv60mjc1p2jqsgjm9t3uerjnivck7q.apps.googleusercontent.com',
//  clientSecret: 'IOzbAkwpTT-8f2N1xdcD0Q7U',
//  calendarId: 'tptsquatter@gmail.com',
//  redirectURL: 'http://localhost:3000/auth'
//  };

// use this block for heroku app
var googleConfig = {
    clientID: '718685232216-44kv60mjc1p2jqsgjm9t3uerjnivck7q.apps.googleusercontent.com',
    clientSecret: 'IOzbAkwpTT-8f2N1xdcD0Q7U',
    calendarId: 'tptsquatter@gmail.com',
    redirectURL: 'https://tpt-tptsquatter-gamma.herokuapp.com/auth'
};

var express = require('express');
var moment = require('moment');
var google = require('googleapis');
var router = express.Router();
var path = require('path');

var app = express(),
    calendar = google.calendar('v3');
oAuthClient = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL),
    authed = false;

router.post('/', function(req,res,next){
    //var today = moment().format('YYYY-MM-DD') + 'T';
    console.log(req.body);
    console.log("post hit");
    var event = {
        summary: req.body.summary,
        location: req.body.location,
        start: {
            'dateTime': req.body.start,
            'timeZone': 'America/Chicago'
        },
        end: {
            'dateTime': req.body.end,
            'timeZone': 'America/Chicago'
        }
    };

    console.log(event);
    calendar.events.insert({
        calendarId: googleConfig.calendarId,
        resource: event,
        auth: oAuthClient
    }, function(err, event){
        if (err) {
            console.log('There was an error contacting google calendar: ' + err);
            return;
        }
        res.send("yes");
        console.log('event created', event.htmlLink);
    });
});

router.get('/', function(req, res) {
    console.log(req.params[0]);

    var today = moment().format('YYYY-MM-DD') + 'T';

    calendar.events.list({
        calendarId: googleConfig.calendarId,
        maxResults: 9999,
        timeMin: today + '00:00:00.000Z',
        timeMax: today + '23:59:59.000Z',
        auth: oAuthClient
        }, function(err, events) {
            if(err) {
                console.log('Error fetching events');
            } else {
                console.log('Successfully fetched events');
                console.log(events);
                res.json(events);

            }
        });
    //}
});

router.get("/*", function(req,res){
    var file = req.params[0] || '/assets/views/index.html';
    //console.log(file);
    res.sendFile(path.join(__dirname, '../public', file));

});

module.exports = router;
