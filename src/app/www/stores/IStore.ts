interface IStore {
	addChangeListener(callback: Function);
	removeChangeListener(callback: Function);
}

export = IStore;