/* Servidor do QuadraJá: serve o site (pasta public/) e a API em /api. */
const path = require('path');
const express = require('express');
const { open } = require('./db');

const db = open();
const app = express();
app.use(express.json());

/* ---------- Consultas preparadas ---------- */
const qQuadras = db.prepare(`
  SELECT q.id, q.nome, q.esporte_id, q.bairro, c.nome AS cidade, c.uf, q.rua,
         q.preco_hora, q.piso_id, q.tamanho_m2, q.capacidade, q.nota, q.avaliacoes,
         q.destaque, a.nome AS anunciante, a.telefone, q.distancia_km, q.descricao
  FROM quadras q
  JOIN cidades c      ON c.id = q.cidade_id
  JOIN anunciantes a  ON a.id = q.anunciante_id
  ORDER BY q.id`);
const qComod = db.prepare('SELECT quadra_id, comodidade_id FROM quadra_comodidades');
const qHoras = db.prepare('SELECT quadra_id, hora FROM horarios_livres ORDER BY hora');
const qExiste = db.prepare('SELECT id, preco_hora FROM quadras WHERE id = ?');
const qOcupados = db.prepare(`SELECT hora_inicio, duracao_h FROM reservas
  WHERE quadra_id = ? AND data_jogo = ? AND status = 'confirmada'`);
const qConflito = db.prepare(`SELECT 1 FROM reservas
  WHERE quadra_id = ? AND data_jogo = ? AND status = 'confirmada'
    AND hora_inicio < ? AND hora_inicio + duracao_h > ?`);
const qInsert = db.prepare(`INSERT INTO reservas
  (usuario_id, quadra_id, data_jogo, hora_inicio, duracao_h, subtotal, taxa, total, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmada')`);
const qUsuario = db.prepare('SELECT id FROM usuarios WHERE id = ?');

/* ---------- API ---------- */
app.get('/api/quadras', (req, res) => {
  const comod = {}, horas = {};
  qComod.all().forEach(r => (comod[r.quadra_id] ||= []).push(r.comodidade_id));
  qHoras.all().forEach(r => (horas[r.quadra_id] ||= []).push(r.hora));
  res.json(qQuadras.all().map(q => ({
    ...q, destaque: !!q.destaque, comodidades: comod[q.id] || [], horarios: horas[q.id] || []
  })));
});

app.get('/api/quadras/:id/ocupados', (req, res) => {
  const data = String(req.query.data || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return res.status(400).json({ erro: 'Informe a data no formato AAAA-MM-DD.' });
  const horas = [];
  qOcupados.all(+req.params.id, data).forEach(r => { for (let h = r.hora_inicio; h < r.hora_inicio + r.duracao_h; h++) horas.push(h); });
  res.json({ data, horas });
});

app.post('/api/reservas', (req, res) => {
  const { quadra_id, data, hora_inicio, duracao_h } = req.body || {};
  const usuario_id = +req.body?.usuario_id || 1;   // login simulado: usuário 1
  const q = qExiste.get(+quadra_id);
  if (!q) return res.status(404).json({ erro: 'Quadra não encontrada.' });
  if (!qUsuario.get(usuario_id)) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data))) return res.status(400).json({ erro: 'Data inválida.' });
  const ini = +hora_inicio, dur = +duracao_h;
  if (!Number.isInteger(ini) || !Number.isInteger(dur) || ini < 7 || dur < 1 || dur > 3 || ini + dur > 23)
    return res.status(400).json({ erro: 'Horário inválido: reserve de 1 a 3 horas, entre 7h e 23h.' });

  const subtotal = q.preco_hora * dur;
  const taxa = Math.round(subtotal * 0.07);
  const fazer = db.transaction(() => {
    if (qConflito.get(q.id, data, ini + dur, ini)) return null;
    const r = qInsert.run(usuario_id, q.id, data, ini, dur, subtotal, taxa, subtotal + taxa);
    return r.lastInsertRowid;
  });
  const id = fazer();
  if (!id) return res.status(409).json({ erro: 'Esse horário acabou de ser reservado por outra pessoa.' });
  res.status(201).json({ id: Number(id), quadra_id: q.id, data, hora_inicio: ini, duracao_h: dur, subtotal, taxa, total: subtotal + taxa });
});

app.get('/api/reservas', (req, res) => {
  res.json(db.prepare(`SELECT r.id, q.nome AS quadra, r.data_jogo, r.hora_inicio, r.duracao_h, r.total, r.status
    FROM reservas r JOIN quadras q ON q.id = r.quadra_id WHERE r.usuario_id = ? ORDER BY r.data_jogo, r.hora_inicio`).all(+req.query.usuario_id || 1));
});

app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

/* ---------- Site ---------- */
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`QuadraJá no ar: http://localhost:${PORT}`));
