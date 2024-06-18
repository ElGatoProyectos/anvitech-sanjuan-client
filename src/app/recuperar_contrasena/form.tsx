"use client";

import React from "react";

function FormRestorePassword() {
  return (
    <form className="flex flex-col gap-8 pt-3 md:pt-8 border p-8 rounded-lg ">
      <div className="flex flex-col pt-4">
        <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition min-w-96">
          <input
            type="text"
            className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Ingresa tu correo"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 flex justify-center h-12"
      >
        Solicitar
      </button>
      <a href="/" className="text-center underline mt-4">
        Volver
      </a>
    </form>
  );
}

export default FormRestorePassword;
