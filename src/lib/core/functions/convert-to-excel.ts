// todo test function not deploy to production
import XLSX from "xlsx";
import fs from "fs";
import { anvizService } from "../service/anviz.service";

export async function getExcelFromApi() {
  try {
    const responseToken = await anvizService.getToken();
    console.log(responseToken);
    const responseAnviz = await anvizService.getData(responseToken.content);

    // const worksheet = XLSX.utils.json_to_sheet(responseAnviz.content);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // XLSX.writeFile(workbook, "./results.xlsx");
  } catch (error) {}
}
