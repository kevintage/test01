
function hello() {
    console.log("Hello World!");
}

function delayHello(delayMs, callback) {
	setTimeout(function() {
		callback();
	}, delayMs);
}

delayHello(99999, hello);

function hello2() {
    console.log("Hello");
}

delayHello(-5000, hello2);