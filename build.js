import { db } from "./db";

export function buildTableHeaders() {
  // Construir Headers de la Tabla
  let txt = "<tr>";
  Object.keys(db[0]).forEach((value) => {
    txt += `<th>${value.toUpperCase()}</th>`;
  });

  txt += "</tr>";

  document.querySelector("#selectContainer table thead").innerHTML = txt;
}
