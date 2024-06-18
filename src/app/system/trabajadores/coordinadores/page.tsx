import FormRegisterCoordinator from "./form";
import FormRegisterSupervisor from "./form";
import TableCoordinators from "./table";
import TableSupervisors from "./table";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg   gap-8">
      <div className="md:col-span-3 col-span-2 mb-4">
        <h1 className="font-semibold">Gestion de coordinadores</h1>
      </div>
      <FormRegisterCoordinator></FormRegisterCoordinator>
      <br />
      <TableCoordinators></TableCoordinators>
    </div>
  );
}

export default Page;
