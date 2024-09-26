import { db } from "./db";

const searchBar = document.getElementById("searchBar");
const resultsHTML = document.querySelector("#selectContainer table tbody");

// Search Bar Event
searchBar.addEventListener("keyup", () => {
  const currentValue = searchBar.value;
  const foundList = [];

  // Realizar busqueda solo si hay algun caracter
  if (currentValue !== "") {
    db.forEach((value) => {
      // Si el nombre del examen coincide
      if (value.EXAMEN.toLowerCase().includes(currentValue)) {
        foundList.push(value);

        // O si el codigo coincide, mostrar en la lista
      } else if (value.CODIGO.includes(currentValue)) {
        foundList.push(value);
      }
    });
  }

  // Generar lista con los resultados obtenidos
  let txt = "";
  foundList.forEach((value) => {
    const dataList = Object.values(value).values();

    txt += "<tr>";
    dataList.forEach((valua) => {
      txt += `<td>${valua}</td>`;
    });
    txt += "</tr>";
  });

  resultsHTML.innerHTML = txt;

  console.log(foundList);
  console.log(searchBar.value);
});
