// fechas.js



function calcularSemanaSanta(year) {
    const fechaPascua = calcularDomingoPascua(year);
    const juevesSanto = new Date(fechaPascua);
    juevesSanto.setDate(juevesSanto.getDate() - 3); // Jueves Santo es tres días antes de Pascua
    const viernesSanto = new Date(fechaPascua);
    viernesSanto.setDate(viernesSanto.getDate() - 2); // Viernes Santo es dos días antes de Pascua

    return {
        juevesSanto,
        viernesSanto,
        fechaPascua
    };
}

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

    return new Date(year, mesDomingoRamos - 1, diaDomingoRamos);
}

function obtenerSiguienteLunes(fecha) {
    const fechaObjeto = new Date(fecha);
    fechaObjeto.setDate(fechaObjeto.getDate() + ((1 + 7 - fechaObjeto.getDay()) % 7));
    return fechaObjeto;
}

function agregarDias(fecha, dias) {
    const fechaObjeto = new Date(fecha);
    fechaObjeto.setDate(fechaObjeto.getDate() + dias);
    return fechaObjeto;
}

module.exports = {
    calcularSemanaSanta,
    calcularDomingoPascua,
    obtenerSiguienteLunes,
    agregarDias
};
