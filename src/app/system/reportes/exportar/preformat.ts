export function reportNewSchema(data: any) {
  const dataGeneral: any = [];
  const fechas: any = new Set();

  // Primero recolectamos todas las fechas
  data.forEach((item: any) => {
    const { report } = item;
    const fecha_reporte = report.fecha_reporte.split("T")[0];
    fechas.add(fecha_reporte);
  });

  // Transformamos los datos
  data.forEach((item: any) => {
    const { report, worker } = item;
    const fecha_reporte = report.fecha_reporte.split("T")[0];

    let existingItem = dataGeneral.find(
      (d: any) => d.cod === worker.content.dni
    );

    if (!existingItem) {
      existingItem = {
        cod: worker.content.dni,
        "apellidos y nombres": worker.content.full_name,
        dni: worker.content.dni,
      };
      dataGeneral.push(existingItem);
    }

    existingItem[fecha_reporte] = {
      Ent: report.hora_inicio,
      "INICIO REFRI": report.hora_inicio_refrigerio,
      "FIN REFRI": report.hora_fin_refrigerio,
      Sali: report.hora_salida,
    };
  });

  // Convertimos la estructura a un formato plano
  const dataFlattened = dataGeneral.map((item: any) => {
    const flattened: any = {
      cod: item.cod,
      "apellidos y nombres": item["apellidos y nombres"],
      dni: item.dni,
    };

    fechas.forEach((fecha: any) => {
      if (item[fecha]) {
        flattened[`${fecha} Ent`] = item[fecha].Ent;
        flattened[`${fecha} INICIO REFRI`] = item[fecha]["INICIO REFRI"];
        flattened[`${fecha} FIN REFRI`] = item[fecha]["FIN REFRI"];
        flattened[`${fecha} Sali`] = item[fecha].Sali;
      } else {
        flattened[`${fecha} Ent`] = "";
        flattened[`${fecha} INICIO REFRI`] = "";
        flattened[`${fecha} FIN REFRI`] = "";
        flattened[`${fecha} Sali`] = "";
      }
    });

    return flattened;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataFlattened);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-nuevo-formato.xlsx");
}
