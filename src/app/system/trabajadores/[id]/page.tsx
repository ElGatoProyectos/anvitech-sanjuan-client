import ScheduleWorker from "./schedule";
import UpdateDataWorker from "./update-data";

function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <div className="flex flex-col w-full gap-8 ">
      <UpdateDataWorker id={id}></UpdateDataWorker>
      <ScheduleWorker id={id}></ScheduleWorker>
    </div>
  );
}

export default Page;
