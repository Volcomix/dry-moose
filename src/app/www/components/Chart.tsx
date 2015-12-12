/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringStore = require('../stores/MonitoringStore');
import MonitoringActions = require('../actions/MonitoringActions');

import ChartBase = require('./ChartBase');
import XAxis = require('./XAxis');
import Divider = require('./Divider');
import ChartControls = require('./ChartControls');
import Loading = require('./Loading');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private static margin = { top: 20, right: 50, bottom: 30, left: 20 };
	
	private svg: SVGElement;
	private xScale = d3.time.scale<Date, number>();
	private drag = d3.behavior.drag<Divider.Datum>().origin(d => d);
	private zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
	
	private get contentWidth() {
		return this.state.width - Chart.margin.left - Chart.margin.right;
	}
	
	private get contentHeight() {
		return this.state.height - Chart.margin.top - Chart.margin.bottom;
	}
	
	private get chartState() {
		var rect = this.svg && this.svg.getBoundingClientRect();
		return {
			monitoringData: MonitoringStore.data,
			resetXDomain: MonitoringStore.resetXDomain,
			width: rect ? rect.width : 0,
			height: rect ? rect.height : 0
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.chartState;
		this.state.dividers = this.getDividers(this.props.charts.length);
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange);
		window.addEventListener('resize', this.onChange);
		this.drag.on('drag', this.onDrag);
		this.zoom.on('zoom', this.onZoom);
		this.onChange();
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
		this.drag.on('drag', null);
		this.zoom.on('zoom', null);
	}
	
	componentWillReceiveProps(nextProps: Chart.Props) {
		if (nextProps.charts.length != this.props.charts.length) {
			this.setState({ dividers: this.getDividers(nextProps.charts.length) });
		}
	}
	
	private get chart() {
		if (this.state.monitoringData) {
			
			var margin = Chart.margin,
				width = this.contentWidth,
				height = this.contentHeight,
				dividersPx = this.state.dividers.map(d => Math.round(height * d));
				
			// range() wants Dates which is wrong
			this.xScale.range([0, width] as any);
			
			if (this.state.resetXDomain) {
				this.xScale.domain(this.state.resetXDomain);
				this.zoom.x(this.xScale as any);
			}
			
			return (
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					<XAxis height={height} scale={this.xScale} />
					
					{this.props.charts.map((ChartType, id) => {
						var y = id ? dividersPx[id - 1] : 0,
							rowHeight: number;
							
						if (id == dividersPx.length) {
							rowHeight = height - y;
						} else {
							rowHeight = dividersPx[id] - y;
						}
						
						return (
							<ChartType
								key={id}
								monitoringData={this.state.monitoringData}
								y={y}
								width={width}
								height={rowHeight}
								xScale={this.xScale}
								zoom={this.zoom} />
						);
					})}
					
					{this.state.dividers.map((ratio: number, id: number) => (
						<Divider
							key={id}
							id={id}
							y={dividersPx[id]}
							width={width + margin.right}
							drag={this.drag} />
					))}
				</g>
			);
		}
	}
	
	private get controls() {
		if (this.state.monitoringData) {
			return <ChartControls />;
		}
	}
	
	private get loading() {
		if (!this.state.monitoringData) {
			return <Loading />;
		}
	}
	
	render() {
		return (
			<div className='chart'>
				<svg ref={ref => this.svg = ref}>{this.chart}</svg>
				{this.controls}
				{this.loading}
			</div>
		);
	}
	
	private onChange = () => this.setState(this.chartState);
	
	private onDrag = (d: Divider.Datum) => {
		var event = d3.event as d3.DragEvent,
			height = this.contentHeight,
			dividers = this.state.dividers,
			min = d.id ? dividers[d.id - 1] : 0,
			max = (d.id == dividers.length - 1) ? 1 : dividers[d.id + 1];
		dividers[d.id] = Math.min(Math.max(event.y / height, min + 0.1), max - 0.1);
		this.setState({ dividers });
	}
	
	private onZoom = () => {
		var domain = this.xScale.domain();
		if (domain[0]  < this.state.monitoringData.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.state.monitoringData.endDate) {
			MonitoringActions.get(domain[1]);
		}
		this.onChange();
	};
	
	/**
	 * Get dividers ratios to separate charts.
	 * @param chartsCount - How many charts should be separated
	 */
	private getDividers(chartsCount: number) {
		var dividers: number[] = [];
		for (var i = 1; i < chartsCount; i++) {
			dividers.push(i / chartsCount);
		}
		return dividers;
	}
}

module Chart {
	export interface Props {
		charts: typeof ChartBase[];
	}
	
	export interface State {
		monitoringData?: MonitoringData;
		resetXDomain?: Date[];
		width?: number;
		height?: number;
		dividers?: number[];
	}
}

export = Chart;