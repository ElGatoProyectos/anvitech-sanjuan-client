import FormOptions from "./form-options";
import NewFormExport from "./new-form";

function Page() {
  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="w-full bg-white p-8 rounded-lg">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-lg font-semibold sm:text-lg">
              Exportar reportes
            </h3>
          </div>
        </div>
        <hr />
        <div className="mt-8 relative h-max overflow-auto">
          <FormOptions></FormOptions>
        </div>
      </div>

      {/* <div className="w-full bg-white p-8 rounded-lg">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-lg font-semibold sm:text-lg">
              Nuevos formatos de reporte
            </h3>
          </div>
        </div>
        <hr />
        <div className="mt-8 relative h-max overflow-auto">
          <NewFormExport></NewFormExport>
        </div>
      </div> */}
    </div>
  );
}

export default Page;
