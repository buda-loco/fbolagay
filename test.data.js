/* F.E.R. test — content (edit copy here; no logic in this file). */
window.Fer = window.Fer || {};
Fer.data = (() => {
  const QUESTIONS = [
    { eje: 1, text: 'Cuando tengo un problema de dinero…', options: [
      { code: 'A', text: 'Me cuesta resolverlo solo/a y termino dependiendo de otros.' },
      { code: 'B', text: 'Lo resuelvo por mi cuenta, aunque eso implique cargarme de más.' },
    ]},
    { eje: 2, text: 'Cuando tengo que tomar decisiones pensando en el futuro…', options: [
      { code: 'C', text: 'Me preocupa y eso influye en lo que hago.' },
      { code: 'D', text: 'Confío en que se va a resolver, aunque no siempre tenga claro cuál es el siguiente paso.' },
    ]},
    { eje: 3, text: 'Con mi dinero y mis decisiones…', options: [
      { code: 'E', text: 'Repito hábitos que sé que me perjudican.' },
      { code: 'F', text: 'Sé lo que debería hacer, pero no termino de hacerlo.' },
    ]},
    { eje: 4, text: 'Cuando tomo decisiones económicas…', options: [
      { code: 'G', text: 'Me cuesta sostenerlas y termino abandonándolas.' },
      { code: 'H', text: 'Las sostengo incluso cuando ya no me están funcionando.' },
    ]},
    { eje: 5, text: 'Cuando el dinero involucra a otras personas…', options: [
      { code: 'I', text: 'Priorizo mi beneficio, aunque eso a veces afecte el vínculo.' },
      { code: 'J', text: 'Priorizo a otros y termino perjudicándome.' },
    ]},
    { eje: 6, text: 'Cuando tengo que tomar decisiones con dinero…', options: [
      { code: 'K', text: 'No tengo claro qué quiero lograr y termino decidiendo sin dirección.' },
      { code: 'L', text: 'Sé lo que quiero, pero igual cambio mis decisiones según el momento.' },
    ]},
    { eje: 7, text: 'Cuando tomo decisiones con dinero…', options: [
      { code: 'M', text: 'Actúo por impulso y después lo reviso.' },
      { code: 'N', text: 'Me controlo tanto que termino frenando decisiones que necesito tomar.' },
    ]},
  ];

  const PERFILES = {
    P1: {
      nombre: 'Sin dirección — no concretás',
      texto: 'Te estás haciendo cargo de tus decisiones, pero eso no está dando resultado. Estás pensando, intentando y decidiendo, pero no hay una dirección clara que ordene todo eso. Tu esfuerzo no se convierte en resultados.',
    },
    P2: {
      nombre: 'Control excesivo',
      texto: 'Estás intentando controlar tus decisiones para no equivocarte, pero ese control te está haciendo perder oportunidades. No es falta de criterio: es que estás usando el control para evitar errores, y eso también tiene costo.',
    },
    P3: {
      nombre: 'Reactivo emocional',
      texto: 'Hoy estás tomando decisiones influido por la emoción, y eso está generando resultados inconsistentes. Cambiás decisiones o no sostenés lo que empezás. El problema no es la emoción: es decidir sin un criterio que se mantenga.',
    },
    P0: {
      nombre: 'Mixto — sin patrón dominante',
      texto: 'Tu resultado no muestra un patrón dominante claro. Muestra algo igual de importante: varias decisiones están funcionando en contra de tus resultados al mismo tiempo. No es falta de capacidad, es falta de orden en cómo estás decidiendo.',
    },
  };

  const BLOQUES = {
    A: 'Estás esperando ayuda o validación antes de actuar, y eso hace que postergues decisiones que ya podrías estar tomando.',
    B: 'Resolvés por tu cuenta, pero también te cargás con decisiones que no siempre deberías asumir solo/a.',
    C: 'La preocupación está influyendo en lo que hacés: decidís más desde el miedo que desde un criterio claro.',
    D: 'Confiar en que se va a resolver sin saber qué hacer está dejando decisiones importantes sin definir.',
    E: 'Estás repitiendo hábitos que sabés que te perjudican, y eso impacta directo en tus resultados.',
    F: 'Estás pensando más de lo que ejecutás, y eso está frenando tus resultados.',
    G: 'Te cuesta sostener decisiones en el tiempo, y eso hace que lo que empezás no termine generando resultado.',
    H: 'Estás sosteniendo decisiones incluso cuando ya no funcionan, y eso hace que pierdas tiempo y oportunidades.',
    I: 'Estás priorizando tu beneficio, y eso puede afectar la calidad de tus vínculos y oportunidades.',
    J: 'Estás dando más de lo que recibís, y eso te está costando dinero.',
    K: 'No tener claro qué querés está haciendo que tomes decisiones sin dirección, y eso te aleja de resultados.',
    L: 'Sabés lo que querés, pero estás cambiando decisiones, y eso te hace perder coherencia.',
    M: 'Estás decidiendo por impulso, y eso hace que después tengas que corregir decisiones.',
    N: 'Estás controlando de más, y eso te está frenando decisiones que necesitás tomar.',
  };

  const PRIORIDAD_BLOQUES = ['J','K','F','N','H','C','G','M','E','B','D','L','A','I'];

  const CIERRES = {
    desbloqueo: {
      titulo: 'Este es el patrón que está frenando tus resultados con el dinero',
      parrafos: [
        'No es un problema de dinero. Es un problema de cómo estás decidiendo.',
        'Hoy lo que pensás, lo que sentís y lo que hacés no están alineados. Y eso está haciendo que tus resultados no cambien.',
        'Hay una forma de ordenar esto y empezar a decidir con más claridad.',
      ],
      cta: 'Dejar de decidir mal con mi dinero',
    },
    impulso: {
      titulo: 'Este es el patrón que está frenando tus resultados con el dinero',
      parrafos: [
        'No necesitás hacer más. Necesitás decidir mejor.',
        'Hoy ya estás en movimiento, pero algunas decisiones te están costando resultados.',
        'Hay una forma de ajustar eso para que lo que hacés empiece a rendir mejor.',
      ],
      cta: 'Tomar mejores decisiones con mi dinero',
    },
  };

  return { QUESTIONS, PERFILES, BLOQUES, CIERRES, PRIORIDAD_BLOQUES };
})();
