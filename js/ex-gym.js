/* Mi Espalda — ejercicios de gimnasio orientados a espalda sana */
(function (A) {
  "use strict";
  var STAND_LEGS = "56 50 57 66 56 83 62 84";

  A.GROUPS = {
    tiron: "Tirón (espalda)", bisagra: "Cadena posterior", core: "Core / estabilidad",
    piernas: "Piernas", empuje: "Empuje", carga: "Carga y postura"
  };

  A.GYM = [
    {
      id: "jalon", name: "Jalón al pecho en máquina", group: "tiron", equip: "Máquina de jalón",
      muscles: "Dorsal ancho, romboides, bíceps", sets: 3, reps: 12, rest: 75, tempo: "2-1-2", level: 1,
      cues: ["Ajusta el rodillo para que los muslos queden fijos", "Agarre algo más ancho que los hombros", "Baja la barra a la parte alta del pecho llevando los codos hacia abajo y atrás", "Pecho arriba, sin balancear el tronco"],
      caution: "No bajes la barra por detrás de la nuca: carga las cervicales.",
      fig: {
        a: "56 22 57 31 58 19 60 7 58 56 76 56 77 76 83 77",
        b: "56 22 57 31 49 41 58 32 58 56 76 56 77 76 83 77",
        eq: [{ l: [96, 4, 96, 84], w: 3 }, { l: [40, 4, 96, 4], w: 3 }, { r: [48, 57, 22, 4] }, { l: [59, 61, 59, 84], w: 3 },
             { r: [70, 49, 12, 4] }, { cable: [60, 4], to: "w" }, { att: "w", l: [-12, 0, 12, 0], w: 2.4 }]
      }
    },
    {
      id: "remo-polea", name: "Remo sentado en polea baja", group: "tiron", equip: "Polea baja con agarre en V",
      muscles: "Dorsal, romboides, trapecio medio", sets: 3, reps: 12, rest: 75, tempo: "2-1-2", level: 1,
      cues: ["Rodillas algo flexionadas y espalda neutra", "Tira del agarre hacia el ombligo", "Junta las escápulas al final del recorrido", "Vuelve despacio sin redondear la zona lumbar"],
      caution: "No te inclines hacia delante para coger impulso: el tronco se queda quieto.",
      fig: {
        a: "40 29 40 38 58 42 76 44 38 62 56 54 72 62 74 56",
        b: "38 29 39 38 28 46 48 46 38 62 56 54 72 62 74 56",
        eq: [{ r: [24, 62, 40, 4] }, { l: [44, 66, 44, 84], w: 3 }, { l: [77, 50, 79, 68], w: 3 }, { l: [100, 18, 100, 84], w: 3 },
             { c: [98, 46, 3] }, { cable: [98, 46], to: "w" }, { att: "w", r: [-1.5, -3, 3, 6] }]
      }
    },
    {
      id: "remo-pecho", name: "Remo en máquina con apoyo de pecho", group: "tiron", equip: "Máquina de remo (pecho apoyado)",
      muscles: "Dorsal, romboides, deltoide posterior", sets: 3, reps: 10, rest: 75, tempo: "2-1-2", level: 1,
      cues: ["Pecho pegado al apoyo durante todo el ejercicio", "Codos pegados al cuerpo y hacia atrás", "Aprieta las escápulas 1 segundo", "Estira los brazos sin soltar la tensión"],
      caution: "El apoyo de pecho descarga la zona lumbar: buena opción en días con molestias.",
      fig: {
        a: "58 22 56 31 68 38 80 40 46 58 64 58 66 80 72 81",
        b: "58 22 56 31 44 38 58 40 46 58 64 58 66 80 72 81",
        eq: [{ r: [38, 58, 18, 4] }, { l: [47, 62, 47, 84], w: 3 }, { r: [61, 26, 4, 24], rx: 2 }, { l: [90, 18, 90, 84], w: 3 },
             { l: [90, 30, 82, 40], w: 2 }, { att: "w", r: [-1.2, -4, 2.4, 8] }]
      }
    },
    {
      id: "face-pull", name: "Face pull en polea", group: "carga", equip: "Polea alta con cuerda",
      muscles: "Deltoide posterior, manguito rotador, trapecio medio", sets: 3, reps: 15, rest: 60, tempo: "2-1-2", level: 1,
      cues: ["Polea a la altura de la frente", "Tira de la cuerda hacia la cara separando las manos", "Codos altos, a la altura de los hombros", "Ideal para corregir hombros adelantados"],
      caution: "Peso ligero: es un ejercicio de control, no de fuerza máxima.",
      fig: {
        a: "56 13 56 23 68 24 82 22 " + STAND_LEGS,
        b: "56 13 56 23 50 18 62 14 " + STAND_LEGS,
        leg2: "54 66 50 83 56 84",
        eq: [{ l: [104, 4, 104, 84], w: 3 }, { c: [102, 20, 2.5] }, { cable: [102, 20], to: "w" }, { att: "w", c: [0, 0, 2] }]
      }
    },
    {
      id: "pallof", name: "Press Pallof (antirrotación)", group: "core", equip: "Polea a la altura del pecho",
      muscles: "Oblicuos, transverso abdominal", sets: 3, reps: 10, rest: 60, tempo: "2-2-2", level: 1,
      cues: ["Colócate de lado a la polea, pies a la anchura de caderas", "Lleva las manos del pecho al frente", "Aguanta 2 segundos sin dejar que el tronco gire", "Haz las repeticiones por cada lado"],
      caution: "Uno de los mejores ejercicios de core para dolor lumbar: estabiliza sin flexionar la columna.",
      fig: {
        a: "56 13 56 23 60 38 66 34 56 50 59 66 56 83 62 84",
        b: "56 13 56 23 72 34 84 34 56 50 59 66 56 83 62 84",
        leg2: "54 66 52 83 58 84",
        eq: [{ l: [104, 4, 104, 84], w: 3 }, { c: [102, 34, 2.5] }, { cable: [102, 34], to: "w" }, { att: "w", r: [-1.5, -3, 3, 6] }]
      }
    },
    {
      id: "rumano", name: "Peso muerto rumano con mancuernas", group: "bisagra", equip: "Mancuernas ligeras",
      muscles: "Isquiotibiales, glúteo, erectores", sets: 3, reps: 10, rest: 90, tempo: "3-1-2", level: 2,
      cues: ["Rodillas ligeramente flexionadas y fijas", "Lleva la cadera hacia atrás como si cerraras una puerta con el culo", "Mancuernas pegadas a los muslos", "Baja hasta notar tensión en isquios, no más"],
      caution: "Espalda siempre neutra. Si notas tirón lumbar, reduce recorrido y peso.",
      fig: {
        a: "56 13 56 23 56 36 57 48 " + STAND_LEGS,
        b: "81 31 74 36 74 48 74 60 51 50 56 66 56 83 62 84",
        eq: [{ att: "w", r: [-5, -2, 10, 4] }]
      }
    },
    {
      id: "hiperext", name: "Extensión lumbar en banco 45°", group: "bisagra", equip: "Banco romano / hiperextensiones",
      muscles: "Erectores espinales, glúteo", sets: 2, reps: 12, rest: 60, tempo: "2-1-2", level: 2,
      cues: ["Almohadilla justo por debajo de la cadera", "Brazos cruzados sobre el pecho", "Sube hasta quedar en línea recta, sin arquear de más", "Baja controlando"],
      caution: "Rango corto y sin peso al principio. Evítalo en días de dolor agudo.",
      fig: {
        a: "50 76 54 68 60 64 56 62 66 52 80 66 92 78 98 80",
        b: "41 27 47 33 54 40 50 36 66 52 80 66 92 78 98 80",
        eq: [{ l: [60, 60, 72, 46], w: 6 }, { l: [68, 56, 90, 84], w: 3 }, { c: [95, 82, 3] }]
      }
    },
    {
      id: "puente", name: "Puente de glúteos", group: "bisagra", equip: "Esterilla",
      muscles: "Glúteo mayor, isquios", sets: 3, reps: 12, rest: 45, tempo: "2-2-2", level: 1,
      cues: ["Pies apoyados a la anchura de caderas", "Aprieta glúteos y sube la cadera", "Aguanta 2 segundos arriba", "No arquees la zona lumbar al subir"],
      caution: "Muy seguro para la espalda. Progresión: con una pierna o con disco sobre la cadera.",
      fig: {
        a: "20 76 30 78 40 80 50 81 56 78 70 62 78 81 84 82",
        b: "22 75 32 76 40 80 50 81 56 62 72 58 78 81 84 82",
        eq: [{ mat: true }]
      }
    },
    {
      id: "prensa", name: "Prensa de piernas 45°", group: "piernas", equip: "Máquina de prensa",
      muscles: "Cuádriceps, glúteo", sets: 3, reps: 12, rest: 90, tempo: "2-1-2", level: 2,
      cues: ["Espalda y glúteo bien pegados al respaldo", "Pies a la anchura de hombros en el centro de la plataforma", "Baja hasta 90° de rodilla", "Empuja sin bloquear las rodillas"],
      caution: "No bajes tanto que se despegue la pelvis del asiento: ahí sufre la lumbar.",
      fig: {
        a: "15 43 22 50 32 64 42 70 42 66 50 44 64 54 67 48",
        b: "15 43 22 50 32 64 42 70 42 66 59 50 78 36 81 30",
        eq: [{ l: [10, 46, 42, 72], w: 6 }, { l: [40, 72, 52, 72], w: 6 }, { l: [46, 84, 108, 24], w: 2 }, { att: "a", l: [-4, -8, 6, 4], w: 4 }]
      }
    },
    {
      id: "sentadilla-cajon", name: "Sentadilla a cajón (goblet)", group: "piernas", equip: "Cajón + kettlebell",
      muscles: "Cuádriceps, glúteo, core", sets: 3, reps: 10, rest: 90, tempo: "3-1-2", level: 2,
      cues: ["Pesa pegada al pecho", "Siéntate atrás hasta rozar el cajón", "Pecho alto y rodillas en la línea de los pies", "Levántate empujando el suelo"],
      caution: "El cajón limita la profundidad y protege la espalda. Sube la altura si molesta.",
      fig: {
        a: "56 13 56 23 60 36 64 28 " + STAND_LEGS,
        b: "57 29 54 38 60 46 64 38 46 62 62 62 60 83 66 84",
        eq: [{ r: [28, 64, 20, 20], rx: 2 }, { att: "w", c: [0, 3, 3.5] }]
      }
    },
    {
      id: "press-pecho", name: "Press de pecho en máquina", group: "empuje", equip: "Máquina de press sentado",
      muscles: "Pectoral, tríceps, deltoide anterior", sets: 3, reps: 10, rest: 75, tempo: "2-1-2", level: 1,
      cues: ["Espalda completa apoyada en el respaldo", "Agarres a la altura del pecho medio", "Empuja sin despegar los hombros del respaldo", "Vuelve despacio"],
      caution: "Equilibra el trabajo de tirón: haz siempre más series de espalda que de pecho.",
      fig: {
        a: "52 20 52 30 44 36 58 32 50 58 68 58 70 80 76 81",
        b: "52 20 52 30 66 32 80 31 50 58 68 58 70 80 76 81",
        eq: [{ l: [45, 18, 47, 60], w: 4 }, { r: [40, 58, 22, 4] }, { l: [50, 62, 50, 84], w: 3 }, { l: [94, 16, 94, 84], w: 3 }, { att: "w", r: [-1.2, -4, 2.4, 8] }]
      }
    },
    {
      id: "plancha", name: "Plancha frontal", group: "core", equip: "Esterilla",
      muscles: "Transverso, recto abdominal, glúteo", sets: 3, secs: 30, rest: 45, level: 1,
      cues: ["Codos bajo los hombros", "Cuerpo en línea de cabeza a talones", "Aprieta glúteos y abdomen", "Respira sin contener el aire"],
      caution: "Si se hunde la cadera, apoya las rodillas o reduce el tiempo.",
      fig: {
        a: "22 58 30 62 30 76 42 78 64 66 80 72 96 78 99 82",
        b: "22 59 30 63 30 76 42 78 64 67 80 72 96 78 99 82",
        eq: [{ mat: true }], dur: 4
      }
    },
    {
      id: "bird-dog", name: "Bird-dog", group: "core", equip: "Esterilla",
      muscles: "Multífidos, glúteo, core", sets: 3, reps: 8, rest: 45, tempo: "2-2-2", level: 1,
      cues: ["A cuatro patas, manos bajo hombros y rodillas bajo cadera", "Estira brazo y pierna contrarios", "Aguanta 2 s sin rotar la pelvis", "Alterna lados"],
      caution: "Clásico de la rehabilitación lumbar. Lento y controlado.",
      fig: {
        a: "30 48 38 54 38 68 38 82 70 54 70 82 88 82 91 80",
        b: "30 47 38 54 26 50 14 48 70 54 86 54 102 53 105 49",
        leg2: "70 82 88 82 91 80", arm2: "38 68 38 82",
        eq: [{ mat: true }]
      }
    },
    {
      id: "dead-bug", name: "Dead bug", group: "core", equip: "Esterilla",
      muscles: "Transverso abdominal, flexores de cadera", sets: 3, reps: 8, rest: 45, tempo: "2-1-2", level: 1,
      cues: ["Boca arriba, brazos al techo y rodillas a 90°", "Zona lumbar pegada al suelo", "Estira brazo y pierna contrarios", "Vuelve y cambia de lado"],
      caution: "Si la lumbar se despega del suelo, reduce el recorrido de la pierna.",
      fig: {
        a: "20 74 30 77 30 66 30 55 58 77 58 61 72 61 74 56",
        b: "20 74 30 77 20 68 10 64 58 77 74 72 90 74 93 69",
        leg2: "60 61 74 61 76 56", arm2: "32 66 32 55",
        eq: [{ mat: true }]
      }
    },
    {
      id: "granjero", name: "Paseo del granjero", group: "carga", equip: "Mancuernas o kettlebells",
      muscles: "Core, trapecio, agarre", sets: 3, secs: 40, rest: 60, level: 2,
      cues: ["Coge dos pesos iguales", "Hombros atrás y abajo, mirada al frente", "Pasos cortos y controlados", "No te inclines hacia ningún lado"],
      caution: "Fortalece la musculatura que estabiliza la columna al andar y cargar.",
      fig: {
        a: "56 13 56 23 56 36 56 48 56 50 60 66 64 83 70 84",
        b: "56 13 56 23 56 36 56 48 56 50 54 66 50 82 55 84",
        leg2: { a: "54 66 50 82 55 84", b: "60 66 64 83 70 84" },
        eq: [{ att: "w", r: [-5, -1, 10, 5] }], dur: 1.4
      }
    }
  ];
  A.GYM.forEach(function (e) { e.kind = "gym"; });
})(window.App);
