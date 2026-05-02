const video = document.getElementById('camera');
const canvas = document.getElementById('vision');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const scanHint = document.getElementById('scanHint');
const arLayer = document.getElementById('arLayer');
const statusBox = document.getElementById('status');
const openSite = document.getElementById('openSite');
const contactMail = document.getElementById('contactMail');

const SITE_URL = 'https://soulflameAR.vercel.app';
const EMAIL = 'soulflame.mitko@gmail.com';

let running = false;
let lastGood = null;
let lostFrames = 0;
let smooth = { x: 0, y: 0, w: 0, h: 0, angle: 0, ready: false };

openSite.addEventListener('click', () => window.open(SITE_URL, '_blank'));
contactMail.addEventListener('click', () => window.location.href = `mailto:${EMAIL}?subject=SoulFlame%20AR`);

startBtn.addEventListener('click', startCamera);

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    startScreen.classList.add('hidden');
    scanHint.classList.remove('hidden');
    running = true;
    statusBox.textContent = 'CAMERA ON';
    requestAnimationFrame(loop);
  } catch (err) {
    statusBox.textContent = 'CAMERA ERROR';
    alert('Камерата не тръгна. Отвори през HTTPS/Vercel или localhost и разреши достъп до камерата.');
    console.error(err);
  }
}

function loop() {
  if (!running || video.readyState < 2) {
    requestAnimationFrame(loop);
    return;
  }

  const detection = detectBlackCard();
  if (detection) {
    lostFrames = 0;
    lastGood = detection;
    updateOverlay(detection);
    scanHint.classList.add('hidden');
    arLayer.classList.remove('hidden');
    statusBox.textContent = `LOCKED ${Math.round(detection.confidence * 100)}%`;
  } else {
    lostFrames++;
    if (lostFrames > 8) {
      arLayer.classList.add('hidden');
      scanHint.classList.remove('hidden');
      statusBox.textContent = 'SCANNING';
      smooth.ready = false;
    } else if (lastGood) {
      updateOverlay(lastGood);
    }
  }

  setTimeout(() => requestAnimationFrame(loop), 70);
}

function detectBlackCard() {
  const W = 180;
  const ratio = video.videoHeight / video.videoWidth || 0.5625;
  const H = Math.max(100, Math.round(W * ratio));
  canvas.width = W;
  canvas.height = H;
  ctx.drawImage(video, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  const darkPoints = [];
  let minX = W, minY = H, maxX = 0, maxY = 0;
  const step = 2;

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const contrast = Math.max(r, g, b) - Math.min(r, g, b);
      // търси голяма черна повърхност с леки бели детайли около нея
      if (brightness < 58 && contrast < 55) {
        darkPoints.push([x, y]);
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (darkPoints.length < 420) return null;

  const bw = maxX - minX;
  const bh = maxY - minY;
  if (bw < W * 0.12 || bh < H * 0.20) return null;

  const aspect = bw / bh;
  if (aspect < 0.33 || aspect > 0.92) return null;

  const areaRatio = (bw * bh) / (W * H);
  if (areaRatio < 0.05 || areaRatio > 0.72) return null;

  let cx = 0, cy = 0;
  for (const [x, y] of darkPoints) { cx += x; cy += y; }
  cx /= darkPoints.length; cy /= darkPoints.length;

  // PCA angle estimate
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of darkPoints) {
    const dx = x - cx, dy = y - cy;
    sxx += dx * dx; syy += dy * dy; sxy += dx * dy;
  }
  const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy) + Math.PI / 2;

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const scaleX = viewW / W;
  const scaleY = viewH / H;

  const confidence = Math.min(1, Math.max(0.25, (darkPoints.length / (W * H / (step * step))) * 4));
  return {
    x: cx * scaleX,
    y: cy * scaleY,
    w: bw * scaleX,
    h: bh * scaleY,
    angle,
    confidence
  };
}

function updateOverlay(d) {
  const alpha = smooth.ready ? 0.22 : 1;
  smooth.x = lerp(smooth.x, d.x, alpha);
  smooth.y = lerp(smooth.y, d.y, alpha);
  smooth.w = lerp(smooth.w, d.w, alpha);
  smooth.h = lerp(smooth.h, d.h, alpha);
  smooth.angle = lerpAngle(smooth.angle, d.angle, alpha);
  smooth.ready = true;

  const baseHeight = 460;
  const scale = Math.max(0.38, Math.min(1.55, smooth.h / baseHeight));

  arLayer.style.transform = `translate(-50%, -50%) translate(${smooth.x - window.innerWidth / 2}px, ${smooth.y - window.innerHeight / 2}px) rotate(${smooth.angle}rad) scale(${scale})`;
  arLayer.style.opacity = String(Math.max(0.45, Math.min(1, d.confidence + 0.25)));
}

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
