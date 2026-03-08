const latinBody = document.getElementById("latinTableBody");
const cyrillicBody = document.getElementById("cyrillicTableBody");

function renderTable(body, rows, columns) {
  body.innerHTML = "";
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const key of columns) {
      const td = document.createElement("td");
      const value = row[key] || "—";
      td.textContent = value;
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }
}

const data = window.RUNE_ALPHABET || [];

const latinRows = data
  .filter((entry) => entry.latin)
  .slice()
  .sort((a, b) => a.latin.localeCompare(b.latin, "en"));
const cyrillicRows = data
  .filter((entry) => entry.cyrillic)
  .slice()
  .sort((a, b) => a.cyrillic.localeCompare(b.cyrillic, "ru"));

renderTable(latinBody, latinRows, ["latin", "rune", "name"]);
renderTable(cyrillicBody, cyrillicRows, ["cyrillic", "rune", "name"]);
