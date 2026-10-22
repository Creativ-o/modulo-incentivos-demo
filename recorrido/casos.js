/* Casos de uso del recorrido. Solo datos y las acciones de Acciones. Un paso = un lugar de la demo + la regla que se ve ahí.
   Los pasos con `llenar` escriben y eligen solos el dato de ejemplo mientras se lee la explicación. */
(function () {
  'use strict';
  var A = window.Acciones, P = A.paso, G = A.PROG;
  var A08 = 'incentivo-08-asignar-buscar.html', A09 = 'incentivo-09-validar-foto.html', A10 = 'incentivo-10-asignar-tipo.html', A11 = 'incentivo-11-asignar-exito.html';
  var A12 = 'incentivo-12-asignaciones.html', A14 = 'incentivo-14-mis-asignaciones.html', C07 = 'incentivo-07-codigos.html';
  var D02 = 'incentivo-02-dashboard.html', R15 = 'incentivo-15-reporteria.html';
  var U18 = 'incentivo-18-gestion-usuarios.html';
  var P001 = 'incentivo-05-programa-detalle.html?id=PRG-2026-006';   // programa con ventana de cargue propia: la reapertura pide confirmar el reajuste de fechas
  var P007 = 'incentivo-05-programa-detalle.html?id=PRG-2026-007';
  var P05 = 'incentivo-05-programa-detalle.html?id=PRG-2026-006';
  var LISTA = 'incentivo-03-programas.html', FORM = 'incentivo-04-programa-crear.html', D17 = 'incentivo-17-mis-documentos.html', R16 = 'incentivo-16-revision-documental.html';
  function f(sel, p) { var o = { pantalla: FORM, sel: sel }; for (var k in p) o[k] = p[k]; return o; }

  window.CASOS = [
    {
      id: 'CU-01', titulo: 'Parametrizar un programa', perfiles: ['admin'], escena: 'base',
      resumen: 'Danna crea «' + G.nombre + '»: no es recurrente, pero uno de sus cuatro tipos de incentivo sí; cada tipo con sus condiciones y documentos.',
      pasos: [
        { rol: 'admin', pantalla: LISTA, sel: '.naowee-btn--loud', contiene: 'Nuevo programa', pulsar: true, titulo: 'Todo parte de la lista de programas',
          texto: 'Solo el Gestor de incentivos puede crear nuevos programas. **Vamos a crear uno nuevo:** no es recurrente, pero tiene un tipo que sí lo es, y cuatro tipos de incentivo distintos. Pulsa «Nuevo programa».' },
        f('#pfStepper', { preparar: P(1), titulo: 'Cuatro pasos',
          texto: 'El formulario tiene **cuatro pasos**: datos generales, información específica, condiciones y códigos y activación. Mientras avanzas, los datos del programa de ejemplo se van llenando. Puedes volver a un paso ya hecho desde este indicador.' }),

        /* Paso 1 */
        f('tarjeta:Información general', { preparar: P(1), titulo: 'Paso 1 · Información general', llenar: A.llenarInfo,
          texto: 'Solo el **nombre** es obligatorio. La descripción dice a quién va dirigido y el **evento asociado** sirve para validar condiciones y para la reportería.' }),
        f('tarjeta:Gestores del programa', { preparar: P(1), titulo: 'Quién gestiona el programa', llenar: A.llenarGestores,
          texto: 'Se elige al menos un **Gestor de programa**. Cada gestor solo ve y administra los programas que tiene a cargo: revisa documentos y puede asignar incentivos en ellos.' }),
        f('tarjeta:Vigencia', { preparar: P(1), titulo: 'Vigencia', llenar: A.llenarVigencia,
          texto: 'Las fechas son opcionales. Con fecha de fin, el programa **se cierra automático** cuando pasa la fecha. Sin fecha de fin sigue activo hasta que alguien lo cierre manualmente. Aquí rige del __' + A.fechaLarga(A.fechas.desde) + '__ al __' + A.fechaLarga(A.fechas.hasta) + '__.' }),
        f('tarjeta:Soporte del programa', { preparar: P(1), titulo: 'Soporte del programa', llenar: A.llenarSoporte,
          texto: 'La justificación o el **acto administrativo** que respalda el programa. También se puede adjuntar el documento (PDF, Word o imagen). Es opcional.' }),

        /* Paso 2 */
        f('tarjeta:Población a la que apunta', { preparar: P(2), titulo: 'Paso 2 · A quién apunta', llenar: A.llenarPoblacion,
          texto: 'Se define por **roles** y **cobertura territorial**: aquí, Deportista y Paradeportista de Antioquia, Atlántico y Valle del Cauca. Es el primer filtro del motor de reglas: quien no cumple no puede aplicar. Con **registro manual** el Gestor de programa también puede habilitar a quien la plataforma no identifique.' }),
        f('tarjeta:Recurrencia', { preparar: P(2), titulo: 'El programa no es recurrente',
          texto: 'Aquí se decide si **todo el programa** se entrega en ciclos. Este **no lo es**: queda de entrega única. Pero un tipo de incentivo puede ser recurrente por sí mismo; lo veremos en el tipo 2.' }),
        f('tarjeta:Documentación requerida', { preparar: P(2), titulo: 'Documentos requeridos', llenar: A.llenarDocs,
          texto: 'Se activa si el programa pide soporte. Se listan los documentos y se marcan los **obligatorios**: el deportista los carga en «Mis documentos» y el Gestor de programa los revisa. Hay uno opcional.' }),
        f('tarjeta:Etapas de cada ciclo, tarjeta:Fechas de cargue', { preparar: async function (c) { await P(2)(c); await A.docsActivar(c); }, titulo: 'Etapas: cargue, revisión y asignación', llenar: A.llenarEtapas,
          texto: 'Cada etapa tiene su ventana. Fuera de la ventana de cargue el deportista no puede subir documentos, salvo **habilitación excepcional**. El **plazo de gracia** da días hábiles para subsanar un documento rechazado.' }),
        f('tarjeta:Tipos de incentivo', { preparar: async function (c) { await P(2)(c); await A.docsActivar(c); }, titulo: 'Cuatro tipos de incentivo', llenar: A.llenarTipos,
          texto: 'Un programa puede entregar **varios tipos** a la vez. Cada tipo se valora y se entrega a su manera: la **categoría** decide si lleva valor (Bono, Beca, Kit o diploma), y la modalidad se deriva sola.' }),
        f('inc:1', { preparar: P(2), titulo: 'Tipo 1 · Beca con código', llenar: function (c) { return A.llenarInc(c, 0); },
          texto: 'Una **beca de entrega única con código**: cada código es único y equivale a una unidad entregable. Se valora «de abajo hacia arriba»: valor unitario × cantidad = **total**.' }),
        f('inc:2', { preparar: P(2), titulo: 'Tipo 2 · Bono recurrente', llenar: function (c) { return A.llenarInc(c, 1); },
          texto: 'Este tipo **es recurrente aunque el programa no lo sea**: se entrega cada mes dentro de su propio rango de fechas. Por eso queda **exento de documentación** y entra con modalidad «fijo recurrente».' }),
        f('inc:3', { preparar: P(2), titulo: 'Tipo 3 · Kit sin código', llenar: function (c) { return A.llenarInc(c, 2); },
          texto: 'Un **kit de entrega única sin código**: el Operador solo registra la entrega. Sin código no hay inventario que cargar en el paso 4.' }),
        f('inc:4', { preparar: P(2), titulo: 'Tipo 4 · Certificado', llenar: function (c) { return A.llenarInc(c, 3); },
          texto: 'La categoría **Diploma / reconocimiento** se entrega como **certificado digital** y no lleva código. El **valor unitario es opcional.**' }),
        f('#pfDist', { preparar: P(2), titulo: 'Total del programa',
          texto: 'El sistema suma los tipos que tienen valor y cantidad. Los tipos recurrentes se calculan **por ciclo**.' }),

        /* Paso 3 */
        f('.pf-h2', { preparar: P(3), titulo: 'Paso 3 · Condiciones de elegibilidad',
          texto: 'Las condiciones se definen **por tipo de incentivo**. Hay cuatro tipos y cada uno es un bloque plegable.' }),
        f('tipo:1 .pf-rule--fixed', { preparar: P(3), titulo: 'Condiciones fijas de la población', llenar: function (c) { return A.llenarCondicionesBeca(c, 'fijas'); },
          texto: 'La población que elegiste en el paso 2 (roles y departamentos) llega aquí como **condiciones fijas**. Con varios tipos de incentivo puedes **parametrizarlas según el caso**: la beca es solo para **Deportistas**, así que a este tipo se le quita Paradeportista.' }),
        f('tipo:1 .pf-group', { preparar: P(3), titulo: 'Grupo 1 · oro y hasta 25 años', llenar: function (c) { return A.llenarCondicionesBeca(c, 'g1'); },
          texto: 'Puedes añadir más condicionales (Y). Las cuales son obligatorias, en este caso: logro **Medalla de oro** y edad de **25 años o menos**.' }),
        f('tipo:1 .pf-group@2', { preparar: P(3), titulo: 'Grupo alternativo (O)', llenar: function (c) { return A.llenarCondicionesBeca(c, 'g2'); },
          texto: 'Entre grupos basta cumplir **uno** (O). El segundo acepta a quien tiene **Medalla de plata** y **al menos 3 medallas** acumuladas: una condición de mayoría.' }),
        f('tipo:1 .pf-preview', { preparar: P(3), titulo: 'Así se leerá la regla',
          texto: 'La regla se traduce a lenguaje natural para comprobar lo configurado: población fija, **y** (grupo 1) **o bien** (grupo 2).' }),
        f('tipo:2', { preparar: P(3), titulo: 'Tipo 2 · recurrente y sin documentos', llenar: A.llenarCondicionesBono,
          texto: 'La condición es la **disciplina** (Atletismo o Ciclismo). Además aparece el aviso **«Exento de documentación»**: al ser recurrente por sí mismo, no se le piden documentos ni aplica la ventana de cargue.' }),
        f('tipo:3', { preparar: P(3), titulo: 'Tipo 3 · documentos por tipo', llenar: A.llenarCondicionesKit,
          texto: 'Los documentos del programa se eligen **por tipo**: el kit no necesita **Certificación bancaria**, así que se desmarca. Las fechas de cargue siguen siendo las del paso 2.' }),
        f('tipo:4', { preparar: P(3), titulo: 'Tipo 4 · sin condiciones propias', llenar: A.llenarCondicionesDiploma,
          texto: 'Sin condiciones propias: puede recibirlo quien cumpla la **población** del programa.' }),

        /* Paso 4 */
        f('tarjeta:Inventario de códigos', { preparar: P(4), titulo: 'Paso 4 · Inventario de códigos', llenar: A.llenarCodigos,
          texto: 'Solo la **beca** lleva código. El inventario se carga de forma masiva (archivo) o manual, y el sistema avisa si faltan, sobran o hay repetidos. Es opcional: se puede cargar después.' }),
        f('tarjeta:Resumen del programa', { preparar: P(4), titulo: 'Resumen antes de crear',
          texto: 'Reúne datos, población, recurrencia, documentos, los **cuatro incentivos** con sus modalidades, la elegibilidad y los documentos de cada tipo.' }),
        f('tarjeta:Activación', { preparar: P(4), titulo: 'Activación', llenar: A.activar,
          texto: 'El programa solo opera cuando está **Activo**. Puede guardarse en **Configuración** o crearse y activarse de una vez.' }),
        f('#pfNext', { preparar: P(4), pulsar: true, titulo: 'Crear el programa',
          texto: 'Al crear queda **auditoría** con usuario, fecha, hora e IP. Pulsa «Crear y activar».' }),
        f('#pfModal .nwt-modal__content', { titulo: 'Programa creado',
          texto: 'El programa queda **Activo · V1.0**. Desde aquí se va a la lista o al detalle, donde después se **registran beneficiarios** y se asignan los incentivos. Eso sigue en los casos siguientes.' })
      ]
    },
    {
      id: 'CU-02', titulo: 'Cargar y enviar documentos', perfiles: ['deportista', 'programa'], escena: 'esteban',
      resumen: 'Esteban carga sus documentos, los envía a revisión y a Isa le llega el aviso.',
      pasos: [
        { rol: 'deportista', persona: 'Esteban Mora', pantalla: D17, sel: '#ptool', titulo: 'Los programas de la persona',
          texto: 'El deportista **solo ve los programas a los que aplica**, según la población y las condiciones del programa. Esteban tiene uno con documentos: «Estímulos integrales medallistas 2026».' },
        { pantalla: D17, sel: '.pcard__head', titulo: 'Estado y ventana de cargue',
          texto: 'El programa nace **«Por cargar»**. Debajo se ve cuántos obligatorios lleva y hasta cuándo puede cargar: la ventana está **abierta hasta el 30 de noviembre**. Fuera de la ventana no se puede subir, salvo habilitación excepcional.' },
        { pantalla: D17, sel: '.docs', titulo: 'Documentos requeridos',
          texto: 'Cada fila trae el documento, los **formatos** y el **peso máximo** aceptados. El asterisco marca los obligatorios; el de estudio es opcional.' },
        { pantalla: D17, sel: '.drow', contiene: 'Documento de identidad', titulo: 'Subir un documento', llenar: function (c) { return A.subirArchivo(c, 'Documento de identidad', 'cedula-esteban-mora.pdf'); },
          texto: 'Al subir se valida el **formato** y el **peso**, y se ve el progreso. El archivo queda como **borrador**: todavía no llega al Gestor de programa y se puede quitar.' },
        { pantalla: D17, sel: '.drow', contiene: 'Certificado de resultado', titulo: 'El segundo obligatorio', llenar: function (c) { return A.subirArchivo(c, 'Certificado de resultado', 'resultado-nacional.jpg'); },
          texto: 'Con los dos **obligatorios** cargados se habilita el envío. El documento opcional puede quedar vacío.' },
        { pantalla: D17, sel: '.pfoot button', pulsar: true, titulo: 'Enviar a revisión',
          texto: '**«Enviar a revisión»** registra los archivos juntos, deja **auditoría** de cada cargue y avisa al Gestor de programa. Pulsa el botón.' },
        { pantalla: D17, sel: '.pcard .naowee-badge', titulo: 'En revisión',
          texto: 'El programa pasa a **«En revisión»**. Mientras el gestor decide, la persona ya no puede cambiar los archivos.' },

        { rol: 'programa', pantalla: 'incentivo-16-revision-documental.html', sel: '.notif__panel', preparar: A.campanaAbrir, titulo: 'El aviso llega al Gestor de programa',
          texto: 'Isa recibe en su **campana** el aviso «Hay soportes pendientes de revisión» con la persona y el programa. El contador del menú también sube.' },
        { pantalla: 'incentivo-16-revision-documental.html', sel: '.asig-table tbody tr', contiene: 'Esteban Mora', preparar: async function (c) { var p = c.d.querySelector('.notif__panel'); if (p && !p.hidden) A.pulsar(c, '.notif__btn'); }, llenar: function (c) { return A.revBuscar(c, 'Esteban'); },
          titulo: 'En la lista de revisión',
          texto: 'La solicitud de Esteban aparece **«En revisión»**, con la cantidad de soportes. Desde aquí Isa la abre para aprobar o rechazar cada documento (caso siguiente).' }
      ]
    },
    {
      id: 'CU-03', titulo: 'Habilitación excepcional', perfiles: ['admin'], escena: 'programa-006',
      resumen: 'Danna habilita por excepción a una persona que no cumple las reglas; a ella solo le llega la invitación a cargar sus documentos.',
      pasos: [
        { rol: 'admin', pantalla: P05, sel: '#benActions', preparar: async function (c) { var t = c.d.getElementById('tabBenBtn'); if (t && !t.classList.contains('naowee-tab--selected')) { t.click(); await A.esperar(400); } },
          titulo: 'Beneficiarios del programa',
          texto: 'En la pestaña **Beneficiarios** hay dos formas de sumar personas. **Registrar beneficiarios** es el registro manual del programa. La **habilitación excepcional** deja participar a alguien que **no cumple las reglas normales**.' },
        { pantalla: P05, sel: '#benActions .naowee-btn--loud', pulsar: true, titulo: 'Habilitación excepcional',
          texto: 'Solo la ven los gestores de un programa **activo**. Pulsa el botón para abrir el formulario.' },
        { pantalla: P05, sel: '#excOv .exc__who', titulo: 'Individual o masiva',
          texto: 'Se puede habilitar a **una persona** (por documento o nombre) o a **varias** con una plantilla de Excel o CSV.' },
        { pantalla: P05, sel: '#excInd', llenar: async function (c) { await A.escribir(c, '#excQ', 'Mariana', true); await A.esperar(500); var s = c.d.querySelector('#excSg div'); if (s) s.click(); await A.esperar(400); },
          titulo: 'Elegir a la persona',
          texto: 'Se busca por nombre o documento y se elige a quien se va a habilitar: aquí, **Mariana Pajón**.' },
        { pantalla: P05, sel: '#excTipoBox', titulo: 'Tipo de incentivo',
          texto: 'Como el programa tiene varios tipos, se indica **a cuál** se habilita a la persona.' },
        { pantalla: P05, sel: '#excChips', titulo: 'Qué se exime',
          texto: 'Se elige qué se exime. **Fechas de la ventana** le permite cargar documentos aunque la ventana esté cerrada. **Condicionales** deja constancia de que no cumple las reglas. Lo más usual es **Ambas**.' },
        { pantalla: P05, sel: '#excJ', llenar: function (c) { return A.escribir(c, '#excJ', 'Resolución 0417 de 2026', true); }, titulo: 'Justificación obligatoria',
          texto: 'Siempre se escribe la **justificación o el número de acto**. Queda en la auditoría con quién lo hizo, cuándo y por qué.' },
        { pantalla: P05, sel: '#excGo', pulsar: true, titulo: 'Habilitar', texto: 'Pulsa **Habilitar** para registrar la excepción.' },
        { pantalla: P05, sel: '#benBody', contiene: 'Mariana', titulo: 'Ya es beneficiaria',
          texto: 'Mariana aparece en la lista con su origen **«Habilitado por excepción»**, el tipo de incentivo y su estado documental.' },
        { pantalla: P05, sel: '#benActions .naowee-btn--mute', titulo: 'Registro manual',
          texto: 'El **registro manual** es para programas que la plataforma no puede identificar por sí sola: el Gestor de programa busca y habilita personas, una a una o por lista.' },
        { pantalla: P05, sel: '#benBody', contiene: 'Mariana', titulo: 'Lo que recibe la persona',
          texto: 'La persona **no ve nada marcado como «excepción»**: solo le llega la **invitación a cargar los documentos del incentivo**. La excepción es una decisión interna del gestor y queda en la auditoría.' }
      ]
    },
    {
      id: 'CU-04', titulo: 'Revisar documentos', perfiles: ['programa', 'deportista'], escena: 'isa-revision',
      resumen: 'Isa aprueba un documento, rechaza otro con motivo y Ana lo corrige.',
      pasos: [
        { rol: 'programa', pantalla: R16, sel: '#strip', titulo: 'Revisión documental',
          texto: 'Isa ve **solo los programas que tiene a cargo**. Los cuatro contadores resumen el estado: **en revisión**, **aprobadas** (por asignar), **pendientes de subsanación** y **expiradas**.' },
        { pantalla: R16, sel: '.tablet-toolbar', titulo: 'Buscar y filtrar',
          texto: 'Se busca por deportista o documento y se filtra por **programa**, **estado** y **ciclo**. Por defecto muestra lo que está **en revisión**.' },
        { pantalla: R16, sel: '.asig-table tbody tr', contiene: ['Ana', 'Estímulos integrales'], llenar: function (c) { return A.revBuscar(c, 'Ana'); }, pulsar: true, titulo: 'Abrir una solicitud',
          texto: 'Cada fila muestra la persona, el programa, los **soportes** recibidos y cuándo se enviaron. Se abre la de Ana García en «Estímulos integrales medallistas 2026».' },

        { pantalla: R16, sel: '.dt-table', titulo: 'Los documentos de la persona',
          texto: 'La izquierda lista cada documento con su **estado** y su fecha de cargue. Las casillas permiten aprobar o rechazar **varios a la vez**.' },
        { pantalla: R16, sel: '.dp', titulo: 'Previsualización',
          texto: 'A la derecha se **previsualiza el archivo**, con zoom y descarga, para revisarlo antes de decidir.' },
        { pantalla: R16, sel: '.rq-row', llenar: function (c) { return A.revPend(c, 'Documento de identidad', 'aprobado'); }, titulo: 'Aprobar un documento',
          texto: 'Para aprobar se pulsa el **✓**. Todavía no se guarda: la decisión queda pendiente hasta pulsar **Enviar**.' },
        { pantalla: R16, sel: '#dtEnviar', pulsar: true, titulo: 'Enviar la decisión',
          texto: 'Pulsa **Enviar** para registrar la aprobación.' },
        { pantalla: R16, sel: '#mdOv .md', titulo: 'Documento aprobado',
          texto: 'Se confirma la decisión. El perfil solo pasa a **asignación** cuando **todos los documentos requeridos** estén aprobados.' },
        { pantalla: R16, sel: '#mdOv .md__f .naowee-btn--loud', pulsar: true, titulo: 'Aceptar', texto: 'Se cierra el aviso y se sigue con el siguiente documento.' },

        { pantalla: R16, sel: '#notaBox', llenar: function (c) { return A.revPend(c, 'Certificado de resultado', 'rechazado', 'El archivo está borroso; vuelve a cargarlo con mejor resolución.'); }, titulo: 'Rechazar con motivo',
          texto: 'Para rechazar se pulsa **⊘** y la **nota es obligatoria**: explica qué debe corregir la persona.' },
        { pantalla: R16, sel: '#dtEnviar', pulsar: true, titulo: 'Enviar el rechazo', texto: 'Pulsa **Enviar** para devolver el documento.' },
        { pantalla: R16, sel: '#mdOv .md', titulo: 'Rechazo de documento',
          texto: 'Se **notifica a la persona** y el perfil queda **«Pendiente de subsanación»**, con un plazo para reemplazar el archivo.' },
        { pantalla: R16, sel: '#mdOv .md__f .naowee-btn--loud', pulsar: true, titulo: 'Aceptar', texto: 'Se cierra el aviso.' },
        { pantalla: R16, sel: '#dtTabs button', contiene: 'Historial', pulsar: true, titulo: 'Historial del perfil',
          texto: 'La pestaña **Historial** guarda la trazabilidad: cargue, aprobación y rechazo, con quién lo hizo, cuándo y el motivo.' },
        { pantalla: R16, sel: '.tl', titulo: 'Trazabilidad', texto: 'Cada evento queda con **usuario, fecha y hora**. Es la evidencia para auditoría.' },

        { rol: 'deportista', persona: 'Ana García', pantalla: D17, sel: '.pcard', contiene: 'Estímulos integrales', titulo: 'Ana ve el rechazo',
          texto: 'En «Mis documentos», Ana ve el programa **«Pendiente de subsanación»**, el documento rechazado y el **motivo**, con el plazo para corregirlo.' },
        { pantalla: D17, sel: '.pcard[data-id^="PRG-2026-006"] .drow', contiene: 'Certificado de resultado', llenar: function (c) { return A.subirArchivo(c, 'Certificado de resultado', 'resultado-corregido.jpg', 0, 'PRG-2026-006'); }, titulo: 'Corregir el documento',
          texto: 'Ana **reemplaza** solo el documento rechazado; los aprobados se conservan.' },
        { pantalla: D17, sel: '.pcard[data-id^="PRG-2026-006"] .pfoot button', pulsar: true, titulo: 'Volver a enviar',
          texto: 'Al enviar, el perfil vuelve a **«En revisión»** y Isa recibe un nuevo aviso. Así se repite hasta aprobar o vencer el plazo.' }
      ]
    },
    {
      id: 'CU-05', titulo: 'Asignar el incentivo', perfiles: ['operador', 'programa'], escena: 'operador',
      resumen: 'Jorge busca a Andrés, elige el incentivo y su código, sube la evidencia y completa la entrega.',
      pasos: [
        { rol: 'operador', pantalla: A08, sel: '.search-card', titulo: 'Buscar a la persona',
          texto: 'El Operador **entrega lo que se le asigna**. Busca al beneficiario por **documento o nombre**; solo puede entregar a quien tiene la **documentación aprobada** por el Gestor de programa.' },
        { pantalla: A08, sel: '.quick-chip', contiene: 'Andrés García', pulsar: true, titulo: 'Una persona de ejemplo',
          texto: 'Para la demo hay personas de ejemplo, todas con **documentación aprobada**: a quien no la tiene el operador **no lo ve**. Usaremos a **Andrés García**.' },
        { pantalla: A08, sel: '.profile-card', titulo: 'Programas y documentación',
          texto: 'Se ven los programas de la persona y el estado de su **documentación por programa**. Solo se entrega en los que están **aprobados**; los demás muestran **por qué** están bloqueados (en revisión, pendiente de subsanación, expirada…).' },
        { pantalla: A08, sel: '.naowee-btn--loud', contiene: 'Continuar', pulsar: true, titulo: 'Continuar', texto: 'Con la persona validada, pulsa **Continuar**.' },

        { pantalla: A10, sel: '#opStepper', titulo: 'Cuatro pasos',
          texto: 'La asignación tiene cuatro pasos: **buscar**, **seleccionar el incentivo**, **evidencia de entrega** y **confirmación**.' },
        { pantalla: A10, sel: '#incList', titulo: 'Incentivos aplicables',
          texto: 'Aquí están los incentivos que **le tocan** a Andrés. Lo que se pide después depende de la **modalidad**: «con código», «fijo del ciclo» (confirma la entrega del ciclo) o «certificado digital» (se genera el PDF).' },
        { pantalla: A10, sel: '.inc', contiene: 'Kit deportivo medallista', llenar: async function (c) { var e = [].slice.call(c.d.querySelectorAll('.inc')).filter(function (x) { return x.textContent.indexOf('Kit deportivo medallista') > -1; })[0]; if (e && !e.classList.contains('selected') && !e.classList.contains('on')) e.click(); await A.esperar(500); },
          titulo: 'Elegir el incentivo', texto: 'Se elige el **kit deportivo**, que es de entrega única **con código**: pide el código del inventario y la evidencia.' },
        { pantalla: A10, sel: 'table:has(#codeTbody)', llenar: async function (c) { var f = c.d.querySelector('#codeTbody tr'); if (f && !f.classList.contains('selected')) f.click(); await A.esperar(400); },
          titulo: 'Código del inventario', texto: 'Se escoge el **código** que se va a entregar. Cada código es **único** y equivale a una unidad; se puede buscar por número y está paginado.' },
        { pantalla: A10, sel: 'aside.summary', titulo: 'Resumen de la asignación',
          texto: 'El resumen se va armando: persona, incentivo, código, modalidad, **operador** y fecha. La asignación solo se completa al registrar la evidencia.' },
        { pantalla: A10, sel: '#btnNext', pulsar: true, titulo: 'Continuar a evidencia', texto: 'Pulsa **Continuar a evidencia**.' },

        { pantalla: A09, sel: '#dropZone', llenar: async function (c) { var dt = new c.w.DataTransfer(); dt.items.add(new c.w.File([new c.w.Uint8Array(90000)], 'entrega-kit-andres.jpg', { type: 'image/jpeg' })); var i = c.d.getElementById('fileInput'); i.files = dt.files; i.dispatchEvent(new c.w.Event('change', { bubbles: true })); await A.esperar(600); },
          titulo: 'Evidencia de entrega', texto: 'Se adjunta el **respaldo de la entrega**: foto, comprobante o documento firmado (PDF, JPG o PNG, máx. 10 MB). Es lo que prueba que el incentivo llegó a la persona.' },
        { pantalla: A09, sel: '#obs', titulo: 'Observaciones', texto: 'Las **observaciones** son opcionales: sirven para dejar constancia de cómo se hizo la entrega.' },
        { pantalla: A09, sel: '#btnConfirmMain', pulsar: true, titulo: 'Completar la entrega', texto: 'Pulsa **Completar entrega**. El código pasa a **Asignado** y queda registrado en el historial.' },

        { pantalla: A11, sel: '.status-banner', titulo: 'Incentivo entregado',
          texto: 'La asignación queda registrada con un **ID de entrega**. El estado del código cambia de **Disponible** a **Asignado**, con fecha, hora y operador.' },
        { pantalla: A11, sel: '#perfilPersona', titulo: 'Lo que ya tiene la persona',
          texto: 'Debajo se ve el **perfil de Andrés**: lo que ya recibió (**Asignado**, con su código y la hora) y lo que **le falta por entregar** en sus programas.' },
        { pantalla: A11, sel: '#btnOtro', titulo: 'Seguir con otro incentivo',
          texto: 'Si le quedan incentivos, **«Asignar otro incentivo»** vuelve a su perfil, donde el ya entregado aparece como **Asignado**, y se continúa el flujo con el siguiente. **«Nueva asignación»** empieza con otra persona.' },

        { rol: 'programa', pantalla: A08, sel: '.nav-row[data-nav="asignar"]', titulo: 'Isa y Danna también asignan',
          texto: 'El **Gestor de programa** también asigna, pero **solo en sus programas**: la búsqueda ya sale filtrada. El **Gestor de incentivos** lo puede hacer en cualquiera.' }
      ]
    },
    {
      id: 'CU-06', titulo: 'Revertir y reasignar', perfiles: ['operador', 'programa', 'admin'], escena: 'jorge-entregas',
      resumen: 'Jorge revierte una entrega suya con motivo; Isa y Danna también pueden, y el código queda disponible para reasignar.',
      pasos: [
        { rol: 'operador', pantalla: A14, sel: '.asig-table', titulo: 'Mis asignaciones',
          texto: 'El Operador ve **todo lo que ha entregado**. El botón **Revertir** solo aparece en **sus** entregas y en programas **activos**: no puede revertir lo de otro operador.' },
        { pantalla: A14, sel: '.asig-table tbody tr', contiene: '2026-006-00105', titulo: 'La entrega más reciente',
          texto: 'La entrega de **Andrés García** (kit con código) está arriba. Supongamos que se registró por error.' },
        { pantalla: A14, sel: '[onclick*="askRevert"]', pulsar: true, titulo: 'Revertir', texto: 'Pulsa **Revertir** en esa fila.' },
        { pantalla: A14, sel: '.rvd', titulo: 'Datos de la entrega',
          texto: 'El modal resume qué se va a revertir: beneficiario, programa, incentivo, **código**, cuándo se entregó y quién lo hizo.' },
        { pantalla: A14, sel: '#rvdM', llenar: async function (c) { var m = c.d.getElementById('rvdM'); if (m && !m.value) { var o = [].slice.call(m.options).filter(function (x) { return x.value; })[0]; if (o) A.elegirValor(c, m, o.value); } await A.esperar(300); if (A.vacio(c, '#rvdJ')) await A.escribir(c, '#rvdJ', 'Se registró a la persona equivocada; la entrega se hará de nuevo.', true); },
          titulo: 'Motivo y detalle', texto: 'El **motivo** y el **detalle** son obligatorios. Quedan en la **auditoría** con nombre, rol, fecha, hora e IP.' },
        { pantalla: A14, sel: '.rvd .naowee-btn--loud', contiene: 'Revertir', pulsar: true, titulo: 'Revertir la asignación',
          texto: 'El código queda **«Revertido» y disponible**: el cupo y el valor vuelven al programa y se retira el beneficio de la persona. Pulsa **Revertir asignación**.' },
        { pantalla: A14, sel: '.asig-table tbody tr', contiene: 'Revertido', titulo: 'Entrega revertida',
          texto: 'La fila queda marcada como **«Revertido»**, en texto gris y sin botón. Esa reversión también aparece en el **Historial** del programa y suma a las revertidas.' },

        { rol: 'programa', pantalla: A12, sel: '.asig-table', titulo: 'Isa revierte las de sus programas',
          texto: 'El **Gestor de programa** ve el historial completo, pero **solo puede revertir las asignaciones de sus programas**. En los demás no aparece el botón.' },
        { rol: 'admin', pantalla: A12, sel: '[onclick*="askRevert"]', titulo: 'Danna revierte cualquiera',
          texto: 'El **Gestor de incentivos** puede revertir **cualquier** asignación de un programa activo. Si el programa está cerrado, no se revierte hasta reabrirlo.' },
        { pantalla: C07, sel: 'tbody tr', contiene: '2026-006-00105', llenar: async function (c) { var i = c.d.querySelector('.naowee-searchbox__input'); if (i && i.value !== '2026-006-00105') await A.escribir(c, '.naowee-searchbox__input', '2026-006-00105', true); },
          titulo: 'El código vuelve al inventario',
          texto: 'En **Códigos**, el código queda con estado **Revertido** y vuelve a estar disponible para asignarlo. Conserva su historial. Los programas que **no usan código** no aparecen aquí.' },

        { rol: 'operador', pantalla: A08, sel: '.search-card', titulo: 'Reasignar',
          texto: 'Para **reasignar**, el Operador repite el flujo normal del caso 5: busca a la persona correcta, elige el incentivo y **el código ya disponible**, sube la evidencia y completa la entrega.' }
      ]
    },
    {
      id: 'CU-07', titulo: 'Seguimiento', perfiles: ['admin', 'programa'], escena: 'admin-inicio',
      resumen: 'Danna sigue el avance: dashboard, inventario de códigos, historial de asignaciones, historial del programa y reportería.',
      pasos: [
        { rol: 'admin', pantalla: D02, sel: '.greeting-row', titulo: 'Dashboard',
          texto: 'El **Gestor de incentivos** empieza el día aquí: un resumen de los programas activos y de lo asignado hoy.' },
        { pantalla: D02, sel: '.kpi-grid', titulo: 'Indicadores del día',
          texto: 'Cuatro indicadores: **inventario disponible**, **asignados hoy**, **revertidos hoy** y **ejecución del rubro**. Los de revertidos ayudan a detectar errores de entrega a tiempo.' },
        { pantalla: D02, sel: '.layout', titulo: 'Programas y actividad',
          texto: 'A la izquierda, los **programas activos** con su avance de códigos; a la derecha, la **actividad reciente**: asignaciones y reversiones con quién las hizo y cuándo.' },
        { pantalla: C07, sel: '.kpi-grid', titulo: 'Inventario de códigos',
          texto: 'En **Códigos** está el inventario consolidado: **totales, disponibles, asignados y revertidos**, con el porcentaje de ejecución.' },
        { pantalla: C07, sel: '.tablet', titulo: 'Buscar y filtrar códigos',
          texto: 'Se busca por **código o beneficiario** y se filtra por **estado, tipo y programa**. Cada código muestra a quién se entregó, quién lo entregó y cuándo.' },
        { pantalla: A12, sel: '.tablet-toolbar', titulo: 'Historial de asignaciones',
          texto: 'Registro completo de **todas las entregas**. Se filtra por **programa, región y estado** o se busca por persona, código u operador, y se **exporta** para auditoría. Desde aquí también se revierte (caso 6).' },
        { pantalla: P05, sel: '[onclick*="downloadHistorial"]', preparar: async function (c) { var t = c.d.querySelector('.naowee-tab[onclick*="historial"]'); if (t && !t.classList.contains('naowee-tab--selected')) { t.click(); await A.esperar(450); } },
          titulo: 'Historial de cada programa',
          texto: 'Cada programa guarda **su propio historial**: activación, cargues de códigos, ediciones, cierres y reaperturas, y **reversiones**. **Descargar reporte** baja un archivo con todos esos cambios.' },
        { pantalla: R15, sel: '.summary-grid', titulo: 'Reportería',
          texto: 'La **reportería** consolida lo entregado por programa, bono e incentivo: beneficiarios premiados, valor entregado y más, para **auditoría y rendición de cuentas**.' },
        { pantalla: R15, sel: '#preview', titulo: 'Vista previa y descarga',
          texto: 'Se filtra por **año, mes y programa**, se **previsualiza** el resultado y se descarga el reporte.' },

        { rol: 'programa', pantalla: D02, sel: '.layout', titulo: 'Isa ve lo suyo',
          texto: 'El **Gestor de programa** tiene el mismo seguimiento, pero **limitado a sus programas**. No ve la reportería ni la gestión de usuarios.' }
      ]
    },
    {
      id: 'CU-08', titulo: 'Cerrar y reabrir un programa', perfiles: ['admin', 'programa'], escena: 'base',
      resumen: 'Danna cierra un programa activo, lo reabre con nuevas fechas y lo ve como «Reactivado»; Isa hace lo mismo con los suyos.',
      pasos: [
        { rol: 'admin', pantalla: LISTA, sel: '.kpi-grid, .summary-grid', titulo: 'Activos y cerrados',
          texto: 'La lista cuenta los programas por estado: **activos**, en **configuración** y **cerrados**. Los contadores se actualizan solos cuando un programa se cierra o se reabre.' },
        { pantalla: LISTA, sel: 'tbody tr', contiene: ['Estímulos mensuales', 'Cerrado'], titulo: 'Programas cerrados',
          texto: 'Los programas **cerrados van en rojo**. Un programa se cierra **solo** cuando pasa su fecha de fin: este ya cerró. Mientras está cerrado, el operador no asigna y no se revierte nada.' },
        { pantalla: P001, sel: '#btnClose', pulsar: true, titulo: 'Cierre manual',
          texto: 'También se puede **cerrar a mano**, sin esperar la fecha de fin. El botón está en el encabezado del programa, aparte de **Editar**. Pulsa **Cerrar programa**.' },
        { pantalla: P001, sel: '#clsInfo', titulo: 'Qué implica cerrar',
          texto: 'Se avisa lo que pasa: el operador **deja de asignar**, las personas sin asignar quedan **bloqueadas** y no se revierte. Cerrar **no crea versión**: queda en el Historial del programa.' },
        { pantalla: P001, sel: '#clsB1', llenar: A.cierreMotivo('Se terminó el presupuesto asignado para este ciclo.'),
          titulo: 'Motivo y detalle', texto: 'Se elige el **motivo** y se escribe el **detalle**. Ambos son obligatorios y quedan en la auditoría.' },
        { pantalla: P001, sel: '#clsGo', pulsar: true, titulo: 'Cerrar el programa', texto: 'Pulsa **Cerrar programa**.' },
        { pantalla: P001, sel: '#hdBadgeText', titulo: 'Programa cerrado',
          texto: 'El programa pasa a **«Cerrado»**, en rojo. En el mismo lugar, el botón ahora dice **Reabrir programa**.' },
        { pantalla: P001, sel: '#btnClose', pulsar: true, titulo: 'Reabrir', texto: 'Para volver a operar se pulsa **Reabrir programa**.' },
        { pantalla: P001, sel: '#clsB1', llenar: A.cierreMotivo('Se amplió el presupuesto y se reabre el programa.'),
          titulo: 'Reabrir un programa vigente', texto: 'Como la **vigencia no ha vencido**, solo se pide **motivo y detalle** y reabre de una vez, sin fechas nuevas.' },
        { pantalla: P001, sel: '#clsGo', pulsar: true, titulo: 'Reabrir', texto: 'Pulsa el botón.' },
        { pantalla: P001, sel: '#hdBadgeText', contiene: 'Reactivado', titulo: 'Reactivado',
          texto: 'El programa vuelve a **Activo** con la marca azul **«Reactivado»**, para distinguirlo de uno que nunca se cerró. Queda en el Historial con el motivo.' },

        { pantalla: P007, sel: '#btnClose', pulsar: true, titulo: 'Reabrir uno que cerró por fecha',
          texto: 'Este programa **cerró solo** al pasar su fecha de fin. Para reabrirlo hay que definir **nuevas fechas**. Pulsa **Reabrir programa**.' },
        { pantalla: P007, sel: '#clsDatesBox', llenar: async function (c) { if (A.vacio(c, '#clsD1')) await A.escribir(c, '#clsD1', '2026-11-02'); if (A.vacio(c, '#clsD2')) await A.escribir(c, '#clsD2', '2027-03-31'); await A.cierreMotivo('Se amplió el presupuesto y se reabre el programa.')(c); },
          titulo: 'Nueva vigencia (opcional)',
          texto: 'Las **fechas nuevas son opcionales**: sin ellas el programa inicia hoy y no tiene fecha de cierre. Con fechas, las ventanas y los rangos ya definidos se **reajustan** desde hoy.' },
        { pantalla: P007, sel: '#clsGo', pulsar: true, titulo: 'Reabrir', texto: 'Como el programa **tiene fechas propias** (ventanas de cargue y un incentivo recurrente), antes se pide una confirmación.' },
        { pantalla: P007, sel: '#clsB2', titulo: 'Confirmar los ajustes',
          texto: 'Se muestran las **fechas que se reajustan** y desde cuándo. Se puede confirmar la reapertura o ir a **editar las fechas** antes de seguir.' },
        { pantalla: P007, sel: '#clsF2 .naowee-btn--loud', pulsar: true, titulo: 'Confirmar la reapertura', texto: 'Pulsa **Confirmar reapertura**.' },
        { pantalla: LISTA, sel: 'tbody tr', contiene: ['Estímulos mensuales', 'Reactivado'], titulo: 'En la lista',
          texto: 'En la lista el programa aparece como **Reactivado** y se cuenta entre los **activos**. El filtro **Estado** permite ver solo los reactivados.' },

        { rol: 'programa', pantalla: 'incentivo-05-programa-detalle.html?id=PRG-2026-006', sel: '#btnClose', titulo: 'Isa también cierra y reabre',
          texto: 'El **Gestor de programa** puede cerrar y reabrir **sus** programas. Lo que no puede es **editar** los datos del programa: eso es del Gestor de incentivos.' }
      ]
    },
    {
      id: 'CU-09', titulo: 'Gestión de usuarios', perfiles: ['admin', 'programa', 'operador'], escena: 'admin-usuarios',
      resumen: 'Danna invita personas y las asigna a programas activos; Isa invita operadores para los suyos; cada persona acepta y entra según su rol.',
      pasos: [
        { rol: 'admin', pantalla: U18, sel: '#kpis', titulo: 'Gestión de usuarios',
          texto: 'Aquí el **Gestor de incentivos** invita a quienes van a usar la plataforma. Los tres contadores resumen cuántas personas están **activas**, **en espera de confirmación** y **desvinculadas**.' },
        { pantalla: U18, sel: '.asig-table', titulo: 'Quién es quién',
          texto: 'La lista muestra la **persona**, su **rol**, los **programas** en los que trabaja, su contacto y su **estado**. Se puede buscar y filtrar por rol y por estado.' },
        { pantalla: U18, sel: '#btnInvitar', pulsar: true, titulo: 'Invitar a una persona', texto: 'Pulsa **Invitar persona**.' },
        { pantalla: U18, sel: '#invRol', llenar: function (c) { return A.rolInvitado(c, 'programa'); }, titulo: 'Elegir el rol',
          texto: 'Se invita como **Gestor de programa** (revisa documentos y asigna en sus programas) o como **Operador** (entrega los incentivos que le toquen).' },
        { pantalla: U18, sel: '.exc__grid', llenar: function (c) { return A.invitarDatos(c, A.usuarioNuevo); }, titulo: 'Datos de la persona',
          texto: 'El formulario es sencillo y todo es **obligatorio**: nombres y apellidos, cédula, teléfono y correo. Se valida que no haya otra persona activa con la misma cédula o correo.' },
        { pantalla: U18, sel: '[data-f="prg"]', llenar: function (c) { return A.invitarPrograma(c, 0); }, titulo: 'Asignar a programas activos',
          texto: 'Se eligen los **programas activos** en los que va a trabajar. Solo aparecen los programas activos; los cerrados o en configuración no se pueden asignar.' },
        { pantalla: U18, sel: '#invGo', pulsar: true, titulo: 'Enviar la invitación', texto: 'Pulsa **Enviar invitación**: a la persona le llega un correo para confirmar su acceso.' },
        { pantalla: U18, sel: '#rows tr', contiene: 'Mateo', titulo: 'En espera de confirmación',
          texto: 'La persona queda **«En espera de confirmación»** hasta que acepte la invitación y haga el flujo de acceso (ese flujo no hace parte de la demo).' },
        { pantalla: U18, sel: '[data-act="acceso"]', contiene: '', pulsar: true, titulo: 'Cuando acepta',
          texto: 'Para la demo, **«Simular acceso»** hace como si la persona abriera el correo y entrara. Pulsa el botón.' },
        { pantalla: U18, sel: '#rows tr', contiene: 'Mateo', titulo: 'Activo',
          texto: 'Ya está **Activa** y ve la plataforma según su rol y los programas que se le asignaron. Desde aquí se le puede **desvincular**.' },
        { pantalla: U18, sel: '#rows tr [data-act="des"]', contiene: '', pulsar: true, titulo: 'Desvincular', texto: 'Si ya no debe tener acceso, se pulsa **Desvincular**.' },
        { pantalla: U18, sel: '#desOv .exc', titulo: 'Confirmación', texto: 'Antes de quitar el acceso se pide **confirmación**: la persona perderá el acceso a la plataforma de inmediato.' },
        { pantalla: U18, sel: '#desGo', pulsar: true, titulo: 'Desvincular', texto: 'Pulsa **Desvincular**.' },
        { pantalla: U18, sel: '#rows tr', contiene: 'Mateo', titulo: 'Sin acceso', texto: 'La persona queda **«Desvinculada»** y sin acciones. Se puede invitar de nuevo cuando se necesite.' },

        { rol: 'programa', pantalla: U18, sel: '#sub', titulo: 'Isa también gestiona usuarios',
          texto: 'El **Gestor de programa** tiene su propia gestión de usuarios, pero **solo para operadores** y **solo para sus programas**. Ve únicamente a los operadores de sus programas.' },
        { pantalla: U18, sel: '#btnInvitar', pulsar: true, titulo: 'Invitar a un operador', texto: 'Pulsa **Invitar persona**: aquí no hay que elegir el rol, siempre es **Operador**.' },
        { pantalla: U18, sel: '#invOv .exc', llenar: async function (c) { await A.invitarDatos(c, { nombre: 'Pablo Andrés Vega', cc: '80555666', tel: '3205550111', mail: 'pablo.vega@mindeporte.gov.co' }); await A.invitarPrograma(c, 0); }, titulo: 'Los mismos datos',
          texto: 'Se registra igual que en el otro perfil, pero los programas que se ofrecen son **solo sus programas activos**.' },
        { pantalla: U18, sel: '#invGo', pulsar: true, titulo: 'Enviar la invitación', texto: 'Pulsa **Enviar invitación**.' },
        { pantalla: U18, sel: '#rows tr', contiene: 'Pablo', titulo: 'En espera de confirmación', texto: 'Queda **«En espera de confirmación»**, igual que cualquier invitación.' },
        { pantalla: U18, sel: '[data-act="acceso"]', pulsar: true, titulo: 'Cuando acepta', texto: 'Con el acceso simulado, Pablo queda **Activo**.' },
        { rol: 'operador', pantalla: A08, sel: '.search-card', titulo: 'Entra y asigna',
          texto: 'Ya como **Operador**, Pablo ve su menú de asignación y **entrega lo que le toque** en el programa que se le asignó (caso 5).' }
      ]
    },
  ];

  /* ═══ Flujo completo (happy path): una sola historia de principio a fin, con el mismo programa y las mismas personas ═══ */
  (function () {
    var N = G.nombre, Q = '2027';
    function por(id) { return window.CASOS.filter(function (x) { return x.id === id; })[0]; }
    function con(p, extra) { var o = {}, k; for (k in p) o[k] = p[k]; for (k in extra) o[k] = extra[k]; return o; }
    var ISA = { nombre: 'Isa Pabon', cc: '1020444555', tel: '3105550102', mail: 'isa.pabon@mindeporte.gov.co' };
    var JORGE = { nombre: 'Jorge Guzman', cc: '80123456', tel: '3105550104', mail: 'jorge.guzman@mindeporte.gov.co' };

    var parte1 = [
      { rol: 'admin', parte: 1, pantalla: U18, sel: '.page-header', titulo: 'Todo empieza con las personas',
        texto: 'Antes de crear un programa, el **Gestor de incentivos** invita a quienes van a trabajar en la plataforma: una **Gestora de programa** (Isa) y un **Operador** (Jorge). Quienes aceptan quedan activos y ven la plataforma según su rol.' },
      { pantalla: U18, sel: '.asig-table', titulo: 'Aún no hay nadie invitado', texto: 'La lista parte vacía: solo muestra a las personas que el Gestor de incentivos invita. Vamos a sumar a Isa y a Jorge.' },
      { pantalla: U18, sel: '#btnInvitar', pulsar: true, titulo: 'Invitar a la Gestora de programa', texto: 'Pulsa **Invitar persona**.' },
      { pantalla: U18, sel: '#invRol', llenar: function (c) { return A.rolInvitado(c, 'programa'); }, titulo: 'Rol: Gestor de programa',
        texto: 'Primero Isa, como **Gestora de programa**: revisa documentos y asigna en los programas que tenga a cargo.' },
      { pantalla: U18, sel: '.exc__grid', llenar: function (c) { return A.invitarDatos(c, ISA); }, titulo: 'Sus datos',
        texto: 'Nombres, cédula, teléfono y correo, todos **obligatorios**. Se valida que no haya otra persona activa con la misma cédula o correo.' },
      { pantalla: U18, sel: '[data-f="prg"]', titulo: 'Programas: opcional',
        texto: 'Los programas **son opcionales** al invitar. Aún no hay ninguno: a Isa se la asignará como **gestora al crear el programa** (parte 2).' },
      { pantalla: U18, sel: '#invGo', pulsar: true, titulo: 'Enviar la invitación', texto: 'Pulsa **Enviar invitación**: a Isa le llega un correo para confirmar su acceso.' },
      { pantalla: U18, sel: '#rows tr', contiene: 'Isa', titulo: 'En espera de confirmación',
        texto: 'Isa queda **«En espera de confirmación»** hasta que acepte y haga el flujo de acceso (ese flujo no hace parte de la demo).' },
      { pantalla: U18, sel: '[data-act="acceso"]', pulsar: true, titulo: 'Isa acepta', texto: 'Con **«Simular acceso»** hacemos como si Isa abriera el correo y entrara. Pulsa el botón.' },
      { pantalla: U18, sel: '#btnInvitar', pulsar: true, titulo: 'Ahora, el Operador', texto: 'Falta quien va a **entregar** los incentivos. Pulsa **Invitar persona** otra vez.' },
      { pantalla: U18, sel: '#invOv .exc', llenar: async function (c) { await A.rolInvitado(c, 'operador'); await A.invitarDatos(c, JORGE); }, titulo: 'Rol: Operador',
        texto: 'Jorge entra como **Operador**: entrega los incentivos que le toquen y revierte solo los suyos. Mismos datos obligatorios.' },
      { pantalla: U18, sel: '#invGo', pulsar: true, titulo: 'Enviar la invitación', texto: 'Pulsa **Enviar invitación**.' },
      { pantalla: U18, sel: '[data-act="acceso"]', pulsar: true, titulo: 'Jorge acepta', texto: 'Jorge también acepta la invitación.' },
      { pantalla: U18, sel: '#kpis', titulo: 'Equipo listo',
        texto: 'Ya hay **dos personas activas**: Isa y Jorge. Con el equipo armado, Danna puede **crear el programa** y dejar a Isa como su gestora.' }
    ];

    /* Parte 2: la parametrización del caso 1, con el gestor que acaba de quedar activo */
    var parte2 = por('CU-01').pasos.map(function (p) {
      var o = con(p, {});
      if (p.titulo === 'Quién gestiona el programa') o.texto = 'Aquí aparece **Isa Pabon**: solo se puede elegir como gestora a quien **ya aceptó la invitación**. Cada gestor solo ve y administra los programas que tiene a cargo: revisa documentos y puede asignar incentivos en ellos.';
      return o;
    });
    parte2[0] = con(parte2[0], { parte: 2, titulo: 'Ahora, el programa', texto: 'Con el equipo listo, el **Gestor de incentivos** crea el programa. Vamos a crear uno complejo: **no es recurrente, pero tiene un tipo que sí lo es**, y cuatro tipos de incentivo distintos. Pulsa «Nuevo programa».' });
    parte2[parte2.length - 1] = con(parte2[parte2.length - 1], { texto: 'El programa queda **Activo · V1.0**, con **Isa** como gestora. Ya es visible para las personas que cumplen su población y condiciones.' });

    var parte3 = [
      { rol: 'deportista', persona: 'Esteban Mora', parte: 3, pantalla: D17, sel: 'pcard[' + Q + ']', titulo: 'El programa le aparece a Esteban',
        texto: 'Esteban entra a **«Mis documentos»** y ve el programa nuevo: aplica por **población y condiciones**. Si no aplicara, no lo vería. El programa nace **«Por cargar»**.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .pcard__head', titulo: 'Ventana de cargue',
        texto: 'Debajo del nombre se ve cuántos obligatorios lleva y **hasta cuándo puede cargar**. Fuera de esa ventana no se puede subir, salvo habilitación excepcional.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .docs', titulo: 'Documentos requeridos',
        texto: 'Los mismos documentos que Danna definió al parametrizar: tres **obligatorios** (asterisco) y uno opcional, con sus formatos y peso máximo.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .drow', contiene: 'Documento de identidad', llenar: function (c) { return A.subirArchivo(c, 'Documento de identidad', 'cedula-esteban-mora.pdf', 0, 0, Q); }, titulo: 'Subir el primero',
        texto: 'Al subir se valida el **formato** y el **peso**. El archivo queda como **borrador**: todavía no llega al gestor.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .drow', contiene: 'Certificado de resultado', llenar: function (c) { return A.subirArchivo(c, 'Certificado de resultado', 'resultado-nacional.jpg', 0, 0, Q); }, titulo: 'El segundo', texto: 'Sube el certificado del resultado deportivo.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .drow', contiene: 'Certificación bancaria', llenar: function (c) { return A.subirArchivo(c, 'Certificación bancaria', 'certificacion-bancaria.pdf', 0, 0, Q); }, titulo: 'Y el tercero',
        texto: 'Con los **tres obligatorios** cargados se habilita el envío. El documento opcional puede quedar vacío.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .pfoot button', pulsar: true, titulo: 'Enviar a revisión',
        texto: '**«Enviar a revisión»** registra los archivos juntos, deja **auditoría** y avisa a la gestora del programa. Pulsa el botón.' },
      { pantalla: D17, sel: 'pcard[' + Q + '] .naowee-badge', titulo: 'En revisión', texto: 'El programa pasa a **«En revisión»**. Ahora la decisión es de Isa.' }
    ];

    var parte4 = [
      { rol: 'programa', parte: 4, pantalla: R16, sel: '.notif__panel', preparar: A.campanaAbrir, titulo: 'El aviso llega a Isa',
        texto: 'Isa recibe en su **campana** «Hay soportes pendientes de revisión» con el nombre de Esteban y el programa. Solo le llegan avisos de **sus** programas.' },
      { pantalla: R16, sel: '.asig-table tbody tr', contiene: ['Esteban Mora', Q], preparar: async function (c) { var p = c.d.querySelector('.notif__panel'); if (p && !p.hidden) A.pulsar(c, '.notif__btn'); }, llenar: function (c) { return A.revBuscar(c, 'Esteban'); }, pulsar: true,
        titulo: 'Abrir la solicitud', texto: 'La solicitud de Esteban aparece **«En revisión»** con sus **3 soportes**. Isa la abre.' },
      { pantalla: R16, sel: '.dt-table', titulo: 'Los documentos de Esteban', texto: 'Cada documento con su estado y fecha de cargue. Las casillas permiten decidir **varios a la vez**.' },
      { pantalla: R16, sel: '.dp', titulo: 'Previsualización', texto: 'Isa revisa el archivo con zoom y descarga antes de decidir.' },
      { pantalla: R16, sel: '.dt-table thead', llenar: A.revSeleccionarTodos, titulo: 'Seleccionar todos',
        texto: 'Los tres documentos están completos y legibles, así que Isa los **selecciona todos** con la casilla de arriba.' },
      { pantalla: R16, sel: '#dtBulk .ok', pulsar: true, titulo: 'Aprobar todos', texto: 'Pulsa **Aprobar todos**.' },
      { pantalla: R16, sel: '#mdOv .md', titulo: 'Documentación aprobada',
        texto: 'Como están aprobados **todos los documentos requeridos**, el perfil pasa a asignación y queda **«Por asignar»** para el Operador.' },
      { pantalla: R16, sel: '#mdOv .md__f .naowee-btn--loud', pulsar: true, titulo: 'Aceptar', texto: 'Se cierra el aviso.' },
      { pantalla: R16, sel: '.rv-back', pulsar: true, titulo: 'Volver a la lista', texto: 'Isa vuelve a la lista de revisión.' },
      { pantalla: R16, sel: '#strip', titulo: 'Una aprobada más', texto: 'El contador de **Aprobadas** sube: son las personas que ya pueden recibir su incentivo.' }
    ];

    var parte5 = [
      { rol: 'operador', parte: 5, pantalla: A08, sel: '.search-card', titulo: 'Le sale al Operador',
        texto: 'Jorge entra a **Asignar incentivo**. Busca a Esteban por documento o nombre: solo se puede entregar a quien tiene la **documentación aprobada**.' },
      { pantalla: A08, sel: '#btnSearch', llenar: function (c) { return A.escribir(c, '#docNumber', '1.020.088.848', true); }, pulsar: true, titulo: 'Buscar a Esteban', texto: 'Se busca a **Esteban Mora** por su documento. Si no tuviera documentación aprobada, **no aparecería**.' },
      { pantalla: A08, sel: '.profile-card', titulo: 'Documentación aprobada',
        texto: 'Esteban aparece con el programa nuevo **«Aprobada»**: el gestor ya validó sus documentos, así que se le puede entregar.' },
      { pantalla: A08, sel: '.naowee-btn--loud', contiene: 'Continuar', pulsar: true, titulo: 'Continuar', texto: 'Pulsa **Continuar**.' },
      { pantalla: A10, sel: '#incList', titulo: 'Incentivos que le tocan',
        texto: 'Solo se ofrecen los incentivos del programa a los que Esteban **aplica** según las condiciones de cada tipo, cada uno con su modalidad.' },
      { pantalla: A10, sel: '.inc', contiene: 'Kit deportivo', llenar: async function (c) { var e = [].slice.call(c.d.querySelectorAll('.inc')).filter(function (x) { return x.textContent.indexOf('Kit deportivo') > -1; })[0]; if (e && !e.classList.contains('selected') && !e.classList.contains('on')) e.click(); await A.esperar(500); },
        titulo: 'Elegir el incentivo', texto: 'Se entrega el **kit deportivo**, de entrega única **sin código**: solo se registra la entrega con su evidencia.' },
      { pantalla: A10, sel: 'aside.summary', titulo: 'Resumen de la asignación', texto: 'Persona, incentivo, modalidad, **operador** y fecha. Se completa al registrar la evidencia.' },
      { pantalla: A10, sel: '#btnNext', pulsar: true, titulo: 'Continuar a evidencia', texto: 'Pulsa **Continuar a evidencia**.' },
      { pantalla: A09, sel: '#dropZone', llenar: async function (c) { var dt = new c.w.DataTransfer(); dt.items.add(new c.w.File([new c.w.Uint8Array(90000)], 'entrega-kit-esteban.jpg', { type: 'image/jpeg' })); var i = c.d.getElementById('fileInput'); i.files = dt.files; i.dispatchEvent(new c.w.Event('change', { bubbles: true })); await A.esperar(600); },
        titulo: 'Evidencia de entrega', texto: 'Jorge adjunta el **respaldo de la entrega** (foto, comprobante o documento firmado). Es lo que prueba que el incentivo llegó.' },
      { pantalla: A09, sel: '#btnConfirmMain', pulsar: true, titulo: 'Completar la entrega', texto: 'Pulsa **Completar entrega**.' },
      { pantalla: A11, sel: '.success-hero', titulo: 'Incentivo entregado',
        texto: 'La entrega queda registrada con su **ID**, la fecha, la hora y el operador. **Así termina el flujo:** personas invitadas → programa creado → documentos cargados → documentos aprobados → incentivo entregado.' }
    ];

    window.CASOS.unshift({
      id: 'FLUJO', titulo: 'Flujo completo', perfiles: ['admin', 'programa', 'operador', 'deportista'], escena: 'flujo',
      resumen: 'La historia de principio a fin: Danna invita al equipo y crea el programa, Esteban carga sus documentos, Isa los aprueba y Jorge entrega el incentivo.',
      partes: ['Gestión de usuarios', 'Parametrización del programa', 'Carga de documentos', 'Aprobación del gestor', 'Asignación del operador'],
      pasos: [].concat(parte1, parte2, parte3, parte4, parte5)
    });
  })();
})();
