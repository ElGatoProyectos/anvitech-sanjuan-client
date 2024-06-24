import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  attendances: number;
  absences: number;
}

function GraphicBar({ week }: { week: any }) {
  const [data, setData] = useState([
    { name: "Sabado", faltas: 0, asistencias: 0, amt: 2000 },
    { name: "Domingo", faltas: 0, asistencias: 0, amt: 2181 },
    { name: "Lunes", faltas: 0, asistencias: 0, amt: 2500 },
    { name: "Martes", faltas: 0, asistencias: 0, amt: 2100 },
    { name: "Miercoles", faltas: 0, asistencias: 0, amt: 2100 },
    { name: "Jueves", faltas: 0, asistencias: 0, amt: 2100 },
    { name: "Viernes", faltas: 0, asistencias: 0, amt: 2100 },
  ]);

  useEffect(() => {
    if (week) {
      const updatedData = [
        { name: "Sabado", faltas: 0, asistencias: 0, amt: 2000 },
        { name: "Domingo", faltas: 0, asistencias: 0, amt: 2181 },
        { name: "Lunes", faltas: 0, asistencias: 0, amt: 2500 },
        { name: "Martes", faltas: 0, asistencias: 0, amt: 2100 },
        { name: "Miercoles", faltas: 0, asistencias: 0, amt: 2100 },
        { name: "Jueves", faltas: 0, asistencias: 0, amt: 2100 },
        { name: "Viernes", faltas: 0, asistencias: 0, amt: 2100 },
      ];

      week.forEach((worker: any) => {
        [
          "sabado",
          "domingo",
          "lunes",
          "martes",
          "miercoles",
          "jueves",
          "viernes",
        ].forEach((day, index) => {
          const report = worker[day];
          if (report) {
            if (report.falta === "si") {
              updatedData[index].faltas += 1;
            } else {
              updatedData[index].asistencias += 1;
            }
          }
        });
      });

      setData(updatedData);
    }
  }, [week]);

  return (
    <div className="h-[30rem] bg-white p-4 xl:col-span-1 col-span-2">
      <div className="mb-4">
        <span className="font-semibold">Asistencias vs faltas</span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[1000, 1500]} />
          <Tooltip />

          <Bar dataKey="faltas" stackId="a" fill="#8884d8" />
          <Bar dataKey="asistencias" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
// interface Props {
//   attendances: number;
//   absences: number;
// }

// function GraphicBar({ attendanceVsAbsence }: { attendanceVsAbsence: Props }) {
//   const workerWeek = [
//     {
//       tag: "Asistencias",
//       record: attendanceVsAbsence.attendances,
//       asistencias: attendanceVsAbsence.attendances,
//     },
//     {
//       tag: "Faltas",
//       record: attendanceVsAbsence.absences,
//       faltas: attendanceVsAbsence.absences,
//     },
//   ];

//   return (
//     <div className="h-[24rem] bg-white p-4">
//       <div className="mb-4">
//         <span className="font-semibold">Asistencias vs faltas</span>
//       </div>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={workerWeek}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <Tooltip
//             cursor={{ fill: "hsl(var(--input))", opacity: 0.4 }}
//             content={({ active, payload }) => {
//               if (active && payload && payload.length) {
//                 return (
//                   <div className="rounded-lg border bg-background p-2 shadow-sm">
//                     <div className="grid grid-cols-1 gap-2">
//                       <div className="flex flex-col">
//                         <span className="text-[0.70rem] uppercase text-muted-foreground">
//                           N° de {payload[0].name}
//                         </span>
//                         <span className="font-bold text-muted-foreground">
//                           {payload[0].value}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               }

//               return null;
//             }}
//           />
//           <XAxis
//             dataKey="region"
//             tickLine={{ stroke: "none" }}
//             axisLine={{ stroke: "none" }}
//             stroke={"hsl(var(--muted-foreground))"}
//             padding={{ left: 20, right: 30 }}
//           />
//           <YAxis
//             tickLine={{ stroke: "none" }}
//             axisLine={{ stroke: "none" }}
//             stroke={"hsl(var(--muted-foreground))"}
//             padding={{ top: 0, bottom: 0 }}
//           />
//           <CartesianGrid
//             horizontal={true}
//             vertical={false}
//             stroke={"hsl(var(--border))"}
//           />

//           <Bar dataKey="asistencias" fill="#00E396" />
//           <Bar dataKey="faltas" fill="#FF4560" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

export default GraphicBar;
