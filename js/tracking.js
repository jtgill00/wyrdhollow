// Ad tracking + cookie consent for www.wyrdhollow.com
// ------------------------------------------------------------------------------------------
// Paste your two IDs below. While both are empty, this file does nothing at all
// (no banner, no tracking), so the site works exactly as before.
//
//   GA_ID    – Google Analytics 4 "Measurement ID", looks like "G-ABC123XYZ"
//              (Google Analytics → Admin → Data streams → your web stream).
//   PIXEL_ID – Meta Pixel ID, a long number like "123456789012345"
//              (Meta Events Manager → Data sources → your pixel).
//
// Nothing is loaded until the visitor presses "Accept" on the cookie banner.
// The choice is remembered; "Cookie settings" in the footer lets them change it.
//
// Events sent:
//   play_started (GA4) / PlayStarted (Meta) – someone pressed Start on the Play page.
//   This is the number the ads are judged on.
// ------------------------------------------------------------------------------------------
(() => {
	const GA_ID = "G-SYL0TQYTLD";
	const PIXEL_ID = "1718837783293131";

	const KEY = "wh-consent"; // "yes" | "no"
	const on = Boolean(GA_ID || PIXEL_ID);
	let loaded = false;
	const queue = []; // events from before the visitor chose

	const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
	const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

	function load() {
		if (loaded) return;
		loaded = true;
		if (GA_ID) {
			const s = document.createElement("script");
			s.async = true;
			s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
			document.head.appendChild(s);
			window.dataLayer = window.dataLayer || [];
			window.gtag = function () { window.dataLayer.push(arguments); };
			window.gtag("js", new Date());
			window.gtag("config", GA_ID);
		}
		if (PIXEL_ID) {
			/* Meta's standard pixel loader */
			!function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
			window.fbq("init", PIXEL_ID);
			window.fbq("track", "PageView");
		}
		queue.splice(0).forEach(send);
	}

	function send(name) {
		if (GA_ID && window.gtag) window.gtag("event", name, { transport_type: "beacon" });
		if (PIXEL_ID && window.fbq) window.fbq("trackCustom", name === "play_started" ? "PlayStarted" : name);
	}

	// ---------- The banner ----------------------------------------------------------------------
	function banner() {
		if (document.getElementById("consent")) return;
		const d = document.createElement("div");
		d.id = "consent";
		d.setAttribute("role", "dialog");
		d.setAttribute("aria-label", "Cookies");
		d.innerHTML =
			'<p><b>Cookies?</b> With your OK, WyrdHollow uses Google Analytics and the Meta Pixel to count visits and how many people start the game, so we know which ads work. No names or emails are collected, and the game plays the same either way.</p>' +
			'<div class="consent-btns"><button type="button" data-c="no">No thanks</button><button type="button" data-c="yes" class="yes">Accept</button></div>';
		d.addEventListener("click", (e) => {
			const b = e.target.closest("[data-c]");
			if (!b) return;
			const v = b.dataset.c;
			save(v);
			d.remove();
			if (v === "yes") load();
			else if (loaded) location.reload(); // switch tracking off for this visit too
		});
		document.body.appendChild(d);
	}

	window.WHTrack = {
		active: () => loaded,
		event(name) {
			if (!on) return;
			if (loaded) send(name);
			else if (read() !== "no") queue.push(name); // sent if they accept later this visit
		},
		settings: () => { if (on) banner(); },
	};

	if (!on) return;
	const ready = () => {
		document.querySelectorAll("[data-cookie-settings]").forEach((a) => {
			a.hidden = false;
			a.addEventListener("click", (e) => { e.preventDefault(); banner(); });
		});
		const c = read();
		if (c === "yes") load();
		else if (c !== "no") banner();
	};
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
	else ready();
})();
