import React, { useState } from "react";
import Chart from "react-apexcharts";

function GraphicLine() {
  const [series, setSeries] = useState([
    {
      name: "Asistencias vs Faltas",
      data: [70, 100],
    },
  ]);

  const [options, setOptions] = useState<any>({
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      curve: "straight",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val;
      },
      offsetY: -10,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: ["Ayer", "Hoy"],
      position: "bottom",
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 500],
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
      min: 0,
      max: 300,
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val: any) {
          return val;
        },
      },
    },
    title: {
      text: "Comparacion de faltas",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
  });

  return (
    <div className="w-full bg-white p-2 rounded-lg">
      <Chart options={options} series={series} type="line" />
    </div>
  );
}

export default GraphicLine;
