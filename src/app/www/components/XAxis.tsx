/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringActions = require('../actions/MonitoringActions');
import ZoomActions = require('../actions/ZoomActions');

class XAxis extends React.Component<XAxis.Props, {}> {
	
	private zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
	
	private axis = d3.svg.axis()
		.tickFormat(d3.time.format.multi([
			['.%L', d => d.getMilliseconds()],
			[':%S', d => d.getSeconds()],
			['%H:%M', d => d.getMinutes()],
			['%H:%M', d => d.getHours()],
			['%a %d', d => d.getDay() && d.getDate() != 1],
			['%b %d', d => d.getDate() != 1],
			['%B', d => d.getMonth()],
			['%Y', d => true]
		]))
		.orient('bottom');
		
		private pane: SVGElement;
	
	constructor(props) {
		super(props);
		this.axis.scale(this.props.scale);
	}
	
	componentDidMount() {
		this.zoom.on('zoom', this.onZoom);
		d3.select(this.pane).call(this.zoom);
	}
	
	componentWillUnmount() {
		this.zoom.on('zoom', null);
	}
	
	render() {
		// range() wants Dates which is wrong
		this.props.scale.range([0, this.props.width] as any);
		
		if (this.props.resetXDomain) {
			this.props.scale.domain(this.props.resetXDomain);
			this.zoom.x(this.props.scale as any);
		}
		
		this.axis.tickSize(-this.props.height, 0);
		return (
			<g>
				<rect
					className='pane'
					ref={ref => this.pane = ref}
					width={this.props.width}
					height={this.props.height} />
				<g
					className='x axis'
					transform={'translate(0, ' + this.props.height + ')'}
					ref={(ref: any) => d3.select(ref).call(this.axis)} />
			</g>
		);
	}
	
	private onZoom = () => {
		var domain = this.props.scale.domain();
		if (domain[0]  < this.props.monitoringData.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.props.monitoringData.endDate) {
			MonitoringActions.get(domain[1]);
		}
		setTimeout(ZoomActions.zoom, 0); // Force wait UI refresh
	};
}

module XAxis {
	export interface Props {
		monitoringData: MonitoringData;
		resetXDomain: Date[];
		width: number;
		height: number;
		scale: d3.time.Scale<Date, number>;
	}
}

export = XAxis;