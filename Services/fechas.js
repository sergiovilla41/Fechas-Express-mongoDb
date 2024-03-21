// Función para calcular la fecha del Domingo de Pascua para un año dado
function calcularDomingoPascua(year) {
    const a = year % 19;
    const b = year % 4;
    const c = year % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;
    let diaDomingoRamos = 15 + dias;
    let mesDomingoRamos = 3; // El mes es marzo
    // Verificar si el día calculado excede los días en marzo
    if (diaDomingoRamos > 31) {
        diaDomingoRamos -= 31; // Ajustar al siguiente mes
        mesDomingoRamos = 4; // El mes es abril
    }

    // Devolver la fecha del Domingo de Pascua
    return new Date(year, mesDomingoRamos - 1, diaDomingoRamos);
}

// Función para calcular las fechas de la Semana Santa para un año dado
function calcularSemanaSanta(year) {
    const fechaPascua = calcularDomingoPascua(year);
    const juevesSanto = new Date(fechaPascua);
    juevesSanto.setDate(juevesSanto.getDate() + 4); // Jueves Santo es tres días antes de Pascua
    const viernesSanto = new Date(fechaPascua);
    viernesSanto.setDate(viernesSanto.getDate() + 5); // Viernes Santo es dos días antes de Pascua

    // Devolver un objeto con las fechas relevantes de la Semana Santa
    return {
        juevesSanto,
        viernesSanto,
        fechaPascua
    };
}

// Función para obtener la fecha del siguiente lunes a partir de una fecha dada
function obtenerSiguienteLunes(fecha) {
    const diaSemana = fecha.getDay(); // Cambiado de getDate a getDay
    const diasHastaLunes = (8 - diaSemana) % 7;
    const fechaLunes = new Date(fecha); // Copiar la fecha original para no modificarla
    fechaLunes.setDate(fecha.getDate() + diasHastaLunes); // Sumar días hasta el próximo lunes
    return fechaLunes;
  }

// Función para agregar un número dado de días a una fecha dada
function agregarDias(fecha, dias) {
    const fechaObjeto = new Date(fecha);
    fechaObjeto.setDate(fechaObjeto.getDate() + dias);
    return fechaObjeto; // Devolver el objeto Date sin convertirlo a cadena de texto
}
module.exports = {
    calcularSemanaSanta,
    calcularDomingoPascua,
    obtenerSiguienteLunes,
    agregarDias,
}
