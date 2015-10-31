/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import d3 = require('d3');

import Quote = require('../../documents/Quote');

class Svg extends React.Component<any, any> {
	render() {
		var { width, height, margin } = this.props;
		return (
			<svg width={width} height={height}>
				<Chart
					data={this.props.data}
					width={width - margin.left - margin.right}
					height={height - margin.top - margin.bottom}
					margin={margin} />
			</svg>
		);
	}
	
	static defaultProps = {
		width: 800,
		height: 600,
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
	}
}

class Chart extends React.Component<any, any> {
	
	private xScale = d3.time.scale();
	private yScale = d3.scale.linear();
	
	render() {
		this.xScale
			.range([0, this.props.width])
			.domain([
				this.props.data[0].dateTime,
				this.props.data[this.props.data.length - 1].dateTime
			])
			.nice();
			
		this.yScale
			.range([this.props.height, 0])
			.domain(d3.extent(data, d => d.close))
			.nice();
		
		return (
			<g transform={'translate(' +
					this.props.margin.left + ', ' + 
					this.props.margin.top +
				')'}>
				<XAxis
					width={this.props.width}
					height={this.props.height}
					scale={this.xScale} />
				<YAxis
					width={this.props.width}
					height={this.props.height}
					scale={this.yScale} />
				<LineSeries
					data={this.props.data}
					xScale={this.xScale}
					yScale={this.yScale} />
			</g>
		);
	}
}

class XAxis extends React.Component<any, any> {	
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
	
	constructor(props) {
		super(props);
		
		this.axis.scale(this.props.scale);
	}
	
	render() {
		this.axis.tickSize(-this.props.height, 0);
		
		return (
			<g
				className='x axis'
				transform={'translate(0, ' + this.props.height + ')'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

class YAxis extends React.Component<any, any> {	
	private axis = d3.svg.axis()
		.tickFormat(d3.format(',.5f'))
		.orient('right');
	
	constructor(props) {
		super(props);
		
		this.axis.scale(this.props.scale);
	}
	
	render() {
		this.axis.tickSize(-this.props.width, 0);
		
		return (
			<g
				className='y axis'
				transform={'translate(' + this.props.width + ', 0)'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

class LineSeries extends React.Component<any, any> {
	
	private line = d3.svg.line<Quote>();
	
	constructor(props) {
		super(props);
		
		this.line
			.x(d => this.props.xScale(d.dateTime))
			.y(d => this.props.yScale(d.close));
	}
	
	render() {
		return (
			<path
				className='line'
				d={this.line(this.props.data)} />
		);
	}
}

var data = [
	{ dateTime: new Date('2015-10-20T10:00:00Z'), close: 1.12 },
	{ dateTime: new Date('2015-10-20T11:00:00Z'), close: 1.20 },
	{ dateTime: new Date('2015-10-20T12:00:00Z'), close: 1.16 },
	{ dateTime: new Date('2015-10-20T13:00:00Z'), close: 1.35 }
];
ReactDOM.render(<Svg data={data} />, document.getElementById('chart'));