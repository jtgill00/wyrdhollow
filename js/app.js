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
	const lb = $("#lightbox"), lbAlt = $("#lb-alt");
	let lbPair = null, lbOther = false;
	// showBox(picture, caption, [the same page as a pencil sketch])
	function showBox(src, caption, alt) {
		$("img", lb).src = src; $("p", lb).textContent = caption;
		lbPair = alt ? [src, alt] : null; lbOther = false;
		lbAlt.hidden = !alt; lbAlt.textContent = "See the pencil sketch";
		lb.classList.add("open");
	}
	lbAlt.addEventListener("click", (e) => {
		e.stopPropagation();
		if (!lbPair) return;
		lbOther = !lbOther;
		$("img", lb).src = lbPair[lbOther ? 1 : 0];
		lbAlt.textContent = lbOther ? "See the painting" : "See the pencil sketch";
	});
	$$(".shot").forEach((s) => s.addEventListener("click", () => { const d = WH.screenshots[s.dataset.i]; showBox(d.src, d.caption); }));
	lb.addEventListener("click", () => lb.classList.remove("open"));
	addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });

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

	// ---------- The Map: JT's painted map with a light on every place ---------------------------
	const WORLD = window.WORLD;
	const plateSrc = (plate, sketch) => `assets/plates/${sketch ? "sketch" : "final"}-${plate}.jpg`;
	const openPlate = (plate, caption) => showBox(plateSrc(plate), caption, plateSrc(plate, true));
	const creatureAt = (name) => WORLD.creatures.find((c) => c.name === name);
	let openAtlas = () => {}, openCompendium = () => {};
	(() => {
		const frame = $("#atlas-frame"), mapEl = $("#atlas-map"), card = $("#atlas-card");
		if (!frame) return;
		const A = WORLD.atlas;
		const KIND = { place: "Place", land: "Land or water", road: "Road" };
		const LEAN = { light: "Leans to the light", shadow: "Leans to the shadow", neither: "Neither light nor shadow" };
		const FILTERS = [["all", "Everything"], ["place", "Places"], ["land", "Lands & waters"], ["road", "Roads"]];
		let filter = "all", zoom = 1, current = "";

		$("#atlas-filter").innerHTML = FILTERS.map((f) => `<button type="button" data-f="${f[0]}">${esc(f[1]).toUpperCase()}</button>`).join("");
		A.forEach((p) => {
			const pin = el("button", "apin"); pin.type = "button";
			pin.style.left = p.x + "%"; pin.style.top = p.y + "%";
			pin.dataset.id = p.id; pin.dataset.kind = p.kind; pin.dataset.lean = p.lean; pin.dataset.name = p.name;
			pin.setAttribute("aria-label", p.name);
			pin.addEventListener("click", () => { if (!dragged) select(p.id, false, true); });
			mapEl.appendChild(pin);
		});
		$("#atlas-index").innerHTML = [["place", "Places"], ["land", "Lands & waters"], ["road", "Roads"]].map(([k, title]) =>
			`<div class="atlas-group" data-kind="${k}"><h3>${title}</h3><div>${A.filter((p) => p.kind === k).map((p) => `<button type="button" class="atlas-name" data-id="${p.id}" data-lean="${p.lean}"><i></i>${esc(p.name)}</button>`).join("")}</div></div>`).join("");
		$$(".atlas-name").forEach((b) => b.addEventListener("click", () => select(b.dataset.id, true, true)));

		const chips = (title, list, fn) => list && list.length ? `<h4>${title}</h4><div class="atlas-chips">${list.map(fn).join("")}</div>` : "";
		function select(id, centre, tell) {
			const p = A.find((x) => x.id === id) || A[0];
			current = p.id;
			$$(".apin", mapEl).forEach((x) => x.classList.toggle("on", x.dataset.id === p.id));
			$$(".atlas-name").forEach((x) => x.classList.toggle("on", x.dataset.id === p.id));
			card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
			card.dataset.lean = p.lean;
			card.innerHTML = `<span class="kicker">${KIND[p.kind]}</span>
				<h3 class="grad-text">${esc(p.name)}</h3>
				<span class="atlas-lean" data-lean="${p.lean}"><i></i>${LEAN[p.lean]}</span>
				${p.img ? `<img class="atlas-shot" src="assets/atlas/places/${p.img}.jpg" alt="${esc(p.name)} in the game" loading="lazy" width="960" height="540">` : ""}
				<p>${esc(p.about)}</p>
				${p.reach ? `<div class="need">↳ HOW TO GET THERE</div><p class="atlas-reach">${esc(p.reach)}</p>` : ""}
				${chips("Who you may meet", p.people, (n) => `<span class="chip">${esc(n)}</span>`)}
				${chips("Creatures", p.creatures, (n) => { const c = creatureAt(n); return c ? `<a class="chip link" href="#/compendium/creatures/${c.id}">${esc(n)} →</a>` : `<span class="chip">${esc(n)}</span>`; })}
				${p.finds && p.finds.length ? `<h4>Worth knowing</h4><ul class="atlas-finds">${p.finds.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
				${p.plate ? `<button type="button" class="btn ghost" data-plate="${p.plate}">See the painted plate</button>` : ""}`;
			const shot = $(".atlas-shot", card);
			if (shot) shot.addEventListener("click", () => showBox(shot.src, p.name + ", as it looks in the game"));
			const pb = $("[data-plate]", card);
			if (pb) pb.addEventListener("click", () => openPlate(p.plate, p.name));
			if (filter !== "all" && filter !== p.kind) setFilter("all");
			if (centre) {
				const pin = $(`.apin[data-id="${p.id}"]`, mapEl);
				frame.scrollTo({ left: pin.offsetLeft - frame.clientWidth / 2, top: pin.offsetTop - frame.clientHeight / 2, behavior: reduced ? "auto" : "smooth" });
			}
			if (tell) {
				try { history.replaceState(null, "", "#/map/" + p.id); } catch (e) {}
				// On a phone the card sits under the map: bring it into view.
				if (innerWidth <= 980) card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: centre ? "center" : "nearest" });
			}
		}
		function setFilter(f) {
			filter = f;
			$$("#atlas-filter button").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
			$$(".apin", mapEl).forEach((x) => x.classList.toggle("off", f !== "all" && x.dataset.kind !== f));
			$$(".atlas-group").forEach((g) => g.hidden = f !== "all" && g.dataset.kind !== f);
		}
		$$("#atlas-filter button").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.f)));

		// Zoom: the map grows inside its frame and you drag or scroll it about.
		function setZoom(z) {
			const cx = (frame.scrollLeft + frame.clientWidth / 2) / mapEl.offsetWidth, cy = (frame.scrollTop + frame.clientHeight / 2) / mapEl.offsetHeight;
			zoom = Math.min(3, Math.max(1, z));
			mapEl.style.width = zoom * 100 + "%";
			frame.classList.toggle("zoomed", zoom > 1);
			frame.scrollLeft = cx * mapEl.offsetWidth - frame.clientWidth / 2; frame.scrollTop = cy * mapEl.offsetHeight - frame.clientHeight / 2;
			$("#atlas-out").disabled = zoom <= 1; $("#atlas-in").disabled = zoom >= 3;
		}
		$("#atlas-in").addEventListener("click", () => setZoom(zoom + 0.5));
		$("#atlas-out").addEventListener("click", () => setZoom(zoom - 0.5));
		$("#atlas-full").addEventListener("click", () => showBox("assets/atlas/map.jpg", "The Valley of WyrdHollow", "assets/atlas/map_sketch.jpg"));
		let drag = null, dragged = false;
		frame.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") { drag = { x: e.clientX, y: e.clientY, l: frame.scrollLeft, t: frame.scrollTop }; dragged = false; } });
		addEventListener("pointermove", (e) => {
			if (!drag) return;
			const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
			if (Math.abs(dx) + Math.abs(dy) > 5) { dragged = true; frame.classList.add("dragging"); }
			frame.scrollLeft = drag.l - dx; frame.scrollTop = drag.t - dy;
		});
		addEventListener("pointerup", () => { drag = null; frame.classList.remove("dragging"); setTimeout(() => { dragged = false; }, 0); });

		setFilter("all"); setZoom(1); select("village", false, false);
		openAtlas = (id, fresh) => {
			if (id && A.some((p) => p.id === id)) { if (id !== current || fresh) select(id, true, false); }
			else if (fresh) setTimeout(() => { const pin = $(`.apin[data-id="${current}"]`, mapEl); frame.scrollLeft = pin.offsetLeft - frame.clientWidth / 2; }, 60);
		};
	})();

	// ---------- The Compendium: creatures, peoples, schools, brooms, wands, Seals ---------------
	(() => {
		const body = $("#comp-body"), tabsEl = $("#comp-tabs");
		if (!body) return;
		const TABS = [["creatures", "Creatures"], ["peoples", "Peoples"], ["schools", "Schools"], ["brooms", "Brooms"], ["wands", "Wands & cores"], ["seals", "Seals & things carried"], ["keep", "Hollow Keep"]];
		const tbl = (heads, rows) => `<div class="table-wrap"><table><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
		const plateFig = (plate, name) => `<figure class="comp-plate" data-plate="${plate}" data-name="${esc(name)}"><img src="${plateSrc(plate)}" alt="${esc(name)}: a painted plate" loading="lazy" width="1500" height="1940"><figcaption>Tap to see it full size, and the pencil sketch</figcaption></figure>`;
		const seenAt = (name) => WORLD.atlas.filter((p) => (p.creatures || []).includes(name));
		const panels = {};

		// Creatures
		panels.creatures = `<p class="comp-intro">Ten of the valley's creatures can be calmed with patience or bound with Hollow magic, and will keep house and fight beside you. Others are best met with a ward up.</p><div class="comp-grid">${WORLD.creatures.map((c) => {
			const g = WH.creatures.find((x) => x.name === c.name) || {};
			const where = seenAt(c.name);
			return `<article class="comp-card" id="c-${c.id}" data-kind="${c.kind}">
				${c.plate ? `<img class="comp-pic" src="assets/plates/creature_${c.id}.jpg" alt="${esc(c.name)}, painted" loading="lazy" data-plate="${c.plate}" data-name="${esc(c.name)}">` : `<div class="comp-pic none"></div>`}
				<div class="comp-text">
					<div class="comp-head"><span class="comp-sprite" data-sprite="${c.id}"></span><div><span class="comp-kind">${esc(c.kind)}</span><h3>${esc(c.name)}</h3><small>${esc(c.where)}</small></div></div>
					<p>${esc(c.text || g.desc || "")}</p>
					${g.perk ? `<p class="comp-fact"><b>As your familiar:</b> ${esc(g.perk)}</p><p class="comp-fact"><b>To calm it:</b> kneel and keep still for about ${g.calm} seconds.</p>` : ""}
					${where.length ? `<div class="atlas-chips">${where.map((p) => `<a class="chip link" href="#/map/${p.id}">${esc(p.name)} →</a>`).join("")}</div>` : ""}
				</div></article>`;
		}).join("")}</div>`;

		// Peoples
		panels.peoples = `<p class="comp-intro">The six guilds are trades inside the valley. Beyond the map live older peoples with older magic. None of them is good or wicked by birth. Five of them cross your path in Part One; nobody explains them yet.</p><div class="comp-grid two">${WORLD.peoples.map((p) => `<article class="comp-card people" id="p-${p.id}">
				<div class="comp-text">
					<div class="comp-head"><span class="comp-sprite" data-stranger="${p.id}"></span><div><span class="comp-kind">${esc(p.school)}</span><h3>${esc(p.name)}</h3><small>${esc(p.title)}</small></div></div>
					<p>${esc(p.look)}</p>
					<p class="comp-fact"><b>Their gift:</b> ${esc(p.gift)}</p>
					<p class="comp-fact"><b>What it costs:</b> ${esc(p.cost)}</p>
					<p class="comp-fact met"><b>In Part One:</b> ${esc(p.met)}</p>
				</div></article>`).join("")}</div>
			<h3 class="comp-sub">Ten peoples further off</h3>
			<p class="comp-intro">Each keeps a school of its own. In Part One they are only rumours: a wind-chime, a warm feather, a lens that won't go dark.</p>
			<div class="comp-grid three">${WORLD.outer.map((o) => `<article class="comp-card mini"><div class="comp-text"><span class="comp-kind">${esc(o[2])}</span><h3>${esc(o[0])}</h3><p>${esc(o[3])}</p><a class="chip link" href="#/compendium/schools">${esc(o[1])} →</a></div></article>`).join("")}</div>`;

		// Schools
		const F = WORLD.firstweave;
		panels.schools = `<p class="comp-intro">A guild is a trade. A school is the formal study of an older magic. A people is a people. The three overlap, and none of them decides who you are: a Sylph may study anywhere, and a human may earn a place at the Cinder Crucible.</p>
			<article class="comp-card wide"><div class="comp-text">
				<span class="comp-kind">${esc(F.also)}</span><h3>${esc(F.name)}</h3>
				<p class="comp-motto">“${esc(F.motto)}”</p>
				<p>${esc(F.text)}</p>
				<p class="comp-fact"><b>Its badge:</b> ${esc(F.badge)}</p>
				<p class="comp-fact"><b>Head of school:</b> ${esc(F.head)}</p>
				<p class="comp-fact"><b>On the grounds:</b> ${F.halls.map(esc).join(" · ")}</p>
				<div class="atlas-chips">${F.studies.map((s) => `<span class="chip">${esc(s[0])} <small>${esc(s[1])}</small></span>`).join("")}</div>
			</div></article>
			<h3 class="comp-sub">The ten outer schools</h3>
			${tbl(["School", "People", "What it teaches", "Where", "Its old discipline", "Magic has a price"], WORLD.outer.map((o) => [`<b>${esc(o[1])}</b>`, esc(o[0]), esc(o[2]), esc(o[4]), esc(o[5]), esc(o[6])]))}
			<h3 class="comp-sub">Not schools at all</h3>
			<div class="comp-grid two">
				<article class="comp-card mini"><div class="comp-text"><span class="comp-kind">Shadowborn</span><h3>The Duskwatch Refuge</h3><p>A hidden sanctuary, not an academy. The Hollow Court wants its people because they can find a thing that has been cut loose.</p></div></article>
				<article class="comp-card mini"><div class="comp-text"><span class="comp-kind">Liches</span><h3>The Quiet Reliquary</h3><p>A hidden order and its archive. It knows a great deal, and it always wants paying.</p></div></article>
			</div>`;

		// Brooms
		panels.brooms = `<div class="comp-split">${plateFig("08-brooms", "Brooms")}<div>
				<p class="comp-intro">Brooms are made and raced by the Skyward Rookery on Galecrest Cliffs. You ride with <span class="kbd">V</span>, and always on the fastest broom you own.</p>
				<ol class="comp-list">${WORLD.brooms.map((b) => `<li><b>${esc(b[0])}</b>${esc(b[1])}</li>`).join("")}</ol>
			</div></div>
			<h3 class="comp-sub">Brooms you can ride</h3>
			${tbl(["Broom", "Speed", "Where to find it"], WH.brooms.map((b) => [`<span class="dot" style="background:${b.bristles}"></span><b>${esc(b.name)}</b><br><small style="color:var(--muted)">${esc(b.desc)}</small>`, b.speed + "× walking", esc(b.where)]))}
			<p class="comp-intro">Rallying the Rookery late in the story tunes your broom, and a Stormcrow familiar adds another 10%.</p>`;

		// Wands
		panels.wands = `<div class="comp-split">${plateFig("09-wands", "Wands, grain and core")}<div>
				<p class="comp-intro">A wand is a hand made longer; measure the hand first. Birch for beginners. A Heartwood wand is cut from the oldest root in Ironroot Hollow and wakes only for the hand it was made for.</p>
				<h4>The grain follows the heart</h4>
				<ul class="comp-list">${WORLD.grains.map((g) => `<li><b>${esc(g[0])}</b>${esc(g[1])}</li>`).join("")}</ul>
				<h4>The core follows what you were born to</h4>
				<ul class="comp-list">${WORLD.bornTo.map((g) => `<li><b>${esc(g[0])}</b>${esc(g[1])}</li>`).join("")}</ul>
			</div></div>
			<h3 class="comp-sub">Wand cores</h3>
			<p class="comp-intro">Bring a core to Bartram Knotwood and he'll fit it, one at a time. A better core makes your attack spells hit harder.</p>
			${tbl(["Core", "Spells hit harder", "How to get it"], WH.cores.map((c) => [`<b>${esc(c.name)}</b>`, "+" + c.bonus + "%", esc(c.where)]))}`;

		// Seals and things carried
		panels.seals = `<div class="comp-split">${plateFig("10-seals", "The six Seals, and things carried")}<div>
				<p class="comp-intro">What is left of the Weave, one piece kept by each guild. Each is no bigger than a Bloomwake daisy, and ragged at the edges, as if torn.</p>
				<ol class="comp-list">${WORLD.seals.map((s) => { const g = WH.guilds.find((x) => x.name === s[0]) || {}; return `<li><b>${esc(s[0])}</b>${esc(s[1])}. ${esc(s[2])}${g.trial ? `<small>Seal Trial: ${esc(g.trial)}</small>` : ""}</li>`; }).join("")}</ol>
				<h4>Things carried</h4>
				<ul class="comp-list">${WORLD.carried.map((c) => `<li><b>${esc(c[0])}</b>${esc(c[1])}</li>`).join("")}</ul>
			</div></div>`;

		// Hollow Keep
		panels.keep = `<div class="comp-split">${plateFig("02-hollow-keep", "Hollow Keep")}<div>
				<p class="comp-intro">The black glass tower beyond the Weeping Veil. Each floor holds one memory. The gate opens only at Lanternfall.</p>
				<ol class="comp-list tower" reversed>${[...WORLD.keep].reverse().map((f) => `<li><b>${esc(f)}</b></li>`).join("")}</ol>
				<p class="comp-intro">Beside it stands a dead alder. If you fall on the way up you're hauled back to your feet: there is no game over.</p>
				<a class="btn ghost" href="#/map/hollow_keep">Find it on the map</a>
			</div></div>`;

		tabsEl.innerHTML = TABS.map((t) => `<button type="button" data-t="${t[0]}">${esc(t[1]).toUpperCase()}</button>`).join("");
		body.innerHTML = TABS.map((t) => `<div class="comp-panel" id="comp-${t[0]}" hidden>${panels[t[0]]}</div>`).join("");
		$$("[data-sprite]", body).forEach((n) => {
			const id = n.dataset.sprite, c = WORLD.creatures.find((x) => x.id === id);
			const g = WH.creatures.find((x) => x.name === c.name);
			const s = g ? g.sprite : id === "goblins" ? WH.goblin : id === "hearth_sprite" ? WH.pip : null;
			if (s) sprite(n, s, 2); else n.remove();
		});
		$$("[data-stranger]", body).forEach((n) => { const s = (WH.strangers || {})[n.dataset.stranger]; if (s) sprite(n, s.sprite, 2); else n.remove(); });
		$$("[data-plate]", body).forEach((n) => n.addEventListener("click", () => openPlate(n.dataset.plate, n.dataset.name)));
		$$("button", tabsEl).forEach((b) => b.addEventListener("click", () => go("#/compendium/" + b.dataset.t)));

		openCompendium = (tab, id) => {
			if (!TABS.some((t) => t[0] === tab)) tab = "creatures";
			$$("button", tabsEl).forEach((b) => b.classList.toggle("on", b.dataset.t === tab));
			$$(".comp-panel", body).forEach((p) => p.hidden = p.id !== "comp-" + tab);
			const target = id && ($("#c-" + id) || $("#p-" + id));
			// A new tab starts at its top, not wherever the last one was scrolled to.
			if (!target && body.getBoundingClientRect().top < 0) scrollTo(0, body.getBoundingClientRect().top + scrollY - 150);
			if (target) setTimeout(() => {
				target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
				target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash");
			}, 80);
		};
	})();

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
	WORLD.atlas.forEach((p) => index.push({ where: "The Map", text: `${p.name}: ${p.about}${p.reach ? " How to get there: " + p.reach : ""}`, go: "#/map/" + p.id }));
	WORLD.creatures.forEach((c) => index.push({ where: "Compendium · Creatures", text: `${c.name} (${c.where}): ${c.text || ""}`, go: "#/compendium/creatures/" + c.id }));
	WORLD.peoples.forEach((p) => index.push({ where: "Compendium · Peoples", text: `${p.name}, ${p.title}: ${p.look} ${p.gift}`, go: "#/compendium/peoples/" + p.id }));
	WORLD.outer.forEach((o) => index.push({ where: "Compendium · Schools", text: `${o[0]} · ${o[1]} (${o[2]}): ${o[3]}`, go: "#/compendium/schools" }));
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
				if (h.go) { go(h.go); return; }
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
		const name = h.startsWith("#/guide") ? "guide" : h.startsWith("#/story") ? "story" : h.startsWith("#/play") ? "play" : h.startsWith("#/map") ? "map" : h.startsWith("#/compendium") ? "compendium" : "home";
		const parts = h.split("/").slice(2);   // "#/map/ironroot" -> ["ironroot"]
		const anchor = h.includes("#", 1) ? h.slice(h.indexOf("#", 1)) : "";
		const swap = () => {
			$$(".view").forEach((v) => v.classList.toggle("on", v.id === "view-" + name));
			$$(".links a").forEach((a) => a.classList.toggle("on", a.dataset.view === name && !a.classList.contains("btn") && (name !== "home" || !a.hash.includes("#", 2))));
			if (anchor && $(anchor)) setTimeout(() => $(anchor).scrollIntoView({ behavior: view === name ? "smooth" : "auto" }), 30);
			else if (view !== name) scrollTo(0, 0);
			const was = view;
			view = name; reveal();
			if (name === "map") openAtlas(parts[0], was !== "map");
			if (name === "compendium") openCompendium(parts[0], parts[1]);
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
			// Count the play for the ads (only if the visitor accepted cookies).
			if (window.WHTrack) WHTrack.event("play_started");
			if (matchMedia("(pointer: coarse) and (hover: none)").matches) {
				// A short pause lets the "play started" count get sent before the page changes.
				const wait = window.WHTrack && WHTrack.active() ? 300 : 0;
				setTimeout(() => { location.href = "play/index.html"; }, wait);
				return;
			}
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

	// ---------- Weather: a little particle sky ------------------------------------------------
	// makeSky(canvas, { ground }) draws rain, snow, wind, sunbeams or a fair day.
	// With `ground`, rain splashes and leaves puddles that dry after it stops.
	function makeSky(canvas, opt = {}) {
		const x = canvas.getContext("2d");
		const LEAF = { spring: ["#ffc4dc", "#ffe1ec", "#f9a8c8"], summer: ["#7ccf6a", "#a5e08a", "#4fae52"], autumn: ["#e8742c", "#d9a521", "#c2452d", "#f0c14a"], winter: ["#ffffff", "#dbeaff"] };
		const rnd = (a, b) => a + Math.random() * (b - a);
		let w = 0, h = 0, dpr = 1, kind = "clear", season = "spring", parts = [], rings = [], puddles = [], wet = 0, t = 0, last = 0, raf = 0, on = false;
		const spawn = (any) => {
			const c = LEAF[season][Math.floor(Math.random() * LEAF[season].length)];
			if (kind === "rain") return { x: rnd(-0.15 * w, 1.05 * w), y: any ? rnd(0, h) : rnd(-60, -5), v: rnd(820, 1250), l: rnd(12, 22), a: rnd(0.35, 0.7), end: opt.ground ? rnd(h * 0.5, h) : h + 30 };
			if (kind === "snow") return { x: rnd(0, w), y: any ? rnd(0, h) : -6, v: rnd(26, 70), r: rnd(1, 3.2), ph: rnd(0, 6.28), a: rnd(0.55, 1) };
			if (kind === "windy") return Math.random() < 0.45
				? { s: 1, x: any ? rnd(0, w) : -120, y: rnd(0, h), v: rnd(520, 820), l: rnd(40, 110), a: rnd(0.08, 0.22), ph: rnd(0, 6.28) }
				: { x: any ? rnd(0, w) : -12, y: rnd(-0.1 * h, h), v: rnd(240, 420), vy: rnd(-20, 60), r: rnd(3, 6), rot: rnd(0, 6.28), vr: rnd(-7, 7), ph: rnd(0, 6.28), c };
			if (kind === "sunny") return { x: rnd(0, w), y: any ? rnd(0, h) : h + 4, v: rnd(6, 18), r: rnd(0.8, 2), ph: rnd(0, 6.28), a: rnd(0.3, 0.8) };
			return { x: rnd(0, w), y: any ? rnd(0, h) : -10, v: rnd(28, 55), r: rnd(3, 5), rot: rnd(0, 6.28), vr: rnd(-2, 2), ph: rnd(0, 6.28), c };
		};
		const seed = () => {
			const a = w * h;
			const n = kind === "rain" ? Math.min(260, a / 2600) : kind === "snow" ? Math.min(170, a / 4200) : kind === "windy" ? Math.min(70, a / 11000)
				: kind === "sunny" ? Math.min(40, a / 20000) : (season === "autumn" || season === "spring") ? Math.min(14, a / 50000) : 0;
			parts = Array.from({ length: Math.floor(n) }, () => spawn(true));
			rings = [];
		};
		const resize = () => {
			const r = canvas.getBoundingClientRect();
			if (!r.width || !r.height) return;
			dpr = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height;
			canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
			puddles = opt.ground ? [[0.16, 0.9, 0.09], [0.34, 0.74, 0.06], [0.52, 0.92, 0.11], [0.63, 0.7, 0.05], [0.78, 0.84, 0.08], [0.92, 0.95, 0.07], [0.08, 0.68, 0.045]] : [];
			seed();
		};
		const leaf = (p) => { x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c; x.globalAlpha = 0.9; x.beginPath(); x.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.283); x.fill(); x.restore(); };
		const frame = (now) => {
			raf = requestAnimationFrame(frame);
			const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now; t += dt;
			x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
			// Puddles: fill while it rains, dry afterwards.
			wet = kind === "rain" ? Math.min(1, wet + dt / 5) : Math.max(0, wet - dt / 9);
			if (wet > 0.01) for (const [px, py, pr] of puddles) {
				const rx = pr * w * Math.sqrt(wet), ry = rx * 0.32;
				x.fillStyle = `rgba(40,58,96,${0.34 * wet})`; x.beginPath(); x.ellipse(px * w, py * h, rx * 1.12, ry * 1.2, 0, 0, 6.283); x.fill();
				x.fillStyle = `rgba(126,170,232,${0.42 * wet})`; x.beginPath(); x.ellipse(px * w, py * h, rx, ry, 0, 0, 6.283); x.fill();
				x.fillStyle = `rgba(226,240,255,${0.3 * wet})`; x.beginPath(); x.ellipse(px * w - rx * 0.3, py * h - ry * 0.25, rx * 0.3, ry * 0.2, 0, 0, 6.283); x.fill();
				if (kind === "rain" && Math.random() < dt * 2.2) rings.push({ x: px * w + rnd(-rx, rx) * 0.7, y: py * h + rnd(-ry, ry) * 0.6, r: 1, a: 0.7 });
			}
			if (kind === "sunny") for (let k = 0; k < 5; k++) {
				const a = 0.07 + 0.05 * Math.sin(t * 0.6 + k * 1.7), bx = w * (0.02 + k * 0.21), bw = w * 0.09, lean = h * 0.55;
				const g = x.createLinearGradient(bx, 0, bx + lean, h); g.addColorStop(0, `rgba(255,232,160,${a})`); g.addColorStop(1, "rgba(255,232,160,0)");
				x.fillStyle = g; x.beginPath(); x.moveTo(bx, 0); x.lineTo(bx + bw, 0); x.lineTo(bx + bw * 2.2 + lean, h); x.lineTo(bx + lean - bw * 0.4, h); x.fill();
			}
			x.lineCap = "round";
			for (let i = 0; i < parts.length; i++) {
				const p = parts[i];
				let gone = false;
				if (kind === "rain") {
					p.y += p.v * dt; p.x += p.v * 0.22 * dt;
					x.strokeStyle = `rgba(178,208,255,${p.a})`; x.lineWidth = 1.3;
					x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - p.l * 0.22, p.y - p.l); x.stroke();
					if (p.y > p.end) { gone = true; if (opt.ground && rings.length < 60) rings.push({ x: p.x, y: p.end, r: 1, a: 0.55 }); }
				} else if (kind === "snow") {
					p.y += p.v * dt; p.x += Math.sin(t * 0.9 + p.ph) * 14 * dt + 6 * dt;
					x.fillStyle = `rgba(255,255,255,${p.a})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
					gone = p.y > h + 6;
				} else if (kind === "windy" && p.s) {
					p.x += p.v * dt;
					const yy = p.y + Math.sin(t * 2 + p.ph) * 8;
					x.strokeStyle = `rgba(255,255,255,${p.a})`; x.lineWidth = 1.4;
					x.beginPath(); x.moveTo(p.x, yy); x.quadraticCurveTo(p.x + p.l * 0.5, yy - 5, p.x + p.l, yy + 2); x.stroke();
					gone = p.x > w + 20;
				} else if (kind === "windy") {
					p.x += p.v * dt; p.y += (p.vy + Math.sin(t * 3 + p.ph) * 60) * dt; p.rot += p.vr * dt; leaf(p);
					gone = p.x > w + 20 || p.y > h + 20;
				} else if (kind === "sunny") {
					p.y -= p.v * dt; p.x += Math.sin(t + p.ph) * 6 * dt;
					x.fillStyle = `rgba(255,236,170,${p.a * (0.6 + 0.4 * Math.sin(t * 2 + p.ph))})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
					gone = p.y < -6;
				} else {
					p.y += p.v * dt; p.x += Math.sin(t * 1.3 + p.ph) * 26 * dt; p.rot += p.vr * dt; leaf(p);
					gone = p.y > h + 12;
				}
				if (gone) parts[i] = spawn(false);
			}
			for (let i = rings.length - 1; i >= 0; i--) {
				const r = rings[i]; r.r += 26 * dt; r.a -= 1.6 * dt;
				if (r.a <= 0) { rings.splice(i, 1); continue; }
				x.strokeStyle = `rgba(214,232,255,${r.a})`; x.lineWidth = 1; x.beginPath(); x.ellipse(r.x, r.y, r.r, r.r * 0.38, 0, 0, 6.283); x.stroke();
			}
		};
		return {
			set(k, s) { const changed = k !== kind || s !== season; kind = k; season = s; if (changed) seed(); },
			start() { if (on || reduced) return; on = true; resize(); last = performance.now(); raf = requestAnimationFrame(frame); },
			stop() { on = false; cancelAnimationFrame(raf); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, canvas.width, canvas.height); },
			resize,
		};
	}

	// ---------- Weather & Seasons section --------------------------------------------------------
	(() => {
		const W = SITE.weather, stage = $("#sky-stage");
		if (!W || !stage) return;
		const sky = makeSky($("#sky-canvas"), { ground: true });
		const everywhere = makeSky($("#skyfall"));
		let si = 0, kind = "rain", z = 1, all = false;
		$("#sky-imgs").innerHTML = W.seasons.map((s, i) => `<img src="${s.img}" alt="WyrdHollow Village in ${esc(s.name.toLowerCase())}" ${i ? 'loading="lazy"' : ""}>`).join("");
		const imgs = $$("#sky-imgs img");
		$("#season-tabs").innerHTML = W.seasons.map((s, i) => `<button data-s="${i}">${s.icon} ${esc(s.name.toUpperCase())}</button>`).join("");
		$("#sky-facts").innerHTML = W.facts.map((f, i) => `<div class="card tilt" data-reveal style="transition-delay:${i * 60}ms"><div class="glare"></div><div class="ico">${f[0]}</div><h3>${esc(f[1])}</h3><p>${esc(f[2])}</p></div>`).join("");
		$("#sky-shots").innerHTML = W.shots.map((s, i) => `<figure class="sky-shot" data-i="${i}" data-reveal style="transition-delay:${i * 70}ms"><img src="${s[0]}" alt="${esc(s[1])}" loading="lazy"><figcaption>${esc(s[1])}</figcaption></figure>`).join("");
		$$(".sky-shot").forEach((f) => f.addEventListener("click", () => { const d = W.shots[f.dataset.i]; showBox(d[0], d[1]); }));

		const render = () => {
			const s = W.seasons[si], k = W.kinds[kind];
			$$("#season-tabs button").forEach((b, i) => b.classList.toggle("on", i === si));
			$("#sky-season").textContent = `${s.name.toUpperCase()} FORECAST`;
			$("#sky-blurb").textContent = s.blurb;
			$("#forecast").innerHTML = s.chances.map(([id, pct]) => `<button class="fc${id === kind ? " on" : ""}" data-k="${id}"><span class="fc-i">${W.kinds[id].icon}</span><span class="fc-n">${esc(W.kinds[id].name)}</span><span class="fc-bar"><i style="--p:${pct}%"></i></span><b>${pct}%</b></button>`).join("");
			$$("#forecast .fc").forEach((b) => b.addEventListener("click", () => { setKind(b.dataset.k); }));
			requestAnimationFrame(() => $$("#forecast .fc-bar i").forEach((i) => i.classList.add("in")));
			$("#sky-kind").innerHTML = `<b>${k.icon} ${esc(k.name)}.</b> ${esc(k.text)}`;
			$("#sky-label").textContent = `${s.name.toUpperCase()} · ${k.name.toUpperCase()}`;
			stage.dataset.kind = kind; stage.dataset.season = s.id;
			sky.set(kind, s.id);
			if (all) everywhere.set(kind, s.id);
		};
		const setKind = (k) => {
			if (k === kind) return;
			kind = k;
			const f = $("#sky-flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
			render();
		};
		const setSeason = (i, e) => {
			if (i === si) return;
			si = i;
			const r = stage.getBoundingClientRect(), px = e ? ((e.clientX - r.left) / r.width) * 100 : 50, py = e ? 0 : 50;
			const im = imgs[i]; im.style.zIndex = ++z;
			if (!reduced && im.animate) im.animate([{ clipPath: `circle(0% at ${px}% ${py}%)` }, { clipPath: `circle(150% at ${px}% ${py}%)` }], { duration: 1000, easing: "cubic-bezier(0.2, 0.8, 0.1, 1)" });
			const allowed = W.seasons[i].chances.map((c) => c[0]);
			if (!allowed.includes(kind)) kind = allowed.find((k) => k !== "clear") || allowed[0];
			render();
		};
		$$("#season-tabs button").forEach((b) => b.addEventListener("click", (e) => setSeason(+b.dataset.s, e)));

		// A little depth: the picture and the weather shift apart under the pointer.
		stage.addEventListener("pointermove", (e) => { const r = stage.getBoundingClientRect(); stage.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); stage.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); });
		stage.addEventListener("pointerleave", () => { stage.style.setProperty("--px", 0); stage.style.setProperty("--py", 0); });

		// Only animate the stage while it's on screen.
		new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting ? sky.start() : sky.stop()), { threshold: 0.05 }).observe(stage);
		addEventListener("resize", () => { sky.resize(); if (all) everywhere.resize(); });

		// "Let it fall across the whole site"
		const btn = $("#sky-everywhere");
		btn.addEventListener("click", () => {
			all = !all;
			document.body.classList.toggle("skyfall-on", all);
			btn.setAttribute("aria-pressed", all);
			btn.textContent = all ? "☁️ Clear the skies again" : "✨ Let it fall across the whole site";
			if (all) { everywhere.set(kind, W.seasons[si].id); everywhere.start(); } else everywhere.stop();
		});
		render();
	})();

	// ---------- What's new ----------------------------------------------------------------------
	if (SITE.news && $("#news-list")) {
		$("#news-list").innerHTML = SITE.news.map((n, i) => `<${n[3] ? `a href="${n[3]}"` : "div"} class="news-item" data-reveal style="transition-delay:${i * 70}ms"><span class="news-n">${String(i + 1).padStart(2, "0")}</span><span class="news-ico">${n[0]}</span><span><b>${esc(n[1])}</b><small>${esc(n[2])}</small></span>${n[3] ? '<i class="news-go">→</i>' : ""}</${n[3] ? "a" : "div"}>`).join("");
	}

	// ---------- Sparks: every click or tap casts a little spell ----------------------------------
	if (!reduced) addEventListener("pointerdown", (e) => {
		if (e.target.closest && e.target.closest(".player, #lightbox, #person-modal")) return;
		const n = 14, hue = root.dataset.path === "hollow" ? ["#b47cff", "#ff4fd8", "#e7d4ff"] : ["#ffcf5a", "#ff9a3d", "#fff3c4"];
		for (let i = 0; i < n; i++) {
			const s = el("i", "spark"), a = (i / n) * 6.283 + Math.random() * 0.5, d = 26 + Math.random() * 52;
			s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px"; s.style.background = hue[i % 3]; s.style.boxShadow = `0 0 8px ${hue[i % 3]}`;
			document.body.appendChild(s);
			s.animate([{ transform: "translate(-50%, -50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 14}px)) scale(0)`, opacity: 0 }], { duration: 520 + Math.random() * 320, easing: "cubic-bezier(0.1, 0.8, 0.2, 1)" }).onfinish = () => s.remove();
		}
		const ring = el("i", "spark-ring"); ring.style.left = e.clientX + "px"; ring.style.top = e.clientY + "px"; document.body.appendChild(ring);
		ring.animate([{ transform: "translate(-50%, -50%) scale(0.2)", opacity: 0.9 }, { transform: "translate(-50%, -50%) scale(1)", opacity: 0 }], { duration: 480, easing: "ease-out" }).onfinish = () => ring.remove();
	}, { passive: true });

	// ---------- Reading progress along the top ---------------------------------------------------
	const bar = $("#scrollbar");
	const progress = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
	addEventListener("scroll", progress, { passive: true }); addEventListener("resize", progress);

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

	// Email sign-up. The section only shows once SITE.signup.url is set (js/content.js).
	// The same form appears twice: in the "Owl post" section and in the pop-up. wireSignup runs both.
	const su = SITE.signup || {};
	const owlGet = () => { try { return localStorage.getItem("wh-owl") || ""; } catch (e) { return ""; } };
	const owlSet = (v) => { try { localStorage.setItem("wh-owl", v); } catch (e) {} };
	const wireSignup = (suBox, suForm) => {
		const msg = $(".signup-msg", suForm);
		const say = (t, bad) => { msg.textContent = t; msg.classList.toggle("bad", Boolean(bad)); };
		suForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const email = $("input[type=email]", suForm).value.trim();
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say("That email doesn't look right. Mind checking it?", true); return; }
			if (suForm.website.value) { suBox.classList.add("done"); say("Thank you!"); return; }   // a bot filled the hidden box
			const picks = Array.from(suForm.querySelectorAll("input[name=interest]:checked")).map((i) => i.value);
			const btn = suForm.querySelector("button");
			btn.disabled = true; say("Sending your owl…");
			try {
				// HubSpot wants its own shape: a list of named fields plus where the sign-up came from.
				const body = su.kind === "hubspot"
					? { fields: [{ name: "email", value: email }, { name: su.interestsField || "wyrdhollow_interests", value: picks.join("; ") }], context: { pageUri: location.href, pageName: document.title } }
					: { email, interests: picks.join(", ") };
				const r = await fetch(su.url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
				if (!r.ok) throw new Error(r.status);
				suBox.classList.add("done");
				say("You're on the list. Watch the sky for an owl ✦");
				owlSet("joined");
				const no = $(".owl-no", suBox); if (no) no.textContent = "Close";
				if (window.WHTrack) WHTrack.event("email_signup");
			} catch (err) {
				say("The owl got lost. Please try again in a moment.", true);
				btn.disabled = false;
			}
		});
	};
	const suSection = $("#updates"), owlPop = $("#owl-pop");
	if (su.url && suSection) { suSection.hidden = false; wireSignup(suSection, $("form", suSection)); }

	// The pop-up. It opens by itself once per visitor after POP_SECONDS on the site. If they are watching
	// the trailer it waits until the trailer is over. It never opens over the cookie question or a running
	// game, and not again for POP_REST_DAYS after being closed. Anything marked data-owl (the "Get news" button) opens it too.
	const POP_SECONDS = 10, POP_REST_DAYS = 14;
	if (su.url && owlPop) {
		wireSignup(owlPop, $("form", owlPop));
		let auto = false;
		const open = (byItself) => {
			if (owlPop.classList.contains("open")) return;
			auto = Boolean(byItself);
			owlPop.classList.add("open");
			if (!byItself) setTimeout(() => $("input[type=email]", owlPop).focus(), 50);
			if (window.WHTrack) WHTrack.event("email_popup_shown");
		};
		const close = () => {
			if (!owlPop.classList.contains("open")) return;
			owlPop.classList.remove("open");
			if (auto && owlGet() !== "joined") owlSet("closed:" + Date.now());
		};
		owlPop.addEventListener("click", (e) => { if (e.target === owlPop || e.target.closest("[data-owl-close]")) close(); });
		addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
		$$("[data-owl]").forEach((b) => { b.hidden = false; b.addEventListener("click", (e) => { e.preventDefault(); open(false); }); });

		const seen = owlGet();
		const resting = seen === "joined" || (seen.startsWith("closed:") && Date.now() - Number(seen.slice(7)) < POP_REST_DAYS * 864e5);
		if (!resting) {
			let armed = false, done = false;
			const busy = () => $("#consent") || $(".running") || $("#lightbox.open") || $("#person-modal.open") || document.fullscreenElement || (film && !film.paused);
			const tryOpen = () => {
				if (done || !armed) return;
				if (busy()) { setTimeout(tryOpen, 3000); return; }
				done = true; open(true);
			};
			setTimeout(() => { armed = true; tryOpen(); }, POP_SECONDS * 1000);
			const film = $("#trailer-video");
			if (film) film.addEventListener("ended", () => setTimeout(tryOpen, 800));
		}
	}

	// The trailer in the hero: press Play and it loads the wide cut, or the tall cut on a phone held upright.
	const trailer = $("#trailer"), tv = $("#trailer-video");
	if (trailer && tv) {
		$("#trailer-play").addEventListener("click", () => {
			const tall = matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
			tv.src = tall ? "assets/trailer/trailer-tall.mp4" : "assets/trailer/trailer.mp4";
			tv.controls = true;
			trailer.classList.add("playing");
			tv.play().catch(() => {});
			if (window.WHTrack) WHTrack.event("trailer_play");
		});
		tv.addEventListener("ended", () => { trailer.classList.remove("playing"); tv.controls = false; tv.removeAttribute("src"); tv.load(); });
	}

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
