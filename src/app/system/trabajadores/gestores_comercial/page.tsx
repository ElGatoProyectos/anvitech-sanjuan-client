import FormRegisterManager from "./form";
import TableManagements from "./table";
function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg   gap-8">
      <div className="md:col-span-3 col-span-2 mb-4">
        <h1 className="font-semibold">Gestion de gestores comerciales</h1>
      </div>
      <FormRegisterManager></FormRegisterManager>
      <br />
      <TableManagements></TableManagements>
    </div>
  );
}

export default Page;
