import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const PressureGauge = ({ pressure }) => {
  const chartConfigs = {
    type: "angulargauge",
    width: "100%",
    height: "300",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Pressure Gauge",
        lowerlimit: "0",
        upperlimit: "200", // Adjust based on your pressure range
        numbersuffix: " PSI", // Adjust the unit if necessary
        theme: "fusion",
        showvalue: "1",
        valuefontsize: "20",
        gaugefillmix: "{light+0}",
        gaugeouterradius: "150",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "70",
            code: "#62B58F",
          },
          {
            minValue: "70",
            maxValue: "140",
            code: "#F8C53A",
          },
          {
            minValue: "140",
            maxValue: "200",
            code: "#E44A00",
          },
        ],
      },
      dials: {
        dial: [
          {
            value: pressure,
            rearExtension: "5",
          },
        ],
      },
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default PressureGauge;
