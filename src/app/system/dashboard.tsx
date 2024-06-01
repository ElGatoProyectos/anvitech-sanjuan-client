"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
  LineChart,
  Line,
} from "recharts";
import GraphicBar from "../graphics/bar";

function Dashboard() {
  const session = useSession();
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <div className="grid xl:grid-cols-3 grid-cols-2 gap-4">
      <div className="border rounded-lg bg-white">
        <div className="flex flex-col gap-4 items-start justify-between p-4">
          {/* header */}
          <div className="flex w-full justify-between">
            <div>
              <h4 className="text-gray-800 font-semibold">Reportes</h4>
            </div>
            <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100">
              Actualizar
            </button>
          </div>
          {/* end header */}

          {/* content */}
          <div className="flex items-center gap-4 ">
            <div>
              <span className="text-3xl font-bold">234</span>
            </div>
            <p className="text-gray-600 text-sm">
              Numero total de reportes realizados hasta el dia de hoy {}
            </p>
          </div>

          {/* end content */}
        </div>
        <div className="py-5 px-4 border-t text-right">
          <Link
            href={"/system/reportes"}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Ir a seccion
          </Link>
        </div>
      </div>
      <div className="border rounded-lg bg-white">
        <div className="flex flex-col gap-4 items-start justify-between p-4">
          {/* header */}
          <div className="flex w-full justify-between">
            <div>
              <h4 className="text-gray-800 font-semibold">
                Total de correcciones
              </h4>
            </div>
            <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100">
              Actualizar
            </button>
          </div>
          {/* end header */}

          {/* content */}
          <div className="flex items-center gap-4 ">
            <div>
              <span className="text-3xl font-bold">234</span>
            </div>
            <p className="text-gray-600 text-sm">
              Numero total de reportes realizados hasta el dia de hoy {}
            </p>
          </div>

          {/* end content */}
        </div>
        <div className="py-5 px-4 border-t text-right">
          <Link
            href={"/system/reportes"}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Ir a seccion
          </Link>
        </div>
      </div>
      {session.data?.user.role === "admin" && (
        <div className="border rounded-lg bg-white">
          <div className="flex flex-col gap-4 items-start justify-between p-4">
            {/* header */}
            <div className="flex w-full justify-between">
              <div>
                <h4 className="text-gray-800 font-semibold">Usuarios</h4>
              </div>
              <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100">
                Actualizar
              </button>
            </div>
            {/* end header */}

            {/* content */}
            <div className="flex items-center gap-4 ">
              <div>
                <span className="text-3xl font-bold">5</span>
              </div>
              <p className="text-gray-600 text-sm">
                Total de usuarios registrados
              </p>
            </div>

            {/* end content */}
          </div>
          <div className="py-5 px-4 border-t text-right">
            <Link
              href={"/system/usuarios"}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Ir a seccion
            </Link>
          </div>
        </div>
      )}
      <div></div>

      {/* graphics */}

      <div className="xl:col-span-3 col-span-2 bg-white border rounded-lg p-4">
        {/* <ResponsiveContainer className={`min-h-80`}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer> */}

        <GraphicBar></GraphicBar>
      </div>
    </div>
  );
}

export default Dashboard;
