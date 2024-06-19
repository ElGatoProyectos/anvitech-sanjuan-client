import { useState } from "react";
import workerWeekJSON from "../../../workers-anvitech.json";

export function useWorkerWeek() {
  const [week, setWeek] = useState(workerWeekJSON);

  const filterAttendance = (data: any) => {
    return data.map((item: any) => {
      const { worker, ...days } = item;
      const attendance = Object.keys(days)
        .filter((day) => days[day] !== null)
        .map((day) => ({
          day: days[day].dia,
          attendance: days[day].falta !== "si",
          lateness: days[day].tardanza === "si",
        }));
      return { worker: worker.full_name, attendance };
    });
  };

  const countAttendancesAndAbsences = (week: any) => {
    return week.reduce(
      (totals: any, worker: any) => {
        worker.attendance.forEach((record: any) => {
          if (record.attendance) {
            totals.attendances += 1;
          } else {
            totals.absences += 1;
          }
        });
        return totals;
      },
      { attendances: 0, absences: 0 }
    );
  };

  const countLatenessByDay = (data: any) => {
    return data.reduce((dayCounts: any, worker: any) => {
      worker.lateness.forEach((record: any) => {
        if (!record.lateness) {
          const day = formatDay(record.day);
          if (dayCounts[day]) {
            dayCounts[day] += 1;
          } else {
            dayCounts[day] = 1;
          }
        }
      });
      return dayCounts;
    }, {});
  };

  const formatDay = (day: string) => {
    switch (day) {
      case "lunes":
        return "lun";
      case "martes":
        return "mar";
      case "miercoles":
        return "mie";
      case "jueves":
        return "jue";
      case "viernes":
        return "vie";
      case "sabado":
        return "sab";
      case "domingo":
        return "dom";
      default:
        return day;
    }
  };

  const filteredWeek = filterAttendance(week);
  const attendanceVsAbsence = countAttendancesAndAbsences(filteredWeek);

  const formatLatenessData = (filteredWeek: any) => {
    const latenessCounts: { [day: string]: number } = {
      lunes: 0,
      martes: 0,
      miercoles: 0,
      jueves: 0,
      viernes: 0,
      sabado: 0,
      domingo: 0,
    };

    filteredWeek.forEach((worker: any) => {
      worker.attendance.forEach((dayRecord: any) => {
        if (dayRecord.lateness) {
          latenessCounts[dayRecord.day] += 1;
        }
      });
    });

    const formattedData = Object.keys(latenessCounts).map((day) => ({
      day: day.substring(0, 3),
      absences: latenessCounts[day],
    }));

    return formattedData;
  };

  const formattedLateness = formatLatenessData(filteredWeek);

  return {
    attendanceVsAbsence,
    formattedLateness,
  };
}
