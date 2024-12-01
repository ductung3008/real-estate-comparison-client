import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

export function rounded(value: number, precision = 2) {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}

export function toBillions(value: number) {
  return `${rounded(value / 1000000000)}`;
}

export function toRangeString(min: number, max: number) {
  min = rounded(min);
  max = rounded(max);
  return min === max ? `${min}` : `${min} - ${max}`;
}

export function toPriceRange(min: number, max: number) {
  min = rounded(min / 1000000000);
  max = rounded(max / 1000000000);
  return min === max ? `${min}` : `${min} - ${max}`;
}

export function toMillionPriceRange(min: number, max: number) {
  min = rounded(min / 1000000);
  max = rounded(max / 1000000);
  return min === max ? `${min}` : `${min} - ${max}`;
}

export function toNumberWithCommas(value: number) {
  return Intl.NumberFormat('en-US').format(value);
}

export function toCoordinateString(lat: number, lng: number) {
  return `${rounded(lat, 6)}, ${rounded(lng, 6)}`;
}

export function toMapString(lat: number, lng: number) {
  return `https://www.google.com/maps/place/@${lat},${lng},19z`;
}

export function getCurrentMonthYear() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Tháng ${month} - ${year}`;
}

export function getAverage(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function compareNumerical(values: (number | null)[], order: 'asc' | 'desc' | 'none' = 'none') {
  if (order === 'none') return Array(values.length).fill(null);

  const ranked = [...values]
    .map((value, index) => ({ index, value }))
    .sort((a, b) => {
      if (a.value === null) return 1;
      if (b.value === null) return -1;
      return order === 'asc' ? a.value - b.value : b.value - a.value;
    });

  const ranks = Array(values.length).fill(null);
  let currentRank = 0;
  ranked.forEach((item, i) => {
    if (i === 0 || item.value !== ranked[i - 1].value) {
      currentRank = i + 1;
    }
    ranks[item.index] = currentRank;
  });

  return ranks;
}
