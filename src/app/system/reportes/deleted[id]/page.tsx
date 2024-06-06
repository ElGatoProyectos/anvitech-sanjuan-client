import TableUser from "./table-users";

function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
            Detalle del reporte {id}
          </h3>
        </div>
      </div>
      <hr />
      <div className="mt-8 relative h-max overflow-auto">
        <TableUser id={id}></TableUser>
      </div>
    </div>
  );
}

export default Page;
