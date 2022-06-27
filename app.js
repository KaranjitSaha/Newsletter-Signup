const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
var MD5 = require("crypto-js/md5");
// console.log(MD5("Message").toString());
const app = express();

const portno = 3000;
// const apiKey=f55d2227cf3279e0efc258f9f5112056-us14

const mailchimp = require("@mailchimp/mailchimp_marketing");
const { error } = require('console');

mailchimp.setConfig({
    apiKey: "f55d2227cf3279e0efc258f9f5112056-us14",
    server: "us14",
});

async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
}

run();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));//If you want to use static resources in your web page


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
    // req.send("Server working correctly");
})

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const subscriberHash = MD5(email.toLowerCase());
    const listId = "c62d0e1552";
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        });
        res.sendFile(__dirname + '/success.html');
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
        );
    }
    run().catch(function(e){
        res.sendFile(__dirname + '/failure.html');
    });
});

app.post("/failure",function(req,res){
    console.log("svv");
    res.redirect("/");
});

app.listen(process.env.PORT||portno, function () {
    console.log('listening on port 3000');
});