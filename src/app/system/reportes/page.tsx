import Link from "next/link";
import CardHeaderReport from "./card-header-report";
import TableReports from "./table-reports";

function Page() {
  const tableItems = [
    {
      name: "Reporte 1",
      date: "Oct 9, 2023",
      status: "Sin cambios",
      price: "100",
      plan: "Monthly subscription",
    },
    {
      name: "Reporte 2",
      date: "Oct 12, 2023",
      status: "Modificado",
      price: "100",
      plan: "Monthly subscription",
    },
    {
      name: "Reporte 3",
      date: "Oct 22, 2023",
      status: "Sin cambios",
      price: "100",
      plan: "Annually subscription",
    },
    {
      name: "Reporte 4",
      date: "Jan 5, 2023",
      status: "Modificado",
      price: "100",
      plan: "Monthly subscription",
    },
    {
      name: "Reporte 5",
      date: "Jan 6, 2023",
      status: "Sin cambios",
      price: "100",
      plan: "Annually subscription",
    },
  ];

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <CardHeaderReport></CardHeaderReport>
      <div className="mt-8 relative h-max overflow-auto">
        <TableReports></TableReports>
      </div>
    </div>
  );
}

export default Page;
