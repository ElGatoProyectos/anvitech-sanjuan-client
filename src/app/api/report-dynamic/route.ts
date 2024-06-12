import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // setTimeout(async () => {
    //   const date = new Date();
    //   const hour = date.getHours();
    //   const minute = date.getMinutes();
    //   const day = date.getDay();

    //   const month = date.getMonth() + 1;
    //   const year = date.getFullYear();

    //   if (hour === 23 && minute > 25) {
    //     //exute function

    //   }

    //   const response = await dataService.instanceDataInit(
    //     day,
    //     day,
    //     year,
    //     month
    //   );
    //   return NextResponse.json(response.content, {
    //     status: 200,
    //   });

    //   console.log("excuting api beetwen 30 minutes");
    // }, 1800 * 1000);

    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const day = date.getDay();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (hour === 23 && minute > 25) {
      //exute function
    }

    const response = await dataService.instanceDataInit(11, 11, 2024, 6);
    return NextResponse.json(response.content, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
