/* Escenas: estado de partida de cada caso. «reiniciar» borra solo lo guardado por la demo de Incentivos. */
window.ESCENAS = {
  base: { reiniciar: true, rol: 'admin', inicio: 'incentivo-03-programas.html' },
  esteban: { reiniciar: true, rol: 'deportista', atleta: 'Esteban Mora', inicio: 'incentivo-17-mis-documentos.html' },
  'programa-006': { reiniciar: true, rol: 'admin', inicio: 'incentivo-05-programa-detalle.html?id=PRG-2026-006' },
  operador: { reiniciar: true, rol: 'operador', inicio: 'incentivo-08-asignar-buscar.html' },
  'jorge-entregas': { reiniciar: true, rol: 'operador', inicio: 'incentivo-14-mis-asignaciones.html', ls: { 'naowee:op-deliveries': [
    { id: 'ENT-2026-10001', item: 'PRG-2026-006-R3', prog: 'PRG-2026-006', progName: 'Estímulos integrales medallistas 2026', inc: 0, incName: 'Kit deportivo medallista', cat: 'Kit', modalidad: 'codigo', code: '2026-006-00105', evidence: 'entrega-kit.jpg', cycle: '', persona: 'Andrés García', tipo: 'TI', cc: '1.020.022.329', operador: 'Jorge Guzman', fecha: '21 oct 2026', hora: '10:15', valor: 450000, obs: '' }
  ] } },
  'admin-inicio': { reiniciar: true, rol: 'admin', inicio: 'incentivo-02-dashboard.html' },
  'admin-usuarios': { reiniciar: true, rol: 'admin', inicio: 'incentivo-18-gestion-usuarios.html' },
  flujo: { reiniciar: true, rol: 'admin', inicio: 'incentivo-18-gestion-usuarios.html', ls: { 'naowee:usuarios': [
    { id: 'u1', nombre: 'Danna Arrieta', cc: '52345678', tel: '3105550101', mail: 'danna.arrieta@mindeporte.gov.co', rol: 'incentivos', estado: 'activo', fecha: '2026-08-03', programas: [], por: 'sistema' }
  ] } },
  'isa-revision': { reiniciar: true, rol: 'programa', inicio: 'incentivo-16-revision-documental.html' }
};
