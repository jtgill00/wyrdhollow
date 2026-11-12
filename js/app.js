/* WyrdHollow site: views, effects and all the interactive bits.
   No libraries, no build step: works straight off GitHub Pages. */
(() => {
	"use strict";
	const WH = window.WH, SITE = window.SITE;
	const $ = (s, r = document) => r.querySelector(s);
	const $$ = (s, r = document) => [...r.querySelectorAll(s)];
	const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
	const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const root = document.documentElement;
	const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();

	// ---------- Path (Radiant / Hollow) -------------------------------------------
	let path = "radiant";
	try { path = localStorage.getItem("wh-path") || "radiant"; } catch (e) {}
	root.dataset.path = path;

	function setPath(p, x, y) {
		if (p === root.dataset.path) return;
		const wipe = $("#wipe");
		wipe.style.setProperty("--wx", (x ?? innerWidth / 2) + "px");
		wipe.style.setProperty("--wy", (y ?? innerHeight / 2) + "px");
		wipe.style.background = p === "hollow" ? "radial-gradient(circle, #ff4fd8, #b47cff 40%, #1a0b2e)" : "radial-gradient(circle, #fff3c4, #ffcf5a 40%, #ff9a3d)";
		wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go");
		setTimeout(() => { root.dataset.path = p; renderPath(); weave.recolour(); }, reduced ? 0 : 480);
		try { localStorage.setItem("wh-path", p); } catch (e) {}
	}
	$$(".switch button[data-p]").forEach((b) => b.addEventListener("click", (e) => setPath(b.dataset.p, e.clientX, e.clientY)));

	// ---------- The Weave: drifting threads of light ---------------------------------
	const weave = (() => {
		const c = $("#weave"), x = c.getContext("2d");
		let w, h, dots = [], mouse = { x: -999, y: -999 }, colour = "#ffcf5a", colour2 = "#ff9a3d";
		const resize = () => {
			w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio;
			c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
			const n = Math.min(120, Math.floor((innerWidth * innerHeight) / 14000));
			dots = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.8 + 0.6, t: Math.random() * 6 }));
		};
		addEventListener("resize", resize); resize();
		addEventListener("pointermove", (e) => { mouse.x = e.clientX * devicePixelRatio; mouse.y = e.clientY * devicePixelRatio; });
		const recolour = () => { colour = css("--accent") || colour; colour2 = css("--accent2") || colour2; };
		recolour();
		const link = 130 * devicePixelRatio;
		const frame = () => {
			x.clearRect(0, 0, w, h);
			const drift = root.dataset.path === "hollow" ? 0.12 : -0.12;   // light rises, shadow sinks
			for (const d of dots) {
				d.t += 0.02;
				const dx = mouse.x - d.x, dy = mouse.y - d.y, dist = Math.hypot(dx, dy);
				if (dist < 220 * devicePixelRatio) { d.vx += dx / dist * 0.012; d.vy += dy / dist * 0.012; }
				d.vx *= 0.985; d.vy = d.vy * 0.985 + drift * 0.01;
				d.x += d.vx; d.y += d.vy;
				if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
			}
			x.lineWidth = devicePixelRatio * 0.7;
			for (let i = 0; i < dots.length; i++) {
				for (let j = i + 1; j < dots.length; j++) {
					const a = dots[i], b = dots[j], d = Math.hypot(a.x - b.x, a.y - b.y);
					if (d < link) { x.globalAlpha = (1 - d / link) * 0.35; x.strokeStyle = colour; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
				}
			}
			for (const d of dots) {
				x.globalAlpha = 0.5 + 0.5 * Math.sin(d.t);
				x.fillStyle = d.r > 1.8 ? colour2 : colour;
				x.beginPath(); x.arc(d.x, d.y, d.r * devicePixelRatio, 0, 7); x.fill();
			}
			x.globalAlpha = 1;
			if (!reduced) requestAnimationFrame(frame);
		};
		frame();
		return { recolour };
	})();

	// ---------- Cursor ------------------------------------------------------------------
	(() => {
		const ring = $("#cursor"), dot = $("#cursor-dot");
		let tx = -100, ty = -100, rx = -100, ry = -100;
		addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; dot.style.left = tx + "px"; dot.style.top = ty + "px"; });
		const loop = () => { rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(loop); };
		loop();
		document.addEventListener("pointerover", (e) => ring.classList.toggle("big", !!e.target.closest("a, button, .card, .person, .pin, .shot, .badge, summary, .spoil")));
	})();

	// ---------- Sprites (pixel sheets animated frame by frame) ----------------------------
	const sprites = [];
	function sprite(node, s, scale) {
		node.classList.add("px");
		node.style.width = s.fw * scale + "px"; node.style.height = s.fh * scale + "px";
		node.style.backgroundImage = `url(${s.src})`;
		const img = new Image();
		img.onload = () => { node.style.backgroundSize = `${img.width * scale}px ${img.height * scale}px`; };
		img.src = s.src;
		sprites.push({ node, s, scale, f: 0 });
		return node;
	}
	let last = 0;
	(function animate(t) {
		for (const sp of sprites) {
			const frame = Math.floor((t / 1000) * sp.s.fps) % sp.s.count;
			if (frame !== sp.f) { sp.f = frame; sp.node.style.backgroundPosition = `-${(sp.s.start + frame) * sp.s.fw * sp.scale}px -${(sp.s.row || 0) * sp.s.fh * sp.scale}px`; }
		}
		requestAnimationFrame(animate);
	})(0);

	// ---------- Home: hero ------------------------------------------------------------------
	const logo = $(".logo");
	logo.innerHTML = [...logo.textContent].map((ch, i) => `<span style="animation-delay:${0.25 + i * 0.06}s">${ch}</span>`).join("");
	// The parade: the creatures following the hero, the hero on a broom with wand glowing,
	// chasing the goblins who run out front (left to right = back to front).
	const parade = $("#parade");
	const add = (node) => { parade.append(node); return node; };
	const flying = ["Emberwing Moth", "Lanternjelly", "Starling Wisp"];
	["Puddlefox", "Emberwing Moth", "Mossback Tortoise", "Thornhound", "Starling Wisp", "Glimmer Newt", "Lanternjelly", "Elder Wyrmling"].forEach((n, i) => {
		const c = WH.creatures.find((x) => x.name === n);
		if (!c) return;
		const s = add(el("div", "sprite critter-walk" + (flying.includes(n) ? " fly" : "")));
		s.style.animationDelay = (i * -0.23) + "s";
		sprite(s, c.sprite, 3);
	});
	add(el("div", "gap")).style.width = "90px";
	const rider = add(el("div", "rider"));
	rider.innerHTML = `<div class="shadow"></div>
		<svg class="broom" viewBox="0 0 44 11" aria-hidden="true">
			<rect class="streak" x="0" y="3" width="6" height="1" fill="#ffffff" opacity=".6"/><rect class="streak" x="1" y="6" width="7" height="1" fill="#ffffff" opacity=".6"/><rect class="streak" x="0" y="8" width="5" height="1" fill="#ffffff" opacity=".6"/>
			<polygon points="8,2 18,4 18,9 8,10" fill="#5a3a1c"/><polygon points="9,3 18,4.6 18,8.4 9,9" fill="#8a6a3a"/>
			<rect x="10" y="5" width="7" height="1" fill="#6a4a24"/><rect x="10" y="7" width="7" height="1" fill="#6a4a24"/>
			<rect x="17" y="3" width="2" height="7" fill="#c83a3a"/>
			<rect x="19" y="5" width="25" height="3" fill="#1a1418"/><rect x="19" y="6" width="24" height="1" fill="#c8a878"/>
		</svg>`;
	const heroS = el("div", "sprite"); sprite(heroS, { ...WH.hero_idle, row: 3 }, 2); rider.append(heroS);
	rider.append(el("div", "wand"));
	for (let i = 0; i < 7; i++) {   // sparkles trailing off the wand tip
		const sp = el("div", "spark");
		sp.style.animationDelay = (i * -0.17) + "s";
		sp.style.setProperty("--dy", (Math.random() * 30 - 8).toFixed(0) + "px");
		rider.append(sp);
	}
	add(el("div", "gap")).style.width = "150px";
	[1.9, 2.2, 2, 2.6].forEach((scale, i) => {   // the big one leading the band, running away
		const g = add(el("div", "sprite goblin"));
		g.style.animationDelay = (i * -0.11) + "s";
		sprite(g, WH.goblin, scale);
	});
	$("#marquee").innerHTML = [...SITE.marquee, ...SITE.marquee].map((t) => `<span>${esc(t)}</span><span>✦</span>`).join("");

	// ---------- Features (3D tilt cards) -------------------------------------------------------
	$("#features").innerHTML = SITE.features.map((f, i) =>
		`<div class="card tilt" data-reveal style="transition-delay:${(i % 3) * 0.08}s"><span class="num">0${i + 1}</span><div class="ico">${f[0]}</div><h3>${esc(f[1])}</h3><p>${esc(f[2])}</p><div class="glare"></div></div>`).join("");
	function tilt(card) {
		card.addEventListener("pointermove", (e) => {
			const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
			card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateZ(0)`;
			card.style.setProperty("--gx", px * 100 + "%"); card.style.setProperty("--gy", py * 100 + "%");
		});
		card.addEventListener("pointerleave", () => { card.style.transform = ""; });
	}

	// ---------- Light & Shadow ------------------------------------------------------------
	function renderPath() {
		const p = SITE.paths[root.dataset.path];
		const blurb = $("#path-blurb");
		blurb.classList.remove("swap"); void blurb.offsetWidth; blurb.classList.add("swap");
		blurb.textContent = p.blurb;
		$("#path-spells").innerHTML = p.spells.map((n) => {
			const s = WH.spells.find((x) => x.name === n) || { colour: css("--accent"), kind: "" };
			return `<span class="chip"><i style="background:${s.colour};color:${s.colour}"></i>${esc(n)} <small style="color:var(--muted)">${esc(s.kind)}</small></span>`;
		}).join("");
	}
	renderPath();
	$("#endings").innerHTML = SITE.endings.map((e) => `<div class="ending" data-reveal><b class="grad-text">${esc(e[0])}</b><small>${esc(e[1]).toUpperCase()}</small></div>`).join("");

	// ---------- Gallery (pinned, scrolls sideways) -------------------------------------------
	$("#rail").innerHTML = WH.screenshots.map((s, i) => `<figure class="shot" data-i="${i}"><span class="n">${String(i + 1).padStart(2, "0")} / ${String(WH.screenshots.length).padStart(2, "0")}</span><img src="${s.src}" alt="${esc(s.caption)}" loading="lazy"><figcaption>${esc(s.caption)}</figcaption></figure>`).join("");
	// Each screenshot gets about 70% of a screen of scrolling (desktop).
	const sizeGallery = () => { $("#gallery").style.height = innerWidth > 760 ? `${100 + WH.screenshots.length * 70}vh` : ""; };
	sizeGallery(); addEventListener("resize", sizeGallery);
	$("#swipe-hint").textContent = `Swipe to see all ${WH.screenshots.length} screenshots →`;
	const lb = $("#lightbox");
	$$(".shot").forEach((s) => s.addEventListener("click", () => { const d = WH.screenshots[s.dataset.i]; $("img", lb).src = d.src; $("p", lb).textContent = d.caption; lb.classList.add("open"); }));
	lb.addEventListener("click", () => lb.classList.remove("open"));

	function railScroll() {
		const sec = $("#gallery"), rail = $("#rail");
		if (!sec || innerWidth <= 760) { rail.style.transform = ""; return; }
		const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
		const k = Math.min(1, Math.max(0, -r.top / total));
		// Slide until the last screenshot sits in the middle of the screen.
		const last = rail.lastElementChild;
		const max = last ? Math.max(0, last.offsetLeft + last.offsetWidth / 2 - innerWidth / 2) : 0;
		rail.style.transform = `translateX(${-k * max}px)`;
		$("#rail-bar").style.width = k * 100 + "%";
	}

	// ---------- World map --------------------------------------------------------------------
	const map = $("#map");
	const lines = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 5], [2, 6], [1, 7], [7, 8], [2, 9], [8, 10], [6, 11], [3, 12], [11, 13], [1, 14]];
	$("#map-lines").innerHTML = lines.map(([a, b]) => { const A = WH.places[a], B = WH.places[b]; const mx = (A[3] + B[3]) / 2, my = (A[4] + B[4]) / 2 - 6; return `<path d="M${A[3]} ${A[4]} Q${mx} ${my} ${B[3]} ${B[4]}"/>`; }).join("");
	WH.places.forEach((p, i) => {
		const pin = el("button", "pin"); pin.style.left = p[3] + "%"; pin.style.top = p[4] + "%"; pin.dataset.name = p[0]; pin.setAttribute("aria-label", p[0]);
		pin.addEventListener("click", () => showPlace(i)); map.appendChild(pin);
	});
	function showPlace(i) {
		const p = WH.places[i], panel = $("#place");
		$$(".pin", map).forEach((x, j) => x.classList.toggle("on", j === i));
		panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
		panel.innerHTML = `<span class="kicker">${String(i + 1).padStart(2, "0")} · Region</span><h3 class="grad-text">${esc(p[0])}</h3><p>${esc(p[1])}</p><div class="need">↳ HOW TO GET THERE: ${esc(p[2]).toUpperCase()}</div>`;
	}
	showPlace(0);

	// ---------- Characters ---------------------------------------------------------------------
	const cast = $("#cast"), modal = $("#person-modal");
	WH.characters.forEach((c, i) => {
		const card = el("div", "person"); card.dataset.reveal = ""; card.style.transitionDelay = (i % 6) * 0.05 + "s";
		const s = el("div", "sprite"); sprite(s, { ...c.sprite, row: 0 }, c.sprite.fw === 24 ? 3 : 2);
		card.append(s); card.insertAdjacentHTML("beforeend", `<b>${esc(c.name)}</b><small>${esc(c.role).toUpperCase()}</small>`);
		card.addEventListener("click", () => {
			const box = $(".box", modal); box.innerHTML = "";
			const big = el("div", "sprite"); sprite(big, { ...c.sprite, row: 0 }, c.sprite.fw === 24 ? 6 : 4);
			box.append(big); box.insertAdjacentHTML("beforeend", `<span class="kicker">${esc(c.role)}</span><h3 class="grad-text" style="font-size:2rem;margin-top:10px">${esc(c.name)}</h3><p style="color:var(--muted)">${esc(c.blurb)}</p>`);
			modal.classList.add("open");
		});
		cast.append(card);
	});
	modal.addEventListener("click", () => modal.classList.remove("open"));

	// ---------- Guilds ---------------------------------------------------------------------------
	const tabs = $("#guild-tabs");
	WH.guilds.forEach((g, i) => { const b = el("button", "", esc(g.name)); b.addEventListener("click", () => showGuild(i)); tabs.append(b); });
	function showGuild(i) {
		const g = WH.guilds[i], panel = $("#guild-panel");
		$$("button", tabs).forEach((b, j) => b.classList.toggle("on", j === i));
		panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
		panel.innerHTML = `<div><span class="kicker" style="color:${g.colour}">${esc(g.place)}</span><h3 style="font-size:2.2rem;margin-top:10px">${esc(g.name)}</h3><p style="color:var(--muted)">${esc(g.what)}</p><div class="ranks"><span>Initiate</span><span>Apprentice</span><span>Journeyman</span><span>Adept · Seal</span><span>Master</span></div></div>
			<dl><dt>MASTER</dt><dd>${esc(g.master)}</dd><dt>SKILL</dt><dd>${esc(g.skill)}</dd><dt>SEAL TRIAL</dt><dd>${esc(g.trial)}</dd><dt>HOLLOW SIDE</dt><dd>${esc(g.hollow)}</dd></dl>`;
	}
	showGuild(0);

	// ---------- Familiars ----------------------------------------------------------------------
	const critters = $("#critters");
	WH.creatures.forEach((c, i) => {
		const card = el("div", "critter"); card.dataset.reveal = ""; card.style.transitionDelay = (i % 4) * 0.06 + "s";
		const s = el("div", "sprite"); sprite(s, c.sprite, 3);
		const t = el("div", "", `<b>${esc(c.name)}</b><p>${esc(c.perk)}</p><p style="color:var(--accent);font-family:var(--pixel);font-size:.6rem;margin-top:6px">${esc(c.home).toUpperCase()}</p>`);
		card.append(s, t); critters.append(card);
	});

	// ---------- Achievements ---------------------------------------------------------------------
	$("#ach-count").textContent = WH.achievements.length;
	$("#ach").innerHTML = WH.achievements.map((a, i) => `<div class="badge" data-reveal style="transition-delay:${(i % 8) * 0.04}s"><div class="in"><div class="f"><img src="${a.icon}" alt="${esc(a.name)}" loading="lazy"></div><div class="b"><div><b>${esc(a.name)}</b>${esc(a.description)}</div></div></div></div>`).join("");
	$$(".badge").forEach((b) => b.addEventListener("click", () => b.classList.toggle("flip")));

	// ---------- Guide ----------------------------------------------------------------------------
	const table = (heads, rows) => `<div class="table-wrap"><table><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
	const dot = (c) => `<span class="dot" style="background:${c};color:${c}"></span>`;
	$("#guide-body").innerHTML = SITE.guide.map((s) => `<section class="gsec" id="g-${s.id}" data-title="${esc(s.title)}"><span class="kicker">Guide</span><h2>${esc(s.title)}</h2>${s.html}</section>`).join("");
	$("#toc").innerHTML = SITE.guide.map((s) => `<a href="#/guide" data-to="g-${s.id}">${esc(s.title)}</a>`).join("");
	$$("#toc a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); $("#" + a.dataset.to).scrollIntoView({ behavior: "smooth" }); }));

	$("#guide-fish").innerHTML = table(["Fish", "Where", "Fishing level", "When", "Sells for"], WH.fish.filter((f) => !f.find).sort((a, b) => a.level - b.level).map((f) =>
		[`${dot(f.colour)}<b>${esc(f.name)}</b><br><small style="color:var(--muted)">${esc(f.desc)}</small>`, esc(f.where.join(", ")), f.level, (f.night ? "Night only · " : "") + esc(f.seasons.join(", ")), f.value + " Gleam"]))
		+ `<p style="color:var(--muted)">You might also hook an Old Coin, Sea Glass or a Seashell. Where each kind of water is: ${Object.entries(WH.waters).map(([k, v]) => `<b>${esc(k)}</b>: ${esc(v.join(", "))}`).join(" · ")}.</p>`;
	$("#guide-meals").innerHTML = table(["Meal", "Ingredients", "Cooking level", "Effect"], WH.meals.map((m) =>
		[`${dot(m.colour)}<b>${esc(m.name)}</b>`, m.ingredients.map((i) => `${i[1]} × ${esc(i[0])}`).join(", "), m.level, [m.heal ? `Heals ${m.heal}` : "", m.mana ? `+${m.mana} mana` : ""].filter(Boolean).join(", ")]));
	$("#guide-brews").innerHTML = table(["Brew", "Ingredients", "Alchemy level", "What it does"], WH.brews.map((m) => [`${dot(m.colour)}<b>${esc(m.name)}</b>`, m.ingredients.map((i) => `${i[1]} × ${esc(i[0])}`).join(", "), m.level, esc(m.desc)]));
	$("#guide-spells").innerHTML = table(["Spell", "School", "Kind", "Mana", "Level", "How you learn it"], WH.spells.map((s) => [`${dot(s.colour)}<b>${esc(s.name)}</b>`, s.school, s.kind, s.mana, s.level, esc(s.how)]));
	$("#guide-critters").innerHTML = table(["Creature", "Where", "What it does", "Calm time"], WH.creatures.map((c) => [`<b>${esc(c.name)}</b><br><small style="color:var(--muted)">${esc(c.desc)}</small>`, esc(c.home), esc(c.perk), c.calm + " s"]));
	$("#guide-brooms").innerHTML = table(["Broom", "Speed", "Where to find it"], WH.brooms.map((b) => [`<span class="dot" style="background:${b.bristles}"></span><b>${esc(b.name)}</b><br><small style="color:var(--muted)">${esc(b.desc)}</small>`, b.speed + "× walking", esc(b.where)]));
	$("#guide-cores").innerHTML = table(["Core", "Spells hit harder", "How to get it"], WH.cores.map((c) => [`<b>${esc(c.name)}</b>`, "+" + c.bonus + "%", esc(c.where)]));
	$("#guide-guilds").innerHTML = table(["Guild", "Where", "Master", "Seal Trial", "Hollow side"], WH.guilds.map((g) => [`${dot(g.colour)}<b>${esc(g.name)}</b>`, esc(g.place), esc(g.master), esc(g.trial), esc(g.hollow)]));
	$("#guide-ach").innerHTML = table(["", "Achievement", "How to earn it"], WH.achievements.map((a) => [`<img src="${a.icon}" width="40" height="40" class="px" alt="" loading="lazy">`, `<b>${esc(a.name)}</b>`, esc(a.description)]));
	$("#guide-quests").innerHTML = WH.quests.map((q) => `<h3>${esc(q.title)}</h3><p style="color:var(--muted);margin-top:-6px">${esc(q.subtitle)}</p><ol class="steps">${q.steps.map((s) => {
		const step = s.replace("{where}", "a town on the map");
		const hint = Object.entries(SITE.hints).find(([k]) => step.startsWith(k));
		return `<li>${esc(step)}${hint ? `<em>💡 ${esc(hint[1])}</em>` : ""}</li>`;
	}).join("")}</ol>`).join("");
	$("#faq").innerHTML = SITE.faq.map((f) => `<details class="faq"><summary>${esc(f[0])}</summary><div>${esc(f[1])}</div></details>`).join("");

	// Search: every guide section, FAQ, quest step, fish, meal, creature, place and person.
	const index = [];
	$$(".gsec").forEach((s) => {
		$$("p, li, tr, details", s).forEach((n) => index.push({ where: s.dataset.title, text: n.textContent.replace(/\s+/g, " ").trim(), node: n }));
	});
	WH.places.forEach((p) => index.push({ where: "World", text: `${p[0]}: ${p[1]} How to get there: ${p[2]}.`, home: "#world" }));
	WH.characters.forEach((c) => index.push({ where: "Characters", text: `${c.name} (${c.role}): ${c.blurb}`, home: "#characters" }));
	const results = $("#results");
	$("#q").addEventListener("input", (e) => {
		const q = e.target.value.trim().toLowerCase();
		if (q.length < 2) { results.innerHTML = ""; return; }
		const words = q.split(/\s+/);
		const hits = index.filter((i) => words.every((w) => i.text.toLowerCase().includes(w))).slice(0, 12);
		results.innerHTML = hits.length ? "" : `<div class="result">Nothing found for “${esc(q)}”. Try fewer words, or check <a href="#/guide" data-to="g-stuck">I'm stuck!</a></div>`;
		hits.forEach((h) => {
			let t = esc(h.text.length > 220 ? h.text.slice(0, 220) + "…" : h.text);
			for (const w of words) t = t.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>");
			const r = el("div", "result", `<small>${esc(h.where).toUpperCase()}</small><div>${t}</div>`);
			r.style.cursor = "pointer";
			r.addEventListener("click", () => {
				if (h.home) { go("#/" + h.home); return; }
				const n = h.node.closest("details") || h.node; if (n.tagName === "DETAILS") n.open = true;
				n.scrollIntoView({ behavior: "smooth", block: "center" });
				n.animate([{ boxShadow: "0 0 0 0 var(--glow)" }, { boxShadow: "0 0 0 8px transparent" }], { duration: 1200, iterations: 2 });
			});
			results.append(r);
		});
	});

	// ---------- Story --------------------------------------------------------------------------
	const tl = $("#timeline");
	SITE.story.forEach((s) => tl.insertAdjacentHTML("beforeend", `<article class="chapter" data-reveal><span class="era">${esc(s[0]).toUpperCase()}</span><h3 class="grad-text">${esc(s[1])}</h3><p class="${s[3] ? "spoil" : ""}">${esc(s[2])}</p></article>`));
	$$(".spoil").forEach((s) => s.addEventListener("click", () => s.classList.add("shown")));
	const sp = $("#spoil-switch");
	$$("button", sp).forEach((b) => b.addEventListener("click", () => {
		const on = b.dataset.s === "on";
		root.classList.toggle("spoilers", on);
		$(".knob", sp).style.transform = on ? "translateX(100%)" : "";
		$$("button", sp).forEach((x) => x.style.color = x === b ? "#140d22" : "");
	}));
	$$("button", sp)[0].style.color = "#140d22";

	// ---------- Views and the portal transition ---------------------------------------------------
	let view = "";
	function route() {
		const h = location.hash || "#/";
		const name = h.startsWith("#/guide") ? "guide" : h.startsWith("#/story") ? "story" : h.startsWith("#/play") ? "play" : "home";
		const anchor = h.includes("#", 1) ? h.slice(h.indexOf("#", 1)) : "";
		const swap = () => {
			$$(".view").forEach((v) => v.classList.toggle("on", v.id === "view-" + name));
			$$(".links a").forEach((a) => a.classList.toggle("on", a.dataset.view === name && !a.classList.contains("btn") && (name !== "home" || !a.hash.includes("#", 2))));
			if (anchor && $(anchor)) setTimeout(() => $(anchor).scrollIntoView({ behavior: view === name ? "smooth" : "auto" }), 30);
			else if (view !== name) scrollTo(0, 0);
			view = name; reveal();
		};
		if (view && view !== name && !reduced) {
			const p = $("#portal"); p.classList.remove("go"); void p.offsetWidth; p.classList.add("go");
			setTimeout(swap, 420);
		} else swap();
		$(".links").classList.remove("open");
	}
	const go = (h) => { if (location.hash === h) route(); else location.hash = h; };

	// ---------- Play in the browser ------------------------------------------------------------
	// The game (play/index.html) only loads when someone presses Start, so the
	// rest of the site stays quick.
	(() => {
		const player = $("#player"), start = $("#player-start"), full = $("#player-full");
		if (!player || !start) return;
		start.addEventListener("click", () => {
			// Phones: open the game on its own page so it fills the screen
			// (an iPhone can't make part of a page fullscreen).
			if (matchMedia("(pointer: coarse) and (hover: none)").matches) { location.href = "play/index.html"; return; }
			const f = document.createElement("iframe");
			f.src = "play/index.html";
			f.title = "WyrdHollow: Part 1";
			f.allow = "fullscreen; autoplay; gamepad";
			f.allowFullscreen = true;
			player.classList.add("running");
			player.appendChild(f);
			f.addEventListener("load", () => { try { f.contentWindow.focus(); } catch (e) {} });
			full.disabled = false;
		});
		$$(".player-bar [data-to]").forEach((a) => a.addEventListener("click", (e) => {
			e.preventDefault(); go("#/guide");
			setTimeout(() => { const t = $("#" + a.dataset.to); if (t) t.scrollIntoView({ behavior: "smooth" }); }, 700);
		}));
		full.addEventListener("click", () => {
			const f = $("iframe", player);
			if (f && f.requestFullscreen) f.requestFullscreen().then(() => f.contentWindow.focus()).catch(() => {});
		});
	})();
	addEventListener("hashchange", route);

	// ---------- Reveal on scroll, header, parallax ----------------------------------------------
	const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
	function reveal() { $$("[data-reveal]:not(.in)").forEach((n) => io.observe(n)); $$(".tilt:not(.t)").forEach((c) => { c.classList.add("t"); tilt(c); }); }

	let lastY = 0;
	const header = $("header.top"), parallax = $$("[data-parallax]");
	function onScroll() {
		const y = scrollY;
		header.classList.toggle("scrolled", y > 30);
		header.classList.toggle("hide", y > lastY && y > 400);
		lastY = y;
		parallax.forEach((p) => p.style.transform = `translateY(${y * p.dataset.parallax}px) scale(1.1)`);
		if (view === "home") railScroll();
		if (view === "story") {
			const r = tl.getBoundingClientRect();
			$("#tfill").style.height = Math.max(0, Math.min(r.height, innerHeight * 0.6 - r.top)) + "px";
		}
	}
	addEventListener("scroll", onScroll, { passive: true });
	addEventListener("resize", onScroll);

	// Magnetic buttons
	$$(".magnet").forEach((b) => {
		b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
		b.addEventListener("pointerleave", () => b.style.transform = "");
	});

	// Steam links
	$$("[data-steam]").forEach((a) => {
		if (SITE.steamUrl) { a.href = SITE.steamUrl; a.target = "_blank"; a.rel = "noopener"; }
		else a.addEventListener("click", (e) => { e.preventDefault(); a.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], 300); const t = a.innerHTML; a.innerHTML = "Steam page coming soon ✦"; setTimeout(() => a.innerHTML = t, 1800); });
	});

	$(".menu-btn").addEventListener("click", () => $(".links").classList.toggle("open"));
	$("#year").textContent = new Date().getFullYear();

	// ---------- Off we go -------------------------------------------------------------------------
	route();
	onScroll();
	const start = performance.now();
	let opened = false;
	const open = () => {
		if (opened) return;
		opened = true;
		$("#loader").classList.add("gone");
		document.body.classList.remove("locked");
		document.body.classList.add("ready");
		root.classList.add("ready");
	};
	addEventListener("load", () => setTimeout(open, Math.max(0, 900 - (performance.now() - start))));
	setTimeout(open, 2500);   // never keep anyone waiting on a slow connection
})();
