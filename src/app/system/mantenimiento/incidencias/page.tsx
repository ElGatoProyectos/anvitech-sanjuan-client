import FormIncidents from "./form-incidents";
import TableIncidents from "./table-incidents";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg grid md:grid-cols-3 grid-cols-2 gap-8">
      <div className="md:col-span-3 col-span-2 mb-4">
        <h1 className="font-semibold">Gestion de incidencias</h1>
      </div>
      <FormIncidents></FormIncidents>
      <TableIncidents></TableIncidents>
    </div>
  );
}

export default Page;
