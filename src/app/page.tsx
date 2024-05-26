import FormAuth from "./auth/form-auth";

export default function Home() {
  return (
    <div className="flex flex-wrap">
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
          <a
            href="https://anvitechperu.com/"
            target="_blank"
            className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900"
          >
            Anvitech
          </a>
        </div>
        <div className="lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">
          <p className="text-left text-3xl font-bold">Bienvenido nuevamente</p>
          <p className="mt-2 text-left text-gray-500">
            Por favor ingresa sus credenciales
          </p>

          <FormAuth></FormAuth>
          <div className="py-12 text-center">
            <p className="whitespace-nowrap text-gray-600">
              No me acuerdo mi contrasen~a
              <a
                href="#"
                className="underline-offset-4 font-semibold text-gray-900 underline ml-4"
              >
                Recuperar ahora.
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
        <div className="absolute bottom-0 z-10 px-8 text-white opacity-100">
          <p className="mb-8 text-3xl font-semibold leading-10">
            Sistema de control de asistencia
          </p>
          {/* <p className="mb-4 text-3xl font-semibold">Name Example</p> */}
          <p className="">Coordinador, Jhon Doe</p>
          {/* <p className="mb-7 text-sm opacity-70">Web Design Agency</p> */}
        </div>
        <img
          className="-z-1 absolute top-0 h-full w-full object-cover opacity-90 "
          src="https://www.cegid.com/ib/wp-content/uploads/sites/3/2024/03/header-blog-gestion-de-horarios-laborales-cegid.jpg"
        />
      </div>
    </div>
  );
}
