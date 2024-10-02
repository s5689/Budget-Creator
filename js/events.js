import { db } from "./db";

const searchBar = document.getElementById("searchBar");
const wipeBudgetButton = document.getElementById("wipeBudget");
const resultsHTML = document.querySelector("#selectContainer table");
const detailsHTML = document.getElementById("details");
const detailsTableHTML = document.querySelector("#details tbody");
const budgetTableHTML = document.querySelector("#budgetContainer table");
const payTypeHTML = document.querySelector("#budgetBottom #payType");
const payTotalHTML = document.querySelector("#budgetBottom #payTotal h1");
const printButton = document.getElementById("budgetPrint");

const currentBudget = {
  list: [],
  _type: "fonasa",
  callback: () => {},

  add(e) {
    if (typeof this.list.find((value) => value === e) === "undefined") {
      this.list.push(e);
      this.callback();
    }
  },

  remove(e) {
    this.list = this.list.filter((value) => value !== e);
    this.callback();
  },

  wipe() {
    this.list = [];
    this.callback();
  },

  onChange(e) {
    this.callback = e;
  },

  get type() {
    return this._type;
  },

  set type(e) {
    this._type = e;
    this.callback();
  },
};

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
        // O si la observacion coincide, mostrar en la lista
      } else if (e.OBSERVACIONES.toLowerCase().includes(currentValue)) {
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

// Wipe Budget
wipeBudgetButton.addEventListener("click", () => {
  currentBudget.wipe();
  searchBar.value = "";
  resultsHTML.innerHTML = "";
});

// Details Right Click
document.addEventListener("contextmenu", (e) => {
  const currentRow = e.srcElement.parentElement;

  // Proceder si el click fue dentro de la lista
  if (checkResultsClick(e) || checkBudgetClick(e)) {
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
});

// Al dar click
document.addEventListener("click", (e) => {
  // Hide details
  detailsHTML.removeAttribute("show");

  // Si el click sucede en la lista de examenes
  if (checkResultsClick(e)) {
    const rowID = e.srcElement.parentElement.getAttribute("id");
    currentBudget.add(rowID);
  }

  // Si el click sucede en la lista de presupuestos
  if (checkBudgetClick(e)) {
    const rowID = e.srcElement.parentElement.getAttribute("id");
    currentBudget.remove(rowID);
  }
});

// Al realizar cambios en la lista de presupuestos
currentBudget.onChange(() => {
  let txt = "";
  let total = 0;

  currentBudget.list.forEach((value) => {
    const currentItem = db[value];
    let asFonasa = false;
    let type = "";
    let price = "";

    if (currentItem["Copago FNS"] !== "") {
      asFonasa = true;
    }

    if (currentBudget.type === "fonasa" && asFonasa) {
      type = "F";
      price = currentItem["Copago FNS"];
    } else {
      type = "P";
      price = currentItem.PART;
    }

    total += Number(price);

    txt += `
      <tr id="${value}">
        <td style="width: 5%">${type}</td>
        <td style="width: 75%;text-align: left;">${currentItem.EXAMEN}</td>
        <td style="width: 20%">${toFormat(price)}</td>
      </tr>
    `;
  });

  budgetTableHTML.innerHTML = txt;
  payTotalHTML.innerHTML = toFormat(String(total));
});

// Cambio al tipo de pago
payTypeHTML.addEventListener("change", (e) => {
  currentBudget.type = e.srcElement.id;
});

// Imprimir Presupuesto
printButton.addEventListener("click", () => {
  if (currentBudget.list.length !== 0) {
    let txt = "";

    // Recorrer todo el presupuesto actual
    for (let k = 0; k < currentBudget.list.length; k++) {
      const currentRow = budgetTableHTML.children[0].children[k];

      txt += `
        <tr>
          <td>${currentRow.children[1].innerHTML}</td>
          <td>${currentRow.children[2].innerHTML}</td>
        </tr>
      `;
    }

    const printPage = window.open();

    printPage.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Clinica Provincia de Petorca</title>

          <style>
            * {
              font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
              -webkit-print-color-adjust: exact !important;
            }

            body {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            #title {
              text-align: center;

              width: 80%;
              border-bottom: 1px solid black;
            }

            table {
              width: 80%;
            }

            table,
            th,
            td {
              border-collapse: collapse;
            }

            th {
              background-color: #04aa6d;
              color: white;
            }

            tr:nth-child(even) {
              background-color: #f2f2f2;
            }

            tbody tr td:last-child {
              text-align: right;
            }

            tbody tr:last-child {
              background-color: white;
            }

            tbody tr:last-child td:last-child {
              font-size: x-large;
              font-weight: bold;
              border-top: 2px solid black;
            }
          </style>
        </head>

        <body>
          <h1 id="title">Presupuesto</h1>
          <table>
              <tr>
                <th style="width: 80%">Examen</th>
                <th style="width: 20%">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${txt}
              <tr>
                <td></td>
                <td>${payTotalHTML.innerHTML}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printPage.print();
    printPage.close();
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

function checkResultsClick(e) {
  try {
    const currentRow = e.srcElement.parentElement;

    if (currentRow.parentElement.parentElement.parentElement.getAttribute("id") === "selectContainer") {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

function checkBudgetClick(e) {
  try {
    const currentRow = e.srcElement.parentElement;

    if (currentRow.parentElement.parentElement.parentElement.getAttribute("id") === "budgetContainer") {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
