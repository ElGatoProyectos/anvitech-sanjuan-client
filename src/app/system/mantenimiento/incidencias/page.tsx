import FormIncidentsAbsolute from "./form-absolute";
import FormIncidents from "./form-incidents";
import TableIncidents from "./table-incidents";
import TableIncidentsAbsolute from "./table-incidents-absolute";

function Page() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="w-full bg-white p-8 rounded-lg   gap-8">
        <div className="md:col-span-3 col-span-2 mb-4">
          <h1 className="font-semibold">Gestion de incidencias</h1>
        </div>
        <FormIncidents></FormIncidents>
        <br />
        <TableIncidents></TableIncidents>
      </div>

      {/* la logica de agregar por fechas ya no, ahora toda incidencia se gestiona a nivel general */}

      {/* <div className="w-full bg-white p-8 rounded-lg   gap-8">
        <div className="md:col-span-3 col-span-2 mb-4">
          <h1 className="font-semibold">Incidencias absolutas</h1>
        </div>
        <FormIncidentsAbsolute></FormIncidentsAbsolute>
        <TableIncidentsAbsolute></TableIncidentsAbsolute>
      </div> */}
    </div>
  );
}

export default Page;
