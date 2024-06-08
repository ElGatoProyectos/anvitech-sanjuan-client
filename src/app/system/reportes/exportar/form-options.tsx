"use client";

import { Button } from "@/components/ui/button";

function FormOptions() {
  return (
    <div className="flex flex-col">
      <div className="">
        <Button>Descargar formato STARSOFT</Button>
      </div>
      <div>
        <Button>Descargar formato NORMAL</Button>
      </div>
    </div>
  );
}

export default FormOptions;
