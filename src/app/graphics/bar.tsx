import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  attendances: number;
  absences: number;
}

function GraphicBar({ attendanceVsAbsence }: { attendanceVsAbsence: Props }) {
  const workerWeek = [
    {
      tag: "Asistencias",
      record: attendanceVsAbsence.attendances,
      asistencias: attendanceVsAbsence.attendances,
    },
    {
      tag: "Faltas",
      record: attendanceVsAbsence.absences,
      faltas: attendanceVsAbsence.absences,
    },
  ];

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={workerWeek}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Tooltip
            cursor={{ fill: "hsl(var(--input))", opacity: 0.4 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          N° de {payload[0].name}
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
          <XAxis
            dataKey="region"
            tickLine={{ stroke: "none" }}
            axisLine={{ stroke: "none" }}
            stroke={"hsl(var(--muted-foreground))"}
            padding={{ left: 20, right: 30 }}
          />
          <YAxis
            tickLine={{ stroke: "none" }}
            axisLine={{ stroke: "none" }}
            stroke={"hsl(var(--muted-foreground))"}
            padding={{ top: 0, bottom: 0 }}
          />
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={"hsl(var(--border))"}
          />

          <Bar dataKey="asistencias" fill="#00E396" />
          <Bar dataKey="faltas" fill="#FF4560" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphicBar;
