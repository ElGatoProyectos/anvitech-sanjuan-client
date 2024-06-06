import prisma from "@/lib/prisma";
import { anvizService } from "./anviz.service";
import { errorService } from "./errors.service";
import { reportService } from "./report.service";
import { httpResponse } from "./response.service";
import { workerService } from "./worker.service";
import { formatDateForPrisma } from "../functions/date-transform";
import { scheduleService } from "./schedule.service";

class DataService {
  async instanceDataInit(
    minDay?: number,
    maxDay?: number,
    selectedYear?: number,
    selectedMonth?: number,
    isReport: boolean = true
  ) {
    try {
      /// obtener fecha y hora actual
      const { monday, saturday } = await this.getMondayAndSaturday();
      const { year: dataYear, month: dataMonth } = await this.getDate();

      const min = minDay ?? monday;
      const max = maxDay ?? saturday;
      const year = selectedYear ?? dataYear;
      const month = selectedMonth ?? dataMonth;

      /// obtener el token para hacer la peticion post

      const responseToken = await anvizService.getToken();
      if (!responseToken.ok) return responseToken;

      if (isReport) {
        const responseReport = await reportService.generateReport();
        if (!responseReport.ok) return responseReport;

        const responseDetail = await this.instanceDetailData(
          responseToken.content.token,
          Number(min),
          Number(max),
          Number(year),
          Number(month),
          responseReport.content
        );

        return httpResponse.http200(
          "Report generado satisfactoriamente",
          responseDetail.content
        );
      } else {
        const responseDetail = await this.instanceDetailDataNoRegister(
          responseToken.content.token,
          Number(min),
          Number(max),
          Number(year),
          Number(month)
        );

        return httpResponse.http200(
          "Report generado satisfactoriamente",
          responseDetail.content
        );
      }
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  /// falta otro metodo igual que no registre, solo que muestre

  async instanceDetailData(
    token: string,
    minDay: number,
    maxDay: number,
    selectedYear: number,
    selectedMonth: number,
    report: any
  ) {
    try {
      const days = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];

      let pos = 0;

      for (let day = minDay; day <= maxDay; day++) {
        /// definimos el dia donde estamos para poder hacer el registro a la bd 📅
        const dayString = days[pos];
        console.log(dayString);

        ///capturamos toda la data por dia de toda las paginas  [{},{},{}....{}]
        // todo todo ok
        const responseDataForDay = await this.captureDataForDay(
          token,
          day,
          selectedMonth,
          selectedYear
        );

        /// filtrar la data para que se registre por usuario
        const workers = await workerService.findAll();

        /// iteración de trabajadores para obtener sus datos y analizar en base a eso
        const responseMap = workers.content.map(async (worker: any) => {
          await this.filterAndRegisterForUser(
            responseDataForDay.content,
            worker,
            dayString,
            report
          );
        });

        pos++;
      }

      return httpResponse.http200("Report created", "Report created");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async filterAndRegisterForUser(
    dataGeneralDay: any[],
    worker: any,
    day: string,
    report: any
  ) {
    try {
      console.log("filter and register!!!!!");

      /// con este horario validamos las horas, ya tenemos el day
      const responseSchedule = await scheduleService.findScheduleForWorker(
        worker.id
      );
      const schedule = responseSchedule.content;

      const [lunesStart, lunesEnd] = schedule.lunes.split("-");
      const [hourStart, hourEnd] = lunesStart.split(":");

      ///devuelve un array de posiblemente 4 objetos que contienen la fecha de inicio a fin
      const dataFiltered = dataGeneralDay.filter(
        (item) => item.employee.workno === worker.dni
      );

      console.log(dataFiltered);

      const formatData = {
        report_id: report.id,
        tardanza: "no",
        falta: "no",
        dia: day,
        fecha_reporte: report.date_created.toISOString(),
        dni: worker.dni,
        nombre: worker.full_name,
        sede: dataFiltered[0].device.name,
        hora_entrada: "",
        hora_inicio: "",
        hora_inicio_refrigerio: "",
        hora_fin_refrigerio: "",
        hora_salida: "",
      };
      /// dataFiltered

      dataFiltered.map((item, index) => {
        const horaCompleta = item.checktime.split("T")[1].split("+")[0];
        const [hour, minutes] = horaCompleta.split(":");
        const newHour = Number(hour) - 5;

        if (newHour <= hourStart) {
          formatData.hora_inicio = newHour + ":" + minutes;
          if (newHour > hourStart) {
            formatData.tardanza = "si";
          } else {
            formatData.tardanza = "no";
          }
        } else if (newHour >= 12 && newHour <= 16) {
          if (formatData.hora_inicio_refrigerio === "") {
            formatData.hora_inicio_refrigerio = newHour + ":" + minutes;
          } else {
            formatData.hora_fin_refrigerio = newHour + ":" + minutes;
          }
        } else {
          if (newHour < hourEnd) {
            formatData.falta = "si";
          }
          formatData.hora_salida = newHour + ":" + minutes;
        }
      });
      console.log(formatData);

      const created = await prisma.detailReport.create({ data: formatData });

      /// no se cuantos objetos haya dentro del array, pero se que tengo que ordenarlos en base a la fecha
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  ///===========================================================================================================================
  /// métodos no affect database
  ///===========================================================================================================================

  functionCaptureDayFromNumber(day: number, year: number, month: number) {
    const date = new Date(year, month - 1, day);
    const dayOfWeekNumber = date.getDay();

    const daysOfWeek = [
      "domino",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];

    return dayOfWeekName;
  }

  async instanceDetailDataNoRegister(
    token: string,
    minDay: number,
    maxDay: number,
    selectedYear: number,
    selectedMonth: number
  ) {
    try {
      const totalData = [];

      for (let day = minDay; day <= maxDay; day++) {
        const dayString = this.functionCaptureDayFromNumber(
          day,
          selectedYear,
          selectedMonth
        );

        console.log(dayString);

        const responseDataForDay = await this.captureDataForDay(
          token,
          day,
          selectedMonth,
          selectedYear
        );

        const workers = await workerService.findAll();

        const reportForDay = await Promise.all(
          workers.content.map(async (worker: any) => {
            const resFormat = await this.filterAndRegisterForUserNoRegister(
              responseDataForDay.content,
              worker,
              dayString
            );
            return resFormat;
          })
        );

        totalData.push(...reportForDay);
      }

      console.log(totalData);

      return httpResponse.http200("Report created", "Report created");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async filterAndRegisterForUserNoRegister(
    dataGeneralDay: any[],
    worker: any,
    day: string
  ) {
    try {
      console.log("filter and register!!!!!");

      /// con este horario validamos las horas, ya tenemos el day
      const responseSchedule = await scheduleService.findScheduleForWorker(
        worker.id
      );
      const schedule = responseSchedule.content;

      ///devuelve un array de posiblemente 4 objetos que contienen la fecha de inicio a fin
      const dataFiltered = dataGeneralDay.filter(
        (item) => item.employee.workno === worker.dni
      );

      if (dataFiltered.length) {
        const [lunesStart, lunesEnd] = schedule.lunes.split("-");
        const [hourStart, hourEnd] = lunesStart.split(":");
        const formatData = {
          report_id: "",
          tardanza: "no",
          falta: "no",
          dia: day,
          fecha_reporte: "",
          dni: worker.dni,
          nombre: worker.full_name,
          sede: dataFiltered[0].device.name,
          hora_entrada: "",
          hora_inicio: "",
          hora_inicio_refrigerio: "",
          hora_fin_refrigerio: "",
          hora_salida: "",
        };
        /// dataFiltered

        dataFiltered.map((item, index) => {
          const horaCompleta = item.checktime.split("T")[1].split("+")[0];
          const [hour, minutes] = horaCompleta.split(":");
          const newHour = Number(hour) - 5;

          if (newHour <= hourStart) {
            formatData.hora_inicio = newHour + ":" + minutes;
            if (newHour > hourStart) {
              formatData.tardanza = "si";
            } else {
              formatData.tardanza = "no";
            }
          } else if (newHour >= 12 && newHour <= 16) {
            if (formatData.hora_inicio_refrigerio === "") {
              formatData.hora_inicio_refrigerio = newHour + ":" + minutes;
            } else {
              formatData.hora_fin_refrigerio = newHour + ":" + minutes;
            }
          } else {
            if (newHour < hourEnd) {
              formatData.falta = "si";
            }
            formatData.hora_salida = newHour + ":" + minutes;
          }
        });
        return formatData;
      } else {
        const formatData = {
          report_id: "",
          tardanza: "si",
          falta: "si",
          dia: day,
          fecha_reporte: "",
          dni: worker.dni,
          nombre: worker.full_name,
          sede: "",
          hora_entrada: "",
          hora_inicio: "",
          hora_inicio_refrigerio: "",
          hora_fin_refrigerio: "",
          hora_salida: "",
        };
        return formatData;
      }
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
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
        if (response.content.payload.list.length) {
          dataList.push(...response.content.payload.list);
          pos++;
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
