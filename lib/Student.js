var util = require("util");
var Person = require("./Person");

function Student(nickname, name, age, gender, school){

	if (typeof name !== 'string')
		throw new TypeError('name should be string!');
    Person.call(this, nickname, name, age, gender);
	this.school = school;


}

util.inherits(Student, Person);


Student.prototype.greet = function (x){
	this.speak("Hello, "+ x.name);
};

var student1 = new Student('Kevin', 'Lai', 20, 'male', 'EE');
var student2 = new Student('Peter', "E", 20, 'male', 'EE');

student1.showNickname();
