/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

class ChartBase extends React.Component<ChartBase.Props, {}> { }

module ChartBase {
	export interface Props {
		key: number; // React key attribute
		monitoringData: MonitoringData;
		y: number;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
	}
}

export = ChartBase;