/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

class Chart extends React.Component<{ name: string }, { }> {
	render() {
		return <div>Hello {this.props.name}</div>;
	}
}

var x = <Chart name="World" />;

ReactDOM.render(x, document.getElementById('example'));