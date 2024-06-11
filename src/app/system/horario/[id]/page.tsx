import ScheduleWorker from "./schedule";

function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <div className="flex flex-col w-full gap-8 ">
      <ScheduleWorker id={id}></ScheduleWorker>
    </div>
  );
}

export default Page;
