import FormOptions from "./form-options";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold sm:text-xl">
            Exportar reportes
          </h3>
        </div>
      </div>
      <hr />
      <div className="mt-8 relative h-max overflow-auto">
        <FormOptions></FormOptions>
      </div>
    </div>
  );
}

export default Page;
