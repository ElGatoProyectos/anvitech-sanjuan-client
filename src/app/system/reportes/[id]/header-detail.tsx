"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { getId } from "@/app/http/api.http";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function HeaderDetail({ id }: { id: string }) {
  const session = useSession();

  const [dataReport, setDataReport] = useState<any>({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getId("reports", Number(id), session.data);
      setDataReport(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la informacion");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchData();
    }
  }, [session.status]);

  return (
    <div className="max-w-lg">
      {session.status === "authenticated" && !loading ? (
        <h3 className="text-gray-800 text-lg font-semibold sm:text-lg">
          {" "}
          Detalle - {dataReport.name}
        </h3>
      ) : (
        <Skeleton className="w-full h-12"></Skeleton>
      )}
    </div>
  );
}

export default HeaderDetail;
