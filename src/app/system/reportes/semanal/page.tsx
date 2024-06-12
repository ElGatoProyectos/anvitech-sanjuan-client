import TableData from "./table-data";

function Page() {
  return (
    <div className="min-w-full bg-white p-8 rounded-lg">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold sm:text-xl">
            Reporte diario
          </h3>
        </div>
      </div>
      <hr />
      <div className="mt-8 relative h-max overflow-auto">
        <TableData></TableData>
      </div>
    </div>
  );
}

export default Page;
