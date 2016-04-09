import flux = require('flux');

import IAction = require('../actions/IAction');

export = new flux.Dispatcher<IAction>();