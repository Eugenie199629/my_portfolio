{
  const raster = document.getElementById("raster");
  const leeg = document.getElementById("leeg");
  const lb = document.getElementById("lightbox");
  const lbFoto = document.getElementById("lbFoto");
  const lbTitel = document.getElementById("lbTitel");
  const geldig = ["alles", "newborn", "dieren", "macro", "natuur", "portretten", "architectuur"];
  let zichtbaar = [];
  let huidig = 0;

  document.getElementById("jaar").textContent = new Date().getFullYear();

  // "boven", "onder", "links", "rechts", "midden", combinaties zoals "boven links",
  // of een percentage van boven: "20%"
  const woorden = { boven: "top", onder: "bottom", links: "left", rechts: "right", midden: "center" };
  const focusNaarCss = (focus) => {
    const delen = String(focus).toLowerCase().trim().split(/\s+/);
    if (delen.length === 1 && /^\d+%$/.test(delen[0])) return "50% " + delen[0];
    return delen.map(w => woorden[w] || w).join(" ");
  };

  // Welk deel van de foto zichtbaar blijft in de tegel
  const zetFocus = (img, f) => {
    const zet = () => {
      if (f.focus) img.style.objectPosition = focusNaarCss(f.focus);
      // Geen focus ingesteld en een staande foto? Dan iets boven het midden,
      // want daar zitten meestal de gezichten.
      else if (img.naturalHeight > img.naturalWidth) img.style.objectPosition = "50% 30%";
    };
    if (img.complete) zet(); else img.addEventListener("load", zet);
  };

  // Namen van de categorieën, zoals ze op de knoppen staan
  const namen = {};
  document.querySelectorAll(".filters button").forEach(b => { namen[b.dataset.filter] = b.textContent.trim(); });
  const ondertitel = document.querySelector(".onder span");

  /* ---------- Home: één foto per categorie ---------- */
  const toonHome = () => {
    const tegels = geldig.filter(c => c !== "alles").map(cat => {
      const fotos = FOTOS.filter(f => f.categorie.split(/\s+/).includes(cat));
      if (!fotos.length) return null;                       // lege categorie: niet tonen
      const omslag = fotos.find(f => f.omslag) || fotos[0]; // foto met omslag: true, anders de eerste
      return { cat, omslag, aantal: fotos.length };
    }).filter(Boolean);

    zichtbaar = [];
    ondertitel.textContent = "Portfolio";
    raster.innerHTML = tegels.map((t, i) => `
      <a class="tegel cat" href="#${t.cat}" style="animation-delay:${i * 70}ms">
        <figure>
          <img src="${t.omslag.bestand}" alt="${namen[t.cat]}" loading="lazy">
          <figcaption>
            <span class="naam">${namen[t.cat]}</span>
            <span class="aantal">${t.aantal} ${t.aantal === 1 ? "foto" : "foto's"}</span>
          </figcaption>
        </figure>
      </a>`).join("");
    leeg.hidden = tegels.length > 0;
    raster.querySelectorAll(".tegel img").forEach((img, i) => zetFocus(img, tegels[i].omslag));

    document.querySelectorAll("[data-filter]").forEach(el =>
      el.classList.toggle("actief", el.dataset.filter === "home"));
  };

  const toon = (filter) => {
    ondertitel.textContent = "Galerij";
    zichtbaar = filter === "alles"
      ? FOTOS
      : FOTOS.filter(f => f.categorie.split(/\s+/).includes(filter));

    raster.innerHTML = zichtbaar.map((f, i) => `
      <button class="tegel" data-i="${i}" style="animation-delay:${i * 50}ms" aria-label="Bekijk ${f.titel || "foto"}">
        <figure>
          <img src="${f.bestand}" alt="${f.titel || ""}" loading="lazy">
          ${f.titel ? `<figcaption>${f.titel}</figcaption>` : ""}
        </figure>
      </button>`).join("");
    leeg.hidden = zichtbaar.length > 0;

    raster.querySelectorAll(".tegel img").forEach((img, i) => zetFocus(img, zichtbaar[i]));

    document.querySelectorAll("[data-filter]").forEach(el =>
      el.classList.toggle("actief", el.dataset.filter === filter));
  };

  const route = () => {
    const h = location.hash.slice(1);
    if (h === "home" || h === "") {
      toonHome();
      if (h === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    toon(geldig.includes(h) ? h : "alles");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.querySelectorAll(".filters button").forEach(b =>
    b.addEventListener("click", () => { location.hash = b.dataset.filter; }));

  window.addEventListener("hashchange", route);
  route();

  /* ---------- Lightbox ---------- */
  const open = (i) => {
    huidig = (i + zichtbaar.length) % zichtbaar.length;
    const f = zichtbaar[huidig];
    lbFoto.src = f.bestand;
    lbFoto.alt = f.titel || "";
    lbTitel.textContent = f.titel || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const sluit = () => { lb.hidden = true; document.body.style.overflow = ""; };

  raster.addEventListener("click", e => {
    const t = e.target.closest("button.tegel");
    if (t) open(+t.dataset.i);
  });
  document.getElementById("lbSluit").addEventListener("click", sluit);
  document.getElementById("lbVorige").addEventListener("click", () => open(huidig - 1));
  document.getElementById("lbVolgende").addEventListener("click", () => open(huidig + 1));
  lb.addEventListener("click", e => { if (e.target === lb) sluit(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") sluit();
    if (e.key === "ArrowLeft") open(huidig - 1);
    if (e.key === "ArrowRight") open(huidig + 1);
  });
}