import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  day: string;
  absences: any;
}

const data_recentOrder = [
  {
    day: "lun",
    absences: 122,
  },
  {
    month: "mar",
    orders: 52,
  },
];

function GraphicLine({ formattedLateness }: { formattedLateness: Props[] }) {
  return (
    <div className="h-[30rem] bg-white p-4">
      <div>
        <span className="font-semibold">Linea de tiempo de tardanzas</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedLateness}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Tardanzas
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={"hsl(var(--border))"}
          />
          <XAxis
            dataKey="day"
            tickLine={{ stroke: "none" }}
            axisLine={{ stroke: "none" }}
            stroke={"hsl(var(--muted-foreground))"}
            padding={{ left: 20, right: 30 }}
          />
          <YAxis
            tickLine={{ stroke: "none" }}
            axisLine={{ stroke: "none" }}
            stroke={"hsl(var(--muted-foreground))"}
            padding={{ top: 0, bottom: 20 }}
          />
          <Area
            type="monotone"
            dataKey="absences"
            strokeWidth={2}
            activeDot={{
              r: 8,
              style: { fill: "hsl(var(--primary))" },
            }}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--accent))"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphicLine;
