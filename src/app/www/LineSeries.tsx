/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');

class LineSeries extends React.Component<LineSeries.Props, LineSeries.State> {
	render() {
		return <path className='line' />;
	}
}

module LineSeries {
	export interface Props {
	}
	
	export interface State {
	}
}

export = LineSeries;