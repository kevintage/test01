var PlcNode = require('./readsensor');
var plcNode = new PlcNode('192.168.0.11', '502', 1);

var WebSocket = require('ws');
var ws = new WebSocket('ws://192.168.1.109:1880');

ws.on('open', function open() {
	plcNode.start(function (err) {
		if (!err) {
			console.log('ready');
		}
	});
});


plcNode.on ('PressureConti', function (bar) { 
	ws.send(JSON.stringify({"type": "Pressure", "value": bar}));
});

plcNode.on ('PumpConti', function (lHr) { 
	ws.send(JSON.stringify({"type": "Pump", "value": lHr}));
});
			
plcNode.on ('PHConti', function (val) { 
	ws.send(JSON.stringify({"type": "PH", "value": val}));
});

ws.on('message', function incoming(data) {
	switch (data) {
		case 'Pressure':
			plcNode.readSensor('Pressure', function (err, bar) {
				ws.send(JSON.stringify({"type": "Pressure", "value": bar}));
			});
			break;
		case 'Pump':
			plcNode.readSensor('Pump', function (err, lHr) {
				ws.send(JSON.stringify({"type": "Pump", "value": lHr}));
			});
			break;
		case 'PH':
			plcNode.readSensor('PH', function (err, val) {
				ws.send(JSON.stringify({"type": "PH", "value": val}));
			});
			break; 
		case 'PressureConti':
			plcNode.readSensorConti('Pressure');
			break;
		case 'PumpConti':
			plcNode.readSensorConti('Pump');
			break;
		case 'PHConti':
			plcNode.readSensorConti('PH');
			break;
		case 'Clear':
			plcNode.clear();
			break;
		case 'Start':
			plcNode.start(function (err) {
				if (!err) {
					console.log('modbus start');
				}
			});

			break;
		case 'Stop':
			plcNode.stop(function (err) {
				if (!err) {
					console.log('modbus close');
				}
			});
			break;
		default:
			return ;
	}
});
