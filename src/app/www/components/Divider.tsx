/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class Divider extends React.Component<Divider.Props, {}> {
	render() {
		return (
			<g
				className='divider'
				ref={ref => d3.select(ref).datum({ x: 0, y: 0 }).call(this.props.drag)}
				transform={'translate(0, ' + this.props.y + ')'}>
				<line x2={this.props.width} />
				<rect
					transform={'translate(0, ' + -4 + ')'}
					width={this.props.width}
					height={7} />
			</g>
		);
	}
}

module Divider {
	export interface Props {
		y: number;
		width: number;
		drag: d3.behavior.Drag<{}>;
	}
}

export = Divider;