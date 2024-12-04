import React, { useState, useEffect } from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const VoltageGauge = () => {
  const [voltage, setVoltage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVoltageLevel = async () => {
    try {
      const response = await fetch(
        "https://agrixcubesat.azurewebsites.net/backendapi/telemetry/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setVoltage(parseFloat(data.voltage)); 
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoltageLevel();
    const intervalId = setInterval(fetchVoltageLevel, 5000); 
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const chartConfigs = {
    type: "lineargauge",
    width: "150",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Voltage Level",
        lowerlimit: "0",
        upperlimit: "240", 
        numbersuffix: " V",
        theme: "fusion",
        valuefontsize: "20",
        pointerbgalpha: "10",
        showvalue: "0",
        chartBottomMargin: "10",
      },
      colorRange: {
        color: [
          { minValue: "0", maxValue: "80", code: "#e44a00" },
          { minValue: "80", maxValue: "160", code: "#f8bd19" },
          { minValue: "160", maxValue: "240", code: "#6baa01" },
        ],
      },
      pointers: {
        pointer: [
          {
            value: voltage,
            bgColor: "#FF5733", 
            borderColor: "#C70039",
            borderThickness: "4",
            radius: "12",
            alpha: "80",
          },
        ],
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ReactFC {...chartConfigs} />;
};

export default VoltageGauge;
