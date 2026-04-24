/* F.E.R. test — pure logic (covered by test.spec.html). */
window.Fer = window.Fer || {};
Fer.logic = (() => {
  function detectarPerfil(respuestas) {
    const count = (codes) => codes.filter(c => respuestas.includes(c)).length;
    if (count(['F','K','N']) >= 2) return 'P1';
    if (count(['B','H','N']) >= 2) return 'P2';
    if (count(['C','G','M']) >= 2) return 'P3';
    return 'P0';
  }

  function asignarServicio(respuestas, perfil) {
    if (perfil === 'P2' && !respuestas.includes('F') && !respuestas.includes('K')) return 'impulso';
    return 'desbloqueo';
  }

  function seleccionarBloques(respuestas, prioridad) {
    return prioridad.filter(c => respuestas.includes(c)).slice(0, 2);
  }

  return { detectarPerfil, asignarServicio, seleccionarBloques };
})();
