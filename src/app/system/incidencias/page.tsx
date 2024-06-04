import FormIncidents from "./form-incidents";
import TableIncidents from "./table-incidents";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg grid md:grid-cols-3 grid-cols-2 gap-16">
      <FormIncidents></FormIncidents>
      <TableIncidents></TableIncidents>
    </div>
  );
}

export default Page;
