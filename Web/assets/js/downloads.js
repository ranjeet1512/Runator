const grid = document.getElementById("downloadsGrid");
const downloads = window.DOWNLOADS || [];

grid.innerHTML = "";

for (const item of downloads) {
  const card = document.createElement("div");
  card.className = "download-card";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = item.title || "Untitled";

  const desc = document.createElement("div");
  desc.className = "download-desc";
  desc.textContent = item.description || "";

  const meta = document.createElement("div");
  meta.className = "download-meta";

  const metaItems = [
    item.platform ? `Platform: ${item.platform}` : "",
    item.version ? `Version: ${item.version}` : "",
    item.category ? `Category: ${item.category}` : "",
  ].filter(Boolean);

  for (const text of metaItems) {
    const chip = document.createElement("span");
    chip.textContent = text;
    meta.appendChild(chip);
  }

  const button = document.createElement("a");
  button.className = "btn primary";
  button.textContent = "Download";
  button.href = item.file || "#";
  button.download = "";

  card.appendChild(title);
  if (desc.textContent) card.appendChild(desc);
  if (metaItems.length) card.appendChild(meta);
  card.appendChild(button);

  grid.appendChild(card);
}
