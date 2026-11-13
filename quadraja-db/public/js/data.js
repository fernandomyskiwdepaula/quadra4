/* =========================================================
   QuadraJá — dados mockados + ilustrações esportivas em SVG
   30 quadras determinísticas (sempre os mesmos dados).
   ========================================================= */

const SPORTS = [
  { id: 'society',      label: 'Futebol Society', short: 'Society',      kind: 'soccer' },
  { id: 'futsal',       label: 'Futsal',          short: 'Futsal',       kind: 'soccer' },
  { id: 'volei',        label: 'Vôlei',           short: 'Vôlei',        kind: 'volley' },
  { id: 'volei-praia',  label: 'Vôlei de praia',  short: 'Vôlei de praia', kind: 'volley' },
  { id: 'beach-tennis', label: 'Beach tennis',    short: 'Beach tennis', kind: 'tennis' },
  { id: 'basquete',     label: 'Basquete',        short: 'Basquete',     kind: 'basket' },
  { id: 'tenis',        label: 'Tênis',           short: 'Tênis',        kind: 'tennis' },
  { id: 'padel',        label: 'Padel',           short: 'Padel',        kind: 'tennis' },
  { id: 'poli',         label: 'Poliesportiva',   short: 'Poliesportiva', kind: 'basket' }
];

const FLOORS = [
  { id: 'grama-sintetica', label: 'Grama sintética' },
  { id: 'grama-natural',   label: 'Grama natural' },
  { id: 'areia',           label: 'Areia' },
  { id: 'cimento',         label: 'Cimento' },
  { id: 'madeira',         label: 'Madeira' },
  { id: 'saibro',          label: 'Saibro' },
  { id: 'borracha',        label: 'Quadra de borracha' }
];

const AMENITIES = [
  { id: 'iluminacao',    label: 'Iluminação noturna',   icon: 'lightbulb' },
  { id: 'vestiario',     label: 'Vestiário',            icon: 'shirt' },
  { id: 'chuveiro',      label: 'Chuveiro',             icon: 'shower-head' },
  { id: 'estacionamento',label: 'Estacionamento',       icon: 'car' },
  { id: 'lanchonete',    label: 'Lanchonete/bar',       icon: 'utensils' },
  { id: 'churrasqueira', label: 'Churrasqueira',        icon: 'flame' },
  { id: 'arquibancada',  label: 'Arquibancada',         icon: 'users' },
  { id: 'coberta',       label: 'Quadra coberta',       icon: 'umbrella' },
  { id: 'bola-coletes',  label: 'Aluguel de bola/coletes', icon: 'circle-dot' },
  { id: 'wifi',          label: 'Wi-Fi',                icon: 'wifi' },
  { id: 'acessibilidade',label: 'Acessibilidade',       icon: 'accessibility' }
];

const CITIES = [
  { name: 'Curitiba',       uf: 'PR', sport: 'society' },
  { name: 'São Paulo',      uf: 'SP', sport: 'padel' },
  { name: 'Rio de Janeiro', uf: 'RJ', sport: 'volei-praia' },
  { name: 'Belo Horizonte', uf: 'MG', sport: 'basquete' }
];

/* Gerador pseudoaleatório com semente (mulberry32) */
function seeded(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------
   ILUSTRAÇÕES ESPORTIVAS
   Cada quadra é desenhada vista de cima, com as linhas
   oficiais da modalidade. Tudo em SVG, sem imagens externas.
   --------------------------------------------------------- */

/* Três "pisos" na paleta da marca: laranja, preto e branco */
const PAL = [
  { floor: '#FF5C00', court: '#E85400', line: '#FFFFFF', ball: '#000000', seam: '#FFFFFF', shade: '#000000' },
  { floor: '#000000', court: '#1C1C1C', line: '#FF5C00', ball: '#FF5C00', seam: '#000000', shade: '#FFFFFF' },
  { floor: '#F2F2F2', court: '#FFFFFF', line: '#000000', ball: '#FF5C00', seam: '#000000', shade: '#000000' }
];
const KIND = { society: 'soccer', futsal: 'soccer', volei: 'volley', 'volei-praia': 'volley', 'beach-tennis': 'tennis', basquete: 'basket', poli: 'basket', tenis: 'tennis', padel: 'tennis' };

/* Linhas da quadra num sistema 200 x 100 */
function courtLines(sp) {
  const R = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const L = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
  const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
  const outer = R(4, 4, 192, 92);
  const net = `<line x1="100" y1="0" x2="100" y2="100" stroke-width="2.4" stroke-dasharray="2 1.6"/>`;
  switch (sp) {
    case 'society':
      return outer + L(100, 4, 100, 96) + C(100, 50, 14) + R(4, 26, 26, 48) + R(170, 26, 26, 48) + R(4, 38, 10, 24) + R(186, 38, 10, 24) + R(0, 43, 4, 14) + R(196, 43, 4, 14);
    case 'futsal': case 'poli':
      return outer + L(100, 4, 100, 96) + C(100, 50, 13) + '<path d="M4 22A28 28 0 0 1 32 50A28 28 0 0 1 4 78M196 22A28 28 0 0 0 168 50A28 28 0 0 0 196 78"/>' + R(0, 43, 4, 14) + R(196, 43, 4, 14);
    case 'volei':
      return outer + net + L(68, 4, 68, 96) + L(132, 4, 132, 96);
    case 'volei-praia':
      return outer + net;
    case 'beach-tennis':
      return R(24, 10, 152, 80) + net;
    case 'basquete':
      return outer + L(100, 4, 100, 96) + C(100, 50, 12) + R(4, 34, 38, 32) + R(158, 34, 38, 32) + '<path d="M42 38A12 12 0 0 1 42 62M158 38A12 12 0 0 0 158 62"/>' + '<path d="M4 12H20A44 44 0 0 1 20 88H4M196 12H180A44 44 0 0 0 180 88H196"/>';
    case 'tenis':
      return outer + L(4, 15.5, 196, 15.5) + L(4, 84.5, 196, 84.5) + net + L(48, 15.5, 48, 84.5) + L(152, 15.5, 152, 84.5) + L(48, 50, 152, 50);
    case 'padel':
      return '<rect x="4" y="4" width="192" height="92" stroke-width="3"/>' + net + L(33, 4, 33, 96) + L(167, 4, 167, 96) + L(33, 50, 167, 50);
    default:
      return outer + L(100, 4, 100, 96);
  }
}

/* Bola desenhada em SVG (soccer, basket, volley, tennis) */
function ballSVG(kind, x, y, r, fill, stroke, sw = 3, patch = stroke) {
  const base = `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const g = (body) => `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
  if (kind === 'soccer') {
    const pts = [0, 1, 2, 3, 4].map(i => { const a = (-90 + 72 * i) * Math.PI / 180; return [x + Math.cos(a) * r * .36, y + Math.sin(a) * r * .36]; });
    const out = [0, 1, 2, 3, 4].map(i => { const a = (-90 + 72 * i) * Math.PI / 180; return [x + Math.cos(a) * r * .98, y + Math.sin(a) * r * .98]; });
    const poly = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${patch}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    return base + poly + g(pts.map((p, i) => `<line x1="${p[0]}" y1="${p[1]}" x2="${out[i][0]}" y2="${out[i][1]}"/>`).join(''));
  }
  if (kind === 'basket') {
    return base + g(`<line x1="${x}" y1="${y - r}" x2="${x}" y2="${y + r}"/><line x1="${x - r}" y1="${y}" x2="${x + r}" y2="${y}"/>` +
      `<path d="M${x - r * .72} ${y - r * .7}Q${x - r * .2} ${y} ${x - r * .72} ${y + r * .7}"/><path d="M${x + r * .72} ${y - r * .7}Q${x + r * .2} ${y} ${x + r * .72} ${y + r * .7}"/>`);
  }
  if (kind === 'volley') {
    const arm = a => `<path transform="rotate(${a} ${x} ${y})" d="M${x} ${y - r}Q${x + r * .95} ${y - r * .2} ${x + r * .2} ${y + r * .95}"/>`;
    return base + g(arm(0) + arm(120) + arm(240));
  }
  // tennis
  return base + g(`<path d="M${x - r * .72} ${y - r * .7}A${r * .95} ${r * .95} 0 0 1 ${x - r * .72} ${y + r * .7}"/><path d="M${x + r * .72} ${y - r * .7}A${r * .95} ${r * .95} 0 0 0 ${x + r * .72} ${y + r * .7}"/>`);
}

/* Pictograma de bola para a interface (herda a cor do texto) */
function sportIcon(id, cls = 'h-8 w-8') {
  const kind = KIND[id] || 'soccer';
  return `<svg viewBox="0 0 48 48" class="${cls}" aria-hidden="true">${ballSVG(kind, 24, 24, 20, 'none', 'currentColor', 2.6, 'currentColor')}</svg>`;
}

/* Foto-ilustração da quadra. variant 0..4 = enquadramentos diferentes */
function courtArt(sport, floor, pal, variant, seed) {
  const P = PAL[pal % 3];
  const kind = KIND[sport] || 'soccer';
  const rnd = seeded(seed * 131 + variant * 17 + 5);
  const V = [
    { s: 3.7, fx: 100, fy: 50, rot: 0 },    // quadra inteira
    { s: 7.2, fx: 36, fy: 50, rot: 0 },     // detalhe da área
    { s: 2.7, fx: 100, fy: 50, rot: 90 },   // quadra em pé
    { s: 9,   fx: 100, fy: 50, rot: -12 },  // centro / rede
    { s: 5.2, fx: 152, fy: 38, rot: 7 }     // canto, com a bola
  ][variant % 5];
  const floorCol = floor === 'areia' && pal % 3 === 0 ? '#FF8A3D' : P.floor;
  let b = `<rect width="800" height="600" fill="${floorCol}"/>`;
  b += `<g transform="translate(400 300) rotate(${V.rot}) scale(${V.s}) translate(${-V.fx} ${-V.fy})">`;
  b += `<rect x="0" y="0" width="200" height="100" fill="${P.court}"/>`;
  b += `<g fill="none" stroke="${P.line}" stroke-width="1.3" stroke-linecap="square">${courtLines(sport)}</g></g>`;
  // faixas de luz/sombra (holofote)
  const x1 = rnd() * 420, x2 = 380 + rnd() * 380;
  b += `<polygon points="${x1},0 ${x1 + 120},0 ${x1 - 100},600 ${x1 - 220},600" fill="${P.shade}" opacity=".09"/>`;
  b += `<polygon points="${x2},0 ${x2 + 60},0 ${x2 - 160},600 ${x2 - 220},600" fill="${P.shade}" opacity=".07"/>`;
  // bola
  if ([1, 3, 4].includes(variant % 5)) {
    const r = variant % 5 === 3 ? 74 : variant % 5 === 1 ? 44 : 40;
    const bx = variant % 5 === 3 ? 575 : variant % 5 === 1 ? 600 : 250;
    const by = variant % 5 === 3 ? 370 : variant % 5 === 1 ? 430 : 410;
    b += `<ellipse cx="${bx + r * .25}" cy="${by + r * .55}" rx="${r}" ry="${r * .34}" fill="#000" opacity=".3"/>`;
    b += ballSVG(kind, bx, by, r, P.ball, P.seam, Math.max(3, r * .07), P.seam);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">${b}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* Só as linhas da quadra (sem fundo), para texturas decorativas */
function courtLinesURI(sport, color, sw = 1.2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="${color}" stroke-width="${sw}">${courtLines(sport)}</g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ---------------------------------------------------------
   QUADRAS: vêm do banco de dados, pela API (GET /api/quadras)
   --------------------------------------------------------- */
const COURTS = [];

/* Converte uma linha do banco no objeto que a interface usa */
function hydrateCourt(r) {
  const sp = SPORTS.find(s => s.id === r.esporte_id);
  const fl = FLOORS.find(f => f.id === r.piso_id);
  const pos = seeded(r.id * 53 + 7);            // posição do pino no mapa ilustrativo
  const pal = r.id % 3;                          // piso laranja, preto ou branco na ilustração
  return {
    id: r.id, name: r.nome, sport: r.esporte_id, sportLabel: sp.label,
    neighborhood: r.bairro, city: r.cidade, uf: r.uf, street: r.rua,
    price: r.preco_hora, floor: r.piso_id, floorLabel: fl.label,
    size: r.tamanho_m2, capacity: r.capacidade,
    amenities: r.comodidades, slots: r.horarios,
    rating: r.nota, reviews: r.avaliacoes, featured: r.destaque,
    owner: r.anunciante, phone: r.telefone, dist: r.distancia_km,
    mx: 8 + Math.floor(pos() * 82), my: 10 + Math.floor(pos() * 78),
    pal, description: r.descricao,
    photos: [0, 1, 2, 3, 4].map(v => courtArt(r.esporte_id, r.piso_id, pal, v, r.id))
  };
}

/* appReady: resolve quando o DOM está pronto E as quadras chegaram do banco.
   Todas as páginas iniciam dentro de appReady.then(...). */
const domReady = new Promise(ok => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ok) : ok());
const dataReady = fetch('/api/quadras')
  .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
  .then(rows => { rows.forEach(r => COURTS.push(hydrateCourt(r))); });
const appReady = Promise.all([domReady, dataReady]);
appReady.catch(err => {
  domReady.then(() => {
    document.body.innerHTML = `<div style="max-width:560px;margin:15vh auto;padding:0 16px;font:18px/1.5 system-ui,sans-serif">
      <h1 style="font:900 2.4rem/1 Impact,sans-serif;text-transform:uppercase">Sem conexão com o banco</h1>
      <p>Não foi possível carregar as quadras (${err.message}). Inicie o servidor com <code>npm start</code> e abra <b>http://localhost:3000</b>. Abrir o arquivo HTML direto no navegador não funciona, porque os dados vêm da API.</p></div>`;
  });
});
