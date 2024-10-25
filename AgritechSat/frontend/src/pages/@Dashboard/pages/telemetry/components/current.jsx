import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const CurrentGauge = ({ current }) => {
  const chartConfigs = {
    type: "angulargauge",
    width: "400",
    height: "300",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Current Level",
        lowerlimit: "0",
        upperlimit: "100", // Adjust based on your current range (e.g., 0-100 A)
        numbersuffix: " A",
        theme: "fusion",
        showvalue: "1",
        valuefontsize: "20",
        gaugefillmix: "{light+0}",
        gaugeouterradius: "150",
      },
      colorRange: {
        color: [
          { minValue: "0", maxValue: "30", code: "#62B58F" }, // Safe range
          { minValue: "30", maxValue: "70", code: "#F8C53A" }, // Warning range
          { minValue: "70", maxValue: "100", code: "#E44A00" }, // Critical range
        ],
      },
      dials: {
        dial: [
          {
            value: current,
            rearExtension: "5",
          },
        ],
      },
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default CurrentGauge;
