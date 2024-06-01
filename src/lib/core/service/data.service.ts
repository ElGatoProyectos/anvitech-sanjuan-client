import { anvizService } from "./anviz.service";
import { errorService } from "./errors.service";
import { reportService } from "./report.service";
import { httpResponse } from "./response.service";

class DataService {
  async instanceDataInit(
    minDay?: number,
    maxDay?: number,
    selectedYear?: number,
    seletedMonth?: number
  ) {
    try {
      /// obtener fecha y hora actual
      const { monday, saturday } = await this.getMondayAndSaturday();
      const { year: dataYear, month: dataMonth } = await this.getDate();

      const min = !minDay && monday;
      const max = !maxDay && saturday;
      const year = !selectedYear && dataYear;
      const month = !seletedMonth && dataMonth;

      /// transformar a fecha y hora estranjera
      const begin_time = `${year}-${month}-${min}T00:00:00+00:00`;
      const end_time = `${year}-${month}-${max}T23:59:59+00:00`;

      // const responseData = await anvizService.getData(begin_time, end_time);

      /// capturar el id del reporte
      const responseReport = await reportService.generateReport();

      /// obtener el token para hacer la peticiion post

      const responseToken = await anvizService.getToken();

      /// toda la logica de

      const responseDetail = await this.instanceDetailData();

      if (!responseReport.ok) return responseReport;

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
    minDay?: number,
    maxDay?: number,
    selectedYear?: number,
    seletedMonth?: number
  ) {
    try {
      const { monday, saturday } = await this.getMondayAndSaturday();
      const { year: dataYear, month: dataMonth } = await this.getDate();

      // todo define data time
      const min = 5;
      const max = 10;
      const year = !selectedYear && dataYear;
      const month = !seletedMonth && dataMonth;

      // todo define time intervals
      const begin_time = `${year}-${month}-${min}T00:00:00+00:00`;
      const end_time = `${year}-${month}-${max}T23:59:59+00:00`;
      const response = dataResponseAnviz;
      const dataReport = response.payload.list;
      const days = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];

      // for (let index = min; index < max; index++) {
      //   const response = await anvizService.getData(begin_time,end_time,);
      // }

      let pos = 0;

      for (let index = min; index < max; index++) {
        const response = dataReport.filter((item) => {
          const fecha = new Date(item.checktime);
          const dia = fecha.getDate();
          return dia === 3;
        });
      }
    } catch (error) {}
  }

  // async captureDataForDay(
  //   token: string,
  //   day: number,
  //   month: number,
  //   year: number
  // ) {
  //   try {
  //     /// la diferencia horaria es de 5 horas hacia delante
  //     const begin_time = `${year}-${month}-${day}T05:00:00+00:00`;
  //     /// validamos si el siguiente dia es el mes siguiente o no
  //     let endDate = new Date(year, month - 1, day + 1, 5, 0, 0);

  //     let end_time;

  //     if (endDate.getDate() === 1) {
  //       end_time = `${year}-${month + 1}-01T05:00:00+00:00`;
  //     } else {
  //       end_time = `${year}-${month}-${day + 1}T05:00:00+00:00`;
  //     }
  //     // await anvizService.getData(token, begin_time, end_time);

  //     console.log(begin_time);
  //     console.log(end_time);
  //   } catch (error) {
  //     return error;
  //   }
  // }
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

      // Crear una fecha a partir de los parámetros
      let endDate = new Date(year, month - 1, day + 1, 5, 0, 0);

      let end_time;
      if (endDate.getDate() === 1) {
        // Si es el siguiente mes
        const newMonth = month === 12 ? 1 : month + 1; // Manejar la transición de diciembre a enero
        const newYear = month === 12 ? year + 1 : year; // Incrementar el año si el mes es diciembre
        end_time = `${newYear}-${String(newMonth).padStart(
          2,
          "0"
        )}-01T05:00:00+00:00`;
      } else {
        end_time = `${year}-${String(month).padStart(2, "0")}-${String(
          day + 1
        ).padStart(2, "0")}T05:00:00+00:00`;
      }

      // await anvizService.getData(token, begin_time, end_time);

      console.log(begin_time);
      console.log(end_time);
    } catch (error) {
      console.error(error);
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
