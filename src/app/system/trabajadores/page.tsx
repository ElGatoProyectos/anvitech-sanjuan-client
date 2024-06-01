import TableWorkers from "./table-workers";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="items-start justify-between flex ">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold">
            Lista de trabajadores
          </h3>
        </div>
      </div>
      <div className="">
        <TableWorkers></TableWorkers>
      </div>
    </div>
  );
}

export default Page;
