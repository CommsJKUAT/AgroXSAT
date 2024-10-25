import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const VoltageGauge = ({ voltage }) => {
  const chartConfigs = {
    type: "hlineargauge",
    width: "400",
    height: "150",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Voltage Level",
        lowerlimit: "0",
        upperlimit: "240", // Adjust based on your voltage range
        numbersuffix: " V",
        theme: "fusion",
        showvalue: "1",
        valuefontsize: "20",
        gaugefillmix: "{light+0}",
      },
      colorRange: {
        color: [
          { minValue: "0", maxValue: "100", code: "#e44a00" }, // Low voltage
          { minValue: "100", maxValue: "180", code: "#f8bd19" }, // Medium voltage
          { minValue: "180", maxValue: "240", code: "#6baa01" }, // High voltage
        ],
      },
      pointers: [
        {
          value: voltage,
        },
      ],
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default VoltageGauge;
