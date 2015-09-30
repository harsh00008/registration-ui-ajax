function hasNumbers(t)
{
	return /\d/.test(t);
}

function getPasswordScore(password){
	var alphaCount =  (password.replace(/[^a-zA-Z]+/g, "") == null ? 0 : password.replace(/[^a-zA-Z]+/g, "").length); // 4 characters
	var spaceCount = (password.match(/\s/) == null ? 0 : password.match(/\s/).length); // no spaces
	var specialCharacterCount = (password.match(/([!@#$%])/g)==null? 0 : password.match(/([!@#$%])/g).length); //1 special
	var numberCount = (password.match(/\d/g) == null ? 0 : password.match(/\d/g).length); // or 1 number
	var upperCaseCount = (password.match(/[A-Z]/g) == null ? 0 : password.match(/[A-Z]/g).length); // or 1 number
	var lowerCaseCount = (password.match(/[a-z]/g) == null ? 0 : password.match(/[a-z]/g).length); // or 1 number
	
	var alphaScore = 0;
	var specialCharacterScore = 0;
	var numberScore = 0;
	var upperCaseScore=0;
	var lowerCaseScore=0;

	//uppercase letter score
	if(upperCaseCount > 1 & lowerCaseCount > 1){
		upperCaseScore = 100;
	}	

	//alphabet score
	if(alphaCount > 4){
		alphaScore = 100;
	}else{
		alphaScore = alphaCount * 25;
	}

	//special character score
	if(specialCharacterCount > 2){
		specialCharacterScore = 100;
	}else{
		specialCharacterScore = specialCharacterCount * 50;
	}

	//number score
	if(numberCount > 2){
		numberScore = 100;
	}else{
		numberScore = numberCount * 50;
	}

	//averaging score to get a score percentage
	score = (alphaScore + specialCharacterScore + numberScore + upperCaseScore )/4;

	//Invalid conditions result in weak score
	if(spaceCount || (username.length > 0 && password.indexOf(username) > -1) || password.length < 7 || password.length > 20){
		score = 20;
	}
	return score;
}

function checkPasswordStrength(password){
	var score = 0;
	var strengthMeter = document.getElementById("strength-meter");
	var username = document.getElementById("username").value;
	var strengthIndicator = document.getElementById("strength-indicator");

	score = getPasswordScore(password);
	
	var error = document.getElementById("error-repass");

	var spaceCount = (password.match(/\s/) == null ? 0 : password.match(/\s/).length); // no spaces
	if(username.length > 0 && password.indexOf(username) > -1){
		error.style.color = "red";
		error.innerHTML= "Cannot contain username";
	}else{
		if(spaceCount){
			error.style.color = "red";
			error.innerHTML= "Spaces not allowed";
		}else{
			error.innerHTML="";
		}	
	}
	
	//updating the progress bar
	strengthMeter.value = score;
	
	//strength indicator text
	if(score < 21 ){
		strengthIndicator.innerHTML="Very Weak";
	}
	if(score > 20 && score < 30){
		strengthIndicator.innerHTML="Weak";
	}
	if(score > 29 && score < 60){
		strengthIndicator.innerHTML="Medium";
	}
	if(score > 59 && score < 80){
		strengthIndicator.innerHTML="Strong";
	}
	if(score > 80 && score < 100){
		strengthIndicator.innerHTML="Very Strong";	
	}
	if(score >= 100){
		strengthIndicator.innerHTML="Excellent";	
	}
	var rePass = document.getElementById("repassword");
	if(rePass.value.length > 0){
		verifyPasswordMatch(rePass.value);
	}
}	

function verifyPasswordMatch(rePass){
	var error = document.getElementById("error-repass");
	if(rePass==""){
		error.innerHTML="";
		return;
	}
	var password = document.getElementById("password").value;
	if(password!= rePass){
		error.style.color = "red";
		error.innerHTML = "Passwords do not match";
	}else{
		error.innerHTML = "Passwords match";
		error.style.color = "green";
	}
}
	
	
function saveToSessionStorage(){
	var registrationForm = document.getElementById("registration-form");
	for (var i = 0; i < registrationForm.elements.length; i++) {
		if(registrationForm.elements[i].type!= "submit" && registrationForm.elements[i].value!= null && registrationForm.elements[i].value!="Cancel"){
			var field = registrationForm.elements[i];
			var fieldName = field.name;
			var fieldValue = field.value;
			console.log("saving to sessionStorage..." + fieldName + ": " + fieldValue);
			sessionStorage.setItem(fieldName, fieldValue);
		}
	}
	alert("Stored data to session!");
}

function submitForm(){
	
	var error = "";
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var repassword = document.getElementById("repassword").value;
	var mobile = (document.getElementById("mobile") == null) ? "" : document.getElementById("mobile").value;
	var email = document.getElementById("email").value;
	var reemail = document.getElementById("reemail") == null ? "" : document.getElementById("reemail").value;
	var securityOne = document.getElementById("security-question-1").value;
	var securityAnswerOne = document.getElementById("security-answer-1").value;
	var securityTwo = document.getElementById("security-question-2").value;
	var securityAnswerTwo = document.getElementById("security-answer-2").value;
	var interests = document.getElementsByName("interest");

	var checked = 0;
	for(var i = 0; i< interests.length; i++){
		if(interests[i].checked){
			checked++;
		}
	}
	if(checked == 0){
		error = error + " - Please check atleast one interest.\n";
	}

	if(username.length == 0){
		error = error + " - Username cannot be left blank.\n";
	}
	if(getPasswordScore(password) < 50){
		error = error + " - Please generate a strong password.\n"
	}
	if(password != repassword){
		error = error + " - Passwords do not match\n";
	}

	if(securityOne!="" && securityAnswerOne==""){
		error = error + " - Please provide an answer to question 1.\n";
	}

	if(securityTwo!="" && securityAnswerTwo==""){
		error = error + " - Please provide an answer to question 2.\n";
	}
	
	if(securityOne == securityTwo){
		error = error + " - Both questions cannot be the same.\n";
	}

	if(mobile!= null && mobile==""){
		error = error + " - Mobile cannot be left blank.\n";	
	}

	if(email!= reemail){
		error = error + " - Emails do not match."
	}

	if(error!=""){
		alert("Errors: \n" + error);
		return false;
	}
	saveToSessionStorage();
	return false;
}

function validateEmail(email){
	if(email.length > 0){
		var error = document.getElementById("error-email");
		if(email.match(/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/)){
			error.style.color = "green";
			error.innerHTML= "Valid email";
		}else{
			error.style.color = "red";
			error.innerHTML= "Invalid email";
		}	
	}
}

function validateMobile(mobile){
	if(mobile.length > 0){
		var error = document.getElementById("error-mobile");
		if(mobile.match(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/)){
			error.style.color = "green";
			error.innerHTML= "Valid mobile";
		}else{
			error.style.color = "red";
			error.innerHTML= "Invalid mobile";
		}
	}
}

function verifyEmailMatch(email){

	var originalEmail = document.getElementById("email");
	var error = document.getElementById("error-email");
	if(email==""){
		error.innerHTML="";
		return;
	}
	if(originalEmail.value!=email){
		error.style.color = "red";
		error.innerHTML="Emails do not match";
	}else{
		error.style.color = "green";
		error.innerHTML= "Emails match";
	}	
	
}

function validateSecurityQuestion(question){
	var originalQuestion = document.getElementById("security-question-1");
	var error = document.getElementById("error-question");
	if(question =="" && originalQuestion.value== ""){
		error.innerHTML="";
		return;
	}
	if(originalQuestion.value == question){
		error.style.color="red";
		error.innerHTML="Both questions cannot be same"
	}else{
		error.innerHTML="";
	}
}

function clearForm(){
	document.getElementById("registration-form").reset();
	var errors = document.getElementsByClassName("error");

	 for(var i = errors.length - 1; i >= 0; --i)
    {
        // PERFORM STUFF ON THE ELEMENT
        errors[i].innerHTML = "";

        // elements[i] no longer exists past this point, in most browsers
    } 
}


