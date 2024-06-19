import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

import * as xlsx from "xlsx";
import { dataService } from "./data.service";
import { workerService } from "./worker.service";
import { incidentService } from "./incident.service";
import { scheduleService } from "./schedule.service";
import { formatSheduleDto } from "../schemas/shedule.dto";
import { formatReportFileDTO } from "../schemas/report.dto";

class ReportService {
  async generateReport() {
    try {
      const lastReport = (await this.findLast()) as any;
      let numberPos;
      if (lastReport !== null) {
        const nameSepare = lastReport.name.split(" ");
        numberPos = Number(nameSepare[1]) + 1;
      } else numberPos = 1;

      const dataSet = {
        state: "default",
        name: "Report " + numberPos,
      };
      const report = await prisma.report.create({ data: dataSet });
      return httpResponse.http200("Report created ok", report);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  // async createReportDetail(dataDetail: any, reportId: number, day: string) {
  //   try {
  //     const dataTemporal = {
  //       uuid: "65638685461972376eb766c4261406cfc5f320272dee536c7c0ee8fc94768d71",
  //       checktype: 0,
  //       checktime: "2024-02-07T18:51:46+00:00",
  //       device: {
  //         serial_number: "0300100024030014",
  //         name: "014-MARIACOBOS-LIMANORTE",
  //       },
  //       employee: {
  //         first_name: "ANDERSON ",
  //         last_name: "GALVEZ TICLLACURI",
  //         workno: "70976827",
  //         department: "INTEGRAL PRO SAC - SEDE LIMA NORTE",
  //         job_title: "ASESOR DE VENTAS CAMPO",
  //       },
  //     };

  //     await prisma.detailReport.create({ data: dataDetail });
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

  async generateReportDetail(dataGeneralAniz: any[], reportId: number) {
    // todo mapeo de la informacion y registro de la misma en base al id del reporte
  }

  async findAll() {
    try {
      const reports = await prisma.report.findMany();
      return httpResponse.http200("All reports", reports);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findById(reportId: number) {
    try {
      const detail = await prisma.report.findFirst({ where: { id: reportId } });
      if (!detail) return httpResponse.http404("Report not found");
      return httpResponse.http200("Report found", detail);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  private async findLast() {
    return await prisma.report.findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }

  /// not used
  async findDetailReport(id: number) {
    try {
      const details = await prisma.detailReport.findMany({
        where: { report_id: id },
      });
      return httpResponse.http200("All details report", details);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async findReportByWorker(reportId: number, workerDNI: string) {
    try {
      const detail = await prisma.detailReport.findMany({
        where: { report_id: reportId, dni: workerDNI },
      });
      return httpResponse.http200("All details report", detail);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  /// ok
  async updateHours(detailReportId: number, dataHours: any) {
    try {
      const updated = await prisma.detailReport.update({
        where: { id: detailReportId },
        data: {
          hora_inicio: { set: dataHours.hora_inicio },
          hora_inicio_refrigerio: { set: dataHours.hora_inicio_refrigerio },
          hora_fin_refrigerio: { set: dataHours.hora_fin_refrigerio },
          hora_salida: { set: dataHours.hora_salida },
        },
      });
      return httpResponse.http200("Detail updated", updated);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async addIncident(detailReportId: number, incidentId: number) {
    try {
      // modifica la tardanza y falta porque esta justificado
      await prisma.detailReport.update({
        where: { id: detailReportId },
        data: { tardanza: "no", falta: "no" },
      });

      const updated = await prisma.detailReportIncident.create({
        data: {
          detail_report_id: detailReportId,
          incident_id: incidentId,
        },
      });
      return httpResponse.http201("Incident created", updated);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async deleteIncident(detailId: number) {
    try {
      // tenemos que validar si el trabajador tiene tardanza o falta
      const reporseDetail = await prisma.detailReportIncident.findFirst({
        where: { id: detailId },
      });
      await prisma.detailReport.update({
        where: { id: reporseDetail?.detail_report_id },
        data: { falta: "si" },
      });

      const deleted = await prisma.detailReportIncident.delete({
        where: { id: detailId },
      });
      return httpResponse.http201("Incident detail deleted", deleted);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async findIncidentsForDetail(detailId: number) {
    try {
      const incidents = await prisma.detailReportIncident.findMany({
        where: { detail_report_id: detailId },
        include: {
          incident: true,
        },
      });
      return httpResponse.http200("All incidents for detail", incidents);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  getMondayAndSaturdayDates() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    const endDate = new Date(now);

    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    startDate.setDate(startDate.getDate() + diffToMonday);

    const diffToSaturday = 6 - dayOfWeek;
    endDate.setDate(endDate.getDate() + diffToSaturday);

    return {
      monday: startDate,
      saturday: endDate,
    };
  }

  async dataForStartSoft(month: number, year: number) {
    try {
      // Consultar registros de la tabla 'detailReport' utilizando los IDs obtenidos

      // const resportResponse = await this.findById(reportId);
      // if (!resportResponse.ok) return resportResponse;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const detailReports = await prisma.detailReport.findMany({
        where: {
          fecha_reporte: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      const responseWorkers = await workerService.findAll();

      const incidents = await prisma.detailReportIncident.findMany({
        where: {
          detailReport: {
            fecha_reporte: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
        include: {
          detailReport: true,
          incident: {
            select: {
              title: true,
              description: true,
            },
          },
        },
      });

      return httpResponse.http200("Report success", {
        data: detailReports,
        workers: responseWorkers.content,
        incidents,
      });
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async dataForExportNormal(dateMin: Date, dateMax: Date) {
    try {
      const data = await prisma.detailReport.findMany({
        where: {
          fecha_reporte: {
            gte: dateMin,
            lte: dateMax,
          },
        },
      });
      return httpResponse.http200("All data", data);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async generateReportForDayNoToday(day: number, month: number, year: number) {
    try {
      const startDate = new Date(year, month - 1, day);
      const endDate = new Date(year, month - 1, day + 1);

      const data = await prisma.detailReport.findMany({
        where: {
          fecha_reporte: {
            gte: startDate, // Greater than or equal to the start of the day
            lt: endDate, // Less than the start of the next day
          },
        },
      });
      return httpResponse.http200("Report day created", data);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async generateReportForWeek(days: string[]) {
    try {
      const { content: workers } = await workerService.findAll();

      const response = await Promise.all(
        workers.map(async (worker: any) => {
          const formatData = {
            worker,
            lunes: {},
            martes: {},
            miercoles: {},
            jueves: {},
            viernes: {},
            sabado: {},
            domingo: {},
          };

          for (let i = 0; i < days.length; i++) {
            const day = days[i];

            const data: any = await prisma.detailReport.findFirst({
              where: { fecha_reporte: day, dni: worker.dni },
            });

            if (i === 0) formatData.sabado = data ? data : null;
            else if (i === 1) formatData.domingo = data ? data : null;
            else if (i === 2) formatData.lunes = data ? data : null;
            else if (i === 3) formatData.martes = data ? data : null;
            else if (i === 4) formatData.miercoles = data ? data : null;
            else if (i === 5) formatData.jueves = data ? data : null;
            else if (i === 6) formatData.viernes = data ? data : null;
          }

          return formatData;
        })
      );

      return httpResponse.http200("Report weekly", response);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async updateDetailReport(data: any, detailReportId: number) {
    try {
      // capturamos el horario del trabajador

      const { dataTemporalHours, dataDetail } = data;

      console.log(dataTemporalHours);

      const workerResponse = await workerService.findByDNI(dataDetail.dni);
      if (!workerResponse.ok) return workerResponse;

      const schedule = await prisma.schedule.findFirst({
        where: { worker_id: workerResponse.content.id },
      });

      if (!schedule) return httpResponse.http400("Schedule not found");

      // ahora validamos ==========================================================================

      const hourTotal = schedule.lunes; // "09:00-18:00"
      const [hourStart, hourEnd] = hourTotal.split("-"); // ["09:00", "18:00"]

      const [scheduleStartHour, scheduStartMinute] = hourStart
        .split(":")
        .map(Number); // [9, 0]
      const [scheduleEndHour, scheduEndMinute] = hourEnd.split(":").map(Number); // [18, 0]

      const dataStart = dataTemporalHours.hora_inicio; // "09:00"
      const dataEnd = dataTemporalHours.hora_salida; // "18:00"

      const formatData = {
        hora_inicio: dataTemporalHours.hora_inicio,
        hora_inicio_refrigerio: dataTemporalHours.hora_inicio_refrigerio,
        hora_fin_refrigerio: dataTemporalHours.hora_fin_refrigerio,
        hora_salida: dataTemporalHours.hora_salida,
        tardanza: "no",
        falta: "no",
      };

      // cuando el usuario tiene una hora de entrada
      if (
        dataTemporalHours.hora_inicio !== "" &&
        dataTemporalHours.hora_salida === ""
      ) {
        const [dataStartHour, dataStartMinute] = dataTemporalHours.hora_inicio
          .split(":")
          .map(Number);

        // aqui cambie la falta por tardanza
        if (dataStartHour > scheduleStartHour) formatData.tardanza = "si";
        else if (dataStartHour === scheduleStartHour) {
          if (dataStartMinute > 0) formatData.tardanza = "si";
        }
      }
      // cuando el usuario tiene una hora de salida
      else if (
        dataTemporalHours.hora_inicio === "" &&
        dataTemporalHours.hora_salida !== ""
      ) {
        const [dataEndHour, dataEndMinute] = dataTemporalHours.hora_salida
          .split(":")
          .map(Number);

        if (dataEndHour < scheduleEndHour) {
          formatData.falta = "si";
          formatData.tardanza = "no";
        } else if (dataEndHour === scheduleEndHour) {
          if (dataTemporalHours.hora_inicio === "") formatData.tardanza = "si";
          formatData.falta = "no";
        }
      } else if (dataStart === "" && dataEnd === "") {
        formatData.falta = "si";
        formatData.tardanza = "no";
      } else {
        const [dataStartHour, dataStartMinute] = dataTemporalHours.hora_inicio
          .split(":")
          .map(Number);
        const [dataEndHour, dataEndMinute] = dataTemporalHours.hora_salida
          .split(":")
          .map(Number);

        if (dataStartHour > scheduleStartHour) formatData.falta = "si";
        else if (dataStartHour === scheduleStartHour) {
          if (dataStartMinute > 0) formatData.falta = "si";
        }

        if (dataEndHour < scheduleEndHour) {
          formatData.falta = "si";
          formatData.tardanza = "no";
        } else if (dataEndHour === scheduleEndHour) {
          formatData.falta = "no";
        }
      }
      const updated = await prisma.detailReport.update({
        where: { id: detailReportId },
        data: formatData,
      });
      return httpResponse.http200("Detail report updated", updated);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async uploadReportMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      const exampleData = sheetToJson[0];

      const report = await reportService.generateReport();

      await Promise.all(
        sheetToJson.map(async (row: any, index) => {
          const worker = await workerService.findByDNI(String(row.dni));
          const schedule = await scheduleService.findScheduleForWorker(
            worker.content.id
          );

          const [scheduleStart, scheduleEnd] =
            schedule.content[
              this.getDayOfWeek(new Date(row.fecha_reporte))
            ].split("-");
          const [scheduleHourStart, scheduleMinuteStart] = scheduleStart
            .split(":")
            .map(Number);

          const [scheduleHourEnd, scheduleMinuteEnd] = scheduleEnd
            .split(":")
            .map(Number);

          const formatData = {
            report_id: report.content.id,
            tardanza: "no",
            falta: "si",
            fecha_reporte: this.excelSerialDateToJSDate(row.fecha_reporte),
            dia: this.getDayOfWeek(
              this.excelSerialDateToJSDate(row.fecha_reporte)
            ),
            dni: String(row.dni),
            nombre: worker.content.full_name,
            sede: worker.content.department,
            hora_inicio: row.hora_inicio ? String(row.hora_inicio) : "",
            hora_inicio_refrigerio: row.hora_inicio_refrigerio
              ? String(row.hora_inicio_refrigerio)
              : "",
            hora_fin_refrigerio: row.hora_fin_refrigerio
              ? String(row.hora_fin_refrigerio)
              : "",
            hora_salida: row.hora_salida ? String(row.hora_salida) : "",
            discount: 0,
          };

          // cuando el usuario tiene registrado una hora de inicio ===============

          if (row.hora_inicio !== "" && row.hora_salida === "") {
            const [dataStartHour, dataStartMinute] = row.hora_inicio
              .split(":")
              .map(Number);

            if (dataStartHour <= 11) {
              if (dataStartHour > scheduleHourStart) {
                formatData.tardanza = "si";
                formatData.discount = 35;
              } else {
                if (dataStartHour === scheduleHourStart) {
                  if (Number(dataStartMinute) <= 5) {
                    formatData.tardanza = "no";
                  } else if (
                    Number(dataStartMinute) > 5 &&
                    Number(dataStartMinute) <= 15
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 5;
                  } else if (
                    Number(dataStartMinute) > 15 &&
                    Number(dataStartMinute) <= 30
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 10;
                  } else if (
                    Number(dataStartMinute) > 30 &&
                    Number(dataStartMinute) <= 59
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 20;
                  }
                } else {
                  formatData.tardanza = "no";
                }
              }
            } else {
              formatData.tardanza = "si";
            }
          }
          // cuando el usuario tiene una hora de salida
          else if (row.hora_inicio === "" && row.hora_salida !== "") {
            const [dataEndHour, dataEndMinute] = row.hora_salida
              .split(":")
              .map(Number);

            if (dataEndHour < scheduleHourEnd) {
              formatData.falta = "si";
              formatData.tardanza = "no";
            } else if (dataEndHour === scheduleHourEnd) {
              if (row.hora_inicio === "") formatData.tardanza = "si";
              formatData.falta = "no";
            }
          } else if (row.hora_inicio === "" && row.hora_salida === "") {
            formatData.falta = "si";
            formatData.tardanza = "no";
          } else {
            const [dataStartHour, dataStartMinute] = String(row.hora_inicio)
              .split(":")
              .map(Number);
            const [dataEndHour, dataEndMinute] = String(row.hora_salida)
              .split(":")
              .map(Number);

            if (dataStartHour <= 11) {
              if (dataStartHour > scheduleHourStart) {
                formatData.tardanza = "si";

                formatData.discount = 35;
              } else {
                if (dataStartHour === scheduleHourStart) {
                  if (Number(dataStartMinute) <= 5) {
                    formatData.tardanza = "no";
                  } else if (
                    Number(dataStartMinute) > 5 &&
                    Number(dataStartMinute) <= 15
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 5;
                  } else if (
                    Number(dataStartMinute) > 15 &&
                    Number(dataStartMinute) <= 30
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 10;
                  } else if (
                    Number(dataStartMinute) > 30 &&
                    Number(dataStartMinute) <= 59
                  ) {
                    formatData.tardanza = "si";
                    formatData.discount = 20;
                  }
                } else {
                  formatData.tardanza = "no";
                }
              }
              formatData.falta = "no";
            } else {
              formatData.tardanza = "si";
            }
          }

          //- validamos si esta en un fecha donde tiene una escusa para no asistir

          const responseValidateWorkerInDay = await this.validateDayInWorker(
            new Date(row.fecha_reporte),
            worker.content.id
          );

          if (responseValidateWorkerInDay) {
            formatData.falta = "no";
            formatData.tardanza = "no";
            formatData.discount = 0;
          }

          await prisma.detailReport.create({ data: formatData });
        })
      );
      return httpResponse.http200("Ok", "Reports upload");
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async uploadUpdateReportMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (row: any, index) => {
          const worker = await workerService.findByDNI(String(row.dni));
          const schedule = await scheduleService.findScheduleForWorker(
            worker.content.id
          );

          console.log(this.getDayOfWeek(new Date(row.fecha_reporte)));

          const detail = await prisma.detailReport.findFirst({
            where: {
              dni: String(row.dni),
              dia: this.getDayOfWeek(new Date(row.fecha_reporte)),
            },
          });

          const [scheduleStart, scheduleEnd] =
            schedule.content[
              this.getDayOfWeek(new Date(row.fecha_reporte))
            ].split("-");
          const [scheduleHourStart, scheduleMinuteStart] = scheduleStart
            .split(":")
            .map(Number);

          const [scheduleHourEnd, scheduleMinuteEnd] = scheduleEnd
            .split(":")
            .map(Number);

          const formatData = {
            report_id: detail?.report_id,
            tardanza: "no",
            falta: "si",
            fecha_reporte: this.excelSerialDateToJSDate(row.fecha_reporte),
            dia: this.getDayOfWeek(
              this.excelSerialDateToJSDate(row.fecha_reporte)
            ),
            dni: String(row.dni),
            nombre: worker.content.full_name,
            sede: worker.content.department,
            hora_inicio: row.hora_inicio ? String(row.hora_inicio) : "",
            hora_inicio_refrigerio: row.hora_inicio_refrigerio
              ? String(row.hora_inicio_refrigerio)
              : "",
            hora_fin_refrigerio: row.hora_fin_refrigerio
              ? String(row.hora_fin_refrigerio)
              : "",
            hora_salida: row.hora_salida ? String(row.hora_salida) : "",
            discount: 0,
          };
          console.log("==========================");
          console.log(row.hora_inicio);
          console.log(row.hora_salida);

          console.log(detail);

          // si hay un registro empezamos a condicionar los horarios =============================================
          if (detail) {
            if (row.hora_inicio !== "" && row.hora_salida === "") {
              const [dataStartHour, dataStartMinute] = row.hora_inicio
                .split(":")
                .map(Number);

              if (dataStartHour <= 11) {
                if (dataStartHour > scheduleHourStart) {
                  formatData.tardanza = "si";

                  formatData.discount = 35;
                } else {
                  if (dataStartHour === scheduleHourStart) {
                    if (Number(dataStartMinute) <= 5) {
                      formatData.tardanza = "no";
                    } else if (
                      Number(dataStartMinute) > 5 &&
                      Number(dataStartMinute) <= 15
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 5;
                    } else if (
                      Number(dataStartMinute) > 15 &&
                      Number(dataStartMinute) <= 30
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 10;
                    } else if (
                      Number(dataStartMinute) > 30 &&
                      Number(dataStartMinute) <= 59
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 20;
                    }
                  } else {
                    formatData.tardanza = "no";
                  }
                }
                formatData.falta = "no";
              } else {
                formatData.tardanza = "si";
              }
            }
            // cuando el usuario tiene una hora de salida
            else if (row.hora_inicio === "" && row.hora_salida !== "") {
              const [dataEndHour, dataEndMinute] = row.hora_salida
                .split(":")
                .map(Number);

              if (dataEndHour < scheduleHourEnd) {
                formatData.falta = "si";
                formatData.tardanza = "no";
              } else if (dataEndHour === scheduleHourEnd) {
                if (row.hora_inicio === "") formatData.tardanza = "si";
                formatData.falta = "no";
              }
            } else if (row.hora_inicio === "" && row.hora_salida === "") {
              formatData.falta = "si";
              formatData.tardanza = "no";
            } else {
              console.log("hereeee======================");
              const [dataStartHour, dataStartMinute] = String(row.hora_inicio)
                .split(":")
                .map(Number);
              const [dataEndHour, dataEndMinute] = String(row.hora_salida)
                .split(":")
                .map(Number);

              if (dataStartHour <= 11) {
                if (dataStartHour > scheduleHourStart) {
                  formatData.tardanza = "si";

                  formatData.discount = 35;
                } else {
                  if (dataStartHour === scheduleHourStart) {
                    if (Number(dataStartMinute) <= 5) {
                      formatData.tardanza = "no";
                    } else if (
                      Number(dataStartMinute) > 5 &&
                      Number(dataStartMinute) <= 15
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 5;
                    } else if (
                      Number(dataStartMinute) > 15 &&
                      Number(dataStartMinute) <= 30
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 10;
                    } else if (
                      Number(dataStartMinute) > 30 &&
                      Number(dataStartMinute) <= 59
                    ) {
                      formatData.tardanza = "si";
                      formatData.discount = 20;
                    }
                  } else {
                    formatData.tardanza = "no";
                  }
                }
                formatData.falta = "no";
              } else {
                formatData.tardanza = "si";
              }
            }

            //- validamos si esta en un fecha donde tiene una escusa para no asistir
            const responseValidateWorkerInDay = await this.validateDayInWorker(
              new Date(row.fecha_reporte),
              worker.content.id
            );

            if (responseValidateWorkerInDay) {
              formatData.falta = "no";
              formatData.tardanza = "no";
              formatData.discount = 0;
            }

            const created = await prisma.detailReport.update({
              where: { id: detail.id },
              data: formatData,
            });
          }

          // si hay un registro empezamos a condicionar los horarios =============================================
        })
      );
      return httpResponse.http200("Ok", "Reports upload");
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  excelSerialDateToJSDate(serial: number): Date {
    const excelEpoch = new Date("1899-12-30"); // Fecha base de Excel
    const millisecondsInDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const offsetDays = Math.floor(serial); // Parte entera del número de serie

    // Calcular el número de milisegundos desde la fecha base
    const dateMilliseconds =
      excelEpoch.getTime() + offsetDays * millisecondsInDay;

    // Crear y devolver el objeto Date
    const date = new Date(dateMilliseconds);
    return date;
  }

  getDayOfWeek(date: Date): string {
    const daysOfWeek = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];

    const dayIndex = date.getDay() + 1;

    return daysOfWeek[dayIndex];
  }

  async validateDayInWorker(fecha_excel: Date, workerId: number) {
    const incidentResponse = await prisma.incident.findMany({
      where: {
        date: fecha_excel,
      },
    });

    const medicalRestResponse = await prisma.medicalRest.findMany({
      where: {
        worker_id: workerId,
        AND: [
          {
            start_date: {
              lte: fecha_excel,
            },
          },
          {
            end_date: {
              gte: fecha_excel,
            },
          },
        ],
      },
    });

    const vacationResponse = await prisma.vacation.findMany({
      where: {
        worker_id: workerId,
        AND: [
          {
            start_date: {
              lte: fecha_excel,
            },
          },
          {
            end_date: {
              gte: fecha_excel,
            },
          },
        ],
      },
    });
    // validamos los permisos

    const permissionResponse = await prisma.permissions.findMany({
      where: {
        worker_id: workerId,
        AND: [
          {
            start_date: {
              lte: fecha_excel,
            },
          },
          {
            end_date: {
              gte: fecha_excel,
            },
          },
        ],
      },
    });

    const licencesResponse = await prisma.licence.findMany({
      where: {
        worker_id: workerId,
        AND: [
          {
            start_date: {
              lte: fecha_excel,
            },
          },
          {
            end_date: {
              gte: fecha_excel,
            },
          },
        ],
      },
    });

    if (
      vacationResponse.length > 0 ||
      permissionResponse.length > 0 ||
      licencesResponse.length > 0 ||
      medicalRestResponse.length > 0 ||
      incidentResponse.length > 0
    )
      return true;
    return false;
  }
}

export const reportService = new ReportService();
