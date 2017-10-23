var plcNode = require('./readsensor');

var WebSocket = require('ws');

var ws = new WebSocket('ws://192.168.1.109:1880');

var rdPressure;

ws.on('open', function open() {
	plcNode.start(function (err) {
		if (!err) {
			console.log('ready');
		}
	});
});

ws.on('message', function incoming(data) {
	switch (data) {
		case 'Pressure':
			rdPressure = setInterval(function () {
				plcNode.readPressure(function (err, bar) {
					ws.send(bar);
				});
			}, 1000);
			break;
		case 'Pump':
            setInterval(function () {
				plcNode.readPump(function (err, lHr) {
					ws.send(lHr);
				});
            }, 1000);
			break;
		case 'PH':
			setInterval(function () {
				plcNode.readPH(function (err, value) {
					ws.send(value);
				});
            }, 1000);
			break;
		case 'Stop':
			return clearInterval(rdPressure);
		default:
			return ;
	}
});
