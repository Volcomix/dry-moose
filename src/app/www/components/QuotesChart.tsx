/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');

import Quote = require('../../../documents/Quote');

import MonitoringStore = require('../stores/MonitoringStore');

import Chart = require('./Chart');

class QuotesChart extends React.Component<QuotesChart.Props, QuotesChart.State> {
	
	private get stateFromStores(): QuotesChart.State {
		return {
			quotes: MonitoringStore.quotes
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.stateFromStores;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange)
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
	}
	
	render() {
		return (
			<Chart
				data={this.state.quotes}
				xAccessor={(d: Quote) => d.dateTime}
				yAccessor={(d: Quote) => d.close}
				width={this.props.width}
				height={this.props.height} />
		);
	}
	
	private onChange = () => this.setState(this.stateFromStores);
}

module QuotesChart {
	export interface Props {
		width: number;
		height: number;
	}
	
	export interface State {
		quotes: Quote[];
	}
}

export = QuotesChart;