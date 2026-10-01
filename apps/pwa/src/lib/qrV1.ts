const ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(() => {
  let value = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = value;
    LOG[value] = i;
    value *= 2;
    if (value > 255) value ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function rsEncode(data: number[], ecCount: number) {
  const gen = [1];
  for (let i = 0; i < ecCount; i += 1) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j += 1) {
      next[j] ^= gfMul(gen[j], EXP[i]);
      next[j + 1] ^= gen[j];
    }
    gen.splice(0, gen.length, ...next);
  }
  const ecc = new Array(ecCount).fill(0);
  for (const byte of data) {
    const factor = byte ^ ecc[0];
    ecc.shift();
    ecc.push(0);
    for (let i = 0; i < ecCount; i += 1) ecc[i] ^= gfMul(gen[i + 1], factor);
  }
  return ecc;
}

function bitsToBytes(bits: string) {
  const padded = bits.padEnd(Math.ceil(bits.length / 8) * 8, '0');
  const bytes: number[] = [];
  for (let i = 0; i < padded.length; i += 8) bytes.push(Number.parseInt(padded.slice(i, i + 8), 2));
  return bytes;
}

export function scanCodeFor(pathId: string) {
  const compact = pathId
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 16);
  return `E/${compact}`.slice(0, 25);
}

function alphanumericBits(text: string) {
  const clean = text
    .toUpperCase()
    .split('')
    .filter((ch) => ALPHA.includes(ch))
    .join('');
  let bits = `0010${clean.length.toString(2).padStart(9, '0')}`;
  for (let i = 0; i < clean.length; i += 2) {
    if (i + 1 < clean.length) {
      const value = ALPHA.indexOf(clean[i]) * 45 + ALPHA.indexOf(clean[i + 1]);
      bits += value.toString(2).padStart(11, '0');
    } else {
      bits += ALPHA.indexOf(clean[i]).toString(2).padStart(6, '0');
    }
  }
  bits += '0000';
  const data: number[] = bitsToBytes(bits);
  while (data.length < 19) data.push(data.length % 2 === 0 ? 0xec : 0x11);
  return data.slice(0, 19);
}

function placeFinder(grid: boolean[][], x: number, y: number) {
  for (let row = -1; row <= 7; row += 1) {
    for (let col = -1; col <= 7; col += 1) {
      const rr = y + row;
      const cc = x + col;
      if (rr < 0 || cc < 0 || rr > 20 || cc > 20) continue;
      const on =
        row >= 0 &&
        row <= 6 &&
        col >= 0 &&
        col <= 6 &&
        (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4));
      grid[rr][cc] = on;
    }
  }
}

function reserved(row: number, col: number) {
  if (row <= 8 && col <= 8) return true;
  if (row <= 8 && col >= 13) return true;
  if (row >= 13 && col <= 8) return true;
  if (row === 6 || col === 6) return true;
  return false;
}

function maskBit(row: number, col: number) {
  return (row + col) % 2 === 0;
}

export function qrMatrix(text: string): boolean[][] {
  const data = alphanumericBits(text);
  const ecc = rsEncode(data, 7);
  const bits = [...data, ...ecc].flatMap((byte) => byte.toString(2).padStart(8, '0').split('').map((bit) => bit === '1'));
  const grid = Array.from({ length: 21 }, () => Array<boolean>(21).fill(false));
  placeFinder(grid, 0, 0);
  placeFinder(grid, 14, 0);
  placeFinder(grid, 0, 14);
  for (let i = 8; i <= 12; i += 1) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
  grid[13][8] = true;
  const format = '111011111000100';
  const formatMap: Array<[number, number]> = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ];
  const formatMap2: Array<[number, number]> = [
    [20, 8],
    [19, 8],
    [18, 8],
    [17, 8],
    [16, 8],
    [15, 8],
    [14, 8],
    [8, 13],
    [8, 14],
    [8, 15],
    [8, 16],
    [8, 17],
    [8, 18],
    [8, 19],
    [8, 20],
  ];
  format.split('').forEach((bit, index) => {
    const on = bit === '1';
    const [r1, c1] = formatMap[index];
    const [r2, c2] = formatMap2[index];
    grid[r1][c1] = on;
    grid[r2][c2] = on;
  });

  let bitIndex = 0;
  let upward = true;
  for (let col = 20; col >= 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let i = 0; i < 21; i += 1) {
      const row = upward ? 20 - i : i;
      for (const offset of [0, -1]) {
        const cc = col + offset;
        if (cc < 0 || reserved(row, cc)) continue;
        const raw = bits[bitIndex] ?? false;
        bitIndex += 1;
        grid[row][cc] = raw !== maskBit(row, cc);
      }
    }
    upward = !upward;
  }
  return grid;
}

export function qrSvg(text: string, size = 168) {
  const matrix = qrMatrix(text);
  const module = size / 21;
  const cells = matrix
    .flatMap((row, y) =>
      row.map((on, x) =>
        on ? `<rect x="${x * module}" y="${y * module}" width="${module}" height="${module}" />` : ''
      )
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#111">${cells}</g></svg>`;
}
