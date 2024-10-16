import React from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const IMUGauge = ({ imuValue, type }) => {
  const chartConfigs = {
    type: "angulargauge",
    width: "400",
    height: "300",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: `${type} Angle`, // Title changes based on the type (Yaw, Pitch, Roll)
        lowerlimit: "-180",
        upperlimit: "180",
        numbersuffix: "°",
        theme: "fusion",
        showvalue: "1",
        valuefontsize: "20",
        gaugefillmix: "{light+0}",
        gaugeouterradius: "150",
        pivotradius: "10",
        pivotfillcolor: "#000000",
        gaugefillratio: "0,0,100,0",
      },
      colorRange: {
        color: [
          {
            minValue: "-180",
            maxValue: "-90",
            code: "#E44A00", // Red for negative extreme
          },
          {
            minValue: "-90",
            maxValue: "90",
            code: "#62B58F", // Green for normal range
          },
          {
            minValue: "90",
            maxValue: "180",
            code: "#E44A00", // Red for positive extreme
          },
        ],
      },
      dials: {
        dial: [
          {
            value: imuValue,
            rearExtension: "5",
          },
        ],
      },
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default IMUGauge;
