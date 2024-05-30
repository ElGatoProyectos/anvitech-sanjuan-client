import Link from "next/link";
import CardHeaderUser from "./card-header-user";
import TableUser from "./table-users";

const users = [
  {
    full_name: "Hans Melchor",
  },
];

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <CardHeaderUser></CardHeaderUser>
      <div className="mt-8 relative h-max overflow-auto">
        <TableUser></TableUser>
      </div>
    </div>
  );
}

export default Page;
