import CardHeaderWorker from "./card-header-workers";
import TableWorkers from "./table-workers";

function Page() {
  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <CardHeaderWorker></CardHeaderWorker>
      <div className="">
        <TableWorkers></TableWorkers>
      </div>
    </div>
  );
}

export default Page;
