var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + "/public"));

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://cmpe280:cmpe280123#@ds053469.mongolab.com:53469/cmpe280';
	

//register URL
app.post('/register', function (req, res) {
	if(req.body == null || req.body.username == null || req.body.password == null || req.body.email == null || req.body.mobile || req.body.address){
		req.end("error");
	}
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var securityQuestionOne = req.body.securityOne;
	var securityQuestionOneAnswer = req.body.answerOne;
	var securityQuestionTwo = req.body.securityTwo;
	var securityQuestionTwoAnswer = req.body.answerTwo;
  	var mobile = req.body.mobile;
  	var address = req.body.address;

  	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
		if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
		    //HURRAY!! We are connected. :)
		    console.log('Connection established to', url);

		    // do some work here with the database.
		     // Get the documents collection
	    	var collection = db.collection('users');

		    //Create some users
		    var user = {username: username, password: password, email: email, mobile: mobile, address: address, securityQuestions: [{question: securityQuestionOne, answer: securityQuestionOneAnswer}, {question: securityQuestionTwo, answer: securityQuestionTwoAnswer}]};
		    
		    // Insert some users
		    collection.insert([user], function (err, result) {
				     if (err) {
				        console.log(err);
				      } else {
				        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				      }
				      db.close();
		  		});
		}
		
	});

  	console.log("Sending AJAX Response...");
  	res.header("Access-Control-Allow-Origin", "*");
  	res.end("Record successfully saved in MongoLab!");
});

app.listen(3000);