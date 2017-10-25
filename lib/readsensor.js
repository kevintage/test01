var WebSocket = require('ws');
var ws = new WebSocket('ws://192.168.1.109:1880');

var util = require('util');

var EventEmitter = require('events');

var modbus = require('jsmodbus');

var PressureConti,
	PumpConti,
	PHConti;

function PlcNode(host) {
    this.client = modbus.client.tcp.complete({
        host: host,
        port: '502',
        unitId: 1,
        // 'logEnabled': true,
        // 'logLevel': 'debug'
    });
    EventEmitter.call(this);
}

util.inherits(PlcNode, EventEmitter);

PlcNode.prototype.start = function (callback) {
    this.client.on('connect', function () {
        callback(null);
    });

    this.client.on('error', function (err) {
        callback(err);
    });
	
    this.client.connect();    
    console.log('modbus start');
};

PlcNode.prototype.stop = function (callback) {
	plcNode.clear();
    this.client.on('connect', function () {
        callback(null);
    });
    
    this.client.on('error', function (err) {
        callback(err);
    });

    this.client.close();
    console.log('modbus stop');
};


//Pressure 6001

PlcNode.prototype.readPressure = function (callback) {
    this.client.readHoldingRegisters(6001, 1).then(function (resp) {
        var pressure = resp.register[0].toString(16);

        while (pressure.length !== 8) {
            pressure = pressure + '0';
        }
        pressure = new Buffer(pressure, 'hex');
        callback(null, pressure.readFloatBE(0));
    }, callback);
};



//Pump 6003
PlcNode.prototype.readPump = function (callback) {
    this.client.readHoldingRegisters(6003, 1).then(function (resp) {
        var pump = resp.register[0].toString(16);

        while (pump.length !== 8) {
            pump = pump + '0';
        }
        pump = new Buffer(pump, 'hex');
        callback(null, pump.readFloatBE(0));
    }, callback);
};

//PH 6005
PlcNode.prototype.readPH = function (callback) {
    this.client.readHoldingRegisters(6005, 1).then(function (resp) {
        var ph = resp.register[0].toString(16);

        while (ph.length !== 8) {
            ph = ph + '0';
        }
        ph = new Buffer(ph, 'hex');
        callback(null, ph.readFloatBE(0));
    }, callback);
};


var plcNode = new PlcNode('192.168.0.11');

PlcNode.prototype.readSensor = function (sensor, callback) {
	switch (sensor) {
		case 'Pressure':
			this.readPressure(function (err, bar) {
				callback(null, bar);
			});
			break;
		case 'Pump':
			this.readPump(function (err, lHr) {
				callback(null, lHr);
			});
			break;
		case 'PH':
			this.readPH(function (err, value) {
				callback(null, value);
			});
			break;
		default:
			return ;
	}
};


PlcNode.prototype.readSensorConti = function (sensor) {
	var self = this;
	
	switch (sensor) {
		case 'Pressure':
			clearInterval(PressureConti);
			PressureConti = setInterval(function () {
				self.readPressure(function (err, bar) {
				self.emit('PressureConti', bar);
				});
			},1000);			
			break;
		case 'Pump':
			clearInterval(PumpConti);
			PumpConti = setInterval(function () {
				self.readPump(function (err, lHr) {
				self.emit('PumpConti', lHr);
				});
			},1000);
			break;
		case 'PH':
			clearInterval(PHConti);
			PHConti = setInterval(function () {
				self.readPH(function (err, lHr) {
				self.emit('PHConti', lHr);
				});
			},1000);
			break;
		default:
			return ;
	}
};


	
PlcNode.prototype.clear = function () {
	return clearInterval(PressureConti),
		   clearInterval(PumpConti),
		   clearInterval(PHConti);
};
module.exports = plcNode;
