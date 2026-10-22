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
    id: 'PRG-2026-007',
    name: 'Estímulos mensuales medallistas Atlántico',
    shortDesc: 'Medallistas · Atlántico',
    longDesc: 'Beca y bono de transporte mensuales (recurrentes, sin documentos) y kit de entrenamiento de entrega única con cargue documental por ventanas, para medallistas de la Liga Departamental del Atlántico.',
    iconBg: '#eef5ff',
    iconColor: '#1f78d1',
    status: 'active',
    event: 'Liga Departamental Atlántico 2026',
    coverage: 'Atlántico',
    responsible: 'Isa Pabon, Laura Meza',
    rubro: 90000000,
    exec: 41500000,
    unit: 600000,
    codes: { total: 120, avail: 66, asig: 49, rev: 5 },
    from: '04 may 2026',
    to: '30 sep 2026',
    actoAdmin: 'Resolución 2026-ATL-012',
    fuente: 'Gobernación del Atlántico + Mindeporte · 2026',
    incentives: [
      { name: 'Beca mensual · Medallistas', category: 'Beca',
        detail: 'Entrega mensual durante la vigencia · 60 cupos',
        value: 600000, valueLabel: '$600.000', valueFoot: 'por mes',
        badges: [{ text: 'Beca', variant: 'informative' }, { text: 'Recurrente', variant: 'caution' }] },
      { name: 'Bono de transporte · Medallistas', category: 'Transporte',
        detail: 'Entrega mensual para desplazamientos a entrenamientos',
        value: 150000, valueLabel: '$150.000', valueFoot: 'por mes',
        badges: [{ text: 'Transporte', variant: 'neutral' }, { text: 'Recurrente', variant: 'caution' }] },
      { name: 'Kit de entrenamiento · Medallistas', category: 'Kit',
        detail: 'Entrega única de implementos, con documentos · 60 cupos',
        value: 350000, valueLabel: '$350.000', valueFoot: 'por kit',
        badges: [{ text: 'Kit', variant: 'caution' }, { text: 'Entrega única', variant: 'neutral' }] }
    ],
    conditions: {
      groups: [
        { logic: 'AND', rules: [
          { field: 'Logro', op: '∈', value: 'Medalla de oro, Medalla de plata' }
        ]}
      ],
      summary: 'Aplica para <strong>medallistas de oro y plata</strong> de la Liga Departamental del Atlántico.'
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
    codes: { total: 175, avail: 71, asig: 100, rev: 4 },
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
    'PRG-2026-007': {
      gestores: ['Isa Pabon', 'Laura Meza'], eventos: ['Liga Departamental Atlántico 2026'], desde: '2026-05-04', hasta: '2026-09-30',
      roles: ['Deportista'], cobertura: ['Atlántico'], municipios: [], seleccion: ['plataforma'],
      rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses' },
      doc: { req: true, list: [DOC_ID, { name: 'Certificado de resultado', oblig: true }] },
      crono: { gracia: '3', carga: { ini: '2026-05-04T08:00', fin: '2026-05-29T18:00' }, revision: { ini: '2026-05-30T08:00', fin: '2026-06-12T18:00' }, asignacion: { ini: '2026-06-13T08:00', fin: '2026-09-15T18:00' } },
      inc: [
        { categoria: 'beca', tope: 'sin', unit: 600000, valor: 0, cantidad: 60, codigos: true, rec: { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '2026-05-18', hasta: '2026-08-31' }, pobOff: { roles: [], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }] },
        { categoria: 'transporte', tope: 'sin', unit: 150000, valor: 0, cantidad: 0, codigos: false, rec: { on: true, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '2026-06-01', hasta: '2026-09-15' }, pobOff: { roles: [], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }] },
        { categoria: 'kit', tope: 'sin', unit: 350000, valor: 0, cantidad: 60, codigos: true, rec: { on: false, frecuencia: 'mensual', frecuenciaN: '', frecuenciaU: 'meses', desde: '', hasta: '' }, pobOff: { roles: [], cobertura: [], municipios: [] },
          grupos: [{ op: 'AND', rows: [{ f: 'logro', op: '∈', v: ['Medalla de oro', 'Medalla de plata'] }] }] }
      ]
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
  var BASE_REV = 'demo-2026-10-20d';
  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (_) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  window.persistCreatedProgram = function (prog) {
    var list = read(K_CREATED, []).filter(function (x) { return x.id !== prog.id; }); list.unshift(unoverlay(prog)); write(K_CREATED, list);
    var i = window.PROGRAMS_DATA.findIndex(function (x) { return x.id === prog.id; });
    if (i > -1) window.PROGRAMS_DATA[i] = prog; else window.PROGRAMS_DATA.unshift(prog);
  };
  window.persistProgramEdit = function (id, prog) {
    var created = read(K_CREATED, []);
    if (created.some(function (x) { return x.id === id; })) { window.persistCreatedProgram(prog); return; }
    prog._base = BASE_REV;
    var ed = read(K_EDITS, {}); ed[id] = unoverlay(prog); write(K_EDITS, ed);
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
     · todos los requeridos aprobados → apr (Aprobados: pasa a asignación, "Por asignar" para el Operador)
     · algún documento rechazado → sub (Rechazados · Pendiente de subsanación); si vence el plazo → exp
     · ninguno cargado → porcargar · en otro caso → pend (En revisión). */
  var K_REV = 'naowee:doc-reviews', K_AUD = 'naowee:doc-reviews-audit';
  var REV_PEOPLE = ['Ana García', 'Pedro Martínez', 'Andrés García', 'María C. Herrera', 'Camila Ríos', 'Santiago López', 'Valentina Pérez', 'Juan Rodríguez', 'Diana Torres', 'Carlos Guzmán', 'Natalia Ruiz', 'Esteban Mora'];
  var REV_SEED = ['pend', 'pend', 'apr', 'pend', 'apr', 'sub', 'sub', 'pend', 'exp', 'porcargar', 'apr', 'porcargar'];
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
  /* ── Habilitación excepcional: personas autorizadas a participar fuera de las reglas normales ── */
  var K_EXC = 'naowee:exceptions', K_UP = 'naowee:doc-uploads';
  window.EXC_CATALOG = [
    ['Mariana Pajón', 'CC', '1.020.331.045'], ['Sofía Ramírez', 'TI', '1.104.552.310'], ['Tomás Herrera', 'TI', '1.099.771.208'], ['Laura Bermúdez', 'CC', '1.032.664.917'],
    ['Daniel Castaño', 'CC', '1.017.445.882'], ['Valeria Ospina', 'TI', '1.108.220.563'], ['Samuel Quintero', 'CC', '1.026.917.340'], ['Isabela Cortés', 'TI', '1.101.886.472'],
    ['Julián Arango', 'CC', '1.036.502.719'], ['Camila Duarte', 'CC', '1.023.774.106'], ['Mateo Londoño', 'TI', '1.105.338.924'], ['Antonella Rojas', 'TI', '1.097.640.251'],
    ['Nicolás Zapata', 'CC', '1.039.118.675'], ['Paula Giraldo', 'CC', '1.028.455.390']
  ];
  window.getExceptionsAll = function (pid) { return read(K_EXC, {})[pid] || []; };
  window.getExceptions = function (pid) { return window.getExceptionsAll(pid).filter(function (x) { return !x.quitado; }); };
  /* Retira a una persona registrada (queda en la auditoría; no se borra) */
  window.removeException = function (pid, id, motivo, who) {
    var e = read(K_EXC, {}), n = new Date(), pad = function (v) { return String(v).padStart(2, '0'); };
    (e[pid] || []).forEach(function (x) { if (x.id === id) x.quitado = { motivo: motivo, usuario: who.name, rol: who.role, fecha: n.getDate() + ' ' + REV_MES[n.getMonth()] + ' ' + n.getFullYear(), hora: pad(n.getHours()) + ':' + pad(n.getMinutes()) }; });
    write(K_EXC, e);
  };
  window.addExceptions = function (pid, list) { var e = read(K_EXC, {}); e[pid] = (e[pid] || []).concat(list); write(K_EXC, e); };
  window.simulateUpload = function (id) { var u = read(K_UP, {}); u[id] = true; write(K_UP, u); };
  /* Documentos que le aplican a un tipo de incentivo (un tipo recurrente por sí mismo en un programa no recurrente está exento) */
  window.docsForType = function (c, idx) {
    var ci = c.inc[idx] || {};
    if (!c.rec.on && ci.rec && ci.rec.on) return [];
    return c.doc.list.filter(function (d) { return (ci.docOff || []).indexOf(d.name) < 0; });
  };
  /* Ventana de cargue del programa hoy: abierta o cerrada, con el texto largo y uno corto. Si la persona fue habilitada con las fechas eximidas, se le muestra el cargue habilitado (sin hablar de «excepción»). */
  window.ventanaCargue = function (c, exencionFechas) {
    var f = c.crono.carga || {}, now = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
    if (exencionFechas) return { abierta: true, txt: 'Tu cargue está habilitado: puedes subir tus documentos.', corto: 'Cargue habilitado' };
    if (!f.ini && !f.fin) return { abierta: true, txt: 'Puedes cargar tus documentos mientras el programa esté activo.', corto: '' };
    if (c.rec.on || /^\d{1,2}$/.test(f.ini || f.fin || '')) {
      var A = +f.ini || 1, B = +f.fin || 31, d = now.getDate();
      if (d >= A && d <= B) return { abierta: true, txt: 'Ventana de cargue abierta: del día ' + A + ' al ' + B + ' de cada mes.', corto: 'Abierta del día ' + A + ' al ' + B };
      return { abierta: false, txt: d < A ? 'La ventana de cargue abre el día ' + A + ' (hasta el ' + B + ').' : 'La ventana de este mes cerró el día ' + B + '. Vuelve a abrir el día ' + A + ' del próximo mes.',
        corto: d < A ? 'Abre el día ' + A : 'Cerró el día ' + B + ' · abre el día ' + A };
    }
    var t = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    if (f.ini && t < f.ini) return { abierta: false, txt: 'La ventana de cargue abre el ' + fmtD(f.ini) + '.', corto: 'Abre el ' + fmtD(f.ini) };
    if (f.fin && t > f.fin) return { abierta: false, txt: 'La ventana de cargue cerró el ' + fmtD(f.fin) + '.', corto: 'Cerró el ' + fmtD(f.fin) };
    return { abierta: true, txt: f.fin ? 'Ventana de cargue abierta hasta el ' + fmtD(f.fin) + '.' : 'Ventana de cargue abierta.', corto: f.fin ? 'Abierta hasta el ' + fmtD(f.fin) : 'Abierta' };
  };
  window.docReviews = function () {
    var dec = read(K_REV, {}), aud = read(K_AUD, {}), out = [], hoy = isoD(new Date());
    window.scopedPrograms().forEach(function (p) {
      var c; try { c = window.getProgramConfig(p); } catch (e) { return; }
      if (p.status === 'draft') return;
      var docsOn = !!(window.progDocsOn(c) && c.doc.list.length);   // sin documentos: solo los registrados a mano / habilitados por excepción
      var cierre = fmtD((c.crono.revision || {}).fin);
      for (var i = 0; docsOn && i < REV_PEOPLE.length; i++) {
        var id = p.id + '-R' + (i + 1), seed = REV_SEED[i], d = (dec[id] || {}).docs || {}, audit = (aud[id] || []).slice();
        if (p.status !== 'active' && seed === 'pend') seed = 'exp';
        if (p._userCreated) seed = 'porcargar';   // un programa recién creado: las personas identificadas aún no cargan documentos
        var upl0 = !!read(K_UP, {})[id];
        var sdate = REV_SEED_DATE[i] || '';
        var docs = c.doc.list.map(function (x, k) {
          var falta = (seed === 'porcargar' && !upl0) || (seed !== 'porcargar' && !x.oblig && (i + k) % 3 === 0), est = 'porcargar', nota = '', iso = '';
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
          var subido = d[x.name] && d[x.name].file;   // archivo cargado por el deportista
          return { name: x.name, oblig: !!x.oblig, file: subido ? subido : (falta ? '' : slug(x.name) + '-' + (i + 1) + '.pdf'), estado: est, nota: nota, iso: iso, fecha: fmtD(iso) };
        });
        if (!audit.length) {
          docs.forEach(function (x) {
            if (x.estado === 'aprobado' || x.estado === 'rechazado') audit.push({ doc: x.name, usuario: 'Isa Pabon', rol: 'Gestor de programa', fecha: fmtD(x.iso), hora: '10:' + String(10 + i).padStart(2, '0'), dictamen: x.estado === 'aprobado' ? 'Aprobado' : 'Rechazado', motivo: x.nota });
          });
        }
        var lc = audit.filter(function (a) { return a.dictamen === 'Cargue'; }).pop();   // último cargue real del deportista
        var ccS = String(1020000000 + (i + 1) * 7391 + p.id.length * 13).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (window.getExceptions(p.id).some(function (x) { return x.doc === ccS; })) continue;   // cargada como excepcional: su expediente de excepción reemplaza a este
        if (!docs.some(function (x) { return x.file; }) && (p.status !== 'active' || !window.checkEligibility(p, REV_PEOPLE[i], ccS).ok)) continue;   // sin archivos: solo si el programa está activo y le aplica
        var cnt = docs.filter(function (x) { return x.oblig || x.file; });
        var apr = cnt.filter(function (x) { return x.estado === 'aprobado'; }).length;
        var rej = docs.filter(function (x) { return x.estado === 'rechazado'; });
        var est = 'pend', limite = '';
        if (rej.length) {
          var last = rej.map(function (x) { return x.iso; }).sort().pop();
          limite = plazoSubsanar(last, c); est = limite < hoy ? 'exp' : 'sub';
        } else if (apr === cnt.length) est = 'apr';
        else if (!docs.some(function (x) { return x.file; }) || docs.some(function (x) { return x.oblig && !x.file; })) est = window.ventanaCargue(c, false).abierta ? 'porcargar' : 'exp';
        var lastA = audit[audit.length - 1];
        out.push({
          id: id, prog: p.id, progName: p.name, persona: REV_PEOPLE[i], tipo: i % 3 === 2 ? 'TI' : 'CC',
          cc: String(1020000000 + (i + 1) * 7391 + p.id.length * 13).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
          nac: fmtD((2003 + (i % 5)) + '-0' + (1 + (i % 9)) + '-' + (10 + i)),
          solicitud: '#SUID 2026 • ' + String(45 + i * 3).padStart(3, '0'),
          cargado: (lc ? lc.fecha : (3 + i) + ' oct 2026'), hora: (lc ? lc.hora : String(8 + (i * 5) % 11).padStart(2, '0') + ':' + String((i * 17) % 60).padStart(2, '0')), cierre: cierre,
          estado: est, total: cnt.length, aprobados: apr, limite: fmtD(limite), docs: docs, audit: audit,
          ultima: lastA ? lastA.fecha + ' ' + lastA.hora : (3 + i) + ' oct 2026 ' + String(8 + (i * 5) % 11).padStart(2, '0') + ':' + String((i * 17) % 60).padStart(2, '0'),
          ultimaPor: lastA ? lastA.usuario : REV_PEOPLE[i]
        });
      }
      if (!docsOn && p.status === 'active' && (c.seleccion || []).indexOf('plataforma') > -1) {
        REV_PEOPLE.forEach(function (name, i) {
          out.push({ id: p.id + '-P' + (i + 1), prog: p.id, progName: p.name, persona: name, tipo: i % 3 === 2 ? 'TI' : 'CC',
            cc: String(1020000000 + (i + 1) * 7391 + p.id.length * 13).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), nac: '—', solicitud: 'Identificado por la plataforma',
            cargado: '—', hora: '', cierre: '', estado: 'apr', total: 0, aprobados: 0, limite: '', docs: [], audit: [], ultima: '—', ultimaPor: 'Plataforma', sinDocs: true, plataforma: true });
        });
      }
      window.getExceptions(p.id).forEach(function (x) {
        var id = p.id + '-X' + x.id, dd = ((dec[id] || {}).docs) || {}, audit = (aud[id] || []).slice(), upl = !!read(K_UP, {})[id];
        var docs = (docsOn ? window.docsForType(c, x.tipo || 0) : []).map(function (dc) {
          var est = upl ? 'revision' : 'porcargar', nota = '', iso = '';
          if (dd[dc.name]) { est = dd[dc.name].estado; nota = dd[dc.name].nota || ''; iso = dd[dc.name].iso || ''; }
          return { name: dc.name, oblig: !!dc.oblig, file: (dd[dc.name] && dd[dc.name].file) || ((upl || dd[dc.name]) ? slug(dc.name) + '-' + x.id + '.pdf' : ''), estado: est, nota: nota, iso: iso, fecha: fmtD(iso) };
        });
        var lbl = x.origen === 'manual' ? 'Registrado manualmente' : 'Habilitado por excepción';
        if (!audit.some(function (a) { return a.dictamen === lbl; })) audit.unshift({ doc: x.origen === 'manual' ? 'Registro manual' : 'Habilitación excepcional', usuario: x.usuario, rol: x.rol, fecha: x.fecha, hora: x.hora, dictamen: lbl, motivo: x.just || '' });
        var cnt = docs.filter(function (z) { return z.oblig || z.file; });
        var apr = cnt.filter(function (z) { return z.estado === 'aprobado'; }).length, rej = docs.filter(function (z) { return z.estado === 'rechazado'; });
        var est = 'pend', limite = '';
        if (rej.length) { limite = plazoSubsanar(rej.map(function (z) { return z.iso; }).sort().pop(), c); est = limite < hoy ? 'exp' : 'sub'; }
        else if (apr === cnt.length) est = 'apr';
        else if (!docs.some(function (z) { return z.file; }) || docs.some(function (z) { return z.oblig && !z.file; })) est = window.ventanaCargue(c, !!x.fechas).abierta ? 'porcargar' : 'exp';
        out.push({
          id: id, prog: p.id, progName: p.name, persona: x.persona, tipo: x.docTipo, cc: x.doc, nac: '—', solicitud: (x.origen === 'manual' ? 'Registro manual • ' : '#SUID 2026 • EXC-') + String(x.id).slice(-3),
          cargado: x.fecha, hora: x.hora, cierre: cierre, estado: est, total: cnt.length, aprobados: apr, limite: fmtD(limite), docs: docs, audit: audit,
          ultima: x.fecha + ' ' + x.hora, ultimaPor: x.usuario, excepcion: x, sinDocs: !docsOn
        });
      });
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
  /* ── Cargue del deportista ──
     El deportista deja sus archivos como borrador y los envía cuando está seguro. Al enviar, cada archivo queda en la auditoría (archivo, usuario, fecha y hora)
     y, si con eso completa TODOS los documentos obligatorios (o recarga los rechazados), la postulación pasa a «En revisión» y se avisa al Gestor de programa. */
  var K_NOT = 'naowee:notificaciones';
  function hhmm(n) { return String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'); }
  window.uploadAthleteDoc = function (id, docName, file, who) {
    var before = window.docReviews().filter(function (r) { return r.id === id; })[0];
    var dec = read(K_REV, {}), aud = read(K_AUD, {}), n = new Date(), hoy = isoD(n);
    dec[id] = dec[id] || { docs: {} }; dec[id].docs = dec[id].docs || {};
    dec[id].docs[docName] = { estado: 'revision', nota: '', iso: hoy, file: file };
    write(K_REV, dec);
    if (!aud[id]) aud[id] = (before && before.audit || []).slice();
    aud[id].push({ doc: docName, usuario: (who && who.name) || '', rol: 'Deportista', fecha: fmtD(hoy), hora: hhmm(n), dictamen: 'Cargue', archivo: file, motivo: '' });
    write(K_AUD, aud);
    var after = window.docReviews().filter(function (r) { return r.id === id; })[0];
    var entra = !!(after && after.estado === 'pend' && (!before || before.estado !== 'pend'));
    if (entra) {
      var nt = read(K_NOT, []);
      nt.unshift({ id: 'n' + n.getTime() + Math.random().toString(36).slice(2, 6), progId: after.prog, itemId: id, progName: after.progName, persona: after.persona,
        fecha: fmtD(hoy), hora: hhmm(n), leida: false, texto: 'Hay soportes pendientes de revisión' });
      write(K_NOT, nt.slice(0, 60));
    }
    return { estado: after && after.estado, enRevision: entra };
  };
  /* Envío del deportista: los archivos que dejó como borrador se registran juntos (auditoría y notificación incluidas). */
  window.submitAthleteDocs = function (id, docs, who) {
    var res = { estado: '', enRevision: false };
    docs.forEach(function (d) {
      var r = window.uploadAthleteDoc(id, d.name, d.file, who);
      res.estado = r.estado; res.enRevision = res.enRevision || r.enRevision;
    });
    return res;
  };
  /* Bandeja del Gestor de programa (y de los roles con alcance global): solo ve las de sus programas */
  /* Notificación de ejemplo (una sola vez): el aviso que recibe el gestor cuando un deportista completa sus documentos. */
  function sembrarNotificacion() {
    var K = 'naowee:notif-ejemplo';
    try { if (localStorage.getItem(K)) return; } catch (_) { return; }
    var r = window.docReviews().filter(function (x) { return x.estado === 'pend' && x.prog === 'PRG-2026-006'; })[0] || window.docReviews().filter(function (x) { return x.estado === 'pend'; })[0];
    if (!r) return;
    var nt = read(K_NOT, []), d = new Date();
    nt.unshift({ id: 'n-ejemplo', progId: r.prog, itemId: r.id, progName: r.progName, persona: r.persona, fecha: fmtD(isoD(d)), hora: '09:12', leida: false, texto: 'Hay soportes pendientes de revisión' });
    write(K_NOT, nt.slice(0, 60));
    try { localStorage.setItem(K, '1'); } catch (_) {}
  }
  window.getNotifications = function () {
    sembrarNotificacion();
    var ids = window.scopedPrograms().map(function (p) { return p.id; });
    return read(K_NOT, []).filter(function (x) { return ids.indexOf(x.progId) > -1; });
  };
  window.markNotificationsRead = function () { var l = read(K_NOT, []); l.forEach(function (x) { x.leida = true; }); write(K_NOT, l); };

  /* ── Motor de reglas (demo): ¿puede postularse esta persona a este programa? ──
     Primero mira si la persona fue cargada como excepcional (o registrada a mano) en el programa: se le asignó, así que le aparece sin validar nada más;
     si no, valida la población del programa
     y los condicionales: basta cumplir los de UN tipo de incentivo (dentro de cada tipo, basta uno de sus grupos). */
  var PERFIL_BASE = { edad: 19, genero: 'Femenino', depto: 'Antioquia', municipio: 'Medellín · Antioquia', zona: 'Urbana', rol: 'Deportista', disciplina: 'Atletismo', logro: 'Medalla de oro',
    etapa: 'Nacional', categoria: 'Prejuvenil', medallas: 6, medallasOro: 3, participaciones: 8, escolaridad: 'Escolarizado', grado: 'Once' };
  var PERFILES = {
    'Esteban Mora':   { edad: 17, genero: 'Masculino', logro: 'Medalla de bronce', categoria: 'Juvenil', medallas: 5, medallasOro: 0, participaciones: 6 },
    'Carlos Guzmán':  { edad: 16, genero: 'Masculino', depto: 'Atlántico', municipio: 'Barranquilla · Atlántico', logro: 'Participación', categoria: 'Juvenil', medallas: 1, medallasOro: 0, participaciones: 2 },
    'Santiago López': { depto: 'Valle del Cauca', municipio: 'Cali · Valle del Cauca', logro: 'Medalla de plata' }
  };
  var ETIQ = { edad: 'Edad', genero: 'Género', depto: 'Departamento', municipio: 'Municipio', zona: 'Zona', disciplina: 'Disciplina', logro: 'Logro', etapa: 'Etapa', categoria: 'Categoría', rol: 'Rol',
    medallas: 'Medallas ganadas', medallasOro: 'Medallas de oro', participaciones: 'Participaciones', escolaridad: 'Escolaridad', grado: 'Grado' };
  function evalFila(r, pf) {
    var val = pf[r.f], lbl = ETIQ[r.f] || r.f, v = r.v, num = Number(v), tiene = (r.f === 'edad') ? ' años' : '';
    function res(ok, msg) { return { ok: ok, msg: msg }; }
    switch (r.op) {
      case '≥': return res(Number(val) >= num, lbl + ': tienes ' + val + tiene + ' y se pide al menos ' + v + '.');
      case '≤': return res(Number(val) <= num, lbl + ': tienes ' + val + tiene + ' y se pide como máximo ' + v + '.');
      case '>': return res(Number(val) > num, lbl + ': tienes ' + val + tiene + ' y se piden más de ' + v + '.');
      case '≠': return res(String(val) !== String(v), lbl + ': no puede ser ' + v + '.');
      case '=': return res(String(val) === String(v), lbl + ': es ' + val + ' y se pide ' + v + '.');
      case '∈': return res((v || []).indexOf(val) > -1, lbl + ': es ' + val + ' y se pide ' + (v || []).join(' o ') + '.');
      case '∉': return res((v || []).indexOf(val) < 0, lbl + ': no puede ser ' + val + '.');
      case 'max': case 'top': return res(Number(val) >= 1, lbl + ': es una condición de mayoría y no tienes ninguna.');
      default: return res(true, '');
    }
  }
  window.checkEligibility = function (p, persona, cc) {
    var c = window.getProgramConfig(p);
    if (window.getExceptions(p.id).some(function (x) { return x.doc === cc; })) return { ok: true, excepcion: true };
    var pf = Object.assign({}, PERFIL_BASE, PERFILES[persona] || {}), pobl = [];
    if (c.roles.length && c.roles.indexOf(pf.rol) < 0) pobl.push('Tu rol es ' + pf.rol + ' y el programa es para: ' + c.roles.join(', ') + '.');
    if (c.cobertura.length && c.cobertura.indexOf('Nacional') < 0 && c.cobertura.indexOf(pf.depto) < 0) pobl.push('El programa cubre ' + c.cobertura.join(', ') + ' y tu departamento es ' + pf.depto + '.');
    if (pobl.length) return { ok: false, reasons: [{ t: 'Población del programa', items: pobl }] };
    var tipos = [], ok = false;
    c.inc.forEach(function (ci, i) {
      if ((((ci.pobOff || {}).roles) || []).indexOf(pf.rol) > -1) return;   // este tipo no aplica a su rol
      var name = (p.incentives[i] || {}).name || 'Incentivo ' + (i + 1), grupos = ci.grupos || [], fallas = [], okTipo = !grupos.length;
      grupos.forEach(function (g) {
        var malas = (g.rows || []).map(function (r) { return evalFila(r, pf); }).filter(function (r) { return !r.ok; });
        if (!malas.length) okTipo = true; else fallas.push(malas.map(function (r) { return r.msg; }));
      });
      if (okTipo) ok = true;
      else tipos.push({ t: name, items: fallas.length > 1 ? fallas.map(function (g, k) { return 'Opción ' + (k + 1) + ': ' + g.join(' ') ; }) : fallas[0] });
    });
    return ok ? { ok: true } : { ok: false, reasons: tipos };
  };
  window.pendingReviewCount = function () {
    return window.docReviews().filter(function (r) { return !r.sinDocs && r.estado === 'pend'; }).length;
  };
  /* ── Flujo del operador: entrega según la modalidad de cada tipo de incentivo ──
     Certificado (Diploma) → PDF con firma y QR · Fijo (programa o tipo recurrente) → confirma el ciclo
     · Código → código del inventario + evidencia · Sin código → solo evidencia. */
  var K_DEL = 'naowee:op-deliveries';
  var MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  window.cycleKey = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  window.cycleLabel = function () { var d = new Date(); return MESES_L[d.getMonth()] + ' ' + d.getFullYear(); };
  window.incModalidad = function (c, idx) {
    var ci = c.inc[idx] || {};
    if (ci.categoria === 'diploma') return 'certificado';
    if (c.rec.on || (ci.rec && ci.rec.on)) return 'fijo';
    return ci.codigos ? 'codigo' : 'sin-codigo';
  };
  window.opFlags = function (c, idx) {
    var m = window.incModalidad(c, idx), ci = c.inc[idx] || {};
    return { modalidad: m, needsCode: m !== 'certificado' && !!ci.codigos, needsEvidence: m === 'codigo' || m === 'sin-codigo' };
  };
  window.getDeliveries = function () { return read(K_DEL, []); };
  window.addDelivery = function (d) {
    var l = read(K_DEL, []); l.unshift(d); write(K_DEL, l);
    if (d.code) { var rv = read(K_RVT, {}), k = d.prog + '|' + d.code; if (rv[k]) { rv[k].reasignado = { persona: d.persona, operador: d.operador, fecha: d.fecha + ' · ' + d.hora }; write(K_RVT, rv); } }
    return d;
  };
  window.nextDeliveryId = function () { return 'ENT-2026-' + String(10000 + read(K_DEL, []).length * 7 + 1).slice(-5).padStart(5, '0'); };
  function normT(t) { return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function digitsOf(t) { return String(t || '').replace(/\D/g, ''); }
  /* Perfil del beneficiario para el operador: solo recibe con documentación aprobada y programa activo */
  window.opBuild = function (items) {
    var h = items[0], prof = { persona: h.persona, tipo: h.tipo, cc: h.cc, entries: [], blocked: [], excepcion: false };
    var dels = window.getDeliveries();
    items.forEach(function (r) {
      var p = window.PROGRAMS_DATA.filter(function (x) { return x.id === r.prog; })[0]; if (!p) return;
      var c = window.getProgramConfig(p);
      if (r.excepcion) prof.excepcion = r.excepcion.origen === 'manual' ? 'manual' : 'excepcion';
      if (p.status === 'closed') { prof.blocked.push({ progName: r.progName, estado: 'cerrado', itemId: r.id }); return; }
      if (r.estado !== 'apr') { prof.blocked.push({ progName: r.progName, estado: r.estado, limite: r.limite, itemId: r.id }); return; }
      if (p.status !== 'active') { prof.blocked.push({ progName: r.progName, estado: 'inactivo', itemId: r.id }); return; }
      p.incentives.forEach(function (inc, idx) {
        var f = window.opFlags(c, idx), cyc = f.modalidad === 'fijo' ? window.cycleKey() : '';
        var done = dels.filter(function (d) { return d.item === r.id && d.inc === idx && (!cyc || d.cycle === cyc) && !d.reverted; })[0] || null;
        prof.entries.push({
          itemId: r.id, progId: p.id, progName: p.name, incIdx: idx, incName: inc.name, cat: inc.category, iconBg: p.iconBg, iconColor: p.iconColor,
          modalidad: f.modalidad, needsCode: f.needsCode, needsEvidence: f.needsEvidence, cycle: cyc, valor: (c.inc[idx] || {}).unit || inc.value || 0, delivered: done
        });
      });
    });
    return prof;
  };
  window.opSearch = function (q) {
    var dg = digitsOf(q), nm = normT(q).trim(), all = window.docReviews();
    var hit = all.filter(function (r) { return (dg.length >= 5 && digitsOf(r.cc) === dg) || (!dg && nm.length >= 3 && normT(r.persona).indexOf(nm) > -1); });
    if (!hit.length) return null;
    var key = digitsOf(hit[0].cc), prof = window.opBuild(all.filter(function (r) { return digitsOf(r.cc) === key; }));
    /* Al operador solo le salen personas que ya pueden recibir al menos un incentivo (documentación aprobada); el resto, como si no existieran */
    return prof.entries.length ? prof : null;
  };
  /* Ejemplos para probar en el buscador: uno por estado documental */
  window.opSamples = function () {
    var all = window.docReviews(), seen = {}, out = [];
    all.filter(function (r) { return r.estado === 'apr' && !seen[digitsOf(r.cc)]; }).forEach(function (r) {
      if (out.length >= 4 || seen[digitsOf(r.cc)] || !window.opSearch(r.cc)) return;   // una vez por persona, y solo quienes de verdad pueden recibir algo
      seen[digitsOf(r.cc)] = 1; out.push({ cc: r.cc, persona: r.persona, estado: r.estado, excepcion: !!r.excepcion });
    });
    return out;
  };
  /* Códigos del inventario disponibles para un tipo (los primeros del tipo ya figuran como asignados en el programa) */
  /* ── Códigos canónicos: la misma etiqueta y el mismo reparto por tipo en TODAS las pantallas ── */
  function pad5(n) { return String(n).padStart(5, '0'); }
  window.codeLabel = function (p, i) { return p.id.replace('PRG-', '') + '-' + pad5(i); };
  window.codeIndex = function (p, code) { var m = new RegExp('^' + p.id.replace('PRG-', '') + '-(\\d{5})$').exec(code || ''); return m ? +m[1] : 0; };
  window.codeTypes = function (c) { return c.inc.map(function (x, k) { return { x: x, k: k }; }).filter(function (t) { return t.x.codigos; }); };
  /* Rango [desde, hasta] de índices de código de un tipo (por cantidad; el último tipo se lleva el resto del inventario) */
  window.codeRange = function (p, c, idx) {
    var ts = window.codeTypes(c), start = 0, total = (window.codesBase(p) || p.codes).total;
    for (var k = 0; k < ts.length; k++) {
      var last = k === ts.length - 1, cap = Number(ts[k].x.cantidad) || 0, end = last ? total : Math.min(total, start + (cap || total));
      if (ts[k].k === idx) return [start + 1, end];
      start = end;
    }
    return [1, 0];
  };
  window.codeTypeAt = function (p, c, i) {
    var ts = window.codeTypes(c); if (!ts.length) return -1;
    for (var k = 0; k < ts.length; k++) { var r = window.codeRange(p, c, ts[k].k); if (i >= r[0] && i <= r[1]) return ts[k].k; }
    return ts[ts.length - 1].k;
  };
  /* Efecto de las entregas y reversiones sobre los contadores del programa (los contadores base nunca se modifican) */
  function overlayDelta(pid) {
    var dels = read(K_DEL, []).filter(function (d) { return d.prog === pid; }), rv = read(K_RVT, {}), keys = Object.keys(rv).filter(function (k) { return k.indexOf(pid + '|') === 0; });
    var active = dels.filter(function (d) { return !d.reverted; }), exec = 0, sPend = 0, seedCodes = {};
    active.forEach(function (d) { exec += Number(d.valor) || 0; });
    keys.forEach(function (k) { var e = rv[k]; exec -= Number(e.valor) || 0; seedCodes[k.slice(pid.length + 1)] = 1; if (!e.reasignado) sPend++; });
    var lastByCode = {}; dels.slice().reverse().forEach(function (d) { if (d.code) lastByCode[d.code] = d; });
    var realRevPending = dels.filter(function (d) { return d.reverted && (!d.code || (lastByCode[d.code] === d)); }).length;
    var distinct = {}; dels.forEach(function (d) { if (d.code && !seedCodes[d.code]) distinct[d.code] = 1; });
    return { asig: active.length - keys.length, rev: sPend + realRevPending, avail: -Object.keys(distinct).length, exec: exec };
  }
  function overlayOn(p, sign) {
    var d = overlayDelta(p.id); if (!p.codes) return;
    var hasInv = (p.codes.total || 0) > 0;
    p.codes = { total: p.codes.total, avail: Math.max(0, (p.codes.avail || 0) + sign * (hasInv ? d.avail : 0)), asig: Math.max(0, (p.codes.asig || 0) + sign * d.asig), rev: Math.max(0, (p.codes.rev || 0) + sign * d.rev) };
    p.exec = Math.max(0, (p.exec || 0) + sign * d.exec);
  }
  /* Copia del programa con los contadores base (para guardar) */
  function unoverlay(prog) { var c = JSON.parse(JSON.stringify(prog)); if (c.codes) overlayOn(c, -1); return c; }
  window.codesBase = function (p) { var c = JSON.parse(JSON.stringify(p)); overlayOn(c, -1); return c.codes; };
  window.opCodes = function (p, c, idx) {
    var inc = p.incentives[idx], dels = window.getDeliveries(), used = dels.filter(function (d) { return d.prog === p.id && d.code && !d.reverted; }).map(function (d) { return d.code; });
    var ev = window.codeEvents(p.id), out = [], left = 0, cap = 0, reverted = [];
    if (Array.isArray(p.codesList) && p.codesList.length) {
      /* programa con códigos cargados por el gestor: se entregan esos mismos */
      var mine = p.codesList.filter(function (x) { return !x.tipo || x.tipo === inc.name; });
      out = mine.map(function (x) { return x.code; }).filter(function (x) { return used.indexOf(x) < 0; }); cap = mine.length; left = out.length; out = out.slice(0, 60);
    } else if ((c.inc[idx] || {}).codigos) {
      var base = window.codesBase(p), r = window.codeRange(p, c, idx), first = base.asig + base.rev + 1;
      cap = Math.max(0, r[1] - r[0] + 1);
      for (var i = Math.max(r[0], first); i <= r[1]; i++) { var code = window.codeLabel(p, i); if (used.indexOf(code) < 0) { left++; if (out.length < 60) out.push(code); } }
    }
    /* códigos liberados por una reversión: salen primero, marcados */
    ev.seed.filter(function (e) { return !e.reasignado && (e.inc || 0) === idx; }).forEach(function (e) { reverted.push(e.key); });
    ev.real.filter(function (e) { return e.estado === 'rev' && e.incName === inc.name; }).forEach(function (e) { reverted.push(e.code); });
    left += reverted.length;
    out = reverted.concat(out.filter(function (x) { return reverted.indexOf(x) < 0; }));
    return { list: out, left: left, cap: cap, reverted: reverted };
  };
  /* ── Reversión de asignaciones (códigos e incentivos sin código) ──
     Restaura el cupo (y el código si lo tiene) y el valor al programa; queda en la auditoría. */
  var K_RVT = 'naowee:asig-reverted';
  window.isReverted = function (pid, key) { return !!read(K_RVT, {})[pid + '|' + key]; };
  window.revertedCount = function (pid) { return Object.keys(read(K_RVT, {})).filter(function (k) { return k.indexOf(pid + '|') === 0; }).length; };
  window.getRevertEntry = function (pid, key) { return read(K_RVT, {})[pid + '|' + key] || null; };
  /* Forma que usa el popover «Historial de reversión» de Códigos */
  window.revHist = function (e) {
    return { beneficiarioPrevio: e.beneficiario, operadorPrevio: e.entregadoPor || '—', fechaAsignacion: e.fechaEntrega || '—', motivo: e.motivo, motivoLabel: e.motivoLabel,
      solicitante: e.autor, justificacion: e.justificacion, autor: e.autor + (e.rol ? ' · ' + e.rol : ''), fecha: e.fecha + ' · ' + e.hora, valor: e.valor, ip: e.ip };
  };
  window.revertAsignacion = function (o) {
    var d = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
    var entry = {
      programaId: o.progId, programa: o.programa, beneficiario: o.persona, incentivo: o.incentivo, code: o.code || null, valor: o.valor || 0, inc: o.inc || 0,
      motivo: o.motivo, motivoLabel: o.motivoLabel, justificacion: o.just, autor: o.autor, rol: o.rol, entregadoPor: o.entregadoPor || '', fechaEntrega: o.fechaEntrega || '',
      ip: '190.' + (24 + d.getMinutes() % 60) + '.' + (10 + d.getSeconds()) + '.' + (2 + (d.getHours() * 7) % 250),
      fecha: pad(d.getDate()) + ' ' + REV_MES[d.getMonth()] + ' ' + d.getFullYear(), hora: pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    };
    if (o.deliveryId) {
      var l = read(K_DEL, []); l.forEach(function (x) { if (x.id === o.deliveryId) x.reverted = entry; }); write(K_DEL, l);
    } else {
      var r = read(K_RVT, {}); r[o.progId + '|' + o.key] = entry; write(K_RVT, r);
    }
    var h = read('naowee-reversiones', []); h.push(entry); write('naowee-reversiones', h);
    return entry;
  };
  /* Estado de los códigos tras reversiones y reasignaciones: sembrados (por clave) y reales (entregados desde el flujo) */
  window.codeEvents = function (pid) {
    var rv = read(K_RVT, {}), seed = [];
    Object.keys(rv).forEach(function (k) { if (k.indexOf(pid + '|') === 0) seed.push(Object.assign({ key: k.slice(pid.length + 1) }, rv[k])); });
    var g = {}, order = [];
    read(K_DEL, []).slice().reverse().forEach(function (d) { if (d.prog === pid && d.code) { if (!g[d.code]) { g[d.code] = []; order.push(d.code); } g[d.code].push(d); } });
    var real = order.map(function (code) {
      var arr = g[code], last = arr[arr.length - 1];
      var hist = arr.filter(function (x) { return x.reverted; }).map(function (x) { return window.revHist(x.reverted); });
      return { code: code, estado: last.reverted ? 'rev' : (arr.length > 1 ? 'reasig' : 'asig'), benef: last.reverted ? null : last.persona, op: last.reverted ? null : last.operador,
        fecha: last.fecha + ' · ' + last.hora, tipo: last.cat, incName: last.incName, valor: last.valor, history: hist };
    });
    return { seed: seed, real: real };
  };
  /* Vigencia: al cumplirse la fecha de fin el programa se cierra solo. Las personas sin asignar quedan bloqueadas (el operador ve «Programa cerrado»)
     y todo vuelve al reabrirlo con nuevas fechas. Un programa sin fecha de fin nunca se cierra por este camino. */
  /* Fecha de fin de la vigencia: la de la configuración; si no la tiene, la que muestra el programa («15 sep 2025»). Vacía si no tiene fecha de fin. */
  window.vigenciaFin = function (p) {
    var h = window.getProgramConfig(p).hasta; if (h) return h;
    var m = /^(\d{1,2}) (\w{3}) (\d{4})$/.exec(String(p.to || '').trim()), i = m ? REV_MES.indexOf(m[2].toLowerCase()) : -1;
    return i > -1 ? m[3] + '-' + String(i + 1).padStart(2, '0') + '-' + String(parseInt(m[1], 10)).padStart(2, '0') : '';
  };
  window.vigenciaVencida = function (p) { var h = window.vigenciaFin(p); return !!h && h < isoD(new Date()); };
  window.PROGRAMS_DATA.forEach(function (p) {
    if (p.status !== 'active' || !window.vigenciaVencida(p)) return;
    var h = window.vigenciaFin(p), cl = (p.closures || []).slice(), last = cl[cl.length - 1];
    p.status = 'closed';
    if (!(last && last.tipo === 'cierre' && last.auto && last.hasta === h)) {
      cl.push({ tipo: 'cierre', auto: true, hasta: h, motivoLabel: 'Terminó la vigencia', autor: 'Sistema', rol: '', fecha: fmtD(h), hora: '23:59',
        just: 'Se cumplió la fecha de fin (' + fmtD(h) + '). Las personas sin asignar quedan bloqueadas hasta que se reabra el programa con nuevas fechas.' });
    }
    p.closures = cl;
  });
  /* Estado que se muestra: un programa activo que ya se cerró y se reabrió se ve «Reactivado» hasta que se cierre otra vez. */
  window.estadoVisible = function (p) {
    var cl = p.closures || [], last = cl[cl.length - 1];
    return p.status === 'active' && last && last.tipo === 'reapertura' ? 'reactivated' : p.status;
  };
  window.PROGRAMS_DATA.forEach(function (p) { overlayOn(p, +1); });
})();
