import FormRegisterUserMassive from "../registro_masivo/form";
import Form from "./form";

function Page() {
  return (
    <div className=" grid md:grid-cols-2 grid-cols-1 w-full gap-8 ">
      <FormRegisterUserMassive></FormRegisterUserMassive>
      <Form></Form>
    </div>
  );
}

export default Page;
