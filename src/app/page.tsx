import { Toaster } from "@/components/ui/toaster";
import FormAuth from "./auth/form-auth";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">
            <p className="text-left text-3xl font-bold">
              Bienvenido nuevamente
            </p>
            <p className="mt-2 text-left text-gray-500">
              Por favor ingresa sus credenciales
            </p>

            <FormAuth></FormAuth>
            <div className="py-12 text-center">
              <p className="whitespace-nowrap text-gray-600">
                <a
                  href="recuperar_contrasena"
                  className="underline-offset-4 font-semibold text-gray-900 underline ml-4"
                >
                  Recuperar contraseña.
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className=" relative hidden h-screen select-none bg-black md:block md:w-1/2">
          <div className="absolute bottom-0 z-10 px-8 text-white opacity-100 mb-4 top-[50%]">
            <p className="mb-8 text-[3rem] font-semibold leading-10">
              Sistema de control de asistencia
            </p>
            {/* <p className="mb-4 text-3xl font-semibold">Name Example</p> */}

            {/* <p className="mb-7 text-sm opacity-70">Web Design Agency</p> */}
          </div>
          <div className="absolute bottom-0 z-50 text-white opacity-100 mb-4  px-8">
            <span className="text-sm">
              Desarrollado por{" "}
              <Link
                href={"www.gato.pe"}
                target="_blank"
                className="font-semibold"
              >
                Agencia GATO
              </Link>{" "}
            </span>
          </div>
          <img
            className="-z-1 absolute top-0 h-full w-full object-cover opacity-90 "
            src="https://www.cegid.com/ib/wp-content/uploads/sites/3/2024/03/header-blog-gestion-de-horarios-laborales-cegid.jpg"
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}
