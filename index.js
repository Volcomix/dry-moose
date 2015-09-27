var os = require('os');
var path = require('path');

var moment = require('moment');

var Supervisor = require('./release/Supervisor');
var GenericASCIIM1 = require('./release/collectors/GenericASCIIM1');
var DummyProcessor = require('./release/processors/DummyProcessor');
var ConsoleInvestor = require('./release/investors/ConsoleInvestor');
var DemoCelebrator = require('./release/celebrators/DemoCelebrator');
var DemoCapacitor = require('./release/capacitors/DemoCapacitor');

var baseDir = path.join(os.homedir(), 'Téléchargements');

var rewards = [{
	countdown: moment({ minutes: 10 }),
	expiration: moment({ minutes: 30 }),
	payout: 0.75
}];

var processor = new DummyProcessor();
var investor = new ConsoleInvestor();
var celebrator = new DemoCelebrator();
var capacitor = new DemoCapacitor(100);

new Supervisor(new GenericASCIIM1(path.join(baseDir,
	'HISTDATA_COM_ASCII_EURUSD_M1201506/DAT_ASCII_EURUSD_M1_201506.csv'
), rewards), processor, investor, celebrator, capacitor)
.run()
.then(function() {
	return new Supervisor(new GenericASCIIM1(path.join(baseDir,
		'HISTDATA_COM_ASCII_EURUSD_M1201507/DAT_ASCII_EURUSD_M1_201507.csv'
	), rewards), processor, investor, celebrator, capacitor)
	.run()
})
.then(function() {
	return new Supervisor(new GenericASCIIM1(path.join(baseDir,
		'HISTDATA_COM_ASCII_EURUSD_M1201508/DAT_ASCII_EURUSD_M1_201508.csv'
	), rewards), processor, investor, celebrator, capacitor)
	.run()
})
.done();