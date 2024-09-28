import { db } from "./db";

const searchBar = document.getElementById("searchBar");
const resultsHTML = document.querySelector("#selectContainer table");

// Search Bar Event
searchBar.addEventListener("keyup", () => {
  const currentValue = searchBar.value;
  const foundList = [];

  // Realizar busqueda solo si hay algun caracter
  if (currentValue !== "") {
    db.forEach((value, k) => {
      if (checkValue(value)) {
        foundList.push({
          id: k,
          data: [
            { codigo: value.CODIGO },
            { examen: value.EXAMEN },
            { fonasa: toFormat(value["Copago FNS"]) },
            { particular: toFormat(value.PART) },
          ],
        });
      }
    });

    function checkValue(e) {
      // Si el nombre del examen coincide
      if (e.EXAMEN.toLowerCase().includes(currentValue.toLowerCase())) {
        return true;

        // O si el codigo coincide, mostrar en la lista
      } else if (e.CODIGO.includes(currentValue)) {
        return true;
      }

      return false;
    }
  }

  // Generar lista con los resultados obtenidos
  let txt = "";
  foundList.forEach((value) => {
    const dataList = value.data;

    txt += `<tr id="${value.id}">`;
    dataList.forEach((valua) => {
      txt += `<td class="${Object.keys(valua)}">${Object.values(valua)}</td>`;
    });
    txt += "</tr>";
  });

  resultsHTML.innerHTML = txt;

  console.log(foundList);
  console.log(searchBar.value);
});

function toFormat(e) {
  const size = e.length;
  let result = "";

  if (size === 0) {
    result = "---";
  } else {
    let k = 0;
    let i = 0;

    while (true) {
      if (k !== 3) {
        result += e.charAt(size - i - 1);

        i++;
      } else {
        result += ".";
        k = 0;
      }

      if (i === size) {
        break;
      }

      k++;
    }

    let temp = "";

    for (let j = result.length - 1; j >= 0; j--) {
      temp += result[j];
    }

    result = temp;
  }

  return result;
}
