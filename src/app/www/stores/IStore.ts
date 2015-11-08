/// <reference path="../../../../typings/tsd.d.ts" />

interface IStore {
	addChangeListener(callback: Function);
	removeChangeListener(callback: Function);
}

export = IStore;