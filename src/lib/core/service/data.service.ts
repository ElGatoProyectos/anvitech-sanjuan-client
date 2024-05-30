import { anvizService } from "./anviz.service";
import { errorService } from "./errors.service";

class DataService {
  async InstanceFilters(
    minDay?: number,
    maxDay?: number,
    selectedYear?: number,
    seletedMonth?: number
  ) {
    try {
      const { monday, saturday } = await this.getMondayAndSaturday();
      const { year: dataYear, month: dataMonth } = await this.getDate();

      // todo define data time
      const min = !minDay && monday;
      const max = !maxDay && saturday;
      const year = !selectedYear && dataYear;
      const month = !seletedMonth && dataMonth;

      // todo define time intervals
      const begin_time = `${year}-${month}-${min}T00:00:00+00:00`;
      const end_time = `${year}-${month}-${max}T23:59:59+00:00`;

      const responseData = await anvizService.getData(begin_time, end_time);
      return responseData;
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async getDate() {
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
}

export const dataService = new DataService();
