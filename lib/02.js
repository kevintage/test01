
function hello() {
    console.log("Hello World!");
}

function delayHello(delayMs, callback) {
	setTimeout(function() {
		callback();
	}, delayMs);
}

function hello2() {
    console.log("Hello again!");
}

delayHello(3000, hello);
delayHello(6000, hello2);