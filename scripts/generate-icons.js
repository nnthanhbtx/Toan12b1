import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generatePNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  
  // Create scanlines: each row = 1 filter byte (0) + width * 4 bytes (RGBA)
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width / 2;
  const badgeR = isMaskable ? maxR * 0.72 : maxR * 0.85;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep navy background: #020024
      let r = 2, g = 0, b = 36, a = 255;

      if (dist <= badgeR) {
        // Outer gold border
        if (dist > badgeR - (size > 200 ? 8 : 4)) {
          r = 245; g = 158; b = 11; // Gold #F59E0B
        } else if (dist > badgeR - (size > 200 ? 14 : 6)) {
          r = 254; g = 240; b = 138; // Light Gold #FEF08A
        } else {
          // Inside badge: radial gradient from dark blue to midnight
          const grad = dist / badgeR;
          r = Math.round(9 + (3 - 9) * grad);
          g = Math.round(30 + (10 - 30) * grad);
          b = Math.round(66 + (28 - 66) * grad);

          // Draw central "$" symbol
          // Vertical stem
          const stemWidth = size * 0.04;
          const stemHeight = size * 0.42;
          if (Math.abs(dx) < stemWidth / 2 && Math.abs(dy) < stemHeight / 2) {
            r = 250; g = 204; b = 21; // Yellow 400
          }

          // Top loop and bottom loop of S
          const loopR = size * 0.13;
          const topCy = cy - size * 0.08;
          const botCy = cy + size * 0.08;

          const distTop = Math.sqrt(dx * dx + (y - topCy) * (y - topCy));
          const distBot = Math.sqrt(dx * dx + (y - botCy) * (y - botCy));

          if (distTop >= loopR - stemWidth && distTop <= loopR + stemWidth && (dx < 0 || y < topCy)) {
            r = 250; g = 204; b = 21;
          }
          if (distBot >= loopR - stemWidth && distBot <= loopR + stemWidth && (dx > 0 || y > botCy)) {
            r = 250; g = 204; b = 21;
          }
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter standard
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', generatePNG(192, false));
fs.writeFileSync('public/pwa-512x512.png', generatePNG(512, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', generatePNG(512, true));
fs.writeFileSync('public/apple-touch-icon.png', generatePNG(180, false));
fs.writeFileSync('public/favicon.ico', generatePNG(64, false));

console.log('All PWA icons generated successfully in public/');
