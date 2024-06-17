"use client";

import { useSession } from "next-auth/react";

import GraphicBar from "../graphics/bar";
import GraphicLine from "../graphics/line";

function Dashboard() {
  const session = useSession();

  return (
    <div className="grid  grid-cols-2 gap-4 w-full">
      <div className="bg-white w-full col-span-2">Filtros</div>
      <GraphicBar></GraphicBar>

      <GraphicLine></GraphicLine>
      <div className="bg-white w-full col-span-2 p-2  rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Item</th>
              <th>Item</th>

              <th>Item</th>

              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>

              <td></td>

              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
