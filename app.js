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
	if(req.body == null ){
		res.end("error");
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
  	var interestOne = req.body.interestOne == undefined || req.body.interestOne == "" ? "None" : req.body.interestOne;
  	var interestTwo = req.body.interestTwo == undefined || req.body.interestTwo == "" ? "None" : req.body.interestTwo ;

  	var interest = interestOne + "," + interestTwo
  	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
		if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
		    console.log('Connection established to', url);
			var collection = db.collection('users');
			var user = {username: username, password: password, email: email, mobile: mobile, address: address, securityQuestions: [{question: securityQuestionOne, answer: securityQuestionOneAnswer}, {question: securityQuestionTwo, answer: securityQuestionTwoAnswer}], interest: interest};
		    
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
	res.setHeader('Access-Control-Allow-Origin', '*');
   	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  	res.end("Record successfully saved in MongoLab!");
});

app.listen(3000);