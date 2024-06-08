import CardHeaderReport from "./card-header-report";
import TableReports from "./table-reports";

function Page() {
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
