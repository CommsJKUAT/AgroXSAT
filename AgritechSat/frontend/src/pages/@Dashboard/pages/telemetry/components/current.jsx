import React, { useState, useEffect } from "react";
import FusionCharts from "fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Resolve dependencies
ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

const CurrentGauge = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current value from the backend
  const fetchCurrentValue = async () => {
    try {
      const response = await fetch(
        "https://agroxsat.onrender.com/backendapi/telemetry/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("ddtaa ",data);
      setCurrent(parseFloat(data.current)); 
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentValue();
    const intervalId = setInterval(fetchCurrentValue, 5000); 
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const chartConfigs = {
    type: "angulargauge",
    width: "400",
    height: "300",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Current Level",
        lowerlimit: "0",
        upperlimit: "100", 
        numbersuffix: " A",
        theme: "fusion",
        showvalue: "1",
        valuefontsize: "20",
        gaugefillmix: "{light+0}",
        gaugeouterradius: "150",
      },
      colorRange: {
        color: [
          { minValue: "0", maxValue: "30", code: "#62B58F" }, 
          { minValue: "30", maxValue: "70", code: "#F8C53A" }, 
          { minValue: "70", maxValue: "100", code: "#E44A00" }, 
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ReactFC {...chartConfigs} />;
};

export default CurrentGauge;
