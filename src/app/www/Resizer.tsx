/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');

class Resizer extends React.Component<Resizer.Props, Resizer.State> {
	
	private resizer: HTMLElement;
	
	private handleResize = () => {
		if (!this.resizer) return;
		
		this.setState({
			width: this.resizer.offsetWidth,
			height: this.resizer.offsetHeight
		});
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	
	render() {
		if (!this.state) {
			return (
				<div
					ref={(ref: any) => ref && this.setState({
						width: ref.offsetWidth,
						height: ref.offsetHeight
					})}
					className="resizer" />
			);
		}
		
		return (
			<div ref={(ref: any) => this.resizer = ref} className="resizer">
				{React.cloneElement(this.props.children, {
					width: this.state.width,
					height: this.state.height
				})}
			</div>
		);
	}
}
module Resizer {
	export interface Props {
		children?: React.ReactElement<any>
	}
	
	export interface State {
		width: number;
		height: number;
	}
}

export = Resizer;