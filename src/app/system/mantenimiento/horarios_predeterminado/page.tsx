import TableSchedule from "./table-schedule";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="mb-4">
        <h1 className="font-semibold">Listado de horarios predeterminados</h1>
      </div>
      <TableSchedule></TableSchedule>
    </div>
  );
}

export default Page;
