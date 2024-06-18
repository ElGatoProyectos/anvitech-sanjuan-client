import LicencesWorker from "./licences";
import MedicalRestWorker from "./medical-rest";
import PermissionsWorker from "./permission";
import ScheduleWorker from "./schedule";
import UpdateDataWorker from "./update-data";
import VacationWorker from "./vacation";

function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <div className="flex flex-col w-full gap-8 ">
      <UpdateDataWorker id={id}></UpdateDataWorker>
      <VacationWorker id={id}></VacationWorker>
      <PermissionsWorker id={id}></PermissionsWorker>
      <LicencesWorker id={id}></LicencesWorker>
      <MedicalRestWorker id={id}></MedicalRestWorker>
      {/* <ScheduleWorker id={id}></ScheduleWorker> */}
    </div>
  );
}

export default Page;
