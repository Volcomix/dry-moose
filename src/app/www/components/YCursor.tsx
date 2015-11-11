/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class YCursor extends React.Component<YCursor.Props, YCursor.State> {
	render() {
		return (
			<g
				className='y cursor'
				transform={'translate(0, ' + this.props.mouseY + ')'}>
				<line x2={this.props.width} />
				<rect x={this.props.width} y={-7} width={50} height={14} />
				<text dy='.32em' x={this.props.width + 3}>
					{this.props.scale.invert(this.props.mouseY).toFixed(5)}
				</text>
			</g>
		);
	}
}

module YCursor {
	export interface Props {
		mouseY: number;
		width: number;
		scale: d3.scale.Linear<number, number>;
	}
	
	export interface State {
	}
}

export = YCursor;