/* ═══════════════════════════════════════════════════════════════
   PROGRAMAS — data fuente de verdad
   Consumida por incentivo-03 (lista) y incentivo-05 (detalle).
   Cada programa tiene info completa: identidad visual, rubro,
   tipos de incentivo, condiciones y historial.
   ═══════════════════════════════════════════════════════════════ */
window.PROGRAMS_DATA = [
  {
    id: 'PRG-2026-001',
    version: 'V2.0',
    versions: [
      { v: 'V2.0', cambio: 'Documento nuevo: certificación bancaria', quien: 'Danna Arrieta', rol: 'Gestor de incentivos', fecha: '14 oct 2026 · 09:40', docs: true },
      { v: 'V1.0', cambio: 'Versión inicial. Ciclos de enero a septiembre', quien: 'Danna Arrieta', rol: 'Gestor de incentivos', fecha: '01 ene 2026' }
    ],
    name: 'Becas deportivas 2026',
    shortDesc: 'Medallistas de oro · Nacional',
    longDesc: 'Beca educativa dirigida a deportistas medallistas de oro y plata de los Juegos Nacionales 2025, para apoyar su formación profesional universitaria.',
    iconBg: '#fff3e6',
    iconColor: '#d74009',
    status: 'active',
    event: 'Juegos Nacionales 2025',
    coverage: 'Nacional',
    responsible: 'Danna Arrieta',
    rubro: 200000000,
    exec: 182000000,
    unit: 1000000,
    codes: { total: 200, avail: 18, asig: 179, rev: 3 },
    from: '01 ene 2026',
    to: '31 dic 2026',
    actoAdmin: 'Resolución 2026-115',
    fuente: 'Ministerio del Deporte · 2026',
    incentives: [
      { name: 'Beca educativa · Medallistas de oro', category: 'Beca',
        detail: 'Cualitativo + monetario · 200 cupos planeados',
        value: 1000000, valueLabel: '$1.000.000', valueFoot: 'por beneficiario',
        badges: [{ text: 'Beca', variant: 'informative' }, { text: 'Monetario', variant: 'positive' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Edad', op: '≥', value: '18' },
          { field: 'Categoría deportiva', op: '=', value: 'Prejuvenil o superior' }
        ]},
        { logic: 'AND', rules: [
          { field: 'Logros', op: '∈', value: '{"medalla de oro", "medalla de plata"}' }
        ]}
      ],
      summary: 'Aplica para deportistas <strong>mayores de 18 años con categoría prejuvenil o superior</strong>, o deportistas <strong>con medalla de oro o plata</strong> (sin importar la edad).'
    }
  },
  {
    id: 'PRG-2026-002',
    name: 'Kit deportivo Atlántico',
    shortDesc: 'Disciplinas de pista · Atlántico',
    longDesc: 'Entrega de kits deportivos (uniforme, calzado y accesorios de entrenamiento) a atletas de disciplinas de pista del departamento del Atlántico.',
    iconBg: '#eef5ff',
    iconColor: '#1f78d1',
    status: 'active',
    event: 'Liga Departamental Atlántico 2026',
    coverage: 'Atlántico',
    responsible: 'Laura Meza',
    rubro: 87500000,
    exec: 37800000,
    unit: 350000,
    codes: { total: 250, avail: 142, asig: 108, rev: 0 },
    from: '01 mar 2026',
    to: '30 abr 2026',
    actoAdmin: 'Convenio 2026-ATL-018',
    fuente: 'Indeportes Atlántico · 2026',
    incentives: [
      { name: 'Kit uniforme · Atletismo pista', category: 'Kit',
        detail: 'Camiseta, pantaloneta, medias y spikes · 250 unidades',
        value: 350000, valueLabel: '$350.000', valueFoot: 'por kit',
        badges: [{ text: 'Kit', variant: 'caution' }, { text: 'En especie', variant: 'neutral' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Categoría deportiva', op: '=', value: 'Juvenil' },
          { field: 'Edad', op: '≤', value: '21' }
        ]}
      ],
      summary: 'Aplica para atletas <strong>juveniles con edad hasta 21 años</strong> inscritos en la liga departamental.'
    }
  },
  {
    id: 'PRG-2026-003',
    name: 'Bono transporte intercolegiados',
    shortDesc: 'Prejuveniles · Cundinamarca',
    longDesc: 'Bono mensual de transporte para deportistas prejuveniles de Cundinamarca que participan en los juegos intercolegiados.',
    iconBg: '#e6f4e7',
    iconColor: '#15803d',
    status: 'active',
    event: 'Juegos Intercolegiados 2026',
    coverage: 'Cundinamarca',
    responsible: 'Carla Suárez',
    rubro: 60000000,
    exec: 14160000,
    unit: 120000,
    codes: { total: 500, avail: 382, asig: 118, rev: 0 },
    from: '15 feb 2026',
    to: '30 jun 2026',
    actoAdmin: 'Acuerdo 2026-CUN-042',
    fuente: 'Gobernación Cundinamarca · 2026',
    incentives: [
      { name: 'Bono transporte mensual', category: 'Bono',
        detail: 'Recarga TransMilenio/SITP · 500 cupos',
        value: 120000, valueLabel: '$120.000', valueFoot: 'por mes',
        badges: [{ text: 'Bono', variant: 'informative' }, { text: 'Transporte', variant: 'positive' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Categoría deportiva', op: '=', value: 'Prejuvenil' },
          { field: 'Edad', op: '≥', value: '13' },
          { field: 'Edad', op: '≤', value: '17' }
        ]}
      ],
      summary: 'Aplica para deportistas <strong>prejuveniles entre 13 y 17 años</strong> del departamento.'
    }
  },
  {
    id: 'PRG-2026-004',
    name: 'Inscripción juegos universitarios',
    shortDesc: 'Mayores de 18 · Nacional',
    longDesc: 'Cobertura del costo de inscripción a los juegos universitarios 2026 para estudiantes-atletas activos en universidades públicas.',
    iconBg: '#fff3e6',
    iconColor: '#d74009',
    status: 'active',
    event: 'Juegos Universitarios 2026',
    coverage: 'Nacional',
    responsible: 'Danna Arrieta',
    rubro: 20000000,
    exec: 11000000,
    unit: 250000,
    codes: { total: 80, avail: 36, asig: 44, rev: 0 },
    from: '01 feb 2026',
    to: '15 jun 2026',
    actoAdmin: 'Resolución 2026-UNI-007',
    fuente: 'Mindeporte + ASCUN · 2026',
    incentives: [
      { name: 'Pago inscripción · Juegos Universitarios', category: 'Inscripción',
        detail: 'Cubre cuota única de inscripción · 80 cupos',
        value: 250000, valueLabel: '$250.000', valueFoot: 'por inscrito',
        badges: [{ text: 'Inscripción', variant: 'informative' }, { text: 'Monetario', variant: 'positive' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Edad', op: '≥', value: '18' },
          { field: 'Categoría deportiva', op: '=', value: 'Mayores' }
        ]}
      ],
      summary: 'Aplica para <strong>estudiantes-atletas mayores de 18 años</strong> inscritos en universidades públicas.'
    }
  },
  {
    id: 'PRG-2026-005',
    name: 'Beca integral alto rendimiento',
    shortDesc: 'Élite · Nacional',
    longDesc: 'Beca integral (alimentación, alojamiento, entrenamiento y estímulos mensuales) para deportistas de alto rendimiento con proyección olímpica.',
    iconBg: '#e6f4e7',
    iconColor: '#15803d',
    status: 'draft',
    event: 'Proyección Panamericanos 2027',
    coverage: 'Nacional',
    responsible: 'Danna Arrieta',
    rubro: 500000000,
    exec: 0,
    unit: 5000000,
    codes: { total: 0, avail: 0, asig: 0, rev: 0 },
    from: '—',
    to: '—',
    actoAdmin: 'Borrador · pendiente aprobación',
    fuente: 'Ministerio del Deporte · 2026',
    incentives: [
      { name: 'Beca integral alto rendimiento', category: 'Beca',
        detail: 'Pendiente definir número de cupos',
        value: 5000000, valueLabel: '$5.000.000', valueFoot: 'por beneficiario mensual',
        badges: [{ text: 'Beca', variant: 'informative' }, { text: 'Monetario', variant: 'positive' }, { text: 'Borrador', variant: 'neutral' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Logros', op: '∈', value: 'Medalla de oro (internacional)' }
        ]}
      ],
      summary: '<strong>Borrador.</strong> Las condiciones están pendientes de revisión por el comité técnico.'
    }
  },
  {
    id: 'PRG-2025-019',
    name: 'Bonos olimpiadas indígenas',
    shortDesc: 'Comunidades · Cauca',
    longDesc: 'Bono único de participación para comunidades indígenas del Cauca inscritas en las primeras Olimpiadas Indígenas Nacionales.',
    iconBg: '#eef5ff',
    iconColor: '#1f78d1',
    status: 'closed',
    event: 'Olimpiadas Indígenas Nacionales 2025',
    coverage: 'Cauca',
    responsible: 'Andrés Polo',
    rubro: 45000000,
    exec: 45000000,
    unit: 250000,
    codes: { total: 180, avail: 0, asig: 180, rev: 0 },
    from: '15 oct 2025',
    to: '15 dic 2025',
    actoAdmin: 'Convenio 2025-CAU-031',
    fuente: 'Ministerio + Gobernación Cauca · 2025',
    incentives: [
      { name: 'Bono participación · Olimpiadas indígenas', category: 'Bono',
        detail: 'Pago único de participación · 180 cupos',
        value: 250000, valueLabel: '$250.000', valueFoot: 'por deportista',
        badges: [{ text: 'Bono', variant: 'informative' }, { text: 'Monetario', variant: 'positive' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Categoría deportiva', op: '=', value: 'Mayores' }
        ]}
      ],
      summary: '<strong>Programa cerrado.</strong> Ejecutado al 100% con 180 asignaciones.'
    }
  },
  {
    id: 'PRG-2025-017',
    name: 'Kit fútbol juveniles Valle',
    shortDesc: 'Juveniles · Valle',
    longDesc: 'Entrega de kits de fútbol (uniforme, guayos y balones) para categorías juveniles de clubes del Valle del Cauca.',
    iconBg: '#eef5ff',
    iconColor: '#1f78d1',
    status: 'closed',
    event: 'Liga Juvenil Valle 2025',
    coverage: 'Valle del Cauca',
    responsible: 'Laura Meza',
    rubro: 32000000,
    exec: 31840000,
    unit: 320000,
    codes: { total: 100, avail: 0, asig: 99, rev: 1 },
    from: '01 sep 2025',
    to: '30 nov 2025',
    actoAdmin: 'Convenio 2025-VAL-022',
    fuente: 'Indervalle · 2025',
    incentives: [
      { name: 'Kit fútbol juvenil', category: 'Kit',
        detail: 'Uniforme + guayos + balón · 100 unidades',
        value: 320000, valueLabel: '$320.000', valueFoot: 'por kit',
        badges: [{ text: 'Kit', variant: 'caution' }, { text: 'En especie', variant: 'neutral' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Categoría deportiva', op: '=', value: 'Juvenil' }
        ]}
      ],
      summary: '<strong>Programa cerrado.</strong> 99 kits entregados, 1 reversión por retiro del deportista.'
    }
  },
  {
    id: 'PRG-2025-012',
    name: 'Becas juegos nacionales 2025',
    shortDesc: 'Oro/plata · Nacional',
    longDesc: 'Beca educativa para medallistas de oro y plata de los Juegos Nacionales 2025. Cubre matrícula universitaria del semestre 2026-I.',
    iconBg: '#fff3e6',
    iconColor: '#d74009',
    status: 'closed',
    event: 'Juegos Nacionales 2025',
    coverage: 'Nacional',
    responsible: 'Danna Arrieta',
    rubro: 180000000,
    exec: 180000000,
    unit: 1000000,
    codes: { total: 180, avail: 0, asig: 180, rev: 0 },
    from: '01 jun 2025',
    to: '15 sep 2025',
    actoAdmin: 'Resolución 2025-116',
    fuente: 'Ministerio del Deporte · 2025',
    incentives: [
      { name: 'Beca universitaria · Medallistas', category: 'Beca',
        detail: 'Matrícula semestre 2026-I · 180 cupos',
        value: 1000000, valueLabel: '$1.000.000', valueFoot: 'por beneficiario',
        badges: [{ text: 'Beca', variant: 'informative' }, { text: 'Monetario', variant: 'positive' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Logros', op: '∈', value: '{"medalla de oro", "medalla de plata"}' }
        ]}
      ],
      summary: '<strong>Programa cerrado.</strong> 180 becas otorgadas. Ejecución 100%.'
    }
  }
  ,{
    id: 'PRG-2026-006',
    version: 'V2.0',
    versions: [
      { v: 'V2.0', cambio: 'Tipo nuevo: Certificado de participación · documento nuevo: certificado de estudio', quien: 'Danna Arrieta', rol: 'Gestor de incentivos', fecha: '09 sep 2026 · 10:15', docs: true },
      { v: 'V1.0', cambio: 'Versión inicial. Kit deportivo y beca de sostenimiento', quien: 'Danna Arrieta', rol: 'Gestor de incentivos', fecha: '15 jul 2026' }
    ],
    name: 'Estímulos integrales medallistas 2026',
    shortDesc: 'Kit, beca y certificado · Antioquia y Valle',
    longDesc: 'Paquete de estímulos para medallistas de los Juegos Nacionales 2026: kit deportivo con código, beca mensual de sostenimiento y certificado de participación para entrenadores. Sin rubro definido: se suma el costo de cada entrega.',
    iconBg: '#eef5ff',
    iconColor: '#1f78d1',
    status: 'active',
    event: 'Juegos Nacionales 2026',
    coverage: 'Antioquia, Valle del Cauca · 2 municipios',
    responsible: 'Isa Pabon, Laura Meza',
    rubro: 0,
    exec: 69750000, // sin rubro: suma de lo que cuesta entregar (67 kits × $450.000 + 33 becas × $1.200.000)
    unit: 450000,
    codes: { total: 175, avail: 75, asig: 100, rev: 4 },
    from: '15 jul 2026',
    to: 'Sin fecha de fin',
    actoAdmin: 'Resolución 2026-171',
    fuente: 'Ministerio del Deporte · 2026',
    incentives: [
      { name: 'Kit deportivo medallista', category: 'Kit',
        detail: 'Entrega única con código · 120 cupos · sin tope',
        value: 450000, valueLabel: '$450.000', valueFoot: 'por entrega',
        badges: [{ text: 'Kit', variant: 'caution' }, { text: 'Con código', variant: 'neutral' }],
        conditions: { groups: [{ logic: 'AND', rules: [{ field: 'Logro / medallería', op: '∈', value: '{Medalla de oro, Medalla de plata}' }] }], summary: 'Medallistas de oro o plata.' } },
      { name: 'Beca de sostenimiento mensual', category: 'Beca',
        detail: 'Incentivo fijo recurrente · mensual desde 15 jul 2026 · 60 cupos · sin tope · exento de documentación',
        value: 1200000, valueLabel: '$1.200.000', valueFoot: 'por ciclo',
        badges: [{ text: 'Beca', variant: 'informative' }, { text: 'Fijo mensual', variant: 'caution' }, { text: 'Con código', variant: 'neutral' }],
        conditions: { groups: [{ logic: 'AND', rules: [{ field: 'Medallas ganadas', op: 'tiene más de', value: '3' }] }, { logic: 'AND', rules: [{ field: 'Medallas de oro', op: 'es quien más', value: 'el mayor' }] }], summary: 'Más de 3 medallas, o quien más medallas de oro tenga.' } },
      { name: 'Certificado de participación', category: 'Pase',
        detail: 'Certificado digital con firma y QR · sin código ni valor',
        value: 0, valueLabel: '—', valueFoot: '',
        badges: [{ text: 'Certificado', variant: 'neutral' }],
        conditions: { groups: [{ logic: 'AND', rules: [{ field: 'Participaciones', op: 'tiene al menos', value: '1' }] }], summary: 'Al menos una participación.' } }
    ],
    conditions: { groups: [], summary: '' }
  }
];

window.getProgramById = function(id){
  return window.PROGRAMS_DATA.find(p => p.id === id) || window.PROGRAMS_DATA[0];
};

/* ══ Iconografía de categorías de incentivo ══════════════════════════════
   8 iconos representativos. Stroke-based (24x24, stroke-width 1.6, currentColor).
   Cada path es el contenido interno de un <svg>; quien lo consume decide
   tamaño, color de fondo y color de stroke. Accesible vía window.CAT_ICONS.
   Para asignar el icono de un programa: tomar la categoría del primer
   incentivo (programa puede tener varios; el primero define el icono). */
window.CAT_ICONS = {
  // Birrete con base — formación académica
  'Beca':        '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4"/><line x1="22" y1="10" x2="22" y2="15"/>',
  // Bolsa deportiva con asa y franja central
  'Kit':         '<path d="M5 9h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"/><path d="M9 9V7a3 3 0 016 0v2"/><line x1="4" y1="13" x2="20" y2="13"/>',
  // Cupón / voucher con perforaciones laterales tipo ticket
  'Bono':        '<path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3a1.5 1.5 0 000 3v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1.5 1.5 0 000-3V7z"/><line x1="13" y1="6" x2="13" y2="9" stroke-dasharray="1.5 1.5"/><line x1="13" y1="11" x2="13" y2="13" stroke-dasharray="1.5 1.5"/><line x1="13" y1="15" x2="13" y2="18" stroke-dasharray="1.5 1.5"/>',
  // Bus frontal con ventanas y ruedas
  'Transporte':  '<rect x="4" y="3" width="16" height="14" rx="2"/><line x1="4" y1="9" x2="20" y2="9"/><rect x="6" y="11" width="3.5" height="3" rx=".5"/><rect x="14.5" y="11" width="3.5" height="3" rx=".5"/><circle cx="8" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/>',
  // Portapapeles con check — formulario inscrito
  'Inscripción': '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/><polyline points="9 13 11 15 15 11"/>',
  // Etiqueta de precio con símbolo % adentro
  'Descuento':   '<path d="M20 12L12 20a2 2 0 01-2.83 0l-6.59-6.59A2 2 0 012 12V4a2 2 0 012-2h8a2 2 0 011.41.59L20 9.17a2 2 0 010 2.83z"/><circle cx="7" cy="7" r="1"/><line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/><circle cx="10" cy="14" r=".4"/><circle cx="14" cy="10" r=".4"/>',
  // Carnet de acceso con foto + líneas (ID-card)
  'Pase':        '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.5-1.5 1.5-2.5 3-2.5s2.5 1 3 2.5"/><line x1="14" y1="10" x2="19" y2="10"/><line x1="14" y1="13" x2="18" y2="13"/>',
  // Billete con moneda central y puntos en esquinas
  'Dinero':      '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><circle cx="6" cy="12" r=".7"/><circle cx="18" cy="12" r=".7"/>'
};

/* Helper: devuelve la categoría primaria (1er incentivo) con fallback. */
window.getProgramCategory = function(p){
  return (p && p.incentives && p.incentives[0] && p.incentives[0].category) || 'Beca';
};

/* ══ Configuración de parametrización por programa ═══════════════════════
   Lo que define el formulario de 4 pasos y que el perfil del programa debe mostrar:
   población (roles, cobertura, municipios, selección), recurrencia, documentos,
   etapas y, por tipo de incentivo, cómo se valora y si lleva códigos.
   Los programas creados desde el formulario la guardan en p.config; los de demo la traen de aquí. */
(function(){
  var FREQ = { mensual: 'mensual', bimestral: 'bimestral', trimestral: 'trimestral', semestral: 'semestral' };
  var G_ORO = { op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro'] }] };
  var DOC_ID = { name: 'Documento de identidad', oblig: true };
  var CFG = {
    'PRG-2026-001': {
      gestores: ['Laura Meza'], eventos: ['Juegos Nacionales 2025'], desde: '2026-01-01', hasta: '2026-12-31',
      roles: ['Deportista'], cobertura: ['Nacional'], municipios: [], seleccion: ['plataforma'],
      rec: { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Certificado de resultado', oblig: true }, { name: 'Certificación bancaria', oblig: true }] },
      crono: { gracia: '3', carga: { ini: '15', fin: '18' }, revision: { ini: '20', fin: '25' }, asignacion: { ini: '25', fin: '30' } },
      inc: [{ categoria: 'beca', tope: 'top', unit: 1000000, valor: 200000000, cantidad: 200, codigos: true,
        grupos: [{ op: 'AND', rows: [{ f: 'edad', op: '≥', v: '18' }, { f: 'categoria', op: '=', v: 'Prejuvenil' }] }, { op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }] }]
    },
    'PRG-2026-002': {
      gestores: ['Laura Meza'], eventos: ['Liga Departamental Atlántico 2026'], desde: '2026-03-01', hasta: '2026-04-30',
      roles: ['Deportista'], cobertura: ['Atlántico'], municipios: ['Barranquilla · Atlántico', 'Soledad · Atlántico'], seleccion: ['plataforma'],
      rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: false, list: [] }, crono: {},
      inc: [{ categoria: 'kit', tope: 'bottom', unit: 350000, valor: 105000000, cantidad: 300, codigos: true,
        grupos: [{ op: 'AND', rows: [{ f: 'categoria', op: '=', v: 'Juvenil' }, { f: 'edad', op: '≤', v: '21' }] }] }]
    },
    'PRG-2026-003': {
      gestores: ['Isa Pabon'], eventos: ['Juegos Intercolegiados 2026'], desde: '2026-02-15', hasta: '2026-06-30',
      roles: ['Deportista'], cobertura: ['Cundinamarca'], municipios: ['Soacha · Cundinamarca', 'Chía · Cundinamarca'], seleccion: ['plataforma', 'manual'],
      rec: { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Autorización del acudiente', oblig: true }] },
      crono: { gracia: '', carga: { ini: '1', fin: '5' }, revision: { ini: '1', fin: '10' }, asignacion: { ini: '1', fin: '20' } },
      inc: [{ categoria: 'bono', tope: 'bottom', unit: 120000, valor: 72000000, cantidad: 600, codigos: true,
        grupos: [{ op: 'AND', rows: [{ f: 'categoria', op: '=', v: 'Prejuvenil' }, { f: 'edad', op: '≥', v: '13' }, { f: 'edad', op: '≤', v: '17' }] }] }]
    },
    'PRG-2026-004': {
      gestores: ['Andrés Polo'], eventos: ['Juegos Universitarios 2026'], desde: '2026-03-01', hasta: '2026-05-31',
      roles: ['Deportista'], cobertura: ['Nacional'], municipios: [], seleccion: ['plataforma'],
      rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Certificado de estudio', oblig: true }] },
      crono: { gracia: '3', carga: { ini: '2026-03-01T08:00', fin: '2026-03-20T18:00' }, revision: { ini: '2026-03-21T08:00', fin: '2026-03-28T18:00' }, asignacion: { ini: '2026-03-29T08:00', fin: '2026-04-15T18:00' } },
      inc: [{ categoria: 'inscripcion', tope: 'bottom', codigos: true, grupos: [{ op: 'AND', rows: [{ f: 'escolaridad', op: '=', v: 'Escolarizado' }] }] }]
    },
    'PRG-2026-006': {
      gestores: ['Isa Pabon', 'Laura Meza'], eventos: ['Juegos Nacionales 2026'], desde: '2026-07-15', hasta: '',
      roles: ['Deportista', 'Entrenador'], cobertura: ['Antioquia', 'Valle del Cauca'], municipios: ['Medellín · Antioquia', 'Cali · Valle del Cauca'], seleccion: ['plataforma', 'manual'],
      rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Certificado de resultado', oblig: true }, { name: 'Certificado de estudio', oblig: false }] },
      crono: { gracia: '4', carga: { ini: '2026-07-15T08:00', fin: '2026-11-30T18:00' }, revision: { ini: '2026-07-20T08:00', fin: '2026-12-10T18:00' }, asignacion: { ini: '2026-07-25T08:00', fin: '2026-12-15T18:00' } },
      activacion: '2026-07-15',
      inc: [
        { categoria: 'kit', tope: 'sin', unit: 450000, valor: 0, cantidad: 120, codigos: true, rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '', hasta: '' }, pobOff: { roles: [], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }] },
        { categoria: 'beca', tope: 'sin', unit: 1200000, valor: 0, cantidad: 60, codigos: true, rec: { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '2026-07-15', hasta: '' }, pobOff: { roles: ['Entrenador'], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'medallas', op: '>', v: '3' }] }, { op: 'AND', rows: [{ f: 'medallasOro', op: 'max', v: '' }] }] },
        { categoria: 'diploma', tope: 'sin', unit: 0, valor: 0, cantidad: 0, codigos: false, rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '', hasta: '' }, pobOff: { roles: ['Deportista'], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'participaciones', op: '≥', v: '1' }] }] }
      ]
    },
    'PRG-2026-005': {
      gestores: ['Andrés Polo'], eventos: ['Proyección Panamericanos 2027'], desde: '', hasta: '',
      roles: ['Deportista', 'Entrenador'], cobertura: ['Nacional'], municipios: [], seleccion: ['plataforma'],
      rec: { on: true, frecuencia: 'trimestral', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Certificación bancaria', oblig: true }, { name: 'Certificado médico', oblig: true }] },
      crono: { gracia: '', carga: { ini: '1', fin: '' }, revision: { ini: '', fin: '' }, asignacion: { ini: '', fin: '' } },
      inc: [{ categoria: 'beca', tope: 'sin', unit: 5000000, codigos: false, grupos: [G_ORO] }]
    }
  };
  var CAT_KEY = { 'Beca': 'beca', 'Kit': 'kit', 'Bono': 'bono', 'Transporte': 'transporte', 'Inscripción': 'inscripcion', 'Descuento': 'descuento', 'Pase': 'pase', 'Dinero': 'dinero' };
  function defaults(p) {
    return {
      gestores: [p.responsible].filter(Boolean), eventos: p.event && p.event !== '—' ? [p.event] : [], desde: '', hasta: '',
      roles: ['Deportista'], cobertura: [p.coverage && p.coverage !== '—' ? p.coverage : 'Nacional'], municipios: [], seleccion: ['plataforma'],
      rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' }, doc: { req: false, list: [] }, crono: {},
      inc: (p.incentives || []).map(function (i) { return { categoria: CAT_KEY[i.category] || '', tope: 'bottom', unit: i.value || 0, valor: 0, cantidad: 0, codigos: (p.codes && p.codes.total > 0), grupos: [] }; })
    };
  }
  function emptyFase() { return { ini: '', fin: '' }; }
  /* Configuración completa (con todos los campos) de un programa */
  window.getProgramConfig = function (p) {
    var base = p.config || CFG[p.id] || defaults(p), d = defaults(p);
    var c = {
      gestores: base.gestores || d.gestores, eventos: base.eventos || d.eventos, desde: base.desde || '', hasta: base.hasta || '',
      roles: base.roles || d.roles, cobertura: base.cobertura || d.cobertura, municipios: base.municipios || [], seleccion: base.seleccion || ['plataforma'],
      rec: Object.assign({ on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' }, base.rec || {}),
      doc: { req: !!(base.doc && base.doc.req), list: (base.doc && base.doc.list) || [] },
      inc: base.inc || d.inc
    };
    var cr = base.crono || {};
    c.crono = { gracia: cr.gracia == null ? '' : cr.gracia, carga: cr.carga || emptyFase(), revision: cr.revision || emptyFase(), asignacion: cr.asignacion || emptyFase() };
    return c;
  };
  window.progRecTxt = function (c) {
    if (!c.rec.on) return 'Entrega única';
    return 'Recurrente · ' + (c.rec.frecuencia === 'otra' ? 'cada ' + (c.rec.frecuenciaN || '?') + ' ' + (c.rec.frecuenciaU || 'meses') : (FREQ[c.rec.frecuencia] || c.rec.frecuencia));
  };
  window.progDocsOn = function (c) { return !!(c.rec.on || c.doc.req); };

  /* ── Persistencia de los programas creados / editados desde el formulario ── */
  var K_CREATED = 'naowee:programs-created', K_EDITS = 'naowee:programs-edits';
  /* Revisión de los datos de demo: una edición guardada contra otra revisión (datos viejos) se descarta, para que los cambios al demo se vean */
  var BASE_REV = 'demo-2026-10-19b';
  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (_) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  window.persistCreatedProgram = function (prog) {
    var list = read(K_CREATED, []).filter(function (x) { return x.id !== prog.id; }); list.unshift(prog); write(K_CREATED, list);
    var i = window.PROGRAMS_DATA.findIndex(function (x) { return x.id === prog.id; });
    if (i > -1) window.PROGRAMS_DATA[i] = prog; else window.PROGRAMS_DATA.unshift(prog);
  };
  window.persistProgramEdit = function (id, prog) {
    var created = read(K_CREATED, []);
    if (created.some(function (x) { return x.id === id; })) { window.persistCreatedProgram(prog); return; }
    prog._base = BASE_REV;
    var ed = read(K_EDITS, {}); ed[id] = prog; write(K_EDITS, ed);
    var i = window.PROGRAMS_DATA.findIndex(function (x) { return x.id === id; });
    if (i > -1) window.PROGRAMS_DATA[i] = prog;
  };
  window.nextProgramId = function () {
    var taken = {}; window.PROGRAMS_DATA.forEach(function (p) { taken[p.id] = 1; });
    var n = window.PROGRAMS_DATA.length + 1, id = 'PRG-2026-' + String(n).padStart(3, '0');
    while (taken[id]) { n++; id = 'PRG-2026-' + String(n).padStart(3, '0'); }
    return id;
  };
  (function load() {
    var ed = read(K_EDITS, {});
    window.PROGRAMS_DATA.forEach(function (p, i) { if (ed[p.id] && ed[p.id]._base === BASE_REV) window.PROGRAMS_DATA[i] = ed[p.id]; });
    read(K_CREATED, []).slice().reverse().forEach(function (p) { if (!window.PROGRAMS_DATA.some(function (x) { return x.id === p.id; })) window.PROGRAMS_DATA.unshift(p); });
  })();
  /* Programas visibles según el rol: el Gestor de programa solo ve los suyos. */
  window.scopedPrograms = function () {
    var role = ''; try { role = localStorage.getItem('naowee-incentivos-role') || ''; } catch (e) {}
    if (role !== 'programa') return window.PROGRAMS_DATA;
    return window.PROGRAMS_DATA.filter(function (p) {
      if (p.id === 'PRG-2026-003') return true;
      try { return window.getProgramConfig(p).gestores.indexOf('Isa Pabon') > -1; } catch (e) { return false; }
    });
  };
  /* ── Revisión documental (demo) ──
     La revisión es por PERFIL de beneficiario: cada documento se aprueba o rechaza (con nota) y el perfil se resuelve solo:
     · todos los requeridos aprobados → apr (Aprobados: pasa a asignación, "Pendiente de entrega" para el Operador)
     · algún documento rechazado → sub (Rechazados · Pendiente subsanación); si vence el plazo → exp
     · ninguno cargado → porcargar · en otro caso → pend (En revisión). */
  var K_REV = 'naowee:doc-reviews', K_AUD = 'naowee:doc-reviews-audit';
  var REV_PEOPLE = ['Ana García', 'Pedro Martínez', 'Andrés García', 'María C. Herrera', 'Camila Ríos', 'Santiago López', 'Valentina Pérez', 'Juan Rodríguez', 'Diana Torres', 'Carlos Guzmán', 'Natalia Ruiz', 'Esteban Mora'];
  var REV_SEED = ['pend', 'pend', 'apr', 'pend', 'apr', 'sub', 'sub', 'pend', 'exp', 'pend', 'apr', 'porcargar'];
  var REV_SEED_DATE = { 5: '2026-10-15', 6: '2026-10-08', 8: '2026-09-28' };
  var REV_MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  /* Festivos de Colombia 2026 (para contar días hábiles del plazo de gracia) */
  var FESTIVOS = ['2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25'];
  function isoD(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fmtD(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); if (!m) return '';
    return parseInt(m[3], 10) + ' ' + REV_MES[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }
  function habiles(iso, n) {
    var d = new Date(iso + 'T12:00:00');
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 && FESTIVOS.indexOf(isoD(d)) < 0) n--; }
    return isoD(d);
  }
  /* Plazo para subsanar: la ventana regular de carga si sigue abierta; si no, el plazo de gracia (días hábiles) desde el rechazo. */
  function plazoSubsanar(decIso, c) {
    var gr = parseInt(c.crono.gracia, 10); if (!(gr >= 3 && gr <= 5)) gr = 3;
    var lim = habiles(decIso, gr), fin = ((c.crono.carga || {}).fin || '').slice(0, 10);
    if (/^\d{4}-/.test(fin) && fin > lim) lim = fin;
    return lim;
  }
  function slug(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''); }
  window.docReviews = function () {
    var dec = read(K_REV, {}), aud = read(K_AUD, {}), out = [], hoy = isoD(new Date());
    window.scopedPrograms().forEach(function (p) {
      var c; try { c = window.getProgramConfig(p); } catch (e) { return; }
      if (!window.progDocsOn(c) || !c.doc.list.length || p.status === 'draft') return;
      var cierre = fmtD((c.crono.revision || {}).fin);
      for (var i = 0; i < REV_PEOPLE.length; i++) {
        var id = p.id + '-R' + (i + 1), seed = REV_SEED[i], d = (dec[id] || {}).docs || {}, audit = (aud[id] || []).slice();
        if (p.status !== 'active' && seed === 'pend') seed = 'exp';
        var sdate = REV_SEED_DATE[i] || '';
        var docs = c.doc.list.map(function (x, k) {
          var falta = seed === 'porcargar' || (!x.oblig && (i + k) % 3 === 0), est = 'porcargar', nota = '', iso = '';
          if (!falta) {
            est = 'revision';
            if (seed === 'apr') { est = 'aprobado'; iso = '2026-10-1' + (i % 8); }
            else if (seed === 'pend' && k === 0 && i % 4 === 1) { est = 'aprobado'; iso = '2026-10-14'; }
            else if ((seed === 'sub' || seed === 'exp') && sdate) {
              if (k === 0) { est = 'rechazado'; iso = sdate; nota = 'La imagen no permite validar los datos: baja calidad y poca iluminación.'; }
              else { est = 'aprobado'; iso = sdate; }
            }
          }
          if (d[x.name]) { est = d[x.name].estado; nota = d[x.name].nota || ''; iso = d[x.name].iso || iso; }
          return { name: x.name, oblig: !!x.oblig, file: falta ? '' : slug(x.name) + '-' + (i + 1) + '.pdf', estado: est, nota: nota, iso: iso, fecha: fmtD(iso) };
        });
        if (!audit.length) {
          docs.forEach(function (x) {
            if (x.estado === 'aprobado' || x.estado === 'rechazado') audit.push({ doc: x.name, usuario: 'Isa Pabon', rol: 'Gestor de programa', fecha: fmtD(x.iso), hora: '10:' + String(10 + i).padStart(2, '0'), dictamen: x.estado === 'aprobado' ? 'Aprobado' : 'Rechazado', motivo: x.nota });
          });
        }
        var cnt = docs.filter(function (x) { return x.oblig || x.file; });
        var apr = cnt.filter(function (x) { return x.estado === 'aprobado'; }).length;
        var rej = docs.filter(function (x) { return x.estado === 'rechazado'; });
        var est = 'pend', limite = '';
        if (rej.length) {
          var last = rej.map(function (x) { return x.iso; }).sort().pop();
          limite = plazoSubsanar(last, c); est = limite < hoy ? 'exp' : 'sub';
        } else if (apr === cnt.length) est = 'apr';
        else if (!docs.some(function (x) { return x.file; })) est = 'porcargar';
        var lastA = audit[audit.length - 1];
        out.push({
          id: id, prog: p.id, progName: p.name, persona: REV_PEOPLE[i], tipo: i % 3 === 2 ? 'TI' : 'CC',
          cc: String(1020000000 + (i + 1) * 7391 + p.id.length * 13).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
          nac: fmtD((2003 + (i % 5)) + '-0' + (1 + (i % 9)) + '-' + (10 + i)),
          solicitud: '#SUID 2026 • ' + String(45 + i * 3).padStart(3, '0'),
          cargado: (3 + i) + ' oct 2026', hora: String(8 + (i * 5) % 11).padStart(2, '0') + ':' + String((i * 17) % 60).padStart(2, '0'), cierre: cierre,
          estado: est, total: cnt.length, aprobados: apr, limite: fmtD(limite), docs: docs, audit: audit,
          ultima: lastA ? lastA.fecha + ' ' + lastA.hora : (3 + i) + ' oct 2026 ' + String(8 + (i * 5) % 11).padStart(2, '0') + ':' + String((i * 17) % 60).padStart(2, '0'),
          ultimaPor: lastA ? lastA.usuario : REV_PEOPLE[i]
        });
      }
    });
    return out;
  };
  /* Guarda el dictamen de UN aprobador (basta uno) por documento y registra la auditoría. */
  window.saveDocDecision = function (id, docName, estado, nota, who) {
    var dec = read(K_REV, {}), aud = read(K_AUD, {}), n = new Date();
    var cur = window.docReviews().filter(function (r) { return r.id === id; })[0];
    dec[id] = dec[id] || { docs: {} };
    dec[id].docs[docName] = { estado: estado, nota: nota || '', iso: isoD(n) };
    write(K_REV, dec);
    if (!aud[id]) aud[id] = (cur && cur.audit || []).slice();
    aud[id].push({
      doc: docName, usuario: (who && who.name) || '', rol: (who && who.role) || '',
      fecha: fmtD(isoD(n)), hora: String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'),
      dictamen: estado === 'aprobado' ? 'Aprobado' : 'Rechazado', motivo: nota || ''
    });
    write(K_AUD, aud);
  };
  window.pendingReviewCount = function () {
    return window.docReviews().filter(function (r) { return r.estado === 'pend'; }).length;
  };
})();
