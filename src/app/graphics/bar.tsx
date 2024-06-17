import React, { useState } from "react";
import Chart from "react-apexcharts";

function GraphicBar() {
  const [series, setSeries] = useState([
    {
      name: "Asistencias vs Faltas",
      data: [100, 70],
    },
  ]);

  const [options, setOptions] = useState<any>({
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        colors: {
          ranges: [
            {
              from: 0,
              to: 70,
              color: "#FF4560", // Rojo para "Faltas"
            },
            {
              from: 71,
              to: 100,
              color: "#00E396", // Verde para "Asistencias"
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: ["Asistencias", "Faltas"],
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val: any) {
          return val;
        },
      },
    },
    title: {
      // text: "Asistencias vs Faltas",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
    colors: ["#FF4560", "#00E396"], // This sets a default color array for the series
  });

  return (
    <div className="w-full bg-white p-2 rounded-lg">
      <Chart options={options} series={series} type="bar" />
    </div>
  );
}

export default GraphicBar;
