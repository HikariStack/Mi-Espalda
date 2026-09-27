/* Mi Espalda — estiramientos y movilidad para la espalda */
(function (A) {
  "use strict";
  var LIE = "20 76 30 78";          // cabeza + hombro tumbado boca arriba
  A.STRETCH = [
    {
      id: "gato-camello", name: "Gato-camello", area: "Toda la columna", hold: 40, sides: 1, reps: 2,
      cues: ["A cuatro patas, manos bajo hombros", "Al soltar el aire redondea la espalda mirando al ombligo", "Al coger aire hunde suavemente la espalda y mira al frente", "Movimiento lento, vértebra a vértebra"],
      caution: "Movilidad suave, no fuerces los extremos.",
      fig: { a: "30 62 38 56 38 70 38 83 70 56 70 83 88 83 91 81 -8", b: "30 48 38 56 38 70 38 83 70 56 70 83 88 83 91 81 6", eq: [{ mat: true }], dur: 5 }
    },
    {
      id: "nino", name: "Postura del niño", area: "Lumbar y dorsal", hold: 45, sides: 1, reps: 2,
      cues: ["De rodillas, siéntate sobre los talones", "Lleva el pecho hacia los muslos", "Brazos estirados al frente", "Respira hinchando la espalda"],
      caution: "Si molestan las rodillas, pon un cojín entre glúteos y talones.",
      fig: { a: "40 79 48 74 34 80 20 82 80 70 62 82 84 83 90 82 3", b: "40 78 48 73 32 80 17 82 81 69 62 82 84 83 90 82 4", eq: [{ mat: true }], dur: 6 }
    },
    {
      id: "rodillas-pecho", name: "Rodillas al pecho", area: "Lumbar", hold: 30, sides: 1, reps: 2,
      cues: ["Boca arriba, abraza las rodillas", "Acércalas al pecho sin levantar la cabeza", "Balancéate suavemente si te alivia", "Hombros relajados"],
      caution: "Muy útil si te despiertas con rigidez lumbar.",
      fig: { a: LIE + " 40 70 56 62 58 78 60 60 74 62 77 58", b: LIE + " 40 68 52 60 58 78 52 58 66 56 69 52", eq: [{ mat: true }], dur: 5 }
    },
    {
      id: "torsion", name: "Rotación lumbar tumbado", area: "Lumbar y oblicuos", hold: 30, sides: 2, reps: 1,
      cues: ["Boca arriba, rodillas dobladas y brazos en cruz", "Deja caer las dos rodillas hacia un lado", "Hombros pegados al suelo", "Vuelve al centro y cambia de lado"],
      caution: "Si notas pinchazo, reduce el recorrido.",
      fig: { a: LIE + " 40 80 50 81 58 78 60 60 74 62 77 58", b: LIE + " 40 80 50 81 58 78 68 70 82 74 86 70", eq: [{ mat: true }], dur: 6 }
    },
    {
      id: "piriforme", name: "Estiramiento de piriforme (figura 4)", area: "Glúteo y ciático", hold: 30, sides: 2, reps: 1,
      cues: ["Boca arriba, cruza un tobillo sobre la rodilla contraria", "Coge el muslo de la pierna de apoyo", "Acércalo al pecho hasta notar el glúteo", "Mantén la cabeza apoyada"],
      caution: "Muy recomendado si el dolor baja por el glúteo hacia la pierna.",
      fig: { a: LIE + " 42 70 60 62 58 78 58 58 70 60 74 56", b: LIE + " 42 68 58 58 58 78 56 56 66 58 70 55", leg2: { a: "70 62 78 81 84 82", b: "66 60 76 70 81 69" }, eq: [{ mat: true }], dur: 6 }
    },
    {
      id: "psoas", name: "Estiramiento de psoas en zancada", area: "Flexores de cadera", hold: 30, sides: 2, reps: 1,
      cues: ["Rodilla atrasada apoyada en el suelo", "Mete ligeramente la pelvis (culo hacia dentro)", "Lleva la cadera hacia delante", "Tronco recto, sin arquear la lumbar"],
      caution: "Un psoas acortado tira de la lumbar: clave si pasas muchas horas sentado.",
      fig: { a: "55 29 55 38 62 50 72 58 56 62 76 62 78 83 84 84", b: "58 30 58 39 64 51 74 59 60 64 78 62 78 83 84 84", leg2: "44 82 28 83 24 83", eq: [{ mat: true }], dur: 6 }
    },
    {
      id: "cobra", name: "Extensión McKenzie (cobra suave)", area: "Lumbar", hold: 20, sides: 1, reps: 3,
      cues: ["Boca abajo, manos bajo los hombros", "Empuja el suelo y eleva el pecho", "Cadera y pelvis pegadas al suelo", "Sube solo hasta donde no duela"],
      caution: "Si el dolor se desplaza hacia la pierna al hacerlo, para y consúltalo.",
      fig: { a: "30 78 38 79 46 72 38 82 66 80 84 81 102 81 106 78", b: "34 50 40 58 40 70 38 82 66 80 84 81 102 81 106 78 4", eq: [{ mat: true }], dur: 5 }
    },
    {
      id: "isquios", name: "Isquiotibiales con toalla", area: "Isquios y ciático", hold: 30, sides: 2, reps: 1,
      cues: ["Boca arriba, pasa una toalla por la planta del pie", "Sube la pierna estirada", "Tira de la toalla hasta notar tensión detrás del muslo", "La otra pierna queda estirada en el suelo"],
      caution: "Unos isquios rígidos aumentan la carga lumbar al agacharte.",
      fig: { a: LIE + " 40 64 66 50 56 78 64 64 72 48 77 46", b: LIE + " 40 62 62 46 56 78 62 62 66 44 71 41", leg2: "74 79 92 80 95 76", eq: [{ mat: true }, { link: ["w", "t"] }], dur: 6 }
    },
    {
      id: "dorsal-apoyo", name: "Estiramiento de dorsal con apoyo", area: "Dorsal y hombros", hold: 30, sides: 1, reps: 2,
      cues: ["Agárrate a una espaldera, poste o máquina", "Camina hacia atrás y flexiona la cadera", "Deja caer el pecho entre los brazos", "Empuja la cadera hacia atrás"],
      caution: "Perfecto entre series de jalón o remo.",
      fig: { a: "71 42 64 40 78 38 92 36 40 50 41 66 40 83 46 84", b: "69 47 62 44 78 40 92 36 36 50 40 66 40 83 46 84", eq: [{ l: [96, 20, 96, 84], w: 3 }], dur: 6 }
    },
    {
      id: "colgarse", name: "Descompresión en barra", area: "Toda la columna", hold: 20, sides: 1, reps: 3,
      cues: ["Agárrate a una barra alta", "Deja el peso colgando, hombros activos", "Piernas relajadas", "Respira profundo y suelta"],
      caution: "Si no llegas colgando del todo, deja los pies apoyados y flexiona las rodillas.",
      fig: { a: "60 20 60 29 59 16 60 6 60 55 61 70 60 80 64 81", b: "60 20 60 29 59 16 60 6 61 55 62 70 61 80 65 81", eq: [{ l: [36, 5, 84, 5], w: 3 }, { l: [38, 5, 38, 84], w: 3 }, { l: [82, 5, 82, 84], w: 3 }], dur: 5 }
    },
    {
      id: "rot-toracica", name: "Rotación torácica a cuatro patas", area: "Dorsal", hold: 30, sides: 2, reps: 1,
      cues: ["A cuatro patas, una mano detrás de la cabeza", "Lleva el codo hacia el brazo de apoyo", "Después ábrelo hacia el techo mirándolo", "La cadera no se mueve"],
      caution: "Mejora la movilidad dorsal y quita trabajo a la zona lumbar y cervical.",
      fig: { a: "32 58 40 56 36 66 34 54 70 56 70 83 88 83 91 81", b: "30 46 40 54 44 38 36 44 70 56 70 83 88 83 91 81", arm2: "40 69 40 83", leg2: "70 83 88 83 91 81", eq: [{ mat: true }], dur: 5 }
    }
  ];
  A.STRETCH.forEach(function (e) { e.kind = "stretch"; });

  A.exById = function (id) {
    var all = A.GYM.concat(A.STRETCH);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
})(window.App);
