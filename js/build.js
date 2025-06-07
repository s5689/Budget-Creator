import { db, rawDB, vocalArray } from "./db";

// Eliminar Tildes del DB
rawDB.forEach((value) => {
  const tempValue = { ...value };

  tempValue.EXAMEN = convert(value.EXAMEN);
  tempValue.OBSERVACIONES = convert(value.OBSERVACIONES);

  db.push(tempValue);

  function convert(toConvert) {
    let result = "";

    for (const e of toConvert) {
      const isSpecial = vocalArray.findIndex((valua) => valua === e);
      let tempChar;

      if (isSpecial !== -1) {
        // Si el caracter es especial, convertir en normal
        if (isSpecial >= 0 && isSpecial <= 9) tempChar = "a";
        if (isSpecial >= 10 && isSpecial <= 16) tempChar = "e";
        if (isSpecial >= 17 && isSpecial <= 22) tempChar = "i";
        if (isSpecial >= 23 && isSpecial <= 30) tempChar = "o";
        if (isSpecial >= 31 && isSpecial <= 38) tempChar = "u";
      } else {
        // Si no es el caso, proceder normalmente
        tempChar = e;
      }

      result += tempChar;
    }

    return result;
  }
});
