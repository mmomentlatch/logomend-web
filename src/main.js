import './styles.css';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { applyTranslations, createTranslator, languageFromPage } from './i18n.js';
import { initializeAds } from './ads.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

let language = languageFromPage();
let t = applyTranslations(language);
initializeAds();

const videoInput = $('#videoInput');
const uploadDrop = $('#uploadDrop');
const uploadView = $('#uploadView');
const editView = $('#editView');
const progressView = $('#progressView');
const resultView = $('#resultView');
const errorView = $('#errorView');
const sourceVideo = $('#sourceVideo');
const videoStage = $('#videoStage');
const maskCanvas = $('#maskCanvas');
const maskContext = maskCanvas.getContext('2d');
const rectSelection = $('#rectSelection');
const logoOverlay = $('#logoOverlay');
const coverPreview = $('#coverPreview');
const seekBar = $('#seekBar');

const state = {
  videoFile: null,
  videoUrl: null,
  operation: 'remove',
  tool: 'rectangle',
  method: 'smart',
  rect: null,
  strokes: [],
  activeStroke: null,
  drawStart: null,
  logoFile: null,
  logoUrl: null,
  logo: null,
  logoDrag: null,
  coverFile: null,
  coverUrl: null,
  coverPosition: 'start',
  ffmpeg: null,
  enginePromise: null,
  cv: null,
  cvPromise: null,
  engineLoaded: false,
  ignoreFfmpegProgress: false,
  cancelled: false,
  outputUrl: null,
  outputBlob: null,
  trimStart: 0,
  trimEnd: 0,
  lastLog: '',
  startedAt: 0,
  elapsedTimer: null
};

function setLanguage(nextLanguage) {
  const base = siteBaseUrl();
  const paths = { uk: '', en: 'en/', pl: 'pl/', de: 'de/' };
  if (nextLanguage !== language) window.location.href = new URL(paths[nextLanguage] || '', base).href;
}

function siteBaseUrl() {
  const current = new URL('.', window.location.href);
  if (/\/(en|pl|de)\/$/.test(current.pathname)) return new URL('../', current);
  return current;
}

document.querySelectorAll('a[href="./downloads/"], a[href="./privacy/"], a[href="./terms/"]').forEach(link => {
  const folder = link.getAttribute('href').replace(/^\.\//, '');
  link.href = new URL(folder, siteBaseUrl()).href;
});

$('#languageSelect').value = language;
$('#languageSelect').addEventListener('change', event => setLanguage(event.target.value));

uploadDrop.addEventListener('click', () => videoInput.click());
$('#replaceVideo').addEventListener('click', () => videoInput.click());
$('#newVideo').addEventListener('click', resetAll);
videoInput.addEventListener('change', () => loadVideo(videoInput.files[0]));

for (const eventName of ['dragenter', 'dragover']) {
  uploadDrop.addEventListener(eventName, event => {
    event.preventDefault();
    uploadDrop.classList.add('over');
  });
}
for (const eventName of ['dragleave', 'drop']) {
  uploadDrop.addEventListener(eventName, event => {
    event.preventDefault();
    uploadDrop.classList.remove('over');
  });
}
uploadDrop.addEventListener('drop', event => loadVideo(event.dataTransfer.files[0]));

function validVideo(file) {
  return file && (file.type.startsWith('video/') || /\.(mp4|mov|m4v|webm|mkv|avi)$/i.test(file.name));
}

async function loadVideo(file) {
  if (!validVideo(file)) return showError(t('runtime.invalidVideo'), true);
  if (file.size > 1.5 * 1024 ** 3) return showError(t('runtime.tooLarge'), true);
  if (file.size > 300 * 1024 ** 2 && !window.confirm(t('runtime.largeWarning'))) return;

  revokeVideoUrl();
  clearSelection();
  clearLogo();
  clearCover();
  state.videoFile = file;
  state.videoUrl = URL.createObjectURL(file);
  sourceVideo.src = state.videoUrl;
  sourceVideo.load();
  $('#fileName').textContent = file.name;
  $('#fileMeta').textContent = formatBytes(file.size);
  uploadView.classList.add('hidden');
  errorView.classList.add('hidden');
  resultView.classList.add('hidden');
  editView.classList.remove('hidden');
}

sourceVideo.addEventListener('loadedmetadata', () => {
  seekBar.max = Number.isFinite(sourceVideo.duration) ? sourceVideo.duration : 0;
  resetTrim();
  $('#duration').textContent = formatTime(sourceVideo.duration);
  $('#fileMeta').textContent = `${formatBytes(state.videoFile.size)} · ${sourceVideo.videoWidth}×${sourceVideo.videoHeight} · ${formatTime(sourceVideo.duration)}`;
  requestAnimationFrame(syncStageLayers);
  const warmEngine = () => ensureEngine().catch(() => {});
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmEngine, { timeout: 2000 });
  else setTimeout(warmEngine, 500);
});
sourceVideo.addEventListener('loadeddata', syncStageLayers);
sourceVideo.addEventListener('error', () => {
  if (state.videoFile) showError(t('runtime.videoError'), true);
});
new ResizeObserver(syncStageLayers).observe(videoStage);

function syncStageLayers() {
  if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) return;
  const stageRect = videoStage.getBoundingClientRect();
  const videoRect = sourceVideo.getBoundingClientRect();
  const layerStyle = {
    left: `${videoRect.left - stageRect.left}px`,
    top: `${videoRect.top - stageRect.top}px`,
    width: `${videoRect.width}px`,
    height: `${videoRect.height}px`
  };
  Object.assign(maskCanvas.style, layerStyle);
  if (maskCanvas.width !== sourceVideo.videoWidth || maskCanvas.height !== sourceVideo.videoHeight) {
    maskCanvas.width = sourceVideo.videoWidth;
    maskCanvas.height = sourceVideo.videoHeight;
  }
  drawMaskPreview();
  renderRectangle();
  renderLogo();
  renderCover();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function formatPreciseTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00.0';
  const value = Math.max(0, seconds);
  return `${Math.floor(value / 60)}:${(value % 60).toFixed(1).padStart(4, '0')}`;
}

function formatBytes(bytes) {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

$('#playButton').addEventListener('click', () => sourceVideo.paused ? sourceVideo.play() : sourceVideo.pause());
sourceVideo.addEventListener('play', () => { $('#playButton').textContent = '❚❚'; $('#playButton').ariaLabel = t('runtime.pause'); });
sourceVideo.addEventListener('pause', () => { $('#playButton').textContent = '▶'; $('#playButton').ariaLabel = t('runtime.play'); });
sourceVideo.addEventListener('timeupdate', () => {
  if (document.activeElement !== seekBar) seekBar.value = sourceVideo.currentTime;
  $('#currentTime').textContent = formatTime(sourceVideo.currentTime);
});
seekBar.addEventListener('input', () => { sourceVideo.currentTime = Number(seekBar.value); });
$('#muteButton').addEventListener('click', () => {
  sourceVideo.muted = !sourceVideo.muted;
  $('#muteButton').textContent = sourceVideo.muted ? '×))' : '◖))';
});

$('#trimStart').addEventListener('input', event => {
  const maximumStart = Math.max(0, state.trimEnd - .1);
  state.trimStart = Math.min(Number(event.target.value), maximumStart);
  updateTrimUi();
  sourceVideo.currentTime = state.trimStart;
  updateProcessButton();
});
$('#trimEnd').addEventListener('input', event => {
  const minimumEnd = Math.min(sourceVideo.duration || 0, state.trimStart + .1);
  state.trimEnd = Math.max(Number(event.target.value), minimumEnd);
  updateTrimUi();
  sourceVideo.currentTime = Math.max(0, state.trimEnd - .05);
  updateProcessButton();
});

for (const boundary of ['Start', 'End']) {
  for (const unit of ['Minutes', 'Seconds']) {
    const input = $(`#trim${boundary}${unit}`);
    input.addEventListener('change', () => setTrimFromTimeFields(boundary.toLowerCase()));
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') input.blur();
    });
  }
}

function setTrimFromTimeFields(boundary) {
  const prefix = boundary === 'start' ? 'trimStart' : 'trimEnd';
  const minutesInput = $(`#${prefix}Minutes`);
  const secondsInput = $(`#${prefix}Seconds`);
  const minutes = Number.isFinite(minutesInput.valueAsNumber) ? Math.max(0, minutesInput.valueAsNumber) : 0;
  const seconds = Number.isFinite(secondsInput.valueAsNumber) ? Math.max(0, secondsInput.valueAsNumber) : 0;
  const requested = minutes * 60 + seconds;
  const duration = Number.isFinite(sourceVideo.duration) ? sourceVideo.duration : 0;
  if (!duration) return;

  if (boundary === 'start') {
    state.trimStart = Math.max(0, Math.min(requested, duration, state.trimEnd - .1));
    sourceVideo.currentTime = state.trimStart;
  } else {
    state.trimEnd = Math.min(duration, Math.max(requested, state.trimStart + .1));
    sourceVideo.currentTime = Math.max(0, state.trimEnd - .05);
  }
  updateTrimUi();
  updateProcessButton();
}
$('#resetTrim').addEventListener('click', () => {
  resetTrim();
  updateProcessButton();
});

function resetTrim() {
  const duration = Number.isFinite(sourceVideo.duration) ? sourceVideo.duration : 0;
  state.trimStart = 0;
  state.trimEnd = duration;
  for (const input of [$('#trimStart'), $('#trimEnd')]) input.max = duration;
  for (const input of [$('#trimStartMinutes'), $('#trimEndMinutes')]) input.max = Math.ceil(duration / 60);
  updateTrimUi();
}

function updateTrimUi() {
  const duration = sourceVideo.duration || 0;
  const startPercent = duration ? state.trimStart / duration * 100 : 0;
  const endPercent = duration ? state.trimEnd / duration * 100 : 100;
  $('#trimSelected').style.left = `${startPercent}%`;
  $('#trimSelected').style.right = `${Math.max(0, 100 - endPercent)}%`;
  $('#trimStart').value = state.trimStart;
  $('#trimEnd').value = state.trimEnd;
  $('#trimStartValue').textContent = formatPreciseTime(state.trimStart);
  $('#trimEndValue').textContent = formatPreciseTime(state.trimEnd);
  $('#trimDuration').textContent = formatPreciseTime(Math.max(0, state.trimEnd - state.trimStart));
  updateTimeFields('trimStart', state.trimStart);
  updateTimeFields('trimEnd', state.trimEnd);
}

function updateTimeFields(prefix, value) {
  const rounded = Math.round(Math.max(0, value) * 10) / 10;
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded - minutes * 60;
  $(`#${prefix}Minutes`).value = String(minutes);
  $(`#${prefix}Seconds`).value = seconds.toFixed(1);
}

function trimChanged() {
  const duration = sourceVideo.duration || 0;
  return state.trimStart > .04 || (duration > 0 && state.trimEnd < duration - .04);
}

$$('.operation-tabs button').forEach(button => button.addEventListener('click', () => selectOperation(button.dataset.operation)));
function selectOperation(operation) {
  state.operation = operation;
  $$('.operation-tabs button').forEach(button => button.classList.toggle('active', button.dataset.operation === operation));
  $('#removePanel').classList.toggle('hidden', operation !== 'remove');
  $('#addPanel').classList.toggle('hidden', operation !== 'add');
  $('#coverPanel').classList.toggle('hidden', operation !== 'cover');
  maskCanvas.style.pointerEvents = operation === 'remove' ? 'auto' : 'none';
  rectSelection.classList.toggle('hidden', operation !== 'remove' || !state.rect || state.tool !== 'rectangle');
  logoOverlay.classList.toggle('hidden', operation !== 'add' || !state.logoFile);
  coverPreview.classList.toggle('hidden', operation !== 'cover' || !state.coverFile);
  $('#stageHint').textContent = operation === 'add'
    ? t('runtime.moveLogo')
    : operation === 'cover'
      ? t(state.coverPosition === 'start' ? 'runtime.coverStart' : 'runtime.coverEnd')
      : t(state.tool === 'brush' ? 'runtime.drawBrush' : 'runtime.drawRect');
  renderCover();
  updateProcessButton();
}

$$('#selectionTools button').forEach(button => button.addEventListener('click', () => selectTool(button.dataset.tool)));
function selectTool(tool) {
  state.tool = tool;
  $$('#selectionTools button').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
  $('#brushSizeRow').classList.toggle('hidden', tool !== 'brush');
  rectSelection.classList.toggle('hidden', tool !== 'rectangle' || !state.rect);
  $('#stageHint').textContent = t(tool === 'brush' ? 'runtime.drawBrush' : 'runtime.drawRect');
  const delogoCard = $('[data-method="delogo"]');
  delogoCard.disabled = tool === 'brush';
  if (tool === 'brush' && state.method === 'delogo') selectMethod('smart');
  updateSelectionSummary();
  updateProcessButton();
}

$$('#methodGrid button').forEach(button => button.addEventListener('click', () => {
  if (!button.disabled) selectMethod(button.dataset.method);
}));
function selectMethod(method) {
  if (method === 'delogo' && state.tool === 'brush') {
    window.alert(t('runtime.delogoBrush'));
    return;
  }
  state.method = method;
  $$('#methodGrid button').forEach(button => button.classList.toggle('active', button.dataset.method === method));
  $('#strengthRow').classList.toggle('hidden', method === 'smart' || method === 'delogo');
  const strengthInput = $('#strength');
  if (method === 'opencv') {
    strengthInput.min = 1;
    strengthInput.max = 12;
    strengthInput.value = 5;
  } else {
    strengthInput.min = 8;
    strengthInput.max = 48;
    if (Number(strengthInput.value) < 8) strengthInput.value = 24;
  }
  $('#strengthValue').textContent = strengthInput.value;
  if (method === 'opencv' && state.videoFile) createOpenCvWorker(false).catch(() => {});
}

$('#brushSize').addEventListener('input', event => { $('#brushSizeValue').textContent = `${event.target.value} px`; });
$('#strength').addEventListener('input', event => { $('#strengthValue').textContent = event.target.value; });
$('#undoMask').addEventListener('click', () => {
  if (state.tool === 'brush') state.strokes.pop();
  else state.rect = null;
  drawMaskPreview(); renderRectangle(); updateSelectionSummary(); updateProcessButton();
});
$('#clearMask').addEventListener('click', clearSelection);

function pointOnVideo(event) {
  const rect = maskCanvas.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return null;
  return {
    x: Math.max(0, Math.min(maskCanvas.width, (event.clientX - rect.left) * maskCanvas.width / rect.width)),
    y: Math.max(0, Math.min(maskCanvas.height, (event.clientY - rect.top) * maskCanvas.height / rect.height))
  };
}

maskCanvas.addEventListener('pointerdown', event => {
  if (state.operation !== 'remove') return;
  const point = pointOnVideo(event);
  if (!point) return;
  sourceVideo.pause();
  maskCanvas.setPointerCapture(event.pointerId);
  if (state.tool === 'brush') {
    state.activeStroke = { size: Number($('#brushSize').value), points: [point] };
    state.strokes.push(state.activeStroke);
    drawMaskPreview();
  } else {
    state.drawStart = point;
    state.rect = { x: point.x, y: point.y, width: 0, height: 0 };
  }
});

maskCanvas.addEventListener('pointermove', event => {
  const point = pointOnVideo(event);
  if (!point) return;
  if (state.activeStroke) {
    const last = state.activeStroke.points.at(-1);
    if (Math.hypot(point.x - last.x, point.y - last.y) > 1.5) {
      state.activeStroke.points.push(point);
      drawMaskPreview();
    }
  } else if (state.drawStart) {
    state.rect = {
      x: Math.min(state.drawStart.x, point.x),
      y: Math.min(state.drawStart.y, point.y),
      width: Math.abs(point.x - state.drawStart.x),
      height: Math.abs(point.y - state.drawStart.y)
    };
    renderRectangle();
  }
});

function endDrawing() {
  if (!state.activeStroke && !state.drawStart) return;
  state.activeStroke = null;
  state.drawStart = null;
  if (state.rect && (state.rect.width < 4 || state.rect.height < 4)) state.rect = null;
  renderRectangle();
  updateSelectionSummary();
  updateProcessButton();
}
maskCanvas.addEventListener('pointerup', endDrawing);
maskCanvas.addEventListener('pointercancel', endDrawing);

function drawMaskPreview() {
  maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskContext.lineCap = 'round';
  maskContext.lineJoin = 'round';
  maskContext.strokeStyle = 'rgba(201,247,98,.68)';
  maskContext.fillStyle = 'rgba(201,247,98,.68)';
  for (const stroke of state.strokes) paintStroke(maskContext, stroke);
}

function paintStroke(context, stroke) {
  if (!stroke.points.length) return;
  context.lineWidth = stroke.size;
  if (stroke.points.length === 1) {
    context.beginPath();
    context.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }
  context.beginPath();
  context.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (const point of stroke.points.slice(1)) context.lineTo(point.x, point.y);
  context.stroke();
}

function renderRectangle() {
  if (!state.rect || state.tool !== 'rectangle' || state.operation !== 'remove' || !sourceVideo.videoWidth) {
    rectSelection.classList.add('hidden');
    return;
  }
  const canvasRect = maskCanvas.getBoundingClientRect();
  const stageRect = videoStage.getBoundingClientRect();
  const scaleX = canvasRect.width / sourceVideo.videoWidth;
  const scaleY = canvasRect.height / sourceVideo.videoHeight;
  Object.assign(rectSelection.style, {
    left: `${canvasRect.left - stageRect.left + state.rect.x * scaleX}px`,
    top: `${canvasRect.top - stageRect.top + state.rect.y * scaleY}px`,
    width: `${state.rect.width * scaleX}px`,
    height: `${state.rect.height * scaleY}px`
  });
  rectSelection.classList.remove('hidden');
}

function brushBounds() {
  if (!state.strokes.length) return null;
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  for (const stroke of state.strokes) {
    const radius = stroke.size / 2;
    for (const point of stroke.points) {
      left = Math.min(left, point.x - radius); top = Math.min(top, point.y - radius);
      right = Math.max(right, point.x + radius); bottom = Math.max(bottom, point.y + radius);
    }
  }
  return {
    x: Math.max(0, Math.floor(left)), y: Math.max(0, Math.floor(top)),
    width: Math.min(sourceVideo.videoWidth, Math.ceil(right)) - Math.max(0, Math.floor(left)),
    height: Math.min(sourceVideo.videoHeight, Math.ceil(bottom)) - Math.max(0, Math.floor(top))
  };
}

function updateSelectionSummary() {
  const summary = $('#selectionSummary');
  if (state.tool === 'rectangle' && state.rect) {
    const rect = normalizedRect();
    summary.textContent = t('runtime.rectangle', { x: rect.x, y: rect.y, w: rect.width, h: rect.height });
  } else if (state.tool === 'brush' && state.strokes.length) {
    const bounds = brushBounds();
    summary.textContent = t('runtime.brush', { count: state.strokes.length, w: bounds.width, h: bounds.height });
  } else {
    summary.textContent = t('remove.empty');
  }
}

function normalizedRect() {
  if (!state.rect) return null;
  const even = value => Math.max(2, Math.round(value / 2) * 2);
  const x = Math.max(0, Math.round(state.rect.x));
  const y = Math.max(0, Math.round(state.rect.y));
  return {
    x, y,
    width: Math.min(even(state.rect.width), sourceVideo.videoWidth - x),
    height: Math.min(even(state.rect.height), sourceVideo.videoHeight - y)
  };
}

function clearSelection() {
  state.rect = null;
  state.strokes = [];
  state.activeStroke = null;
  state.drawStart = null;
  drawMaskPreview();
  renderRectangle();
  updateSelectionSummary();
  updateProcessButton();
}

$('#chooseLogo').addEventListener('click', () => $('#logoInput').click());
$('#logoInput').addEventListener('change', () => loadLogo($('#logoInput').files[0]));
function loadLogo(file) {
  if (!file || (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp)$/i.test(file.name))) return;
  if (state.logoUrl) URL.revokeObjectURL(state.logoUrl);
  state.logoFile = file;
  state.logoUrl = URL.createObjectURL(file);
  const image = logoOverlay.querySelector('img');
  image.onload = () => {
    const width = sourceVideo.videoWidth * Number($('#logoSize').value) / 100;
    state.logo = {
      x: sourceVideo.videoWidth - width - sourceVideo.videoWidth * .035,
      y: sourceVideo.videoHeight * .04,
      width,
      aspect: image.naturalWidth / image.naturalHeight || 1
    };
    renderLogo();
    updateProcessButton();
  };
  image.src = state.logoUrl;
  $('#logoName').textContent = t('runtime.logoReady', { name: file.name });
}

$('#logoSize').addEventListener('input', event => {
  $('#logoSizeValue').textContent = `${event.target.value}%`;
  if (!state.logo) return;
  const centerX = state.logo.x + state.logo.width / 2;
  state.logo.width = sourceVideo.videoWidth * Number(event.target.value) / 100;
  state.logo.x = Math.max(0, Math.min(sourceVideo.videoWidth - state.logo.width, centerX - state.logo.width / 2));
  renderLogo();
});
$('#logoOpacity').addEventListener('input', event => {
  $('#logoOpacityValue').textContent = `${event.target.value}%`;
  logoOverlay.style.opacity = Number(event.target.value) / 100;
});

logoOverlay.addEventListener('pointerdown', event => {
  if (event.target.classList.contains('resize-handle') || !state.logo) return;
  event.preventDefault();
  logoOverlay.setPointerCapture(event.pointerId);
  state.logoDrag = { clientX: event.clientX, clientY: event.clientY, x: state.logo.x, y: state.logo.y };
});
logoOverlay.addEventListener('pointermove', event => {
  if (!state.logoDrag) return;
  const rect = maskCanvas.getBoundingClientRect();
  state.logo.x = Math.max(0, Math.min(sourceVideo.videoWidth - state.logo.width,
    state.logoDrag.x + (event.clientX - state.logoDrag.clientX) * sourceVideo.videoWidth / rect.width));
  state.logo.y = Math.max(0, Math.min(sourceVideo.videoHeight - state.logo.width / state.logo.aspect,
    state.logoDrag.y + (event.clientY - state.logoDrag.clientY) * sourceVideo.videoHeight / rect.height));
  renderLogo();
});
logoOverlay.addEventListener('pointerup', () => { state.logoDrag = null; });
logoOverlay.addEventListener('pointercancel', () => { state.logoDrag = null; });

function renderLogo() {
  if (!state.logo || !state.logoFile || !sourceVideo.videoWidth || state.operation !== 'add') {
    logoOverlay.classList.add('hidden');
    return;
  }
  const canvasRect = maskCanvas.getBoundingClientRect();
  const stageRect = videoStage.getBoundingClientRect();
  const scaleX = canvasRect.width / sourceVideo.videoWidth;
  const scaleY = canvasRect.height / sourceVideo.videoHeight;
  Object.assign(logoOverlay.style, {
    left: `${canvasRect.left - stageRect.left + state.logo.x * scaleX}px`,
    top: `${canvasRect.top - stageRect.top + state.logo.y * scaleY}px`,
    width: `${state.logo.width * scaleX}px`,
    height: `${state.logo.width / state.logo.aspect * scaleY}px`,
    opacity: Number($('#logoOpacity').value) / 100
  });
  logoOverlay.classList.remove('hidden');
}

function clearLogo() {
  if (state.logoUrl) URL.revokeObjectURL(state.logoUrl);
  state.logoFile = null;
  state.logoUrl = null;
  state.logo = null;
  state.logoDrag = null;
  logoOverlay.classList.add('hidden');
  logoOverlay.querySelector('img').removeAttribute('src');
  $('#logoInput').value = '';
  $('#logoName').textContent = t('add.empty');
}

$('#chooseCover').addEventListener('click', () => $('#coverInput').click());
$('#coverInput').addEventListener('change', () => loadCover($('#coverInput').files[0]));

function loadCover(file) {
  if (!file || (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp)$/i.test(file.name))) {
    window.alert(t('runtime.invalidCover'));
    return;
  }
  if (state.coverUrl) URL.revokeObjectURL(state.coverUrl);
  state.coverFile = file;
  state.coverUrl = URL.createObjectURL(file);
  coverPreview.src = state.coverUrl;
  coverPreview.onload = () => {
    renderCover();
    updateProcessButton();
  };
  $('#coverName').textContent = t('runtime.coverReady', { name: file.name });
}

function renderCover() {
  if (!state.coverFile || !sourceVideo.videoWidth || state.operation !== 'cover') {
    coverPreview.classList.add('hidden');
    return;
  }
  const canvasRect = maskCanvas.getBoundingClientRect();
  const stageRect = videoStage.getBoundingClientRect();
  Object.assign(coverPreview.style, {
    left: `${canvasRect.left - stageRect.left}px`,
    top: `${canvasRect.top - stageRect.top}px`,
    width: `${canvasRect.width}px`,
    height: `${canvasRect.height}px`
  });
  coverPreview.classList.toggle('fit-cover', $('#coverFit').value === 'cover');
  coverPreview.classList.toggle('fit-contain', $('#coverFit').value === 'contain');
  coverPreview.classList.remove('hidden');
}

function clearCover() {
  if (state.coverUrl) URL.revokeObjectURL(state.coverUrl);
  state.coverFile = null;
  state.coverUrl = null;
  coverPreview.removeAttribute('src');
  coverPreview.classList.add('hidden');
  $('#coverInput').value = '';
  $('#coverName').textContent = t('cover.empty');
}

$$('#coverPosition button').forEach(button => button.addEventListener('click', () => {
  state.coverPosition = button.dataset.coverPosition;
  $$('#coverPosition button').forEach(candidate => candidate.classList.toggle('active', candidate === button));
  $('#stageHint').textContent = t(state.coverPosition === 'start' ? 'runtime.coverStart' : 'runtime.coverEnd');
}));

$('#coverDuration').addEventListener('input', event => {
  $('#coverDurationValue').textContent = t('cover.seconds', { value: Number(event.target.value).toFixed(1) });
});
$('#coverFit').addEventListener('change', renderCover);

function updateProcessButton() {
  const actionReady = state.operation === 'add'
    ? state.logoFile && state.logo
    : state.operation === 'cover'
      ? state.coverFile
      : (state.tool === 'rectangle' ? state.rect?.width >= 4 && state.rect?.height >= 4 : state.strokes.length > 0);
  const ready = state.videoFile && (actionReady || trimChanged());
  $('#processButton').disabled = !ready;
}

$('#processButton').addEventListener('click', processVideo);
$('#cancelButton').addEventListener('click', cancelProcessing);
$('#editAgain').addEventListener('click', () => showOnly(editView));
$('#continueEditing').addEventListener('click', continueWithResult);
$('#errorBack').addEventListener('click', () => state.videoFile ? showOnly(editView) : showOnly(uploadView));

async function ensureEngine() {
  if (state.engineLoaded && state.ffmpeg) return state.ffmpeg;
  if (state.enginePromise) return state.enginePromise;
  state.enginePromise = (async () => {
    const ffmpeg = new FFmpeg();
    state.ffmpeg = ffmpeg;
    state.lastLog = '';
    ffmpeg.on('log', ({ message }) => { state.lastLog = message || state.lastLog; });
    ffmpeg.on('progress', ({ progress }) => {
      if (!state.ignoreFfmpegProgress && Number.isFinite(progress)) setProgress(15 + Math.max(0, Math.min(1, progress)) * 80);
    });

    setEngineState('loading', t('runtime.engineLoading'), t('progress.loadingText'));
    const coreURL = new URL('../ffmpeg-core/ffmpeg-core.js', import.meta.url).href;
    const wasmURL = new URL('../ffmpeg-core/ffmpeg-core.wasm', import.meta.url).href;
    await ffmpeg.load({ coreURL, wasmURL });
    state.engineLoaded = true;
    setEngineState('ready', t('runtime.engineLoaded'), t('runtime.engineCached'));
    return ffmpeg;
  })();
  try {
    return await state.enginePromise;
  } catch (error) {
    state.ffmpeg = null;
    state.engineLoaded = false;
    setEngineState('', t('engine.waiting'), t('engine.note'));
    throw error;
  } finally {
    if (!state.engineLoaded) state.enginePromise = null;
  }
}

function setEngineState(status, title, note) {
  $('#engineDot').className = status;
  $('#engineState').textContent = title;
  $('.engine-status small').textContent = note;
}

async function processVideo() {
  state.cancelled = false;
  sourceVideo.pause();
  showOnly(progressView);
  startElapsed();
  setProgress(1);
  $('#progressTitle').textContent = t('progress.loading');
  $('#progressDetail').textContent = t('progress.loadingText');

  let inputPath;
  let logoPath;
  let coverPath;
  let maskPath;
  const outputPath = 'logomend-output.mp4';
  try {
    const ffmpeg = await ensureEngine();
    if (state.cancelled) return;
    setProgress(8);
    $('#progressTitle').textContent = t('runtime.reading');
    $('#progressDetail').textContent = state.videoFile.name;
    const videoExtension = extensionOf(state.videoFile.name, 'mp4');
    inputPath = `input.${videoExtension}`;
    await ffmpeg.writeFile(inputPath, await fetchFile(state.videoFile));
    if (state.cancelled) return;

    let args;
    const hasRemoval = state.tool === 'rectangle'
      ? state.rect?.width >= 4 && state.rect?.height >= 4
      : state.strokes.length > 0;
    if (state.operation === 'add' && state.logoFile) {
      logoPath = `logo.${extensionOf(state.logoFile.name, 'png')}`;
      await ffmpeg.writeFile(logoPath, await fetchFile(state.logoFile));
      args = addLogoArguments(inputPath, logoPath, outputPath);
    } else if (state.operation === 'cover' && state.coverFile) {
      coverPath = `cover.${extensionOf(state.coverFile.name, 'jpg')}`;
      await ffmpeg.writeFile(coverPath, await fetchFile(state.coverFile));
      const fps = await probeFrameRate(ffmpeg, inputPath);
      args = coverArguments(inputPath, coverPath, outputPath, fps);
    } else if (state.operation === 'remove' && hasRemoval && state.method === 'opencv') {
      await processOpenCvVideo(ffmpeg, inputPath, outputPath);
      args = null;
    } else if (state.operation === 'remove' && hasRemoval && state.method === 'smart') {
      maskPath = 'logo-mask.png';
      await ffmpeg.writeFile(maskPath, await createMaskBytes());
      args = smartFfmpegArguments(inputPath, maskPath, outputPath);
    } else if (state.operation === 'remove' && hasRemoval && state.method === 'delogo') {
      args = delogoArguments(inputPath, outputPath);
    } else {
      args = trimOnlyArguments(inputPath, outputPath);
    }

    if (args) {
      $('#progressTitle').textContent = t('runtime.processing');
      $('#progressDetail').textContent = `${sourceVideo.videoWidth}×${sourceVideo.videoHeight} · ${formatTime(sourceVideo.duration)}`;
      setProgress(15);
      const exitCode = await ffmpeg.exec(args);
      if (exitCode !== 0) throw new Error(state.lastLog || `FFmpeg exited with code ${exitCode}`);
    }
    if (state.cancelled) return;

    setProgress(96);
    $('#progressTitle').textContent = t('runtime.finalizing');
    const data = await ffmpeg.readFile(outputPath);
    if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
    state.outputBlob = new Blob([data.buffer], { type: 'video/mp4' });
    state.outputUrl = URL.createObjectURL(state.outputBlob);
    $('#resultVideo').src = state.outputUrl;
    $('#downloadButton').href = state.outputUrl;
    $('#downloadButton').download = outputFileName(state.videoFile.name);
    setProgress(100);
    showOnly(resultView);

  } catch (error) {
    if (!state.cancelled) showError(t('runtime.failed', { message: error?.message || state.lastLog || 'Unknown error' }));
  } finally {
    if (state.ffmpeg) {
      await safeDelete(state.ffmpeg, inputPath);
      await safeDelete(state.ffmpeg, logoPath);
      await safeDelete(state.ffmpeg, coverPath);
      await safeDelete(state.ffmpeg, maskPath);
      await safeDelete(state.ffmpeg, outputPath);
    }
    state.ignoreFfmpegProgress = false;
    stopElapsed();
  }
}

function commonOutputArguments(outputPath) {
  const duration = Math.max(.1, state.trimEnd - state.trimStart);
  return ['-map', '[v]', '-map', '0:a?', '-t', duration.toFixed(3), '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', $('#qualitySelect').value,
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', outputPath];
}

function videoInputArguments(inputPath) {
  return state.trimStart > .001
    ? ['-ss', state.trimStart.toFixed(3), '-i', inputPath]
    : ['-i', inputPath];
}

function addLogoArguments(inputPath, logoPath, outputPath) {
  const logo = state.logo;
  const width = Math.max(2, Math.round(logo.width / 2) * 2);
  const x = Math.max(0, Math.round(logo.x));
  const y = Math.max(0, Math.round(logo.y));
  const opacity = (Number($('#logoOpacity').value) / 100).toFixed(2);
  const filter = `[1:v]scale=${width}:-2,format=rgba,colorchannelmixer=aa=${opacity}[wm];[0:v][wm]overlay=${x}:${y}:format=auto[v]`;
  return [...videoInputArguments(inputPath), '-i', logoPath, '-filter_complex', filter, ...commonOutputArguments(outputPath)];
}

function coverArguments(inputPath, coverPath, outputPath, detectedFps) {
  const width = Math.max(2, Math.floor(sourceVideo.videoWidth / 2) * 2);
  const height = Math.max(2, Math.floor(sourceVideo.videoHeight / 2) * 2);
  const mainDuration = Math.max(.1, state.trimEnd - state.trimStart);
  const coverDuration = Math.max(1, Math.min(10, Number($('#coverDuration').value)));
  const totalDuration = mainDuration + coverDuration;
  const fps = Math.max(1, Math.min(60, detectedFps || 30)).toFixed(3);
  const fitFilter = $('#coverFit').value === 'contain'
    ? `scale=${width}:${height}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black`
    : `scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height}`;
  const videoOrder = state.coverPosition === 'start'
    ? '[coverv][mainv]'
    : '[mainv][coverv]';
  const filters = [
    `[0:v]trim=duration=${mainDuration.toFixed(3)},setpts=PTS-STARTPTS,scale=${width}:${height}:flags=lanczos,setsar=1,fps=${fps}[mainv]`,
    `[1:v]${fitFilter},setsar=1,fps=${fps},trim=duration=${coverDuration.toFixed(3)},setpts=PTS-STARTPTS[coverv]`,
    `${videoOrder}concat=n=2:v=1:a=0[v]`
  ];
  const audioFilter = state.coverPosition === 'start'
    ? `adelay=${Math.round(coverDuration * 1000)}:all=1,apad=pad_dur=${coverDuration.toFixed(3)}`
    : `apad=pad_dur=${coverDuration.toFixed(3)}`;

  return [
    ...videoInputArguments(inputPath), '-loop', '1', '-framerate', fps, '-i', coverPath,
    '-filter_complex', filters.join(';'), '-map', '[v]', '-map', '0:a?',
    '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', $('#qualitySelect').value,
    '-pix_fmt', 'yuv420p', '-af', audioFilter, '-c:a', 'aac', '-b:a', '160k',
    '-t', totalDuration.toFixed(3),
    '-movflags', '+faststart', outputPath
  ];
}

function delogoArguments(inputPath, outputPath) {
  const rect = normalizedRect();
  const filter = `[0:v]delogo=x=${rect.x}:y=${rect.y}:w=${rect.width}:h=${rect.height}:show=0[v]`;
  return [...videoInputArguments(inputPath), '-filter_complex', filter, ...commonOutputArguments(outputPath)];
}

function smartFfmpegArguments(inputPath, maskPath, outputPath) {
  const filter = `[0:v]removelogo=f=${maskPath}[v]`;
  return [...videoInputArguments(inputPath), '-filter_complex', filter, ...commonOutputArguments(outputPath)];
}

function openCvWorkerCall(worker, payload, transfer = []) {
  return new Promise((resolve, reject) => {
    const onMessage = event => {
      const message = event.data || {};
      if (message.type === 'status') {
        const statusText = {
          script: t('runtime.opencvStageScript'),
          runtime: t('runtime.opencvStageRuntime'),
          ready: t('runtime.opencvStageReady')
        };
        $('#progressDetail').textContent = statusText[message.stage] || $('#progressDetail').textContent;
        return;
      }
      if (message.type === 'error' && (message.id == null || message.id === payload.id)) {
        cleanup();
        reject(new Error(message.message || t('runtime.opencvUnavailable')));
      } else if ((payload.type === 'init' && message.type === 'ready') || (message.type === 'result' && message.id === payload.id)) {
        cleanup();
        resolve(message);
      }
    };
    const onError = event => {
      cleanup();
      reject(new Error(event.message || t('runtime.opencvUnavailable')));
    };
    const cleanup = () => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
    };
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.postMessage(payload, transfer);
  });
}

async function createOpenCvWorker(showProgress = true) {
  if (showProgress) {
    $('#progressTitle').textContent = t('runtime.opencvLoading');
    $('#progressDetail').textContent = 'OpenCV.js 4.13.0 · Web Worker · Telea';
    setProgress(12);
  }
  if (state.cv && state.cvPromise) return state.cvPromise;
  const workerUrl = new URL('vendor/opencv/inpaint-worker.js', siteBaseUrl()).href;
  const worker = new Worker(workerUrl);
  state.cv = worker;
  state.cvPromise = openCvWorkerCall(worker, { type: 'init' }).then(() => worker).catch(error => {
    worker.terminate();
    state.cv = null;
    state.cvPromise = null;
    throw error;
  });
  return state.cvPromise;
}

async function probeFrameRate(ffmpeg, inputPath) {
  const probePath = 'opencv-fps.txt';
  try {
    const result = await ffmpeg.ffprobe([
      '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate',
      '-of', 'default=noprint_wrappers=1:nokey=1', inputPath, '-o', probePath
    ]);
    if (result !== 0) return 25;
    const value = String(await ffmpeg.readFile(probePath, 'utf8')).trim();
    const [numerator, denominator = '1'] = value.split('/').map(Number);
    const fps = numerator / denominator;
    return Number.isFinite(fps) ? Math.max(1, Math.min(30, fps)) : 25;
  } catch {
    return 25;
  } finally {
    await safeDelete(ffmpeg, probePath);
  }
}

async function clearOpenCvFrames(ffmpeg) {
  try {
    const entries = await ffmpeg.listDir('opencv-frames');
    for (const entry of entries) {
      if (!entry.isDir && entry.name !== '.' && entry.name !== '..') await safeDelete(ffmpeg, `opencv-frames/${entry.name}`);
    }
    await ffmpeg.deleteDir('opencv-frames');
  } catch { /* The temporary directory may not exist yet. */ }
}

async function processOpenCvVideo(ffmpeg, inputPath, outputPath) {
  const clipDuration = Math.max(.1, state.trimEnd - state.trimStart);
  if (clipDuration > 15.01 || sourceVideo.videoWidth * sourceVideo.videoHeight > 1920 * 1080 || Math.max(sourceVideo.videoWidth, sourceVideo.videoHeight) > 1920) {
    throw new Error(t('runtime.opencvLimit'));
  }

  state.ignoreFfmpegProgress = true;
  const openCvWorker = await createOpenCvWorker();
  if (state.cancelled) throw new Error('Cancelled');
  const radius = Math.max(1, Math.min(12, Number($('#strength').value)));
  const selection = state.tool === 'rectangle' ? normalizedRect() : brushBounds();
  const padding = Math.ceil(radius * 3 + 4);
  const roi = {
    x: Math.max(0, selection.x - padding),
    y: Math.max(0, selection.y - padding),
    width: Math.min(sourceVideo.videoWidth, selection.x + selection.width + padding) - Math.max(0, selection.x - padding),
    height: Math.min(sourceVideo.videoHeight, selection.y + selection.height + padding) - Math.max(0, selection.y - padding)
  };
  const fps = await probeFrameRate(ffmpeg, inputPath);
  const fpsValue = Number(fps.toFixed(3));
  await clearOpenCvFrames(ffmpeg);
  await ffmpeg.createDir('opencv-frames');

  try {
    $('#progressTitle').textContent = t('runtime.opencvFrames');
    $('#progressDetail').textContent = `${roi.width}×${roi.height} · ${fpsValue} FPS`;
    setProgress(16);
    const extractArgs = [
      ...videoInputArguments(inputPath), '-t', clipDuration.toFixed(3),
      '-vf', `fps=${fpsValue},crop=${roi.width}:${roi.height}:${roi.x}:${roi.y}`,
      '-start_number', '1', 'opencv-frames/frame-%06d.png'
    ];
    const extractResult = await ffmpeg.exec(extractArgs);
    if (extractResult !== 0) throw new Error(state.lastLog || 'FFmpeg could not extract frames');

    const entries = await ffmpeg.listDir('opencv-frames');
    const frames = entries.filter(entry => !entry.isDir && /^frame-\d+\.png$/.test(entry.name)).map(entry => entry.name).sort();
    if (!frames.length) throw new Error('FFmpeg did not create frames');

    const workCanvas = document.createElement('canvas');
    workCanvas.width = roi.width;
    workCanvas.height = roi.height;
    const workContext = workCanvas.getContext('2d', { willReadFrequently: true });
    const maskCanvasForCv = createMaskCanvas();
    const maskImage = maskCanvasForCv.getContext('2d').getImageData(roi.x, roi.y, roi.width, roi.height);

    for (let index = 0; index < frames.length; index++) {
      if (state.cancelled) throw new Error('Cancelled');
      const framePath = `opencv-frames/${frames[index]}`;
      const frameData = await ffmpeg.readFile(framePath);
      const bitmap = await createImageBitmap(new Blob([frameData.buffer], { type: 'image/png' }));
      workContext.clearRect(0, 0, workCanvas.width, workCanvas.height);
      workContext.drawImage(bitmap, 0, 0);
      bitmap.close();
      await safeDelete(ffmpeg, framePath);

      const sourceImage = workContext.getImageData(0, 0, roi.width, roi.height);
      const sourcePixels = sourceImage.data.slice().buffer;
      const maskPixels = maskImage.data.slice().buffer;
      const response = await openCvWorkerCall(openCvWorker, {
        type: 'inpaint', id: index, width: roi.width, height: roi.height,
        pixels: sourcePixels, mask: maskPixels, radius
      }, [sourcePixels, maskPixels]);
      const restoredImage = new ImageData(new Uint8ClampedArray(response.pixels), roi.width, roi.height);
      workContext.putImageData(restoredImage, 0, 0);

      const processedBlob = await new Promise((resolve, reject) => workCanvas.toBlob(value => value ? resolve(value) : reject(new Error('OpenCV frame export failed')), 'image/png'));
      await ffmpeg.writeFile(framePath, new Uint8Array(await processedBlob.arrayBuffer()));
      const current = index + 1;
      $('#progressTitle').textContent = t('runtime.opencvFrame', { current, total: frames.length });
      $('#progressDetail').textContent = `${Math.round(current / frames.length * 100)}%`;
      setProgress(25 + current / frames.length * 58);
      // Give rendering and the Cancel button a chance to run between frames.
      await new Promise(resolve => setTimeout(resolve, 16));
    }

    if (state.cancelled) throw new Error('Cancelled');
    $('#progressTitle').textContent = t('runtime.opencvAssembling');
    $('#progressDetail').textContent = `${frames.length} · ${fpsValue} FPS`;
    setProgress(86);
    const assembleArgs = [
      '-framerate', String(fpsValue), '-start_number', '1', '-i', 'opencv-frames/frame-%06d.png',
      ...videoInputArguments(inputPath), '-t', clipDuration.toFixed(3),
      '-filter_complex', `[1:v][0:v]overlay=x=${roi.x}:y=${roi.y}:shortest=1[v]`,
      '-map', '[v]', '-map', '1:a?', '-c:v', 'libx264', '-preset', 'ultrafast',
      '-crf', $('#qualitySelect').value, '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
      '-movflags', '+faststart', '-shortest', outputPath
    ];
    const assembleResult = await ffmpeg.exec(assembleArgs);
    if (assembleResult !== 0) throw new Error(state.lastLog || 'FFmpeg could not assemble OpenCV frames');
  } finally {
    await clearOpenCvFrames(ffmpeg);
  }
}

function trimOnlyArguments(inputPath, outputPath) {
  const duration = Math.max(.1, state.trimEnd - state.trimStart);
  const containerSupportsCopy = /\.(mp4|mov|m4v)$/i.test(state.videoFile?.name || '');
  if (state.trimStart <= .001 && containerSupportsCopy) {
    return ['-i', inputPath, '-t', duration.toFixed(3), '-map', '0:v:0', '-map', '0:a?',
      '-c', 'copy', '-movflags', '+faststart', outputPath];
  }
  return [...videoInputArguments(inputPath), '-filter_complex', '[0:v]null[v]', ...commonOutputArguments(outputPath)];
}

function createMaskCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = sourceVideo.videoWidth;
  canvas.height = sourceVideo.videoHeight;
  const context = canvas.getContext('2d');
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff';
  context.strokeStyle = '#fff';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  if (state.tool === 'rectangle') {
    const rect = normalizedRect();
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  } else {
    for (const stroke of state.strokes) paintStroke(context, stroke);
  }
  return canvas;
}

async function createMaskBytes() {
  const canvas = createMaskCanvas();
  const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Mask export failed')), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

async function safeDelete(ffmpeg, path) {
  if (!path) return;
  try { await ffmpeg.deleteFile(path); } catch { /* Virtual file may not exist after cancellation. */ }
}

function extensionOf(name, fallback) {
  const match = name.toLowerCase().match(/\.([a-z0-9]{2,5})$/);
  return match ? match[1] : fallback;
}

function outputFileName(originalName) {
  const base = originalName.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/(?:-logomend)+$/i, '').replace(/^-+|-+$/g, '') || 'video';
  return `${base}-logomend.mp4`;
}

function setProgress(value) {
  const rounded = Math.max(0, Math.min(100, Math.round(value)));
  $('#progressBar').style.width = `${rounded}%`;
  $('#progressPercent').textContent = `${rounded}%`;
}

function startElapsed() {
  stopElapsed();
  state.startedAt = Date.now();
  $('#progressElapsed').textContent = '0:00';
  state.elapsedTimer = setInterval(() => { $('#progressElapsed').textContent = formatTime((Date.now() - state.startedAt) / 1000); }, 1000);
}
function stopElapsed() { clearInterval(state.elapsedTimer); state.elapsedTimer = null; }

function cancelProcessing() {
  state.cancelled = true;
  stopElapsed();
  if (state.ffmpeg) {
    try { state.ffmpeg.terminate(); } catch { /* Already stopped. */ }
    state.ffmpeg = null;
    state.enginePromise = null;
    state.engineLoaded = false;
    setEngineState('', t('engine.waiting'), t('engine.note'));
  }
  showOnly(editView);
}

function showOnly(element) {
  for (const view of [uploadView, editView, progressView, resultView, errorView]) view.classList.toggle('hidden', view !== element);
  if (element === editView) requestAnimationFrame(syncStageLayers);
}

function showError(message, keepUpload = false) {
  $('#errorText').textContent = message;
  errorView.dataset.keepUpload = String(keepUpload);
  showOnly(errorView);
}

function revokeVideoUrl() {
  if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
  state.videoUrl = null;
}

function resetAll() {
  sourceVideo.pause();
  sourceVideo.removeAttribute('src');
  sourceVideo.load();
  revokeVideoUrl();
  clearSelection();
  clearLogo();
  clearCover();
  state.videoFile = null;
  videoInput.value = '';
  if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
  state.outputUrl = null;
  state.outputBlob = null;
  $('#resultVideo').removeAttribute('src');
  showOnly(uploadView);
}

async function continueWithResult() {
  if (!state.outputBlob) return;
  const nextFile = new File([state.outputBlob], outputFileName(state.videoFile?.name || 'video.mp4'), { type: 'video/mp4' });
  await loadVideo(nextFile);
  selectOperation('add');
  document.querySelector('#editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

selectOperation('remove');
selectTool('rectangle');
selectMethod('smart');
