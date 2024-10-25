import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const EPSTemperatureGauge = ({ temperature }) => {
  const chartConfigs = {
    type: "thermometer",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "EPS Temperature",
        subcaption: "In Celsius",
        lowerlimit: "-50",
        upperlimit: "150",
        numbersuffix: "°C",
        thmfillcolor: "#E44A00",
        showgaugeborder: "1",
        gaugebordercolor: "#E44A00",
        gaugeborderthickness: "2",
        showvalue: "1",
        valuefontsize: "20",
        tickmarkdistance: "5",
        showtickmarks: "1",
        showtickvalues: "1",
        thermometerbulbheight: "15",
        thermometerbulbwidth: "20",
      },
      value: temperature,
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default EPSTemperatureGauge;
