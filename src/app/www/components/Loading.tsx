import React = require('react');

class Loading extends React.Component<{}, {}> {
	
	private loadingElement: HTMLElement;
	
	componentDidMount() {
		componentHandler.upgradeElement(this.loadingElement);
	}
	
	render() {
		return (
			<div className='overlay'>
				<div
					className='mdl-spinner mdl-js-spinner is-active'
					ref={ref => this.loadingElement = ref}>
				</div>
			</div>
		);
	}
}

export = Loading;