import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/+esm';

const URL_ = 'https://tpckinppyknqbssiesej.supabase.co';
const KEY = 'sb_publishable_ik22BBTe5L9A8VyBpJbrrQ_9rsMwY05';
const APP = 'https://levelup-gashapon.vercel.app';
const sb = createClient(URL_, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = id => document.getElementById(id);

const e = {
  live: $('live'), coins: $('coins'), role: $('roleBadge'), openLogin: $('openLogin'), headerLogout: $('headerLogout'),
  notice: $('accessNotice'), noticeTitle: $('accessNoticeTitle'), noticeText: $('accessNoticeText'), noticeLogout: $('noticeLogout'), app: $('appContent'),
  homeView: $('homeView'), playView: $('playView'), consoleView: $('consoleView'), machineGallery: $('machineGallery'),
  machineTabs: $('machineTabs'), newMachineTop: $('newMachineTop'), backToMachines: $('backToMachines'), playAdminBtn: $('playAdminBtn'),
  playMachineName: $('playMachineName'), playPoster: $('playPoster'), playPosterEmpty: $('playPosterEmpty'), machineTitle: $('machineTitle'), machineAvailability: $('machineAvailability'),
  gashaponMachine: $('gashaponMachine'), capsuleDisplay: $('capsuleDisplay'), coinSlot: $('coinSlot'), machineCostValue: $('machineCostValue'), knob: $('knob'), capsuleChute: $('capsuleChute'), dispensedCapsule: $('dispensedCapsule'), dispensedCapsuleImage: $('dispensedCapsuleImage'), emptyChute: $('emptyChute'),
  flowCoin: $('flowCoin'), flowTurn: $('flowTurn'), flowOpen: $('flowOpen'), loadedCoinChip: $('loadedCoinChip'), turnMeterFill: $('turnMeterFill'),
  roll: $('roll'), status: $('status'), prizes: $('prizes'), wins: $('wins'),
  adminBtn: $('adminBtn'), playerAccountBtn: $('playerAccountBtn'), accountBtn: $('accountBtn'), consoleBack: $('consoleBack'), accountFromAdmin: $('accountFromAdmin'), account: $('accountPanel'), playerAccountPanel: $('playerAccountPanel'),
  email: $('accountEmail'), username: $('accountUsername'), display: $('accountDisplayName'),
  saveProfile: $('saveProfile'), accountLogout: $('accountLogout'), accountMsg: $('accountMsg'), logout: $('logout'),
  admin: $('admin'), machineManagement: $('machineManagement'), machineName: $('machineName'), machineCoinCost: $('machineCoinCost'),
  machinePosterPreview: $('machinePosterPreview'), saveMachine: $('saveMachine'), uploadMachinePoster: $('uploadMachinePoster'), removeMachinePoster: $('removeMachinePoster'), toggleMachine: $('toggleMachine'), deleteMachine: $('deleteMachine'),
  createMachineModal: $('createMachineModal'), createMachineName: $('createMachineName'), createMachineCost: $('createMachineCost'), createMachineSubmit: $('createMachineSubmit'), createMachineClose: $('createMachineClose'), createMachineCancel: $('createMachineCancel'), createMachineMsg: $('createMachineMsg'),
  machineAdminMsg: $('machineAdminMsg'), playerSearchInput: $('playerSearchInput'), playerSearchBtn: $('playerSearchBtn'), playerSearchMsg: $('playerSearchMsg'), playerSearchResults: $('playerSearchResults'), name: $('name'), stock: $('stock'), prizeImageControls: $('prizeImageControls'),
  imageFile: $('imageFile'), imagePreview: $('imagePreview'), add: $('add'), pool: $('pool'),
  login: $('login'), loginClose: $('loginClose'), identifier: $('identifier'), password: $('password'), signin: $('signin'), signup: $('signup'),
  forgot: $('forgot'), resend: $('resend'), loginmsg: $('loginmsg'), passwordModal: $('passwordModal'), passwordClose: $('passwordClose'),
  passwordTitle: $('passwordTitle'), passwordHelp: $('passwordHelp'), currentLabel: $('currentPasswordLabel'),
  current: $('currentPassword'), newPw: $('newPassword'), confirmPw: $('confirmPassword'), savePw: $('savePassword'),
  cancelPw: $('cancelPassword'), passwordMsg: $('passwordMsg'), changePw: $('changePasswordBtn'),
  result: $('result'), resultClose: $('resultClose'), rimg: $('rimg'), rnoimg: $('rnoimg'), rname: $('rname'),
  rstock: $('rstock'), claim: $('claim'), confirmModal: $('confirmModal'), confirmClose: $('confirmClose'), confirmTitle: $('confirmTitle'), confirmText: $('confirmText'), confirmOk: $('confirmOk'), confirmCancel: $('confirmCancel')
};

let user = null;
let role = null;
let profile = null;
let selectedMachineId = null;
let state = { coins: 0, machines: [], prizes: [], wins: [] };
let channel = null;
let previewUrl = null;
let posterPreviewUrl = null;
let recovery = false;
let lastSignupEmail = '';
let signedUrls = new Map();
let uiView = 'home';
let lastMainView = 'home';
let machinePhase = 'idle';
let turnProgress = 0;
let pendingPrize = null;
let completingTurn = false;
let knobDragging = false;
let lastKnobAngle = null;

const isMaster = () => role === 'master';
const isAdmin = () => role === 'admin' || isMaster();
const isPlayer = () => role === 'player';
let playerSearchResults = [];
const msg = (n, t) => { if (n) n.textContent = t; };
const clear = n => { while (n?.firstChild) n.removeChild(n.firstChild); };
const node = (tag, t, c) => { const n = document.createElement(tag); if (t !== undefined) n.textContent = t; if (c) n.className = c; return n; };
const btn = (t, c, f) => { const b = node('button', t, c); b.type = 'button'; b.onclick = f; return b; };
const currentMachine = () => state.machines.find(m => m.id === selectedMachineId) || null;
const machinePrizes = () => state.prizes.filter(p => p.machine_id === selectedMachineId);
const machineWins = () => state.wins.filter(w => w.machine_id === selectedMachineId);
const machineCoinCost = () => Math.max(1, Number(currentMachine()?.coin_cost || 1));
const machineInventory = () => machinePrizes().filter(p => p.enabled && Number(p.stock) > 0).reduce((n,p) => n + Math.max(0, Math.floor(Number(p.stock) || 0)), 0);

function friendly(x) {
  const m = String(x?.message || x || 'Unknown error');
  if (m.includes('NO_COINS')) return 'Not enough coins for this gashapon.';
  if (m.includes('NO_PRIZES')) return 'This gashapon has no available prizes.';
  if (m.includes('MACHINE_NOT_FOUND')) return 'This gashapon machine is unavailable.';
  if (m.includes('ADMIN_ACCESS_REQUIRED')) return 'Administrator access is required.';
  if (m.includes('MASTER_ACCESS_REQUIRED')) return 'Master access is required for gashapon machine management.';
  if (m.includes('STAFF_ACCESS_REQUIRED')) return 'This account is not approved for staff access.';
  if (m.includes('ACCESS_REQUIRED') || m.includes('AUTH_REQUIRED')) return 'Sign in with a verified account first.';
  if (m.includes('SEARCH_TOO_SHORT')) return 'Enter at least 2 characters to search.';
  if (m.includes('INVALID_COIN_AMOUNT')) return 'Enter a coin amount from 1 to 10,000.';
  if (m.includes('INSUFFICIENT_PLAYER_COINS')) return 'This player does not have enough coins to deduct that amount.';
  if (m.includes('PLAYER_NOT_FOUND')) return 'Player not found.';
  if (m.includes('ACCOUNT_BANNED')) return 'This player account is banned.';
  if (m.includes('23505') || m.toLowerCase().includes('duplicate key')) return 'That username or display name is already in use.';
  if (m.toLowerCase().includes('same password')) return 'Choose a password different from your current password.';
  return m;
}

function imageUrl(path) { return path ? (signedUrls.get(path) || null) : null; }

async function refreshImages() {
  signedUrls = new Map();
  const paths = [...new Set([
    ...state.machines.map(m => m.poster_path),
    ...state.prizes.map(p => p.image_path)
  ].filter(Boolean))];
  if (!paths.length) return;
  const { data, error } = await sb.storage.from('prize-images').createSignedUrls(paths, 3600);
  if (error) throw error;
  (data || []).forEach((x, i) => { if (x?.signedUrl) signedUrls.set(x.path || paths[i], x.signedUrl); });
}

async function signedImage(path) {
  if (!path) return null;
  if (signedUrls.has(path)) return signedUrls.get(path);
  const { data } = await sb.storage.from('prize-images').createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

function createMissingImage(className = 'prize-image-missing') {
  const d = document.createElement('div');
  d.className = className;
  d.textContent = '◇';
  return d;
}

function visibleMachines() {
  return isMaster() ? state.machines : state.machines.filter(m => m.enabled);
}

function normalizeSelectedMachine() {
  const visible = visibleMachines();
  if (!visible.some(m => m.id === selectedMachineId)) selectedMachineId = visible[0]?.id || null;
}

function resetMachineInteraction(message = 'Tap the coin slot to begin.') {
  machinePhase = 'idle';
  turnProgress = 0;
  pendingPrize = null;
  if (e.dispensedCapsuleImage) { e.dispensedCapsuleImage.removeAttribute('src'); e.dispensedCapsuleImage.classList.add('hidden'); }
  completingTurn = false;
  knobDragging = false;
  lastKnobAngle = null;
  msg(e.status, message);
  renderMachineInteraction();
}

function setView(view) {
  if ((machinePhase === 'dispensing' || machinePhase === 'capsule') && view !== 'play') {
    msg(e.status, 'Open your capsule before leaving this machine.');
    return false;
  }
  if ((machinePhase === 'coin' || machinePhase === 'turning') && view !== 'play') resetMachineInteraction('Coin returned. Choose a machine when ready.');
  uiView = view;
  if (view === 'home' || view === 'play') lastMainView = view;
  e.homeView.classList.toggle('hidden', view !== 'home');
  e.playView.classList.toggle('hidden', view !== 'play');
  e.consoleView.classList.toggle('hidden', view !== 'console');
  return true;
}

function enterMachine(id) {
  const m = state.machines.find(x => x.id === id);
  if (!m) return;
  if (selectedMachineId !== id) resetMachineInteraction();
  selectedMachineId = id;
  setView('play');
  render();
  msg(e.status, m.enabled ? 'Tap the coin slot to begin.' : 'This machine is currently disabled.');
}

function selectMachine(id) {
  if (!state.machines.some(m => m.id === id)) return;
  selectedMachineId = id;
  render();
  msg(e.status, 'Machine selected.');
}

function renderMachineGallery() {
  clear(e.machineGallery);
  const machines = visibleMachines();
  if (!machines.length) {
    const empty = node('div', '', 'gallery-empty card');
    empty.append(node('span', '✦', 'gallery-empty-icon'), node('h3', 'No Gashapon available'), node('p', isMaster() ? 'Use the + button to create your first machine.' : 'There are no enabled machines right now.', 'muted'));
    e.machineGallery.append(empty);
    return;
  }
  for (const m of machines) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'machine-banner-card' + (!m.enabled ? ' machine-offline' : '');
    const poster = imageUrl(m.poster_path);
    if (poster) {
      const im = document.createElement('img'); im.src = poster; im.alt = `${m.name} poster`; im.referrerPolicy = 'no-referrer'; card.append(im);
    } else {
      const fallback = node('div', '', 'banner-fallback');
      fallback.innerHTML = '<span class="fallback-orb">✦</span><small>GASHAPONFUN</small>';
      card.append(fallback);
    }
    const shade = node('span', '', 'banner-card-shade');
    const copy = node('span', '', 'banner-card-copy');
    const cost = Math.max(1, Number(m.coin_cost || 1));
    copy.append(node('small', m.enabled ? `READY · ${cost} COIN${cost === 1 ? '' : 'S'} / PLAY` : 'OFFLINE', 'banner-status'), node('strong', m.name), node('span', 'Tap banner to enter →', 'banner-enter'));
    card.append(shade, copy);
    card.onclick = () => enterMachine(m.id);
    e.machineGallery.append(card);
  }
  e.newMachineTop.classList.toggle('hidden', !isMaster());
}

function renderTabs() {
  clear(e.machineTabs);
  const machines = visibleMachines();
  if (!machines.length) e.machineTabs.append(node('div', 'No gashapon machines available.', 'muted'));
  for (const m of machines) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'machine-tab' + (m.id === selectedMachineId ? ' active' : '') + (!m.enabled ? ' disabled-tab' : '');
    b.append(node('span', '', 'machine-tab-dot'), node('span', m.name + (!m.enabled ? ' · OFF' : '')));
    b.onclick = () => selectMachine(m.id);
    e.machineTabs.append(b);
  }
}

function renderPlayPoster() {
  const m = currentMachine();
  if (!m) {
    e.playMachineName.textContent = 'Gashapon';
    e.machineTitle.textContent = 'No gashapon selected';
    e.machineAvailability.textContent = 'Return to Machines and choose one.';
    e.playPoster.classList.add('hidden');
    e.playPosterEmpty.classList.remove('hidden');
    return;
  }
  e.playMachineName.textContent = m.name;
  e.machineTitle.textContent = m.name;
  const active = machinePrizes().filter(p => p.enabled && p.stock > 0).length;
  const inventory = machineInventory();
  const cost = machineCoinCost();
  e.machineAvailability.textContent = `${active} active prize${active === 1 ? '' : 's'} · ${inventory} capsule${inventory === 1 ? '' : 's'} · ${cost} coin${cost === 1 ? '' : 's'} / play · ${m.enabled ? 'ONLINE' : 'OFFLINE'}`;
  const poster = imageUrl(m.poster_path);
  if (poster) {
    e.playPoster.src = poster; e.playPoster.classList.remove('hidden'); e.playPosterEmpty.classList.add('hidden');
  } else {
    e.playPoster.removeAttribute('src'); e.playPoster.classList.add('hidden'); e.playPosterEmpty.classList.remove('hidden');
  }
}

function capsuleHue(prize, index = 0) {
  const seed = [...String(prize?.id || prize?.name || index)].reduce((n, ch) => ((n * 31) + ch.charCodeAt(0)) >>> 0, 17);
  const palette = [194, 320, 258, 42, 154, 286, 8, 218];
  return palette[seed % palette.length];
}

function renderChamberCapsules() {
  if (!e.capsuleDisplay) return;
  clear(e.capsuleDisplay);
  const available = machinePrizes().filter(p => p.enabled && Number(p.stock) > 0);
  const total = available.reduce((n, p) => n + Math.max(0, Math.floor(Number(p.stock) || 0)), 0);
  e.capsuleDisplay.dataset.count = String(total);
  if (!total) {
    e.capsuleDisplay.style.removeProperty('--capsule-size');
    const empty = node('div', 'NO PRIZES', 'chamber-empty');
    e.capsuleDisplay.append(empty);
    return;
  }

  // One visual capsule per real unit of enabled stock.
  const size = total <= 5 ? 104 : total <= 8 ? 88 : total <= 12 ? 72 : total <= 20 ? 58 : total <= 35 ? 46 : total <= 60 ? 36 : total <= 100 ? 29 : total <= 180 ? 23 : 18;
  const gap = total <= 12 ? 5 : total <= 35 ? 3 : total <= 100 ? 2 : 1;
  e.capsuleDisplay.style.setProperty('--capsule-size', `${size}px`);
  e.capsuleDisplay.style.setProperty('--capsule-gap', `${gap}px`);
  const frag = document.createDocumentFragment();
  let visualIndex = 0;
  for (const p of available) {
    const count = Math.max(0, Math.floor(Number(p.stock) || 0));
    const url = imageUrl(p.image_path);
    for (let unit = 0; unit < count; unit++, visualIndex++) {
      const c = document.createElement('span');
      c.className = 'capsule-ball inventory-capsule';
      c.style.setProperty('--capsule-hue', String(capsuleHue(p, visualIndex)));
      c.style.setProperty('--capsule-delay', `${-(visualIndex % 17) * .13}s`);
      c.setAttribute('aria-label', p.name);
      c.title = p.name;
      if (url && size >= 27) {
        const im = document.createElement('img');
        im.className = 'capsule-prize-img'; im.src = url; im.alt = ''; im.referrerPolicy = 'no-referrer';
        im.onerror = () => { im.remove(); if (size >= 34) c.append(node('span', p.name.slice(0, 1).toUpperCase(), 'capsule-prize-fallback')); };
        c.append(im);
      } else if (size >= 34) {
        c.append(node('span', p.name.slice(0, 1).toUpperCase(), 'capsule-prize-fallback'));
      }
      frag.append(c);
    }
  }
  e.capsuleDisplay.append(frag);
}

function canPlayCurrentMachine() {
  const m = currentMachine();
  return !!(user && role && m && m.enabled && state.coins >= machineCoinCost() && machinePrizes().some(p => p.enabled && p.stock > 0));
}

function renderMachineInteraction() {
  if (!e.gashaponMachine) return;
  e.gashaponMachine.className = `real-machine anime-machine phase-${machinePhase}`;
  const progress = Math.min(100, Math.max(0, turnProgress / 720 * 100));
  e.turnMeterFill.style.width = `${progress}%`;
  e.knob.style.transform = `rotate(${turnProgress}deg)`;
  e.knob.setAttribute('aria-valuenow', String(Math.round(turnProgress)));
  const cost = machineCoinCost();
  const loaded = machinePhase === 'coin' || machinePhase === 'turning' || machinePhase === 'dispensing';
  e.loadedCoinChip.textContent = `◆ ${cost} COIN${cost === 1 ? '' : 'S'} LOADED`;
  if (e.machineCostValue) e.machineCostValue.textContent = `${cost} COIN${cost === 1 ? '' : 'S'}`;
  e.loadedCoinChip.classList.toggle('hidden', !loaded);
  e.coinSlot.setAttribute('aria-label', `Insert ${cost} coin${cost === 1 ? '' : 's'}`);
  e.dispensedCapsule.classList.toggle('hidden', machinePhase !== 'capsule');
  e.emptyChute.classList.toggle('hidden', machinePhase === 'capsule');
  e.capsuleChute.disabled = machinePhase !== 'capsule';
  e.coinSlot.disabled = machinePhase !== 'idle' || !canPlayCurrentMachine();
  e.knob.classList.toggle('knob-active', machinePhase === 'coin' || machinePhase === 'turning');

  [e.flowCoin, e.flowTurn, e.flowOpen].forEach(x => x?.classList.remove('active', 'complete'));
  if (machinePhase === 'idle') {
    e.flowCoin?.classList.add('active');
    msg(e.status, state.coins < cost ? `Need ${cost} coin${cost === 1 ? '' : 's'} to play.` : `Tap the coin slot · ${cost} coin${cost === 1 ? '' : 's'} per play.`);
  } else if (machinePhase === 'coin' || machinePhase === 'turning') {
    e.flowCoin?.classList.add('complete'); e.flowTurn?.classList.add('active');
    msg(e.status, `${Math.floor(progress)}% · turn clockwise until the capsule dispenses.`);
  } else if (machinePhase === 'dispensing') {
    e.flowCoin?.classList.add('complete'); e.flowTurn?.classList.add('complete');
    msg(e.status, 'Dispensing your capsule…');
  } else if (machinePhase === 'capsule') {
    e.flowCoin?.classList.add('complete'); e.flowTurn?.classList.add('complete'); e.flowOpen?.classList.add('active');
    msg(e.status, 'Capsule ready — tap it to open.');
  } else {
    [e.flowCoin, e.flowTurn, e.flowOpen].forEach(x => x?.classList.add('complete'));
    msg(e.status, 'Reward unlocked.');
  }
}

function renderPrizeCards() {
  clear(e.prizes);
  const visible = machinePrizes().filter(p => p.enabled);
  if (!currentMachine()) {
    const d = node('div', '', 'empty-state'); d.append(node('strong', 'No machine selected'), node('span', 'Choose a gashapon tab above.')); e.prizes.append(d); return;
  }
  if (!visible.length) {
    const d = node('div', '', 'empty-state'); d.append(node('strong', 'No prizes in this machine'), node('span', isAdmin() ? 'Open Admin and add the first prize.' : 'Please choose another gashapon.')); e.prizes.append(d); return;
  }
  for (const p of visible) {
    const c = document.createElement('div'); c.className = 'p';
    const url = imageUrl(p.image_path);
    if (url) {
      const im = document.createElement('img'); im.src = url; im.alt = p.name; im.referrerPolicy = 'no-referrer';
      im.onerror = () => im.replaceWith(createMissingImage()); c.append(im);
    } else c.append(createMissingImage());
    const body = document.createElement('div'); body.className = 'p-body';
    body.append(node('b', p.name), document.createElement('br'), node('span', `${p.stock} left`, 'muted'));
    c.append(body); e.prizes.append(c);
  }
}

function renderWins() {
  clear(e.wins);
  const wins = machineWins().slice(0, 8);
  if (!wins.length) { e.wins.append(node('div', 'No wins yet.', 'muted')); return; }
  for (const w of wins) {
    const d = document.createElement('div');
    d.append(node('span', w.prize_name), node('span', ` · ${new Date(w.created_at).toLocaleString()}`, 'muted'));
    e.wins.append(d);
  }
}

function syncAdminMachineFields() {
  const m = currentMachine();
  e.machineName.value = m?.name || '';
  if (e.machineCoinCost) e.machineCoinCost.value = String(Math.max(1, Number(m?.coin_cost || 1)));
  if (posterPreviewUrl) { URL.revokeObjectURL(posterPreviewUrl); posterPreviewUrl = null; }
  const poster = imageUrl(m?.poster_path);
  if (poster) { e.machinePosterPreview.src = poster; e.machinePosterPreview.classList.remove('hidden'); }
  else { e.machinePosterPreview.removeAttribute('src'); e.machinePosterPreview.classList.add('hidden'); }
  if (e.machineManagement) e.machineManagement.classList.toggle('hidden', !isMaster());
  e.saveMachine.disabled = !m || !isMaster();
  if (e.uploadMachinePoster) e.uploadMachinePoster.disabled = !m || !isMaster();
  if (e.removeMachinePoster) { e.removeMachinePoster.disabled = !m || !isMaster() || !m?.poster_path; e.removeMachinePoster.classList.toggle('hidden', !m?.poster_path); }
  e.toggleMachine.disabled = !m || !isMaster();
  e.deleteMachine.disabled = !m || !isMaster();
  e.toggleMachine.textContent = m?.enabled ? 'DISABLE MACHINE' : 'ENABLE MACHINE';
  e.add.disabled = !m;
  if (e.prizeImageControls) e.prizeImageControls.classList.toggle('hidden', !isMaster());
  if (!isMaster() && e.imageFile) { e.imageFile.value = ''; e.imagePreview.classList.add('hidden'); }
}

function renderAdminPool() {
  clear(e.pool);
  if (!isAdmin()) return;
  const prizes = machinePrizes();
  if (!prizes.length) { e.pool.append(node('div', 'No prizes in this gashapon yet.', 'muted')); return; }
  for (const p of prizes) {
    const r = document.createElement('div'); r.className = 'item';
    const wrap = document.createElement('div'); wrap.className = 'item-image-wrap';
    const url = imageUrl(p.image_path);
    if (url) {
      const im = document.createElement('img'); im.src = url; im.alt = p.name; im.onerror = () => im.replaceWith(createMissingImage('no-image-mini')); wrap.append(im);
    } else wrap.append(createMissingImage('no-image-mini'));
    const inf = document.createElement('div');
    inf.append(node('b', p.name), node('div', `${p.stock} stock · ${p.enabled ? 'enabled' : 'disabled'}`, 'muted'));
    const a = document.createElement('div'); a.className = 'item-actions';
    if (isMaster()) {
      a.append(btn(p.image_path ? 'Change image' : 'Add image', 'btn secondary', () => choosePrizeImage(p)));
      if (p.image_path) a.append(btn('Remove image', 'btn secondary danger', () => removePrizeImage(p)));
    }
    a.append(
      btn(p.enabled ? 'Disable' : 'Enable', 'btn secondary', () => togglePrize(p)),
      btn('Delete', 'btn secondary danger', () => deletePrize(p))
    );
    r.append(wrap, inf, a); e.pool.append(r);
  }
}

function renderPlayerSearchResults() {
  clear(e.playerSearchResults);
  if (!isAdmin()) return;
  if (!playerSearchResults.length) return;
  for (const p of playerSearchResults) {
    const card = document.createElement('div'); card.className = 'player-result-card' + (p.is_banned ? ' player-banned' : '');
    const ident = document.createElement('div'); ident.className = 'player-result-ident';
    const titleRow = document.createElement('div'); titleRow.className = 'player-title-row';
    const title = node('strong', p.username ? `@${p.username}` : (p.display_name || 'Player'));
    const accountState = node('span', p.is_banned ? 'BANNED' : 'ACTIVE', `player-state ${p.is_banned ? 'banned' : 'active'}`);
    titleRow.append(title, accountState);
    const email = node('span', p.email || '', 'muted');
    const name = p.display_name && p.username ? node('span', p.display_name, 'player-display-name') : null;
    ident.append(titleRow); if (name) ident.append(name); ident.append(email);

    const balance = document.createElement('div'); balance.className = 'player-balance';
    balance.append(node('small', 'BALANCE'), node('strong', String(p.coin_balance ?? 0)), node('span', 'COINS'));

    const controls = document.createElement('div'); controls.className = 'player-credit-controls';
    const amount = document.createElement('input'); amount.type = 'number'; amount.min = '1'; amount.max = '10000'; amount.step = '1'; amount.value = '1'; amount.inputMode = 'numeric'; amount.setAttribute('aria-label', `Coin amount for ${p.username || p.email}`);

    const updateCoins = async delta => {
      const n = Number(amount.value);
      if (!Number.isInteger(n) || n < 1 || n > 10000) return msg(e.playerSearchMsg, 'Enter a coin amount from 1 to 10,000.');
      const signedDelta = delta > 0 ? n : -n;
      add.disabled = deduct.disabled = true;
      msg(e.playerSearchMsg, `${delta > 0 ? 'Adding' : 'Deducting'} ${n} coin${n === 1 ? '' : 's'}…`);
      const { data, error } = await sb.rpc('change_player_coins', { p_user_id: p.user_id, p_delta: signedDelta });
      add.disabled = deduct.disabled = false;
      if (error) return msg(e.playerSearchMsg, friendly(error));
      p.coin_balance = Number(data || 0);
      balance.querySelector('strong').textContent = String(p.coin_balance);
      msg(e.playerSearchMsg, `${delta > 0 ? 'Added' : 'Deducted'} ${n} coin${n === 1 ? '' : 's'} ${delta > 0 ? 'to' : 'from'} ${p.username ? '@' + p.username : p.email}. New balance: ${p.coin_balance}.`);
    };

    const add = btn('+ ADD COINS', 'btn primary compact', () => updateCoins(1));
    const deduct = btn('− DEDUCT', 'btn secondary compact', () => updateCoins(-1));

    const ban = btn(p.is_banned ? 'UNBAN ACCOUNT' : 'BAN ACCOUNT', `btn secondary compact ${p.is_banned ? '' : 'danger'}`, async () => {
      const banning = !p.is_banned;
      const label = p.username ? '@' + p.username : p.email;
      const ok = await confirmAction(
        banning ? 'Ban player account?' : 'Unban player account?',
        banning
          ? `${label} will immediately lose access to the Gashapon machines until a Master or Admin unbans the account.`
          : `${label} will regain access to the Gashapon machines.`,
        banning ? 'BAN ACCOUNT' : 'UNBAN ACCOUNT'
      );
      if (!ok) return;
      ban.disabled = true;
      msg(e.playerSearchMsg, `${banning ? 'Banning' : 'Unbanning'} ${label}…`);
      const { data, error } = await sb.rpc('set_player_ban', { p_user_id: p.user_id, p_banned: banning });
      ban.disabled = false;
      if (error) return msg(e.playerSearchMsg, friendly(error));
      p.is_banned = Boolean(data);
      msg(e.playerSearchMsg, `${label} is now ${p.is_banned ? 'banned' : 'active'}.`);
      renderPlayerSearchResults();
    });

    controls.append(amount, add, deduct, ban);
    card.append(ident, balance, controls); e.playerSearchResults.append(card);
  }
}

async function searchPlayers() {
  if (!isAdmin()) return;
  const q = e.playerSearchInput.value.trim();
  if (q.length < 2) return msg(e.playerSearchMsg, 'Enter at least 2 characters of a username or email.');
  e.playerSearchBtn.disabled = true; msg(e.playerSearchMsg, 'Searching players…'); clear(e.playerSearchResults);
  const { data, error } = await sb.rpc('search_players', { p_query: q });
  e.playerSearchBtn.disabled = false;
  if (error) { playerSearchResults = []; return msg(e.playerSearchMsg, friendly(error)); }
  playerSearchResults = data || [];
  if (!playerSearchResults.length) { msg(e.playerSearchMsg, 'No matching players found.'); return; }
  msg(e.playerSearchMsg, `${playerSearchResults.length} player${playerSearchResults.length === 1 ? '' : 's'} found.`);
  renderPlayerSearchResults();
}

function render() {
  normalizeSelectedMachine();
  const virtualCoinLoaded = machinePhase === 'coin' || machinePhase === 'turning';
  const previewCost = machineCoinCost();
  e.coins.textContent = user && role ? Math.max(0, state.coins - (virtualCoinLoaded ? previewCost : 0)) : '—';
  e.role.textContent = role || '';
  e.role.classList.toggle('hidden', !role);
  e.adminBtn.classList.toggle('hidden', !isAdmin());
  e.playerAccountBtn.classList.toggle('hidden', !isAdmin());
  e.playAdminBtn.classList.toggle('hidden', !isAdmin());
  e.newMachineTop.classList.toggle('hidden', !isMaster());
  renderMachineGallery();
  renderTabs();
  renderPlayPoster();
  renderChamberCapsules();
  renderPrizeCards();
  renderWins();
  renderAdminPool();
  renderPlayerSearchResults();
  syncAdminMachineFields();
  renderMachineInteraction();
  const m = currentMachine();
  const hasPrize = machinePrizes().some(p => p.enabled && p.stock > 0);
  e.roll.disabled = !user || !role || !m || !m.enabled || state.coins < machineCoinCost() || !hasPrize;
}

async function getRole() {
  const { data, error } = await sb.rpc('current_app_role');
  if (error) throw error;
  return data || null;
}

async function loadProfile() {
  const { data, error } = await sb.from('staff_profiles').select('username,display_name').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  profile = data || null;
  e.username.value = profile?.username || '';
  e.display.value = profile?.display_name || '';
}

async function saveProfile() {
  const u = e.username.value.trim().toLowerCase(), d = e.display.value.trim();
  if (!/^[a-z0-9_]{3,24}$/.test(u)) return msg(e.accountMsg, 'Username must be 3–24 characters using lowercase letters, numbers or underscore.');
  if (d.length < 2 || d.length > 40) return msg(e.accountMsg, 'Display name must be 2–40 characters.');
  e.saveProfile.disabled = true; msg(e.accountMsg, 'Saving profile…');
  const q = profile
    ? sb.from('staff_profiles').update({ username: u, display_name: d }).eq('user_id', user.id)
    : sb.from('staff_profiles').insert({ user_id: user.id, username: u, display_name: d });
  const { data, error } = await q.select('username,display_name').single();
  e.saveProfile.disabled = false;
  if (error) return msg(e.accountMsg, friendly(error));
  profile = data; e.username.value = data.username; e.display.value = data.display_name;
  msg(e.accountMsg, `Profile saved. You can now log in with your email or @${data.username}.`);
}

async function load() {
  if (!user || !role) return;
  const balanceQuery = isPlayer()
    ? sb.rpc('my_coin_balance')
    : sb.from('app_settings').select('coin_balance').eq('id', 1).single();
  const [m, p, s, w] = await Promise.all([
    sb.from('gashapon_machines').select('*').order('sort_order').order('created_at'),
    sb.from('prizes').select('*').order('created_at'),
    balanceQuery,
    sb.from('wins').select('*').order('created_at', { ascending: false }).limit(100)
  ]);
  const er = m.error || p.error || s.error || w.error;
  if (er) return msg(e.status, 'Sync error: ' + friendly(er));
  const balance = isPlayer() ? Number(s.data || 0) : Number(s.data?.coin_balance || 0);
  state = { machines: m.data || [], prizes: p.data || [], coins: balance, wins: w.data || [] };
  normalizeSelectedMachine();
  try { await refreshImages(); } catch {}
  render();
  e.live.textContent = 'live sync'; e.live.className = 'live'; msg(e.status, 'Ready.');
}

function stopRealtime() { if (channel) { sb.removeChannel(channel); channel = null; } }
function startRealtime() {
  stopRealtime();
  channel = sb.channel('gashaponfun-secure-v4')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gashapon_machines' }, load)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'prizes' }, load)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, load)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'player_wallets' }, payload => { if (isPlayer() && payload.new?.user_id === user?.id) load(); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'wins' }, load)
    .subscribe();
}

async function handleSession(s) {
  user = s?.user || null; role = null; stopRealtime();
  if (!user) return showSignedOut();
  e.login.classList.add('hidden'); e.openLogin.classList.add('hidden'); e.email.textContent = user.email || ''; e.headerLogout.classList.remove('hidden');
  try { role = await getRole(); } catch (x) { msg(e.loginmsg, friendly(x)); return showSignedOut(); }
  if (role === 'banned') {
    e.app.classList.add('hidden');
    e.noticeTitle.textContent = 'Account banned';
    e.noticeText.textContent = 'This player account has been banned from GashaponFun. Please contact a Master or Admin if you believe this is a mistake.';
    e.notice.classList.remove('hidden');
    e.live.textContent = 'account banned';
    e.coins.textContent = '—';
    e.role.textContent = 'banned';
    e.role.classList.remove('hidden');
    return;
  }
  if (!role) {
    e.noticeTitle.textContent = 'Account awaiting approval';
    e.noticeText.textContent = 'Your email is verified, but this account has not been approved for GashaponFun access.';
    e.app.classList.add('hidden'); e.notice.classList.remove('hidden'); e.live.textContent = 'awaiting approval'; e.coins.textContent = '—'; return;
  }
  e.noticeTitle.textContent = 'Account awaiting approval';
  e.noticeText.textContent = 'Your email is verified, but this account has not been approved for GashaponFun access.';
  e.notice.classList.add('hidden'); e.app.classList.remove('hidden');
  if (e.machineManagement) e.machineManagement.classList.toggle('hidden', !isMaster());
  e.account.classList.add('hidden');
  e.playerAccountPanel.classList.add('hidden');
  e.admin.classList.toggle('hidden', !isAdmin());
  uiView = 'home'; lastMainView = 'home'; resetMachineInteraction(); setView('home');
  try { await loadProfile(); } catch (x) { msg(e.status, 'Profile error: ' + friendly(x)); }
  await load(); startRealtime();
}

function showSignedOut() {
  user = role = profile = null; selectedMachineId = null; playerSearchResults = []; if (e.playerSearchInput) e.playerSearchInput.value = ''; if (e.playerSearchResults) clear(e.playerSearchResults);
  state = { coins: 0, machines: [], prizes: [], wins: [] }; stopRealtime();
  uiView = 'home'; lastMainView = 'home'; resetMachineInteraction();
  e.login.classList.remove('hidden'); e.openLogin.classList.add('hidden'); e.app.classList.add('hidden'); e.notice.classList.add('hidden');
  e.role.classList.add('hidden'); e.headerLogout.classList.add('hidden'); e.live.textContent = 'signed out'; e.live.className = ''; e.coins.textContent = '—';
}

function closeLogin() {
  e.login.classList.add('hidden');
  if (!user) e.openLogin.classList.remove('hidden');
}

function openLogin() {
  if (user) return;
  e.openLogin.classList.add('hidden');
  e.login.classList.remove('hidden');
}

function closePasswordModal() {
  e.passwordModal.classList.add('hidden');
  if (recovery) {
    recovery = false;
    history.replaceState({}, '', location.pathname);
  }
}

let confirmResolver = null;
function confirmAction(title, text, confirmLabel = 'CONFIRM') {
  if (confirmResolver) { confirmResolver(false); confirmResolver = null; }
  e.confirmTitle.textContent = title;
  e.confirmText.textContent = text;
  e.confirmOk.textContent = confirmLabel;
  e.confirmModal.classList.remove('hidden');
  return new Promise(resolve => { confirmResolver = resolve; });
}
function finishConfirm(value) {
  e.confirmModal.classList.add('hidden');
  const resolve = confirmResolver; confirmResolver = null;
  if (resolve) resolve(value);
}

async function signIn() {
  const identifier = e.identifier.value.trim(), password = e.password.value;
  if (!identifier || !password) return msg(e.loginmsg, 'Enter your email or username and password.');
  e.signin.disabled = true; msg(e.loginmsg, 'Signing in…');
  try {
    const r = await fetch(URL_ + '/functions/v1/login-with-identifier', {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KEY }, body: JSON.stringify({ identifier, password })
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (body.error === 'EMAIL_NOT_CONFIRMED') { msg(e.loginmsg, 'Confirm your email first. Enter your email here and tap Resend verification email.'); e.resend.classList.remove('hidden'); }
      else msg(e.loginmsg, 'Email/username or password is incorrect.');
      return;
    }
    const { data, error } = await sb.auth.setSession({ access_token: body.access_token, refresh_token: body.refresh_token });
    if (error || !data?.session) return msg(e.loginmsg, 'Could not start the login session. Try again.');
    msg(e.loginmsg, ''); await handleSession(data.session);
  } catch { msg(e.loginmsg, 'Unable to reach the login service. Check your connection and try again.'); }
  finally { e.signin.disabled = false; }
}

async function signUp() {
  const email = e.identifier.value.trim(), password = e.password.value;
  if (!email || !password) return msg(e.loginmsg, 'Enter an email and password.');
  if (!email.includes('@')) return msg(e.loginmsg, 'Use your email address when creating a new account. Username login becomes available after approval.');
  if (password.length < 12) return msg(e.loginmsg, 'Use at least 12 characters for the password.');
  e.signup.disabled = true; msg(e.loginmsg, 'Creating account…');
  const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: APP } });
  e.signup.disabled = false;
  if (error) return msg(e.loginmsg, friendly(error));
  lastSignupEmail = email; e.resend.classList.remove('hidden'); if (data?.session) await sb.auth.signOut();
  msg(e.loginmsg, 'Account created. Check your email and open the verification link. After verification, you can sign in as a Player. Staff/Admin access still requires Master approval.');
}

async function resendVerification() {
  const typed = e.identifier.value.trim(), email = lastSignupEmail || (typed.includes('@') ? typed : '');
  if (!email) return msg(e.loginmsg, 'Enter your email address (not username) first.');
  e.resend.disabled = true;
  const { error } = await sb.auth.resend({ type: 'signup', email, options: { emailRedirectTo: APP } });
  e.resend.disabled = false; msg(e.loginmsg, error ? friendly(error) : 'Verification email sent. Check your inbox and spam folder.');
}

async function forgotPassword() {
  const email = e.identifier.value.trim();
  if (!email.includes('@')) return msg(e.loginmsg, 'For password recovery, enter your email address (not username), then tap Forgot password again.');
  e.forgot.disabled = true; msg(e.loginmsg, 'Sending reset email…');
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: APP + '/?recovery=1' });
  e.forgot.disabled = false;
  msg(e.loginmsg, error && String(error.message).toLowerCase().includes('rate') ? 'Too many requests. Try again later.' : 'If this email belongs to an account, a password-reset link has been sent. Check your inbox and spam folder.');
}

function openPassword(mode = 'change') {
  recovery = mode === 'recovery';
  e.passwordTitle.textContent = recovery ? 'Set new password' : 'Change password';
  e.passwordHelp.textContent = recovery ? 'Your reset link was verified. Choose a new password.' : 'Enter your current password, then choose a new password.';
  e.currentLabel.classList.toggle('hidden', recovery); e.current.value = e.newPw.value = e.confirmPw.value = ''; msg(e.passwordMsg, '');
  e.cancelPw.classList.toggle('hidden', recovery); e.passwordModal.classList.remove('hidden');
}

async function savePassword() {
  const cur = e.current.value, n = e.newPw.value, c = e.confirmPw.value;
  if (!recovery && !cur) return msg(e.passwordMsg, 'Enter your current password.');
  if (n.length < 12) return msg(e.passwordMsg, 'New password must be at least 12 characters.');
  if (n !== c) return msg(e.passwordMsg, 'The new passwords do not match.');
  e.savePw.disabled = true; msg(e.passwordMsg, 'Updating password…');
  if (!recovery) {
    const verify = await sb.auth.signInWithPassword({ email: user.email, password: cur });
    if (verify.error) { e.savePw.disabled = false; return msg(e.passwordMsg, 'Current password is incorrect.'); }
  }
  const { error } = await sb.auth.updateUser({ password: n });
  e.savePw.disabled = false;
  if (error) return msg(e.passwordMsg, friendly(error));
  msg(e.passwordMsg, 'Password updated successfully.');
  if (recovery) {
    recovery = false; history.replaceState({}, '', location.pathname);
    setTimeout(async () => { e.passwordModal.classList.add('hidden'); const { data } = await sb.auth.getSession(); if (data?.session) await handleSession(data.session); }, 500);
  }
}

async function signOut() { await sb.auth.signOut(); showSignedOut(); }

function closeResult() {
  e.result.classList.add('hidden');
  e.rimg.classList.add('hidden'); e.rimg.removeAttribute('src'); e.rnoimg.classList.remove('hidden');
  resetMachineInteraction('Tap the coin slot to begin.');
  render();
}

function insertCoin() {
  if (machinePhase !== 'idle') return;
  const m = currentMachine();
  if (!m || !m.enabled) return msg(e.status, 'This gashapon machine is unavailable.');
  const cost = machineCoinCost();
  if (state.coins < cost) return msg(e.status, `Need ${cost} coin${cost === 1 ? '' : 's'} to play this machine.`);
  if (!machinePrizes().some(p => p.enabled && p.stock > 0)) return msg(e.status, 'This gashapon has no available prizes.');
  machinePhase = 'coin';
  turnProgress = 0;
  pendingPrize = null;
  msg(e.status, 'Coin loaded. Turn the knob clockwise a few times.');
  render();
  if (navigator.vibrate) navigator.vibrate(30);
}

function knobAngleFromEvent(ev) {
  const r = e.knob.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  return Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
}

function addTurnDegrees(delta) {
  if (!(machinePhase === 'coin' || machinePhase === 'turning') || completingTurn) return;
  machinePhase = 'turning';
  turnProgress = Math.min(720, turnProgress + Math.max(0, delta));
  render();
  if (turnProgress >= 720) completeMachineTurn();
}

function knobPointerDown(ev) {
  if (!(machinePhase === 'coin' || machinePhase === 'turning')) return;
  knobDragging = true;
  lastKnobAngle = knobAngleFromEvent(ev);
  try { e.knob.setPointerCapture(ev.pointerId); } catch {}
  ev.preventDefault();
}

function knobPointerMove(ev) {
  if (!knobDragging || !(machinePhase === 'coin' || machinePhase === 'turning')) return;
  const a = knobAngleFromEvent(ev);
  let d = a - lastKnobAngle;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  lastKnobAngle = a;
  if (d > 0 && d < 95) addTurnDegrees(d);
  ev.preventDefault();
}

function knobPointerUp(ev) {
  knobDragging = false;
  lastKnobAngle = null;
  try { e.knob.releasePointerCapture(ev.pointerId); } catch {}
}

async function completeMachineTurn() {
  if (completingTurn || turnProgress < 720) return;
  const m = currentMachine(); if (!m) return resetMachineInteraction();
  completingTurn = true;
  machinePhase = 'dispensing';
  msg(e.status, 'Dispensing capsule…');
  render();
  if (navigator.vibrate) navigator.vibrate([35, 45, 35]);
  const started = Date.now();
  const { data, error } = await sb.rpc('roll_gashapon', { p_machine_id: m.id });
  const wait = Math.max(0, 700 - (Date.now() - started));
  if (wait) await new Promise(r => setTimeout(r, wait));
  if (error) {
    completingTurn = false;
    resetMachineInteraction(friendly(error));
    return render();
  }
  const p = Array.isArray(data) ? data[0] : data;
  pendingPrize = p;
  state.coins = Math.max(0, state.coins - machineCoinCost());
  const stockPrize = state.prizes.find(x => x.id === p.prize_id);
  if (stockPrize && Number.isFinite(Number(p.remaining_stock))) stockPrize.stock = Number(p.remaining_stock);
  const wonPrize = state.prizes.find(x => x.id === p.prize_id) || { id: p.prize_id, name: p.prize_name };
  e.dispensedCapsule.style.setProperty('--capsule-hue', String(capsuleHue(wonPrize)));
  const wonImage = imageUrl(p.prize_image_path) || await signedImage(p.prize_image_path);
  if (wonImage) {
    e.dispensedCapsuleImage.src = wonImage; e.dispensedCapsuleImage.alt = p.prize_name || 'Prize'; e.dispensedCapsuleImage.classList.remove('hidden');
  } else {
    e.dispensedCapsuleImage.removeAttribute('src'); e.dispensedCapsuleImage.alt = ''; e.dispensedCapsuleImage.classList.add('hidden');
  }
  machinePhase = 'capsule';
  completingTurn = false;
  msg(e.status, 'Capsule ready. Tap it to open.');
  render();
}

async function openDispensedCapsule() {
  if (machinePhase !== 'capsule' || !pendingPrize) return;
  machinePhase = 'revealed';
  e.dispensedCapsule.classList.add('opening');
  msg(e.status, 'Opening capsule…');
  if (navigator.vibrate) navigator.vibrate(45);
  await new Promise(r => setTimeout(r, 380));
  const p = pendingPrize;
  e.rname.textContent = p.prize_name;
  e.rstock.textContent = `${p.remaining_stock} left in inventory`;
  const url = await signedImage(p.prize_image_path);
  if (url) {
    e.rimg.src = url; e.rimg.alt = p.prize_name; e.rimg.classList.remove('hidden'); e.rnoimg.classList.add('hidden');
    e.rimg.onerror = () => { e.rimg.classList.add('hidden'); e.rnoimg.classList.remove('hidden'); };
  } else { e.rimg.classList.add('hidden'); e.rnoimg.classList.remove('hidden'); }
  e.result.classList.remove('hidden');
  e.dispensedCapsule.classList.remove('opening');
  msg(e.status, 'Reward unlocked.');
  try { await load(); } catch {}
  renderMachineInteraction();
}

async function roll() {
  // Legacy hidden control: preserve compatibility by starting the physical flow.
  if (machinePhase === 'idle') insertCoin();
}

async function changeCoins(d) {
  const { data, error } = await sb.rpc('change_coin_balance', { p_delta: d });
  if (error) return msg(e.status, friendly(error));
  state.coins = Number(data); render(); msg(e.status, 'Coin balance updated.');
}

async function compress(file, maxSize = 1400) {
  if (file.size > 8 * 1024 * 1024) throw Error('Image is too large. Use an image under 8 MB.');
  const u = URL.createObjectURL(file);
  try {
    const im = await new Promise((r, j) => { const x = new Image(); x.onload = () => r(x); x.onerror = j; x.src = u; });
    const s = Math.min(1, maxSize / Math.max(im.width, im.height));
    const w = Math.max(1, Math.round(im.width * s)), h = Math.max(1, Math.round(im.height * s));
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
    return await new Promise(r => c.toBlob(r, 'image/jpeg', .86));
  } finally { URL.revokeObjectURL(u); }
}

async function createMachine() {
  if (!isMaster()) return;
  const name = e.createMachineName.value.trim();
  const cost = Math.floor(Number(e.createMachineCost?.value || 1));
  if (!name) return msg(e.createMachineMsg, 'Enter a name for the new gashapon machine.');
  if (!Number.isInteger(cost) || cost < 1 || cost > 99) return msg(e.createMachineMsg, 'Coin cost must be between 1 and 99.');
  const maxOrder = state.machines.reduce((n, m) => Math.max(n, Number(m.sort_order || 0)), -1);
  e.createMachineSubmit.disabled = true; msg(e.createMachineMsg, 'Creating gashapon…');
  const { data, error } = await sb.from('gashapon_machines').insert({ name, coin_cost: cost, sort_order: maxOrder + 1, enabled: true }).select('*').single();
  e.createMachineSubmit.disabled = false;
  if (error) return msg(e.createMachineMsg, friendly(error));
  selectedMachineId = data.id;
  e.createMachineName.value = '';
  if (e.createMachineCost) e.createMachineCost.value = '1';
  e.createMachineModal.classList.add('hidden');
  await load();
  showAdminView();
  syncAdminMachineFields();
  msg(e.machineAdminMsg, 'Gashapon created. Upload a poster to make its home banner stand out.');
}

function openCreateMachine() {
  if (!isMaster()) return;
  e.createMachineName.value = '';
  if (e.createMachineCost) e.createMachineCost.value = '1';
  msg(e.createMachineMsg, '');
  e.createMachineModal.classList.remove('hidden');
  setTimeout(() => e.createMachineName.focus(), 0);
}

function closeCreateMachine() {
  e.createMachineModal.classList.add('hidden');
  e.createMachineName.value = '';
  if (e.createMachineCost) e.createMachineCost.value = '1';
  msg(e.createMachineMsg, '');
}

async function saveMachine() {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required.');
  const m = currentMachine(); if (!m) return msg(e.machineAdminMsg, 'Select a machine first.');
  const name = e.machineName.value.trim(); if (!name) return msg(e.machineAdminMsg, 'Enter a machine name.');
  const cost = Math.floor(Number(e.machineCoinCost?.value || 1));
  if (!Number.isInteger(cost) || cost < 1 || cost > 99) return msg(e.machineAdminMsg, 'Coin cost must be between 1 and 99.');
  e.saveMachine.disabled = true; msg(e.machineAdminMsg, 'Saving machine settings…');
  const { error } = await sb.from('gashapon_machines').update({ name, coin_cost: cost, updated_at: new Date().toISOString() }).eq('id', m.id);
  e.saveMachine.disabled = false;
  if (error) return msg(e.machineAdminMsg, friendly(error));
  await load(); msg(e.machineAdminMsg, `Machine saved · ${cost} coin${cost === 1 ? '' : 's'} per play.`);
}

function chooseMachinePoster() {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required to upload posters.');
  const m = currentMachine(); if (!m) return msg(e.machineAdminMsg, 'Select a machine first.');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/webp';
  input.className = 'image-change-input';
  input.onchange = async () => {
    const file = input.files?.[0];
    try { if (file) await uploadMachinePosterFile(m, file); }
    finally { input.remove(); }
  };
  document.body.append(input);
  input.click();
}

async function uploadMachinePosterFile(machine, file) {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required to upload posters.');
  e.uploadMachinePoster.disabled = true; msg(e.machineAdminMsg, 'Uploading poster…');
  let newPath = null;
  try {
    const blob = await compress(file, 1800);
    if (!blob) throw Error('Could not process poster.');
    newPath = `${user.id}/machines/${machine.id}/${crypto.randomUUID()}.jpg`;
    const up = await sb.storage.from('prize-images').upload(newPath, blob, { contentType: 'image/jpeg' });
    if (up.error) throw up.error;
    const { error } = await sb.from('gashapon_machines').update({ poster_path: newPath, updated_at: new Date().toISOString() }).eq('id', machine.id);
    if (error) throw error;
    if (machine.poster_path && machine.poster_path !== newPath) {
      await sb.storage.from('prize-images').remove([machine.poster_path]).catch(() => {});
    }
    await load();
    msg(e.machineAdminMsg, 'Machine poster uploaded.');
  } catch (x) {
    if (newPath) await sb.storage.from('prize-images').remove([newPath]).catch(() => {});
    msg(e.machineAdminMsg, friendly(x));
  } finally {
    e.uploadMachinePoster.disabled = false;
  }
}

async function removeMachinePoster() {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required.');
  const m = currentMachine(); if (!m || !m.poster_path) return;
  const ok = await confirmAction('Remove machine poster?', `Remove the poster from “${m.name}”? The gashapon machine will remain.`, 'REMOVE POSTER');
  if (!ok) return;
  e.removeMachinePoster.disabled = true; msg(e.machineAdminMsg, 'Removing poster…');
  const oldPath = m.poster_path;
  const { error } = await sb.from('gashapon_machines').update({ poster_path: null, updated_at: new Date().toISOString() }).eq('id', m.id);
  if (error) { e.removeMachinePoster.disabled = false; return msg(e.machineAdminMsg, friendly(error)); }
  await sb.storage.from('prize-images').remove([oldPath]).catch(() => {});
  await load(); msg(e.machineAdminMsg, 'Machine poster removed.');
}

async function toggleMachine() {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required.');
  const m = currentMachine(); if (!m) return msg(e.machineAdminMsg, 'Select a machine first.');
  e.toggleMachine.disabled = true; msg(e.machineAdminMsg, m.enabled ? 'Disabling machine…' : 'Enabling machine…');
  const { error } = await sb.from('gashapon_machines').update({ enabled: !m.enabled, updated_at: new Date().toISOString() }).eq('id', m.id);
  e.toggleMachine.disabled = false;
  if (error) return msg(e.machineAdminMsg, friendly(error));
  await load(); msg(e.machineAdminMsg, m.enabled ? 'Machine disabled.' : 'Machine enabled.');
}

async function deleteMachine() {
  if (!isMaster()) return msg(e.machineAdminMsg, 'Master access is required.');
  const m = currentMachine(); if (!m) return msg(e.machineAdminMsg, 'Select a machine first.');
  const prizes = state.prizes.filter(p => p.machine_id === m.id);
  const ok = await confirmAction('Remove gashapon machine?', `Remove “${m.name}”? This permanently removes the machine and its ${prizes.length} prize${prizes.length === 1 ? '' : 's'}. Win history is kept.`, 'REMOVE MACHINE');
  if (!ok) return;
  e.deleteMachine.disabled = true; msg(e.machineAdminMsg, 'Removing machine…');
  const paths = [...new Set([m.poster_path, ...prizes.map(p => p.image_path)].filter(Boolean))];
  const { error } = await sb.rpc('delete_gashapon_machine', { p_machine_id: m.id });
  e.deleteMachine.disabled = false;
  if (error) return msg(e.machineAdminMsg, friendly(error));
  if (paths.length) await sb.storage.from('prize-images').remove(paths).catch(() => {});
  selectedMachineId = null; await load(); msg(e.machineAdminMsg, 'Machine removed.');
}

async function addPrize() {
  if (!isAdmin()) return;
  const m = currentMachine(); if (!m) return msg(e.status, 'Select a gashapon machine first.');
  const name = e.name.value.trim(), stock = Math.max(0, Number(e.stock.value || 0)), file = isMaster() ? e.imageFile.files?.[0] : null;
  if (!name) return msg(e.status, 'Enter a prize name.');
  e.add.disabled = true; msg(e.status, 'Saving prize…');
  let path = null;
  try {
    if (file) {
      const blob = await compress(file, 1200); if (!blob) throw Error('Could not process image.');
      path = `${user.id}/prizes/${m.id}/${crypto.randomUUID()}.jpg`;
      const up = await sb.storage.from('prize-images').upload(path, blob, { contentType: 'image/jpeg' }); if (up.error) throw up.error;
    }
    const payload = { machine_id: m.id, name, stock, enabled: true }; if (path) payload.image_path = path;
    const { error } = await sb.from('prizes').insert(payload);
    if (error) throw error;
    e.name.value = ''; e.stock.value = '10'; if (e.imageFile) e.imageFile.value = ''; e.imagePreview.classList.add('hidden');
    await load(); msg(e.status, `Prize added to ${m.name}.`);
  } catch (x) {
    if (path) await sb.storage.from('prize-images').remove([path]).catch(() => {});
    msg(e.status, friendly(x));
  } finally { e.add.disabled = false; }
}

function choosePrizeImage(p) {
  if (!isMaster()) return msg(e.status, 'Master access is required to upload prize images.');
  const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/png,image/jpeg,image/webp'; input.className = 'image-change-input';
  input.onchange = async () => { const file = input.files?.[0]; try { if (file) await replacePrizeImage(p, file); } finally { input.remove(); } };
  document.body.append(input); input.click();
}

async function replacePrizeImage(p, file) {
  if (!isMaster()) return msg(e.status, 'Master access is required to upload prize images.');
  msg(e.status, `Updating ${p.name} image…`);
  let path = null;
  try {
    const blob = await compress(file, 1200); if (!blob) throw Error('Could not process image.');
    path = `${user.id}/prizes/${p.machine_id}/${p.id}-${crypto.randomUUID()}.jpg`;
    const up = await sb.storage.from('prize-images').upload(path, blob, { contentType: 'image/jpeg' }); if (up.error) throw up.error;
    const { error } = await sb.from('prizes').update({ image_path: path, updated_at: new Date().toISOString() }).eq('id', p.id); if (error) throw error;
    if (p.image_path) await sb.storage.from('prize-images').remove([p.image_path]);
    await load(); msg(e.status, `${p.name} image updated.`);
  } catch (x) {
    if (path) await sb.storage.from('prize-images').remove([path]).catch(() => {});
    msg(e.status, friendly(x));
  }
}


async function removePrizeImage(p) {
  if (!isMaster()) return msg(e.status, 'Master access is required to remove prize images.');
  if (!p.image_path) return;
  const ok = await confirmAction('Remove prize image?', `Remove the image from “${p.name}”? The prize itself will remain.`, 'REMOVE IMAGE');
  if (!ok) return;
  msg(e.status, `Removing ${p.name} image…`);
  const oldPath = p.image_path;
  const { error } = await sb.from('prizes').update({ image_path: null, updated_at: new Date().toISOString() }).eq('id', p.id);
  if (error) return msg(e.status, friendly(error));
  await sb.storage.from('prize-images').remove([oldPath]).catch(() => {});
  await load(); msg(e.status, `${p.name} image removed.`);
}

async function togglePrize(p) {
  const { error } = await sb.from('prizes').update({ enabled: !p.enabled, updated_at: new Date().toISOString() }).eq('id', p.id);
  error ? msg(e.status, friendly(error)) : await load();
}

async function deletePrize(p) {
  if (p.image_path && !isMaster()) return msg(e.status, 'Master access is required to delete a prize that has an uploaded image.');
  const ok = await confirmAction('Delete prize?', `Delete “${p.name}” from this gashapon?`, 'DELETE PRIZE');
  if (!ok) return;
  const { error } = await sb.from('prizes').delete().eq('id', p.id); if (error) return msg(e.status, friendly(error));
  if (p.image_path && isMaster()) await sb.storage.from('prize-images').remove([p.image_path]).catch(() => {});
  await load();
}


function showAdminView() {
  if (!isAdmin()) return;
  if (!setView('console')) return;
  e.account.classList.add('hidden');
  e.playerAccountPanel.classList.add('hidden');
  e.admin.classList.remove('hidden');
  syncAdminMachineFields();
}

function showAccountView() {
  if (!setView('console')) return;
  e.admin.classList.add('hidden');
  e.playerAccountPanel.classList.add('hidden');
  e.account.classList.remove('hidden');
  msg(e.accountMsg, '');
}

function showPlayerAccountView() {
  if (!isAdmin()) return;
  if (!setView('console')) return;
  e.admin.classList.add('hidden');
  e.account.classList.add('hidden');
  e.playerAccountPanel.classList.remove('hidden');
  msg(e.playerSearchMsg, '');
  setTimeout(() => e.playerSearchInput?.focus(), 0);
}

function closeConsoleView() {
  e.account.classList.add('hidden');
  e.playerAccountPanel.classList.add('hidden');
  if (isAdmin()) e.admin.classList.remove('hidden');
  setView(lastMainView === 'play' ? 'play' : 'home');
}

e.signin.onclick = signIn; e.signup.onclick = signUp; e.forgot.onclick = forgotPassword; e.resend.onclick = resendVerification; e.loginClose.onclick = closeLogin; e.openLogin.onclick = openLogin;
e.password.onkeydown = x => { if (x.key === 'Enter') signIn(); };
[e.logout, e.headerLogout, e.accountLogout, e.noticeLogout].forEach(x => x.onclick = signOut);
e.accountBtn.onclick = showAccountView; e.accountFromAdmin.onclick = showAccountView;
e.playerAccountBtn.onclick = showPlayerAccountView;
e.adminBtn.onclick = showAdminView; e.playAdminBtn.onclick = showAdminView; e.consoleBack.onclick = closeConsoleView;
e.backToMachines.onclick = () => setView('home');
e.saveProfile.onclick = saveProfile; e.changePw.onclick = () => openPassword(); e.savePw.onclick = savePassword;
e.cancelPw.onclick = closePasswordModal; e.passwordClose.onclick = closePasswordModal;
e.roll.onclick = roll; e.claim.onclick = closeResult; e.resultClose.onclick = closeResult;
e.confirmOk.onclick = () => finishConfirm(true); e.confirmCancel.onclick = () => finishConfirm(false); e.confirmClose.onclick = () => finishConfirm(false);
e.newMachineTop.onclick = openCreateMachine; e.createMachineSubmit.onclick = createMachine; e.createMachineClose.onclick = closeCreateMachine; e.createMachineCancel.onclick = closeCreateMachine; e.createMachineName.onkeydown = x => { if (x.key === 'Enter') createMachine(); }; e.saveMachine.onclick = saveMachine; e.uploadMachinePoster.onclick = chooseMachinePoster; e.removeMachinePoster.onclick = removeMachinePoster; e.toggleMachine.onclick = toggleMachine; e.deleteMachine.onclick = deleteMachine;
document.querySelectorAll('.coinBtn').forEach(b => b.onclick = () => changeCoins(Number(b.dataset.d)));
e.playerSearchBtn.onclick = searchPlayers; e.playerSearchInput.onkeydown = ev => { if (ev.key === 'Enter') searchPlayers(); };
e.add.onclick = addPrize;

e.coinSlot.onclick = insertCoin;
e.capsuleChute.onclick = openDispensedCapsule;
e.knob.addEventListener('pointerdown', knobPointerDown);
e.knob.addEventListener('pointermove', knobPointerMove);
e.knob.addEventListener('pointerup', knobPointerUp);
e.knob.addEventListener('pointercancel', knobPointerUp);
e.knob.addEventListener('keydown', ev => {
  if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault(); addTurnDegrees(ev.key === 'Enter' || ev.key === ' ' ? 90 : 45);
  }
});

e.imageFile.onchange = () => {
  if (!isMaster()) { e.imageFile.value = ''; e.imagePreview.classList.add('hidden'); return msg(e.status, 'Master access is required to upload images.'); }
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const f = e.imageFile.files?.[0]; if (!f) return e.imagePreview.classList.add('hidden');
  previewUrl = URL.createObjectURL(f); e.imagePreview.src = previewUrl; e.imagePreview.classList.remove('hidden');
};


sb.auth.onAuthStateChange((event, s) => {
  if (event === 'PASSWORD_RECOVERY') { user = s?.user || null; return setTimeout(() => openPassword('recovery'), 0); }
  if (event === 'SIGNED_OUT') showSignedOut();
  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && s) setTimeout(() => handleSession(s), 0);
});

const { data } = await sb.auth.getSession();
data?.session ? await handleSession(data.session) : showSignedOut();
if (new URLSearchParams(location.search).get('recovery') === '1' && data?.session) openPassword('recovery');
setInterval(() => { if (user && role) load(); }, 45 * 60 * 1000);
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js'));
