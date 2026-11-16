/* ayakkabi-numara-cetveli — Ayakkabı Numara Cetveli — ayak uzunluğundan numara bulan devrik ölçü tablosu (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Solda vurgu kartında ayak uzunluğu (cm) girişi ve önerilen numara; yanında numaralı ölçüm adımları (desing `olcuNot`). Altında devrik ölçü tablosu: sütunlar numaralar, satırlar EU · UK · US · cm; ilk sütun yapışkan, tablo yatay kaydırılır. Girilen uzunluğa uyan en küçük numara sütunu vurgulanır ve ortaya kaydırılır. Kayıt alanları: `baslik` (EU/TR numara) · `uk` · `us` · `cm`. JS yokken tablo ve adımlar tam, giriş kartı gizli.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-ayakkabi-numara-cetveli";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: ayakkabi-numara-cetveli --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const L = { eu: metinAl(des, ["euAd"]), uk: metinAl(des, ["ukAd"]), us: metinAl(des, ["usAd"]), cm: metinAl(des, ["cmAd"]) };
    const N = A.map((k, i) => { const c = Number(x(i, ["cm", "uzunluk"]).replace(",", ".")); return { k, i, uk: x(i, ["uk"]), us: x(i, ["us"]), cm: x(i, ["cm", "uzunluk"]) !== "" && Number.isFinite(c) ? c : NaN }; });
    const satir = (et, f) => `<tr><th scope="row">${esc(et)}</th>${N.map((n) => `<td data-k="${n.i}">${f(n)}</td>`).join("")}</tr>`;
    const tablo = `<div class="${P}-tkap" data-tkap><table class="${P}-tablo"${B.baslik ? ` aria-labelledby="${P}-{{id}}-b"` : ""}><thead><tr><th scope="col" class="${P}-kose">${esc(L.eu)}</th>${N.map((n) => `<th scope="col" data-k="${n.i}" data-ad="${esc(n.k.baslik)}"${Number.isFinite(n.cm) ? ` data-cm="${n.cm}"` : ""}><bdi>${esc(n.k.baslik)}</bdi></th>`).join("")}</tr></thead><tbody>${N.some((n) => n.uk) ? satir(L.uk, (n) => `<bdi>${esc(n.uk || "—")}</bdi>`) : ""}${N.some((n) => n.us) ? satir(L.us, (n) => `<bdi>${esc(n.us || "—")}</bdi>`) : ""}${N.some((n) => Number.isFinite(n.cm)) ? satir(L.cm, (n) => (Number.isFinite(n.cm) ? `<bdi>${sayiBicim(n.cm, 1)}</bdi>` : "—")) : ""}${N.some((n) => n.k.metin) ? satir("", (n) => (n.k.metin ? `<span class="${P}-tnot">${satirlar(n.k.metin)}</span>` : "")) : ""}</tbody></table></div>`;
    const ON = metinAl(des, ["olcuNot"]).split(/\r?\n/).map((z) => z.trim()).filter(Boolean);
    const olcu = N.some((n) => Number.isFinite(n.cm)) ? `<div class="${P}-akart" data-akap hidden><label class="${P}-aet" for="${P}-{{id}}-a">${esc(metinAl(des, ["ayakAd"]) || L.cm)}</label><div class="${P}-agir">${ikonH("footprint", `${P}-aik`)}<input class="${P}-agirdi" id="${P}-{{id}}-a" type="number" inputmode="decimal" min="10" max="40" step="0.1" value="25" data-ayak /></div><p class="${P}-aset">${esc(metinAl(des, ["sonucAd"]))}</p><p class="${P}-anum" data-anum aria-live="polite">—</p></div>` : "";
    const adim = ON.length ? `<ol class="${P}-adimlar" role="list">${ON.map((z, j) => `<li class="${P}-adim"><span class="${P}-ano" aria-hidden="true"><bdi>${sayiBicim(j + 1, 0)}</bdi></span><span>${esc(z)}</span></li>`).join("")}</ol>` : "";
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div>${olcu || adim ? `<div class="${P}-olcum">${olcu}${adim}</div>` : ""}${tablo}${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
