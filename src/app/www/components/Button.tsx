/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="./common/material-design-lite.d.ts" />

import React = require('react');

class Button extends React.Component<Button.Props, {}> {
	
	private buttonElement: HTMLElement;
	
	componentDidMount() {
		componentHandler.upgradeElement(this.buttonElement);
	}
	
	render() {
		return (
			<button
				className={
					'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab ' +
					'mdl-js-ripple-effect'
				}
				ref={ref => this.buttonElement = ref}
				onClick={this.props.onClick}>
				{this.props.children}
			</button>
		);
	}
}

module Button {
	export interface Props {
		onClick: React.MouseEventHandler;
		children?: React.ReactNode;
	}
}

export = Button;