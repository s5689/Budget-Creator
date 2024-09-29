import { db } from "./db";

const searchBar = document.getElementById("searchBar");
const resultsHTML = document.querySelector("#selectContainer table");
const detailsHTML = document.getElementById("details");
const detailsTableHTML = document.querySelector("#details tbody");

const currentBudget = [];

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
});

// Details Right Click
document.addEventListener("contextmenu", (e) => {
  const currentRow = e.srcElement.parentElement;

  try {
    // Proceder si el click fue dentro de la lista
    if (checkClick(e)) {
      e.preventDefault();
      detailsHTML.setAttribute("show", "");

      const rowID = currentRow.getAttribute("id");
      let txt = "<tr>";

      // Recorrer los datos seleccionados
      Object.values(db[rowID]).forEach((value, k) => {
        let tempValue = value;

        // Dar formato a los Precios
        if (k === 3 || k === 4) {
          tempValue = toFormat(value);
        }

        txt += `<td>${tempValue}</td>`;
      });

      txt += "</tr>";

      detailsTableHTML.innerHTML = txt;
    }
  } catch (error) {}
});

document.addEventListener("click", (e) => {
  // Hide details
  detailsHTML.removeAttribute("show");

  if (checkClick(e)) {
    const rowID = e.srcElement.parentElement.getAttribute("id");
    console.log(rowID);
  }
});

function toFormat(e) {
  const size = e.length;
  let result = "";

  // Si no hay ningun valor, mostrar ---
  if (size === 0) {
    result = "---";
  }
  // De lo contrario, aplicar formato
  else {
    let k = 0;
    let i = 0;

    // Detectar donde aplicar el punto.
    while (true) {
      if (k !== 3) {
        result += e.charAt(size - i - 1);

        i++;
        k++;
      } else {
        result += ".";
        k = 0;
      }

      if (i === size) {
        break;
      }
    }

    // Invertir el resultado
    let temp = "";
    for (let j = result.length - 1; j >= 0; j--) {
      temp += result[j];
    }

    result = "$" + temp;
  }

  return result;
}

function checkClick(e) {
  const currentRow = e.srcElement.parentElement;

  if (currentRow.parentElement.parentElement.parentElement.getAttribute("id") === "selectContainer") {
    return true;
  }

  return false;
}
