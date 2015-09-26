var os = require('os');
var path = require('path');

var moment = require('moment');

var Supervisor = require('./release/Supervisor');
var GenericASCIIM1 = require('./release/collectors/GenericASCIIM1');
var DummyProcessor = require('./release/processors/DummyProcessor');
var ConsoleInvestor = require('./release/investors/ConsoleInvestor');
var DemoCelebrator = require('./release/celebrators/DemoCelebrator');
var DemoCapacitor = require('./release/capacitors/DemoCapacitor');

new Supervisor(
	new GenericASCIIM1(
		path.join(
			os.homedir(),
			'Téléchargements',
			'HISTDATA_COM_ASCII_EURUSD_M1201506',
			'DAT_ASCII_EURUSD_M1_201506.csv'
		),
		[{
			countdown: moment({ minutes: 10 }),
			expiration: moment({ minutes: 30 }),
			payout: 0.75
		}]
	),
	new DummyProcessor(),
	new ConsoleInvestor(),
	new DemoCelebrator(),
	new DemoCapacitor(100)
)
.run()
.done();