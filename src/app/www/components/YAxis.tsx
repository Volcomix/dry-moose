/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import YCursor = require('./YCursor');

class YAxis extends React.Component<YAxis.Props, {}> {
	
	private axis = d3.svg.axis().orient('right');
	
	render() {
		this.axis
			.tickFormat(this.props.tickFormat)
			.scale(this.props.scale)
			.tickSize(-this.props.width, 0);
		return (
			<g>
				{React.createElement('clipPath', { id: this.props.clipPath },
					<rect
						transform={'translate(' + -this.props.width + ', 0)'}
						width={this.props.width + 100}
						height={this.props.height} />
				) /* TSX doesn't know clipPath element */}
				<g
					className='y axis'
					transform={'translate(' + this.props.width + ', 0)'}
					clipPath={'url(#' + this.props.clipPath + ')'}
					ref={(ref: any) => d3.select(ref).call(this.axis)} />
				<YCursor
					width={this.props.width}
					height={this.props.height}
					scale={this.props.scale}
					zoom={this.props.zoom}
					labelFormat={this.props.tickFormat} />
			</g>
		);
	}
}

module YAxis {
	export interface Props {
		width: number;
		height: number;
		scale: d3.scale.Linear<number, number>;
		zoom: d3.behavior.Zoom<{}>;
		clipPath: string;
		tickFormat: (t: any) => string;
	}
}

export = YAxis;