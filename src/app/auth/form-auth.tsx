"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function FormAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    showToast();

    // setTimeout(() => {
    //   router.push("system");
    // }, 2200);
  }

  function showToast() {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }

  async function getData() {
    try {
      const response = await axios.get("/api/data");
      console.log(response);
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
            type="email"
            id="login-email"
            className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Correo"
          />
        </div>
      </div>
      <div className="mb-12 flex flex-col pt-4">
        <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
          <input
            type="password"
            id="login-password"
            className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Contrasen~a"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 flex justify-center h-12"
      >
        {isLoading ? (
          <div className="typing-indicator ">
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
          </div>
        ) : (
          <span>Ingresar</span>
        )}
      </button>
    </form>
  );
}

export default FormAuth;
