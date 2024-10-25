import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const BatteryGauge = ({ level }) => {
  const chartConfigs = {
    type: "hlineargauge",
    width: "100%",
    height: "150",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Battery Level",
        lowerlimit: "0",
        upperlimit: "100",
        numbersuffix: "%",
        theme: "fusion",
        valuefontsize: "20",
        pointerbgalpha: "0",
      },
      colorRange: {
        color: [
          { minValue: "0", maxValue: "20", code: "#e44a00" },
          { minValue: "20", maxValue: "50", code: "#f8bd19" },
          { minValue: "50", maxValue: "100", code: "#6baa01" },
        ],
      },
      pointers: [
        {
          value: level,
        },
      ],
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default BatteryGauge;
