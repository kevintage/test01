function Person(nickname, name, age, gender){
	var nickname = nickname;
	if (typeof name !== 'string')
		throw new TypeError('name should be string!');
	this.name = name;
 	this.age = age;
	this.gender = gender;
	this.showNickname = function () {
		console.log("I'm" + nickname);
	};
}

Person.prototype.speak = function (text) {
	console.log(text);
};

Person.prototype.hello = function (){
	console.log("I'm " + this.name);
};



module.exports = Person;

