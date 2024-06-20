import prisma from "@/lib/prisma";
import { anvizService } from "./anviz.service";
import { errorService } from "./errors.service";
import { reportService } from "./report.service";
import { httpResponse } from "./response.service";
import { workerService } from "./worker.service";
import { formatDateForPrisma } from "../functions/date-transform";
import { scheduleService } from "./schedule.service";
import { vacationService } from "./vacation.service";

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
      console.log("============", min, max, year, month);

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
        "domingo",
      ];

      let pos = 0;

      for (let day = minDay; day <= maxDay; day++) {
        /// definimos el dia donde estamos para poder hacer el registro a la bd 📅
        const dayString = this.functionCaptureDayFromNumber(
          day,
          selectedYear,
          selectedMonth
        );
        console.log("=================" + dayString + "======================");

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
            report,
            day,
            selectedMonth,
            selectedYear
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
    report: any,
    dayI: number,
    monthI: number,
    yearI: number
  ) {
    try {
      console.log("filter and register!!!!!");

      /// con este horario validamos las horas, ya tenemos el day
      const responseSchedule = await scheduleService.findScheduleForWorker(
        worker.id
      );
      const schedule = responseSchedule.content;

      const [lunesStart, lunesEnd] = schedule.lunes.split("-");
      const [hourStart, minutesStart] = lunesStart.split(":");
      const [hourEnd, minutesEnd] = lunesEnd.split(":");

      //-devuelve un array de posiblemente 4 objetos que contienen la fecha de inicio a fin
      const dataFiltered = dataGeneralDay.filter(
        (item) => item.employee.workno === worker.dni
      );

      const formatData: any = {
        report_id: report.id,
        tardanza: "no",
        falta: "si",
        dia: day,
        // fecha_reporte: report.date_created.toISOString(),?
        fecha_reporte: new Date(yearI, monthI - 1, dayI),

        dni: worker.dni,
        nombre: worker.full_name,
        supervisor: worker.supervisor,
        sede: worker.department,
        hora_entrada: "",
        hora_inicio: "",
        hora_inicio_refrigerio: "",
        hora_fin_refrigerio: "",
        hora_salida: "",
        discount: 0,
      };

      //- aqui vamos a crear la fecha

      const dateI = new Date(yearI, monthI - 1, dayI);
      formatData.fecha_reporte = dateI;
      // caso normal ==========================================================================================

      if (dataFiltered.length) {
        //! formatData.sede=dataFiltered[0].device.name,
        dataFiltered.map((item, index) => {
          const horaCompleta = item.checktime.split("T")[1].split("+")[0];

          if (!horaCompleta) {
            formatData.falta = "si";
            formatData.discount = 35;
          }
          const [hour, minutes] = horaCompleta.split(":");

          let newHour: number = Number(hour) - 5;

          if (Number(hour) >= 0 && Number(hour) <= 4) {
            newHour = 23 - 4 + Number(hour);
          }

          if (index === dataFiltered.length - 1) {
            if (newHour < 16) {
              formatData.falta = "si";
              formatData.tardanza = "no";
              formatData.discount = 35;
            }
          } else {
            if (newHour <= 11) {
              formatData.hora_inicio = newHour + ":" + minutes;
              if (newHour > Number(hourStart)) {
                formatData.tardanza = "si";
                formatData.discount = 35;
              } else {
                if (newHour === 9) {
                  if (Number(minutes) <= 5) {
                    formatData.tardanza = "no";
                  } else if (Number(minutes) > 5 && Number(minutes) <= 15) {
                    formatData.tardanza = "si";
                    formatData.discount = 5;
                  } else if (Number(minutes) > 15 && Number(minutes) <= 30) {
                    formatData.tardanza = "si";
                    formatData.discount = 10;
                  } else if (Number(minutes) > 30 && Number(minutes) <= 59) {
                    formatData.tardanza = "si";
                    formatData.discount = 20;
                  }
                } else {
                  formatData.tardanza = "no";
                }
              }
            } else if (newHour >= 12 && newHour <= 16) {
              if (formatData.hora_inicio_refrigerio === "") {
                formatData.hora_inicio_refrigerio = newHour + ":" + minutes;
              } else {
                formatData.hora_fin_refrigerio = newHour + ":" + minutes;
              }
            } else {
              if (newHour >= Number(hourEnd)) {
                formatData.falta = "no";
              } else {
                formatData.falta = "si";
                formatData.tardanza = "no";
                formatData.discount = 35;
              }
              formatData.hora_salida = newHour + ":" + minutes;
            }
          }
        });

        // ========================================================= caso de vacaciones y permisos =============================================================
      } else {
        const dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 1);

        //- validamos si esta de vacaciones, permiso, licencia o descanso medico

        // validamos las vacaciones

        const vacationResponse = await prisma.vacation.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });
        // validamos los permisos

        const permissionResponse = await prisma.permissions.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        // validamos licencias

        const licencesResponse = await prisma.licence.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        // validamos los descansos medicos

        const medicalRestResponse = await prisma.medicalRest.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        // validamos incidencias

        const incidentResponse = await prisma.incident.findMany({
          where: {
            date: dateYesterday,
          },
        });

        if (
          vacationResponse.length > 0 ||
          permissionResponse.length > 0 ||
          licencesResponse.length > 0 ||
          medicalRestResponse.length > 0 ||
          incidentResponse.length > 0
        ) {
          formatData.falta = "no";
          formatData.tardanza = "no";
          formatData.discount = 0;
        } else {
          formatData.falta = "si";
          formatData.discount = 35;
        }
      }

      await prisma.detailReport.create({ data: formatData });

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
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
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

      return httpResponse.http200("Report created", totalData);
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
      const limaTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Lima",
      });

      const limaDate = new Date(limaTime);

      const dateToString = limaDate.toISOString();

      /// con este horario validamos las horas, ya tenemos el day
      const responseSchedule = await scheduleService.findScheduleForWorker(
        worker.id
      );
      const schedule = responseSchedule.content;

      ///devuelve un array de posiblemente 4 objetos que contienen la fecha de inicio a fin
      const dataFiltered = dataGeneralDay.filter(
        (item) => item.employee.workno === worker.dni
      );

      const formatData = {
        report_id: "",
        tardanza: "no",
        falta: "si",
        dia: day,
        fecha_reporte: dateToString,
        dni: worker.dni,
        nombre: worker.full_name,
        // sede: dataFiltered[0].device.name,
        sede: worker.department,
        supervisor: worker.supervisor,
        hora_entrada: "",
        hora_inicio: "",
        hora_inicio_refrigerio: "",
        hora_fin_refrigerio: "",
        hora_salida: "",
        discount: 35,
      };
      if (dataFiltered.length) {
        const [lunesStart, lunesEnd] = schedule.lunes.split("-");
        const [hourStart, hourEnd] = lunesStart.split(":");
        /// dataFiltered

        if (dataFiltered.length) {
          //! formatData.sede=dataFiltered[0].device.name,
          dataFiltered.map((item, index) => {
            const horaCompleta = item.checktime.split("T")[1].split("+")[0];
            const [hour, minutes] = horaCompleta.split(":");

            let newHour: number = Number(hour) - 5;

            if (Number(hour) >= 0 && Number(hour) <= 4) {
              newHour = 23 - 4 + Number(hour);
            }

            if (index === dataFiltered.length - 1) {
              if (newHour < 16) {
                formatData.falta = "si";
                formatData.tardanza = "no";
                formatData.discount = 35;
              }
            }

            if (newHour <= 11) {
              formatData.hora_inicio = newHour + ":" + minutes;
              if (newHour > Number(hourStart)) {
                formatData.tardanza = "si";
                formatData.discount = 35;
              } else {
                if (newHour === 9) {
                  if (Number(minutes) <= 5) {
                    formatData.tardanza = "no";
                  } else if (Number(minutes) > 5 && Number(minutes) <= 15) {
                    formatData.tardanza = "si";
                    formatData.discount = 5;
                  } else if (Number(minutes) > 15 && Number(minutes) <= 30) {
                    formatData.tardanza = "si";
                    formatData.discount = 10;
                  } else if (Number(minutes) > 30 && Number(minutes) <= 59) {
                    formatData.tardanza = "si";
                    formatData.discount = 20;
                  }
                } else {
                  formatData.tardanza = "no";
                }
              }
            } else if (newHour >= 12 && newHour <= 16) {
              if (formatData.hora_inicio_refrigerio === "") {
                formatData.hora_inicio_refrigerio = newHour + ":" + minutes;
              } else {
                formatData.hora_fin_refrigerio = newHour + ":" + minutes;
              }
            } else {
              if (newHour >= Number(hourEnd)) {
                formatData.falta = "no";
              } else {
                formatData.falta = "si";
                formatData.tardanza = "no";
                formatData.discount = 35;
              }
              formatData.hora_salida = newHour + ":" + minutes;
            }
          });
        }
      } else {
        const dateYesterday = new Date();

        //- validamos si esta de vacaciones o permiso

        // validamos las vacaciones

        const vacationResponse = await prisma.vacation.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });
        // validamos los permisos

        const permissionResponse = await prisma.permissions.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        const licencesResponse = await prisma.licence.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        const medicalRestResponse = await prisma.medicalRest.findMany({
          where: {
            worker_id: worker.id,
            AND: [
              {
                start_date: {
                  lte: dateYesterday,
                },
              },
              {
                end_date: {
                  gte: dateYesterday,
                },
              },
            ],
          },
        });

        const incidentResponse = await prisma.incident.findMany({
          where: {
            date: dateYesterday,
          },
        });

        if (
          vacationResponse.length > 0 ||
          permissionResponse.length > 0 ||
          licencesResponse.length > 0 ||
          medicalRestResponse.length > 0 ||
          incidentResponse.length > 0
        ) {
          formatData.falta = "no";
          formatData.tardanza = "no";
          formatData.discount = 0;
        } else {
          formatData.falta = "si";
          formatData.discount = 35;
        }
      }
      return formatData;
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

  async getMondayAndSaturday() {
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

  getMondayAndSaturdayDatetime(day: number, month: number, year: number) {
    // Crear una fecha a partir de los datos proporcionados
    const inputDate = new Date(year, month - 1, day); // Los meses en JavaScript son 0-indexados

    const dayOfWeek = inputDate.getDay();

    // Calcular el lunes de esa semana
    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - ((dayOfWeek + 6) % 7));

    // Calcular el sábado de esa semana
    const saturday = new Date(inputDate);
    saturday.setDate(inputDate.getDate() + (6 - dayOfWeek));

    return {
      monday: monday.toISOString(),
      saturday: saturday.toISOString(),
    };
  }

  async getDaysBetweenMondayAndSaturday(
    day: number,
    month: number,
    year: number
  ) {
    const inputDate = new Date(year, month - 1, day);

    const dayOfWeek = inputDate.getDay();

    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - ((dayOfWeek + 6) % 7));

    const saturday = new Date(inputDate);
    saturday.setDate(inputDate.getDate() + (6 - dayOfWeek));

    const daysBetween = [];

    for (let d = new Date(monday); d <= saturday; d.setDate(d.getDate() + 1)) {
      daysBetween.push(new Date(d).toISOString());
    }

    return daysBetween;
  }

  async getDaysFromLastSaturdayToThisFriday(
    day: number,
    month: number,
    year: number
  ) {
    const inputDate = new Date(year, month - 1, day);
    const dayOfWeek = inputDate.getDay();

    // Encontrar el sábado anterior
    const lastSaturday = new Date(inputDate);
    lastSaturday.setDate(inputDate.getDate() - dayOfWeek - 1);

    // Encontrar el viernes actual
    const thisFriday = new Date(inputDate);
    thisFriday.setDate(inputDate.getDate() + (5 - dayOfWeek));

    // Generar todas las fechas entre el sábado anterior y el viernes actual
    const daysBetween = [];

    for (
      let d = new Date(lastSaturday);
      d <= thisFriday;
      d.setDate(d.getDate() + 1)
    ) {
      daysBetween.push(new Date(d).toISOString());
    }

    return daysBetween;
  }
}

export const dataService = new DataService();
