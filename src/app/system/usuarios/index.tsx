"use client";

import CardHeaderUser from "./card-header-user";
import TableUser from "./table-users";

function Index() {
  return (
    <>
      <CardHeaderUser></CardHeaderUser>
      <div className="mt-8 relative h-max overflow-auto">
        <TableUser></TableUser>
      </div>
    </>
  );
}

export default Index;
