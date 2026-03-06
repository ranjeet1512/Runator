const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const statusText = document.getElementById("statusText");
const fileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");
const sourceSelect = document.getElementById("sourceSelect");
const targetSelect = document.getElementById("targetSelect");
const swapBtn = document.getElementById("swapBtn");

let lastFileName = null;
let lastFileTranslatedContent = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

const runeTable = [
  { rune: "ᚠ", cyr: "Ф", lat: "F" },
  { rune: "ᚢ", cyr: "У", lat: "U" },
  { rune: "ᚦ", cyr: "Т / Д", lat: "TH / T" },
  { rune: "ᚨ", cyr: "А", lat: "A" },
  { rune: "ᚱ", cyr: "Р", lat: "R" },
  { rune: "ᚲ", cyr: "К", lat: "K" },
  { rune: "ᚷ", cyr: "Г", lat: "G" },
  { rune: "ᚹ", cyr: "В", lat: "V / W" },
  { rune: "ᚺ", cyr: "Х", lat: "H" },
  { rune: "ᚾ", cyr: "Н", lat: "N" },
  { rune: "ᛁ", cyr: "И", lat: "I" },
  { rune: "ᛃ", cyr: "Й", lat: "J / Y" },
  { rune: "ᛇ", cyr: "Э", lat: "E" },
  { rune: "ᛈ", cyr: "П", lat: "P" },
  { rune: "ᛉ", cyr: "З", lat: "Z" },
  { rune: "ᛋ", cyr: "С", lat: "S" },
  { rune: "ᛏ", cyr: "Т", lat: "T" },
  { rune: "ᛒ", cyr: "Б", lat: "B" },
  { rune: "ᛖ", cyr: "Е", lat: "E" },
  { rune: "ᛗ", cyr: "М", lat: "M" },
  { rune: "ᛚ", cyr: "Л", lat: "L" },
  { rune: "ᛜ", cyr: "НГ", lat: "NG" },
  { rune: "ᛞ", cyr: "Д", lat: "D" },
  { rune: "ᛟ", cyr: "О", lat: "O" },
  { rune: "ᚪ", cyr: "А", lat: "A" },
  { rune: "ᚫ", cyr: "Я / Э", lat: "AE" },
  { rune: "ᚩ", cyr: "О", lat: "O" },
  { rune: "ᚣ", cyr: "Ю", lat: "Y" },
  { rune: "ᛡ", cyr: "ЙО", lat: "IO" },
  { rune: "ᚷᛋ", cyr: "ZH", lat: "Ж" },
  { rune: "ᚲᛋ", cyr: "CH", lat: "Ч" },
  { rune: "ᛋᛋ", cyr: "SH", lat: "Ш" },
  { rune: "ᛏᛋ", cyr: "TS", lat: "Ц" },
  { rune: "ᛋᛋᚲ", cyr: "SHCH", lat: "Щ" },
  { rune: "ᛃᚨ", cyr: "YA", lat: "Я" },
  { rune: "ᛃᚢ", cyr: "YU", lat: "Ю" },
  { rune: "ᛃᛟ", cyr: "YO", lat: "Ё" },
  { rune: "ᛁ", cyr: "'", lat: "Ь" },
];

const cyrToRune = new Map();
const latToRune = new Map();
const runeToCyr = new Map();
const runeToLat = new Map();

for (const entry of runeTable) {
  const cyrVariants = entry.cyr
      .split("/")
      .map((value) => value.trim())
      .filter(Boolean);
  const latVariants = entry.lat
      .split("/")
      .map((value) => value.trim())
      .filter(Boolean);

  const cyrOut = cyrVariants[0] ?? "";
  const latOut = latVariants[0] ?? "";
  if (cyrOut) runeToCyr.set(entry.rune, cyrOut);
  if (latOut) runeToLat.set(entry.rune, latOut);

  for (const value of cyrVariants) {
    const cyrKey = value.toUpperCase();
    if (!cyrToRune.has(cyrKey)) cyrToRune.set(cyrKey, entry.rune);
  }
  for (const value of latVariants) {
    const latKey = value.toUpperCase();
    if (!latToRune.has(latKey)) latToRune.set(latKey, entry.rune);
  }
}

const cyrKeys = Array.from(cyrToRune.keys()).sort((a, b) => b.length - a.length);
const latKeys = Array.from(latToRune.keys()).sort((a, b) => b.length - a.length);
const runeKeys = Array.from(runeToCyr.keys()).sort((a, b) => b.length - a.length);

function mapByKeys(text, keys, map, caseInsensitive) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const key of keys) {
      const slice = text.slice(i, i + key.length);
      const compare = caseInsensitive ? slice.toUpperCase() : slice;
      if (compare === key) {
        out += map.get(key);
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += text[i];
      i += 1;
    }
  }
  return out;
}

function toRunesFromCyr(text) {
  return mapByKeys(text, cyrKeys, cyrToRune, true);
}

function toRunesFromLat(text) {
  return mapByKeys(text, latKeys, latToRune, true);
}

function fromRunesToCyr(text) {
  return mapByKeys(text, runeKeys, runeToCyr, false);
}

function fromRunesToLat(text) {
  return mapByKeys(text, runeKeys, runeToLat, false);
}

function detectSource(text) {
  const runeCount = (text.match(/[\u16A0-\u16FF]/g) || []).length;
  const cyrCount = (text.match(/[А-Яа-яЁё]/g) || []).length;
  const latCount = (text.match(/[A-Za-z]/g) || []).length;

  if (runeCount === 0 && cyrCount === 0 && latCount === 0) {
    return sourceSelect.value;
  }
  if (runeCount >= cyrCount && runeCount >= latCount) return "runes";
  if (cyrCount >= latCount) return "cyrillic";
  return "latin";
}

function translateText(text, source, target) {
  if (source === target) return text;

  let runes = text;
  if (source === "cyrillic") {
    runes = toRunesFromCyr(text);
  } else if (source === "latin") {
    runes = toRunesFromLat(text);
  }

  if (target === "runes") return runes;
  if (target === "cyrillic") return fromRunesToCyr(runes);
  if (target === "latin") return fromRunesToLat(runes);
  return text;
}

function translateFileContentToRunes(text) {
  const detected = detectSource(text);
  sourceSelect.value = detected;
  return translateText(text, detected, "runes");
}

function runTranslate() {
  const input = inputText.value;
  if (!input) {
    outputText.value = "";
    statusText.textContent = "Ready";
    return;
  }
  lastFileTranslatedContent = null;
  const detected = detectSource(input);
  sourceSelect.value = detected;
  const translated = translateText(input, detected, targetSelect.value) + "";
  outputText.value = translated;
  statusText.textContent = "Ready";
}

translateBtn.addEventListener("click", runTranslate);

copyBtn.addEventListener("click", () => {
  if (!outputText.value) return;
  navigator.clipboard.writeText(outputText.value);
  statusText.textContent = "Copied";
});

inputText.addEventListener("input", () => {
  statusText.textContent = "Translating...";
  clearTimeout(runTranslate._t);
  runTranslate._t = setTimeout(runTranslate, 250);
});

sourceSelect.addEventListener("change", runTranslate);
targetSelect.addEventListener("change", runTranslate);
swapBtn.addEventListener("click", () => {
  const source = sourceSelect.value;
  sourceSelect.value = targetSelect.value;
  targetSelect.value = source;
  runTranslate();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  lastFileName = file.name;
  lastFileTranslatedContent = null;
  statusText.textContent = "Loading file...";
  downloadBtn.classList.remove("primary");
  downloadBtn.classList.add("ghost");

  const reader = new FileReader();
  reader.onload = () => {
    const text = typeof reader.result === "string" ? reader.result : "";
    const translated = translateFileContentToRunes(text);
    lastFileTranslatedContent = translated;
    statusText.textContent = "File translated. Ready to download.";
    downloadBtn.classList.remove("ghost");
    downloadBtn.classList.add("primary");
  };
  reader.onerror = () => {
    lastFileTranslatedContent = null;
    statusText.textContent = "File read error.";
    downloadBtn.classList.remove("primary");
    downloadBtn.classList.add("ghost");
  };
  reader.readAsText(file);
});

downloadBtn.addEventListener("click", () => {
  const fileContent = lastFileTranslatedContent ?? outputText.value;
  if (!fileContent) return;
  const original = lastFileName || "translated.txt";
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  const ext = dot > 0 ? original.slice(dot) : ".txt";
  const suffix = lastFileTranslatedContent ? "runic" : targetSelect.value;
  const name = `${base}_${suffix}${ext}`;
  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  if (lastFileTranslatedContent) {
    lastFileTranslatedContent = null;
    downloadBtn.classList.remove("primary");
    downloadBtn.classList.add("ghost");
    statusText.textContent = "Ready";
  }
});
