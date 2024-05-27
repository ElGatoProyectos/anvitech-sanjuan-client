import { FileCode2, Link } from "lucide-react";

function Page() {
  return (
    <div className="grid grid-cols-3">
      <div className="border rounded-lg bg-white">
        <div className="flex flex-col gap-4 items-start justify-between p-4">
          {/* header */}
          <div className="flex w-full justify-between">
            <div>
              <FileCode2 />
              <h4 className="text-gray-800 font-semibold">Reportes</h4>
            </div>
            <button className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100">
              Connect
            </button>
          </div>
          {/* end header */}

          {/* content */}
          <div className="flex items-center gap-2 ">
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
          <a className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            Ir a seccion
          </a>
        </div>
      </div>
    </div>
  );
}

export default Page;
