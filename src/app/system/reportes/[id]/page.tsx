import HeaderDetail from "./header-detail";
import TableUser from "./table-users";

function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="items-start justify-between md:flex">
        <HeaderDetail id={id}></HeaderDetail>
      </div>
      <hr />
      <div className="mt-8 relative h-max overflow-auto">
        <TableUser id={id}></TableUser>
      </div>
    </div>
  );
}

export default Page;
