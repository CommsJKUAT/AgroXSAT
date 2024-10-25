// STEP 1 - Include Dependencies
// Include react
import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// Resolves charts dependancy
charts(FusionCharts);

const dataSource = {
  chart: {
    caption: "Satellite Temperature",
    subcaption: "(Per Quarter minute)",
    lowerlimit: "120",
    upperlimit: "200",
    numbersuffix: "°F",
    thmfillcolor: "#008ee4",
    showgaugeborder: "1",
    gaugebordercolor: "#008ee4",
    gaugeborderthickness: "2",
    plottooltext: "Temperature: <b>$datavalue</b> ",
    theme: "gammel",
    showvalue: "1",
  },
  value: "140",
};

// STEP 4 - Creating the DOM element to pass the react-fusioncharts component
class Temperature extends React.Component {
  render() {
    return (
      <ReactFusioncharts
        type="thermometer"
        width="100%"
        height="400"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    );
  }
}

export default Temperature;
