"use client";

import { useEffect, useState } from "react";
import workerWeekJSON from "../../../workers-anvitech.json";
import { useToastDestructive } from "./toast.hook";
import { useSession } from "next-auth/react";
import { get, post } from "../http/api.http";

export function useWorkerWeek(date: string) {
  const [week, setWeek] = useState([]);

  const [loading, setLoading] = useState(true);

  const session = useSession();

  const [isFilter, setIsFilter] = useState(false);

  const [dataDepartments, setDataDepartments] = useState<any[]>([]);

  function changeFilter() {
    setLoading(true);
    setIsFilter(true);
    handleFilterDay();
  }

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

  const filteredWeek = filterAttendance(week);
  const attendanceVsAbsence = countAttendancesAndAbsences(filteredWeek);

  const formatLatenessData = (filteredWeek: any) => {
    const latenessCounts: { [day: string]: number } = {
      sabado: 0,
      domingo: 0,
      lunes: 0,
      martes: 0,
      miercoles: 0,
      jueves: 0,
      viernes: 0,
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

  async function fetchData() {
    try {
      setLoading(true);
      const day = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const response = await post(
        "reports/weekly",
        { day, month, year },
        session.data
      );

      setWeek(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al cargar la informacion");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilterDay() {
    try {
      setLoading(true);
      const day = new Date(date).getDate();
      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear();
      const response = await post(
        "reports/weekly",
        { day, month, year },
        session.data
      );

      setWeek(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al solicitar los datos");
    } finally {
      setLoading(false);
    }
  }
  async function fetchDepartments() {
    try {
      const response = await get("workers/departments", session.data);
      setDataDepartments(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al solicitar los datos");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      // fetchDepartments();
      if (date === "") {
        fetchData();
      } else {
        handleFilterDay();
      }
    }
  }, [session.status, date]);

  useEffect(() => {
    if (date !== "") {
    }
  }, [isFilter]);

  return {
    attendanceVsAbsence,
    formattedLateness,
    loading,
    changeFilter,
    week,
    dataDepartments,
  };
}
