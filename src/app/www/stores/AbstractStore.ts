import events = require('events');

import IStore = require('./IStore');

abstract class AbstractStore extends events.EventEmitter implements IStore {
	private static CHANGE_EVENT = 'change';
	
	emitChange() {
		this.emit(AbstractStore.CHANGE_EVENT);
	}
	
	addChangeListener(callback: Function) {
		this.on(AbstractStore.CHANGE_EVENT, callback);
	}
	
	removeChangeListener(callback: Function) {
		this.removeListener(AbstractStore.CHANGE_EVENT, callback);
	}
}

export = AbstractStore;