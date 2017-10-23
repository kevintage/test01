var modbus = require('jsmodbus');
/*
var plcNode = {};
    client = modbus.client.tcp.complete({
        'host': '192.168.0.11',
        'port': '502',
        'unitId': 1,
        // 'logEnabled': true,
        // 'logLevel': 'debug'
    });

plcNode.start = function (callback) {
    client.on('connect', function () {
        callback(null);
    });

    client.on('error', function (err) {
        callback(err);
    });

    client.connect();
};
*/
function PlcNode(host) {
    this.client = modbus.client.tcp.complete({
        host: host,
        port: '502',
        unitId: 1,
        // 'logEnabled': true,
        // 'logLevel': 'debug'
    });
}

PlcNode.prototype.start = function (callback) {
    this.client.on('connect', function () {
        callback(null);
    });

    this.client.on('error', function (err) {
        callback(err);
    });

    this.client.connect();
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

/*
plcNode.start(function (err) {
    if (!err) {
        console.log('ready');
    }
});

setInterval(function () {
            plcNode.readPressure(function (err, bar) {
                console.log(bar);
            });
        }, 1000);
*/
module.exports = plcNode;