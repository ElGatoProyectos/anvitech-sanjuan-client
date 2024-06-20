"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useToastDestructive } from "../hooks/toast.hook";

function FormAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) router.push("/system");
    else {
      setIsLoading(false);
      useToastDestructive("Error", "Credenciales incorrectas");
    }

    // setTimeout(() => {
    //   router.push("system");
    // }, 2200);
  }

  async function getData() {
    try {
      // const response = await axios.get("/api/data");
      const res = await axios.get("/api/test-date");

      // getExcelFromApi();
    } catch (error) {}
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
      <div className="flex flex-col pt-4">
        <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
          <input
            type="text"
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Usuario"
          />
        </div>
      </div>
      <div className="mb-12 flex flex-col pt-4">
        <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
          <input
            type="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Contraseña"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 flex justify-center h-12"
      >
        {isLoading ? (
          <span className="animate-pulse">Cargando ...</span>
        ) : (
          <span>Ingresar</span>
        )}
      </button>
    </form>
  );
}

export default FormAuth;
