/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import d3 = require('d3');

import Quote = require('../../documents/Quote');

class Chart extends React.Component<any, any> {
	
	private xScale = d3.time.scale();
	private yScale = d3.scale.linear();
	
	render() {
		var { data, containerWidth, containerHeight, margin }: {
			data: Quote[];
			containerWidth: number;
			containerHeight: number;
			margin: { top: number, right: number, bottom: number, left: number };
		} = this.props;
		var width = containerWidth - margin.left - margin.right;
		var height = containerHeight - margin.top - margin.bottom;
		
		this.xScale
			.range([0, width])
			.domain([data[0].dateTime, data[data.length - 1].dateTime])
			.nice();
			
		this.yScale
			.range([height, 0])
			.domain(d3.extent(data, d => d.close))
			.nice();
		
		return (
			<svg width={containerWidth} height={containerHeight}>
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					<XAxis width={width} height={height} scale={this.xScale} />
					<YAxis width={width} height={height} scale={this.yScale} />
					<LineSeries data={data} xScale={this.xScale} yScale={this.yScale} />
					<Cursor
						data={data}
						width={width}
						height={height}
						xScale={this.xScale}
						yScale={this.yScale} />
				</g>
			</svg>
		);
	}
	
	static defaultProps = {
		containerWidth: 800,
		containerHeight: 600,
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
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

class Cursor extends React.Component<any, any> {
	render() {		
		return (
			<g>
				<XCursor
					data={this.props.data}
					x={this.props.x}
					height={this.props.height}
					scale={this.props.xScale} />
				<YCursor
					y={this.props.y}
					width={this.props.width}
					scale={this.props.yScale} />
				<rect
					className='pane'
					width={this.props.width}
					height={this.props.height} />
			</g>
		);
	}
	
	static defaultProps = {
		x: 200,
		y: 200
	}
}

class XCursor extends React.Component<any, any> {
	
	private bisectDate = d3.bisector(function(d: Quote) { return d.dateTime; }).left;
	private dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
	
	render() {
		var x0 = this.props.scale.invert(this.props.x),
            i = this.bisectDate(this.props.data, x0, 1),
            d0 = this.props.data[i - 1],
            d1 = this.props.data[i],
            d: Quote;
		
		if (d1) {
			d = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
		} else {
			d = d0;
		}
		
		return (
			<g
				className='x cursor'
				transform={'translate(' + this.props.scale(d.dateTime) + ', 0)'}>
				<line y2={this.props.height} />
				<rect x={-60} y={this.props.height} width={120} height={14} />
				<text dy='.71em' y={this.props.height + 3}>
					{this.dateFormat(d.dateTime)}
				</text>
			</g>
		);
	}
}

class YCursor extends React.Component<any, any> {
	render() {
		return (
			<g className='y cursor' transform={'translate(0, ' + this.props.y + ')'}>
				<line x2={this.props.width} />
				<rect x={this.props.width} y={-7} width={50} height={14} />
				<text dy='.32em' x={this.props.width + 3}>
					{this.props.scale.invert(this.props.y).toFixed(5)}
				</text>
			</g>
		);
	}
}

var data = [
	{ dateTime: new Date('2015-10-20T10:00:00Z'), close: 1.12 },
	{ dateTime: new Date('2015-10-20T11:00:00Z'), close: 1.20 },
	{ dateTime: new Date('2015-10-20T12:00:00Z'), close: 1.16 },
	{ dateTime: new Date('2015-10-20T13:00:00Z'), close: 1.35 }
];
ReactDOM.render(<Chart data={data} />, document.getElementById('chart'));