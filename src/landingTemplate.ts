// Adapted version of https://github.com/Stremio/stremio-addon-sdk/blob/v1.6.2/src/landingTemplate.js
import { CustomManifest } from './types';
import { envGet } from './utils';

const STYLESHEET = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg: #08080c;
  --surface: rgba(255,255,255,0.035);
  --surface-hover: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.07);
  --border-focus: rgba(124,58,237,0.5);
  --text: #e4e4e7;
  --text-muted: #71717a;
  --text-dim: #a1a1aa;
  --accent: #7c3aed;
  --accent-light: #a78bfa;
  --accent-glow: rgba(124,58,237,0.25);
  --success: #10b981;
  --success-glow: rgba(16,185,129,0.2);
  --error: #ef4444;
  --warn: #f59e0b;
  --radius: 14px;
  --radius-sm: 8px;
  --radius-xs: 6px;
}

html {
  background: var(--bg);
  min-height: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  line-height: 1.6;
  padding: 2rem 1rem 4rem;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Ambient background glow */
body::before {
  content: '';
  position: fixed;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 60vh;
  background: radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── Layout ── */
.wrapper {
  max-width: 680px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ── Hero ── */
.hero {
  text-align: center;
  padding: 1rem 0 2rem;
  animation: fadeUp 0.6s ease-out both;
}

.hero-logo {
  width: 96px;
  height: 96px;
  border-radius: 22px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 24px var(--accent-glow));
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #e4e4e7, var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.hero-version {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent-light);
  background: rgba(124,58,237,0.12);
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.hero-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.5;
}

.hero-links {
  margin-top: 0.75rem;
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  font-size: 0.8rem;
}

.hero-links a {
  color: var(--accent-light);
  text-decoration: none;
  transition: color 0.2s;
}

.hero-links a:hover {
  color: #c4b5fd;
}

/* ── Sections ── */
.section {
  margin-top: 1.25rem;
  animation: fadeUp 0.5s ease-out both;
}

.section:nth-child(2) { animation-delay: 0.08s; }
.section:nth-child(3) { animation-delay: 0.12s; }
.section:nth-child(4) { animation-delay: 0.16s; }
.section:nth-child(5) { animation-delay: 0.20s; }
.section:nth-child(6) { animation-delay: 0.24s; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: border-color 0.3s;
}

.card:hover {
  border-color: rgba(255,255,255,0.1);
}

/* Collapsible sections */
details.card {
  overflow: hidden;
}

details.card > summary {
  padding: 1rem 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text);
  user-select: none;
  list-style: none;
  transition: background 0.2s;
}

details.card > summary::-webkit-details-marker { display: none; }

details.card > summary::after {
  content: '';
  margin-left: auto;
  width: 6px;
  height: 6px;
  border-right: 2px solid var(--text-muted);
  border-bottom: 2px solid var(--text-muted);
  transform: rotate(-45deg);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

details[open].card > summary::after {
  transform: rotate(45deg);
}

details.card > summary:hover {
  background: var(--surface-hover);
}

details.card > .section-body {
  padding: 0 1.25rem 1.25rem;
}

/* Non-collapsible card */
.card-static {
  padding: 1.25rem;
}

.section-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--accent-light);
  opacity: 0.85;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
}

.section-subtitle {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 0.25rem;
}

/* ── Input fields ── */
.field {
  margin-bottom: 0.875rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-dim);
  margin-bottom: 0.35rem;
}

.field-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  color: var(--text);
  font-family: inherit;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.field-input::placeholder {
  color: var(--text-muted);
}

/* ── Checkbox grid (languages) ── */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.4rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: background 0.15s;
  font-size: 0.78rem;
  color: var(--text-dim);
}

.checkbox-item:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.checkbox-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  background: rgba(0,0,0,0.3);
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  transition: all 0.15s;
}

.checkbox-item input[type="checkbox"]:checked {
  background: var(--accent);
  border-color: var(--accent);
}

.checkbox-item input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 4.5px;
  top: 1.5px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ── Pill toggles (resolutions) ── */
.pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pill-item {
  position: relative;
}

.pill-item input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.pill-label {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
  cursor: pointer;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--border);
  color: var(--text-dim);
  transition: all 0.2s;
  user-select: none;
}

.pill-label:hover {
  border-color: rgba(255,255,255,0.15);
  color: var(--text);
}

.pill-item input:checked + .pill-label {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.3);
  color: #fca5a5;
}

/* ── AI key test button ── */
.field-row {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.field-row .field-input {
  flex: 1;
}

.test-btn {
  padding: 0.55rem 0.85rem;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  background: rgba(0,0,0,0.3);
  color: var(--text-dim);
  white-space: nowrap;
  transition: all 0.2s;
}

.test-btn:hover {
  background: var(--surface-hover);
  border-color: rgba(255,255,255,0.15);
  color: var(--text);
}

.test-result {
  font-size: 0.7rem;
  margin-top: 0.3rem;
  min-height: 1rem;
  transition: color 0.2s;
}

.test-result.success { color: var(--success); }
.test-result.error { color: var(--error); }
.test-result.loading { color: var(--warn); }

/* ── Action buttons ── */
.actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.6rem;
  animation: fadeUp 0.5s ease-out 0.3s both;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.8rem 1.25rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
  box-shadow: 0 4px 20px var(--accent-glow);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(124,58,237,0.35);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px var(--accent-glow);
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%);
  border: 1px solid rgba(16,185,129,0.25);
  color: #6ee7b7;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(6,182,212,0.15) 100%);
  border-color: rgba(16,185,129,0.4);
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(1px);
}

/* ── Info bar ── */
.info-bar {
  margin-top: 1.25rem;
  text-align: center;
  animation: fadeUp 0.5s ease-out 0.35s both;
}

.info-bar p {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.info-bar a {
  color: var(--accent-light);
  text-decoration: none;
  transition: color 0.2s;
}

.info-bar a:hover {
  color: #c4b5fd;
}

/* ── Toast notification ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(16,185,129,0.95);
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
}

.toast.visible {
  opacity: 1;
  visibility: visible;
}

/* ── Keyframes ── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Responsive ── */

/* Tablet / small desktop */
@media (max-width: 768px) {
  body { padding: 1.5rem 1rem 3rem; }
  .wrapper { max-width: 100%; }
  .hero-logo { width: 80px; height: 80px; border-radius: 18px; }
  .hero-title { font-size: 2rem; }
  .hero-desc { font-size: 0.82rem; }
  .checkbox-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  details.card > summary { padding: 0.9rem 1rem; }
  details.card > .section-body { padding: 0 1rem 1rem; }
  .btn { padding: 0.75rem 1rem; font-size: 0.8rem; }
}

/* Phone landscape */
@media (max-width: 600px) {
  .hero-logo { width: 72px; height: 72px; border-radius: 16px; }
  .hero-title { font-size: 1.85rem; }
  .hero-version { font-size: 0.6rem; }
  .hero-desc { font-size: 0.78rem; }
  .hero-links { flex-direction: column; gap: 0.4rem; }
  .checkbox-grid { grid-template-columns: 1fr 1fr; gap: 0.25rem; }
  .checkbox-item { padding: 0.5rem; font-size: 0.72rem; }
  .section-title { font-size: 0.82rem; }
  .section-subtitle { font-size: 0.65rem; }
  .field-input { font-size: 0.78rem; padding: 0.55rem 0.65rem; }
  .field-label { font-size: 0.72rem; }
  .field-row { flex-direction: column; }
  .test-btn { padding: 0.5rem 0.75rem; }
}

/* Phone portrait */
@media (max-width: 480px) {
  body { padding: 1rem 0.75rem 3rem; }
  .hero-logo { width: 64px; height: 64px; border-radius: 14px; }
  .hero-title { font-size: 1.6rem; }
  .hero-desc { font-size: 0.75rem; }
  .checkbox-grid { grid-template-columns: 1fr; gap: 0.15rem; }
  .checkbox-item { padding: 0.55rem 0.5rem; font-size: 0.75rem; min-height: 44px; }
  .checkbox-item input[type="checkbox"] { width: 18px; height: 18px; }
  .actions { flex-direction: column; }
  .btn { padding: 0.85rem 1rem; font-size: 0.82rem; min-height: 48px; }
  details.card > summary { padding: 0.85rem 0.9rem; min-height: 48px; }
  details.card > .section-body { padding: 0 0.9rem 0.9rem; }
  .pill-label { padding: 0.4rem 0.75rem; font-size: 0.72rem; min-height: 36px; display: inline-flex; align-items: center; }
  .section-icon { width: 16px; height: 16px; }
  .info-bar p { font-size: 0.68rem; }
  .toast { font-size: 0.72rem; padding: 0.55rem 1rem; bottom: 1.5rem; }
}

/* Small phones */
@media (max-width: 360px) {
  body { padding: 0.75rem 0.6rem 2.5rem; }
  .hero-logo { width: 56px; height: 56px; }
  .hero-title { font-size: 1.4rem; }
  .hero-desc { font-size: 0.72rem; }
  .section-title { font-size: 0.78rem; }
  .btn { font-size: 0.78rem; }
}

/* iOS safe areas */
@supports (padding: env(safe-area-inset-bottom)) {
  body { padding-bottom: calc(3rem + env(safe-area-inset-bottom)); }
  .toast { bottom: calc(1.5rem + env(safe-area-inset-bottom)); }
}

/* Touch device improvements */
@media (hover: none) and (pointer: coarse) {
  .checkbox-item { min-height: 44px; }
  .pill-label { min-height: 40px; display: inline-flex; align-items: center; }
  .btn { min-height: 48px; }
  details.card > summary { min-height: 48px; }
  .test-btn { min-height: 44px; }
  .field-input { min-height: 44px; font-size: 16px; }
}
`;

export function landingTemplate(manifest: CustomManifest) {
  const logo = manifest.logo || 'https://dl.strem.io/addon-logo.png';

  // ── Categorize config items ──
  const languageKeys = new Set([
    'multi','al','ar','bg','bl','cs','de','el','en','es','et','fa','fr','gu','he','hi','hr','hu',
    'id','it','ja','kn','ko','lt','lv','ml','mr','mx','nl','no','pa','pl','pt','ro','ru','sk',
    'sl','sr','ta','te','th','tr','uk','vi','zh',
  ]);

  const languages: typeof manifest.config = [];
  const proxyFields: typeof manifest.config = [];
  const aiFields: typeof manifest.config = [];
  const resolutionFields: typeof manifest.config = [];
  const advancedCheckboxes: typeof manifest.config = [];

  for (const item of manifest.config || []) {
    if (languageKeys.has(item.key)) {
      languages.push(item);
    } else if (item.key === 'mediaFlowProxyUrl' || item.key === 'mediaFlowProxyPassword') {
      proxyFields.push(item);
    } else if (item.key === 'geminiApiKey' || item.key === 'openAiApiKey') {
      aiFields.push(item);
    } else if (item.key.startsWith('excludeResolution_')) {
      resolutionFields.push(item);
    } else {
      advancedCheckboxes.push(item);
    }
  }

  // ── Build language checkboxes ──
  const languageHTML = languages.map((elem) => {
    const isChecked = elem.default === 'checked' ? ' checked' : '';
    return `<label class="checkbox-item">
      <input type="checkbox" id="${elem.key}" name="${elem.key}"${isChecked}>
      <span>${elem.title}</span>
    </label>`;
  }).join('');

  // ── Build proxy fields ──
  const proxyHTML = proxyFields.map((elem) => {
    const inputType = elem.type === 'password' ? 'password' : 'text';
    const defaultVal = elem.default ? ` value="${elem.default}"` : '';
    const placeholder = elem.key === 'mediaFlowProxyUrl' ? ' placeholder="https://your-proxy.example.com"' : ' placeholder="••••••••"';
    return `<div class="field">
      <label class="field-label" for="${elem.key}">${elem.title}</label>
      <input type="${inputType}" id="${elem.key}" name="${elem.key}" class="field-input"${defaultVal}${placeholder}>
    </div>`;
  }).join('');

  // ── Build AI fields with test buttons ──
  const aiHTML = aiFields.map((elem) => {
    const defaultVal = elem.default ? ` value="${elem.default}"` : '';
    const providerName = elem.key === 'geminiApiKey' ? 'Gemini' : 'OpenAI';
    return `<div class="field">
      <label class="field-label" for="${elem.key}">${elem.title}</label>
      <div class="field-row">
        <input type="password" id="${elem.key}" name="${elem.key}" class="field-input"${defaultVal} placeholder="Enter your ${providerName} key">
        <button type="button" class="test-btn" onclick="testApiKey('${elem.key}')">Test</button>
      </div>
      <div class="test-result" id="test-result-${elem.key}"></div>
    </div>`;
  }).join('');

  // ── Build resolution pills ──
  const resolutionHTML = resolutionFields.map((elem) => {
    const isChecked = elem.default === 'checked' ? ' checked' : '';
    // Extract the resolution label from title like "Exclude resolution 1080p"
    const resLabel = (elem.title ?? '').replace('Exclude resolution ', '');
    return `<div class="pill-item">
      <input type="checkbox" id="${elem.key}" name="${elem.key}"${isChecked}>
      <label class="pill-label" for="${elem.key}">${resLabel}</label>
    </div>`;
  }).join('');

  // ── Build advanced checkboxes ──
  const advancedHTML = advancedCheckboxes.map((elem) => {
    const isChecked = elem.default === 'checked' ? ' checked' : '';
    return `<label class="checkbox-item">
      <input type="checkbox" id="${elem.key}" name="${elem.key}"${isChecked}>
      <span>${elem.title}</span>
    </label>`;
  }).join('');

  // ── Content types ──
  const stylizedTypes = manifest.types
    .map(types => types.charAt(0).toUpperCase() + types.slice(1) + (types !== 'series' ? 's' : ''));

  const configDescription = envGet('CONFIGURATION_DESCRIPTION') || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${manifest.name} - Configure</title>
  <meta name="description" content="${manifest.name} - ${manifest.description.split('\n')[0]}">
  <link rel="shortcut icon" href="${logo}" type="image/x-icon">
  <style>${STYLESHEET}</style>
</head>
<body>

<div class="wrapper">

  <!-- Hero -->
  <div class="hero">
    <img class="hero-logo" src="${logo}" alt="${manifest.name} logo">
    <h1 class="hero-title">${manifest.name}</h1>
    <span class="hero-version">v${manifest.version || '0.0.0'}</span>
    <p class="hero-desc">${manifest.description.split('\n')[0]}</p>
    <div class="hero-links">
      <a href="https://github.com/zainulnazir/hydra" target="_blank">GitHub</a>
      <span style="color:var(--text-muted)">•</span>
      <span style="color:var(--text-muted);font-size:0.75rem">Supports ${stylizedTypes.join(' & ')}</span>
    </div>
  </div>

  <form id="mainForm">

    <!-- Languages -->
    <div class="section">
      <details class="card" open>
        <summary>
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          <span class="section-title">Languages</span>
          <span class="section-subtitle">— select content languages</span>
        </summary>
        <div class="section-body">
          <div class="checkbox-grid">
            ${languageHTML}
          </div>
        </div>
      </details>
    </div>

    <!-- Proxy -->
    <div class="section">
      <details class="card">
        <summary>
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span class="section-title">MediaFlow Proxy</span>
          <span class="section-subtitle">— unlock more hosters</span>
        </summary>
        <div class="section-body">
          <p style="font-size:0.73rem;color:var(--text-muted);margin-bottom:0.75rem;line-height:1.5">
            Required for Fastream, FileLions, FileMoon, LuluStream, Mixdrop, Streamtape, and VOE.
          </p>
          ${proxyHTML}
        </div>
      </details>
    </div>

    <!-- AI Fallback -->
    <div class="section">
      <details class="card">
        <summary>
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M9 18h6"/></svg>
          <span class="section-title">AI Fallback</span>
          <span class="section-subtitle">— self-healing extraction</span>
        </summary>
        <div class="section-body">
          <p style="font-size:0.73rem;color:var(--text-muted);margin-bottom:0.75rem;line-height:1.5">
            If native extractors fail, AI will dynamically analyze the page to recover stream links.
          </p>
          ${aiHTML}
        </div>
      </details>
    </div>

    <!-- Resolution Filters -->
    <div class="section">
      <details class="card">
        <summary>
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="section-title">Resolution Filters</span>
          <span class="section-subtitle">— exclude unwanted qualities</span>
        </summary>
        <div class="section-body">
          <p style="font-size:0.73rem;color:var(--text-muted);margin-bottom:0.75rem;line-height:1.5">
            Toggle resolutions you want to <em>exclude</em> from results.
          </p>
          <div class="pill-grid">
            ${resolutionHTML}
          </div>
        </div>
      </details>
    </div>

    <!-- Advanced -->
    <div class="section">
      <details class="card">
        <summary>
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z"/></svg>
          <span class="section-title">Advanced</span>
          <span class="section-subtitle">— errors, extractors & more</span>
        </summary>
        <div class="section-body">
          <div class="checkbox-grid">
            ${advancedHTML}
          </div>
        </div>
      </details>
    </div>

  </form>

  ${configDescription ? `<div class="section"><div class="card card-static" style="font-size:0.78rem;color:var(--text-dim);line-height:1.6">${configDescription}</div></div>` : ''}

  <!-- Action Buttons -->
  <div class="actions">
    <a id="installLink" href="#" class="btn btn-primary">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      INSTALL
    </a>
    <button id="copyLinkBtn" type="button" class="btn btn-secondary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      COPY LINK
    </button>
  </div>

  <!-- Info -->
  <div class="info-bar">
    <p>
      HTTP streams have limitations. For a better experience, consider a Debrid service.<br>
      <a href="https://torbox.app/subscription?referral=f22eb00d-27ce-4e20-85fc-68da3d018b99" target="_blank">TorBox</a> works very well as a complement.
    </p>
  </div>

</div>

<!-- Toast -->
<div class="toast" id="toast">Link copied to clipboard</div>

<script>
(function() {
  const installLink = document.getElementById('installLink');
  const mainForm = document.getElementById('mainForm');
  const copyBtn = document.getElementById('copyLinkBtn');
  const toast = document.getElementById('toast');

  function updateLink() {
    const formData = new FormData(mainForm);
    const config = Object.fromEntries(formData);
    if (config.mediaFlowProxyUrl) {
      config.mediaFlowProxyUrl = config.mediaFlowProxyUrl.replace(/^https?:\\/\\//, '');
    }
    installLink.href = 'stremio://' + window.location.host + '/' + encodeURIComponent(JSON.stringify(config)) + '/manifest.json';
  }

  installLink.onclick = function(e) {
    if (!mainForm.reportValidity()) {
      e.preventDefault();
      return false;
    }
  };

  mainForm.addEventListener('change', updateLink);
  mainForm.addEventListener('input', updateLink);

  // Initialize link
  updateLink();

  // Copy button
  copyBtn.onclick = function(e) {
    e.preventDefault();
    if (!mainForm.reportValidity()) return;

    const targetHref = installLink.href || ('stremio://' + window.location.host + '/manifest.json');
    const finalLink = targetHref.replace(/^stremio:\\/\\//, window.location.protocol + '//');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(finalLink).then(function() {
        showToast();
      }).catch(function() {
        prompt('Copy this link and paste it into the Stremio search bar:', finalLink);
      });
    } else {
      prompt('Copy this link and paste it into the Stremio search bar:', finalLink);
    }
  };

  function showToast() {
    toast.classList.add('visible');
    setTimeout(function() {
      toast.classList.remove('visible');
    }, 2200);
  }

  // Test API key
  window.testApiKey = function(keyId) {
    var input = document.getElementById(keyId);
    var resultEl = document.getElementById('test-result-' + keyId);
    var apiKey = input.value;

    if (!apiKey) {
      resultEl.className = 'test-result error';
      resultEl.innerText = 'Please enter an API key first.';
      return;
    }

    resultEl.className = 'test-result loading';
    resultEl.innerText = 'Testing connection…';

    var provider = keyId === 'geminiApiKey' ? 'gemini' : 'openai';

    var basePath = window.location.pathname.replace(/\/configure\/?$/, '');
    fetch(basePath + '/test-ai-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: provider, key: apiKey })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.success) {
        resultEl.className = 'test-result success';
        resultEl.innerText = '✓ Connection successful';
      } else {
        resultEl.className = 'test-result error';
        resultEl.innerText = '✗ ' + (data.message || 'Invalid key');
      }
    })
    .catch(function() {
      resultEl.className = 'test-result error';
      resultEl.innerText = '✗ Network error. Please try again.';
    });
  };
})();
</script>

</body>
</html>`;
}
