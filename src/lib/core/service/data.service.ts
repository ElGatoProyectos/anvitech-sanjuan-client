import { anvizService } from "./anviz.service";
import { errorService } from "./errors.service";
import { reportService } from "./report.service";
import { httpResponse } from "./response.service";

class DataService {
  async instanceDataInit(
    minDay?: number,
    maxDay?: number,
    selectedYear?: number,
    selectedMonth?: number
  ) {
    try {
      /// obtener fecha y hora actual
      const { monday, saturday } = await this.getMondayAndSaturday();
      const { year: dataYear, month: dataMonth } = await this.getDate();

      const min = !minDay && monday;
      const max = !maxDay && saturday;
      const year = !selectedYear && dataYear;
      const month = !selectedMonth && dataMonth;

      /// transformar a fecha y hora estranjera
      // const begin_time = `${year}-${month}-${min}T00:00:00+00:00`;
      // const end_time = `${year}-${month}-${max}T:59:59+00:00`;

      // const responseData = await anvizService.getData(begin_time, end_time);

      /// capturar el id del reporte
      const responseReport = await reportService.generateReport();
      if (!responseReport.ok) return responseReport;

      /// obtener el token para hacer la peticiion post

      const responseToken = await anvizService.getToken();
      if (!responseToken.ok) return responseToken;

      /// toda la logica de insercion en la base de datos

      const responseDetail = await this.instanceDetailData(
        responseToken.content.token,
        Number(min),
        Number(max),
        Number(selectedYear),
        Number(selectedMonth)
      );

      // todo pending define
      // const detail = await reportService.generateReportDetail(
      //   responseData.content,
      //   report.id
      // );

      return httpResponse.http200(
        "Reporte creado con exito",
        responseReport.content
      );
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async instanceDetailData(
    token: string,
    minDay: number,
    maxDay: number,
    selectedYear: number,
    seletedMonth: number
  ) {
    try {
      // const { monday, saturday } = await this.getMondayAndSaturday();
      // const { year: dataYear, month: dataMonth } = await this.getDate();

      // // todo define data time
      // const min = 5;
      // const max = 10;
      // const year = !selectedYear && dataYear;
      // const month = !seletedMonth && dataMonth;

      // // todo define time intervals
      // const begin_time = `${year}-${month}-${min}T00:00:00+00:00`;
      // const end_time = `${year}-${month}-${max}T23:59:59+00:00`;
      // const response = dataResponseAnviz;
      // const dataReport = response.payload.list;

      const days = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];

      let pos = 0;

      for (let day = minDay; day < maxDay; day++) {
        const dayString = days[pos];
        ///capturacion de data por dia
        const response = await this.captureDataForDay(
          token,
          day,
          seletedMonth,
          selectedYear
        );
        /// registrar toda la data que llego del dia en base al usuario
        const users = ["", ""];

        /// bucle para registrar

        pos++;
      }

      // for (let index = min; index < max; index++) {
      //   const response = await anvizService.getData(begin_time,end_time,);
      // }
    } catch (error) {}
  }

  async filterAndRegisterForUser(dataGeneralDay: any[], worker: any) {
    try {
      const dataFiltered = dataGeneralDay.filter(
        (item) => item.payload.list.employe.workno === worker.dni
      );
      /// no se cuantos objetos haya dentro del array, pero se que tengo que ordenarlos en base a la fecha
    } catch (error) {}
  }

  async captureDataForDay(
    token: string,
    day: number,
    month: number,
    year: number
  ) {
    try {
      const begin_time = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}T05:00:00+00:00`;

      let endDate = new Date(year, month - 1, day + 1, 5, 0, 0);

      let end_time;
      if (endDate.getDate() === 1) {
        const newMonth = month === 12 ? 1 : month + 1;
        const newYear = month === 12 ? year + 1 : year;
        end_time = `${newYear}-${String(newMonth).padStart(
          2,
          "0"
        )}-01T05:00:00+00:00`;
      } else {
        end_time = `${year}-${String(month).padStart(2, "0")}-${String(
          day + 1
        ).padStart(2, "0")}T05:00:00+00:00`;
      }

      let dataList = [];
      let pos = 1;
      while (true) {
        const response = await anvizService.getData(
          token,
          begin_time,
          end_time,
          "asc",
          pos
        );
        if (response.content.data.payload.list.length) {
          dataList.push(...response.content.payload.list);
        } else {
          break;
        }
      }

      return httpResponse.http200("Data for day", dataList);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  private async getDate() {
    const limaTime = new Date().toLocaleString("en-US", {
      timeZone: "America/Lima",
    });

    const limaDate = new Date(limaTime);

    const day = limaDate.getDate();
    const month = limaDate.getMonth() + 1;
    const year = limaDate.getFullYear();

    return { day, month, year };
  }

  private async getMondayAndSaturday() {
    const limaTime = new Date().toLocaleString("en-US", {
      timeZone: "America/Lima",
    });
    const limaDate = new Date(limaTime);

    const dayOfWeek = limaDate.getDay();

    const monday = new Date(limaDate);
    monday.setDate(limaDate.getDate() - ((dayOfWeek + 6) % 7));

    const saturday = new Date(limaDate);
    saturday.setDate(limaDate.getDate() + (6 - dayOfWeek));

    return {
      monday: monday.getDate(),
      saturday: saturday.getDate(),
    };
  }
}

export const dataService = new DataService();
