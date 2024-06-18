import FormRegisterTerminationMassive from "../cese_masivo/form";
import FormRegisterMedicalRestMassive from "../descanso_medico_masivo/form";
import FormRegisterLicenseMassive from "../licencia_masivo/form";
import FormRegisterPermissionsMassive from "../permiso_masivo/form";
import FormRegisterWorkersMassive from "../registro_masivo/form";
import FormRegisterSupervisorMassive from "../supervisores_masivos/form";
import FormRegisterVacationMassive from "../vacaciones_masivas/form";

function Page() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <FormRegisterWorkersMassive></FormRegisterWorkersMassive>
      <FormRegisterSupervisorMassive></FormRegisterSupervisorMassive>
      <FormRegisterTerminationMassive></FormRegisterTerminationMassive>
      <FormRegisterVacationMassive></FormRegisterVacationMassive>

      <FormRegisterLicenseMassive></FormRegisterLicenseMassive>
      <FormRegisterMedicalRestMassive></FormRegisterMedicalRestMassive>
      <FormRegisterPermissionsMassive></FormRegisterPermissionsMassive>
    </div>
  );
}

export default Page;
