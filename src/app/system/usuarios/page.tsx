import Link from "next/link";
import CardHeaderUser from "./card-header-user";

const users = [
  {
    full_name: "Hans Melchor",
  },
];

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <CardHeaderUser></CardHeaderUser>
      <div className="mt-8 relative h-max overflow-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Nombre</th>
              <th className="py-3 pr-6">Fecha</th>
              <th className="py-3 pr-6">Estado</th>

              <th className="py-3 pr-6">Registros</th>
              <th className="py-3 pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {/* {tableItems.map((item, idx) => (
              <tr key={idx}>
                <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.date}</td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      item.status !== "Modificado"
                        ? "text-green-600 bg-green-50"
                        : "text-blue-600 bg-blue-50"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="pr-6 py-4 whitespace-nowrap">{item.price}</td>
                <td className="text-right whitespace-nowrap">
                  <Link
                    href={"/system/reportes/" + idx}
                    className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
