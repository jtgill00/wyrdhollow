// The words on the site that don't come from the game's data files.
// Edit freely: the game data (fish, meals, creatures...) lives in data.js,
// rebuilt by tools/build_website.py.

window.SITE = {
	// Set this to your Steam store page once Steamworks gives you an App ID,
	// e.g. "https://store.steampowered.com/app/1234567/WyrdHollow_Part_1/".
	steamUrl: "",

	marquee: ["Six Seals", "One Crown", "Light or Shadow", "Brew", "Duel", "Fly", "Fish", "Fall in Love", "The Weave Remembers"],

	// Weather and seasons. The chances are the game's own (WeatherRules.CHANCES):
	// keep them in step if the game's odds change.
	weather: {
		seasons: [
			{ id: "spring", name: "Spring", icon: "🌸", img: "assets/weather/season_0_village.jpg", blurb: "Blossom on every tree, petals on the breeze, and plenty of showers to water the garden for you.", chances: [["rain", 35], ["windy", 15], ["sunny", 10], ["clear", 40]] },
			{ id: "summer", name: "Summer", icon: "☀️", img: "assets/weather/season_1_village.jpg", blurb: "The sun is out more days than not. The trees are full and green, and the apple and mulberry trees hang with fruit.", chances: [["sunny", 55], ["rain", 15], ["windy", 10], ["clear", 20]] },
			{ id: "autumn", name: "Autumn", icon: "🍂", img: "assets/weather/season_2_village.jpg", blurb: "The valley turns gold and red. Leaves fall all season long, and the windiest days send them racing.", chances: [["windy", 35], ["rain", 30], ["clear", 35]] },
			{ id: "winter", name: "Winter", icon: "❄️", img: "assets/weather/season_3_village.jpg", blurb: "Bare branches, snowy pines and white paths. Snow falls most days, and all day long at the Frostglow festival.", chances: [["snow", 55], ["windy", 10], ["clear", 35]] },
		],
		kinds: {
			rain: { name: "Rain", icon: "🌧️", text: "Rain waters your whole garden for you. Puddles gather on open ground while it falls, then dry up once it stops." },
			snow: { name: "Snow", icon: "❄️", text: "Winter only. Flakes drift down over the snowy ground, and the valley goes quiet." },
			windy: { name: "Wind", icon: "🍃", text: "Trees sway faster, and the wind carries whatever the season has: petals, leaves or powder snow." },
			sunny: { name: "Sunshine", icon: "☀️", text: "Warm light and slanting sunbeams from morning until early evening, with dust motes drifting through them." },
			clear: { name: "Fair", icon: "⛅", text: "A calm, fair day. In autumn the leaves still fall, and festival days are always fair." },
		},
		facts: [
			["💧", "Rain does the watering", "When the rain starts, every crop in your garden is watered for the day. Put the watering can down and go fishing."],
			["🪞", "Puddles come and go", "Puddles fill over the first hour of rain, ripple while it falls, and dry up a couple of hours after it stops."],
			["🌳", "Trees keep the calendar", "Blossom in spring, deep green in summer, gold and red in autumn, bare branches in winter. Pines wear snow, and fruit trees only fruit in summer and autumn."],
			["🧭", "Read the sky at a glance", "A little weather icon sits on your minimap, so you always know what today is doing."],
			["🔊", "Hear it from indoors", "Rain patters and wind sighs outside. Step into your cottage and they soften to a murmur."],
			["🎉", "Festivals stay fair", "Festival days are always fine weather, except Frostglow, when it snows from dawn to dusk."],
		],
		shots: [
			["assets/weather/rain_village.jpg", "Rain over WyrdHollow Village"],
			["assets/weather/rain_after.jpg", "After the rain: puddles drying at the cottage"],
			["assets/weather/sunny_summer.jpg", "Summer sunbeams"],
			["assets/weather/windy_autumn.jpg", "A windy autumn day"],
			["assets/weather/snow_wilds.jpg", "Snow in Fernhallow Wilds"],
		],
	},

	// "What's new": newest first. [icon, title, text, optional link]
	news: [
		["🌦️", "Weather and seasons", "Rain with puddles, snow, wind and summer sun, and a valley that changes through all four seasons.", "#/#weather"],
		["▶️", "Play in your browser", "The whole game now runs right here on the site, free, while it makes its way to Steam.", "#/play"],
		["📱", "Phones and tablets", "On-screen touch controls: a thumb-stick, tap-to-aim casting and big, easy buttons. Add it to your Home Screen to play full screen.", "#/play"],
		["💾", "Three save slots", "Keep three stories going at once. Each slot shows your hero, the date and your Gleam."],
		["🏡", "A cottage worth mending", "Every stage of restoring Thistlewick Cottage is now a big change you can see, from ruin to manor."],
		["🦉", "Inside the Owl Tower", "Step inside Tamsin's owl tower and climb its stairs. Your familiars have a new table and screen of their own, too."],
	],

	features: [
		["🏡", "Restore your cottage", "Wake Pip the hearth sprite, mend Thistlewick Cottage from ruin to manor, tend a garden through four seasons."],
		["⚔️", "Duels that feel great", "Fast top-down magic duels: aim, ward, dodge-roll. Reflect spells with a perfect ward and land a Focus Finisher."],
		["🔥", "Elements that combine", "Kindle sets them Burning, Gust makes a Firestorm. Puddles conduct, grass burns, and Galecrest's wind bends every spell."],
		["🏛️", "Six guilds, six Seals", "Potions, wands, creatures, brooms, silk and the duelling Ring. Each guild guards a Seal, and a secret."],
		["📈", "Fourteen skills", "Alchemy to Flight, Fishing to Hollow Magic. Every skill feeds the next: herbs become tonics become deeper mines."],
		["🌙", "A world that keeps living", "Close the game and your brews keep bubbling and your crops keep growing. Stay away too long and goblins come raiding."],
		["🎣", "Fish and cook", "Sixteen fish in ponds, lakes, the sea and secret cave pools. Cook them at the hearth into meals that heal and restore."],
		["💞", "Romance and weddings", "Fall for Kestrel, Thorne or Grisela. Wed under the lanterns, then fight side by side in two-on-two duels."],
		["🐉", "Familiars", "Ten creatures to calm or bind, from a Puddlefox to an Elder Wyrmling, each with a gift at home and a move in a fight."],
	],

	paths: {
		radiant: { blurb: "Radiant: gold light. Protect, heal, calm and reveal. Villagers greet you warmly, creatures trust you, and guild masters answer your call out of loyalty.", spells: ["Mend", "Soothe", "Cleansing Light", "Lumen Ward"] },
		hollow: { blurb: "Hollow: violet shadow. Drain, bind, curse and frighten. Stronger and faster to learn, and the valley answers you out of fear.", spells: ["Siphon", "Dread", "Shadowbind", "Hex of Ash"] },
	},

	endings: [
		["The Hero's Ending", "Radiant · break the crown"],
		["The Fall", "Radiant · wear the crown"],
		["The Heir's Ending", "Hollow · wear the crown"],
		["The Redemption", "Hollow · break the crown"],
	],

	// ---------------- The Guide ----------------
	// Each section: id, title, html. Tables of game data are added by app.js.
	guide: [
		{ id: "start", title: "Getting started", html: `
			<p>You arrive at Thistlewick Cottage with a letter, a ruin and a scar that glows. Your first days:</p>
			<ol class="steps">
				<li>Press <span class="kbd">E</span> at the hearth to wake <b>Pip</b>, your hearth sprite. He'll guide you.<em>Pip's tips pop up the first time anything new matters.</em></li>
				<li>Plant and water the Glowcap seeds in the garden. Water every day; they ripen in a few days.</li>
				<li>Pick the wild Glowcaps round the cottage and brew a <b>Night-Sight Tonic</b> in the cauldron.</li>
				<li>Walk the south path to <b>WyrdHollow Village</b>. Meet Juniper at the bakery (free honey buns!).</li>
				<li>Join a guild: talk to <b>Odessa Brine</b> at the Cauldron Circle hall.</li>
				<li>Find Maren's three journal pages: one in the cottage, one in the village, one in the Fernhallow Wilds.</li>
			</ol>
			<div class="tip"><b>Tip:</b> a day lasts about 20 real minutes, from 06:00 to 02:00. Sleep in your bed to save and start fresh, with full health, mana and stamina.</div>` },
		{ id: "controls", title: "Controls", html: `
			<p>Play with keyboard and mouse or a controller (Steam Deck ready). Every key can be changed in <b>Pause → Settings → Controls</b>, and the on-screen hints switch to whatever you last touched.</p>
			<div class="table-wrap"><table>
				<tr><th>Action</th><th>Keyboard &amp; mouse</th><th>Controller</th></tr>
				<tr><td>Move</td><td><span class="kbd">W</span><span class="kbd">A</span><span class="kbd">S</span><span class="kbd">D</span></td><td>Left stick</td></tr>
				<tr><td>Use / talk</td><td><span class="kbd">E</span></td><td><span class="pad a">A</span></td></tr>
				<tr><td>Bolt (attack)</td><td>Left click</td><td><span class="pad">RT</span></td></tr>
				<tr><td>Ward</td><td>Right click</td><td><span class="pad">LT</span></td></tr>
				<tr><td>Gust (control)</td><td><span class="kbd">Q</span></td><td><span class="pad">LB</span></td></tr>
				<tr><td>Spell keys 1–4</td><td><span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span><span class="kbd">4</span></td><td><span class="pad">RB</span><span class="pad x">X</span> D-pad ↓ ←</td></tr>
				<tr><td>Dodge roll</td><td><span class="kbd">Space</span></td><td><span class="pad b">B</span></td></tr>
				<tr><td>Drink healing / mana</td><td><span class="kbd">R</span> / <span class="kbd">F</span></td><td>D-pad ↑ / →</td></tr>
				<tr><td>Ride broom</td><td><span class="kbd">V</span> or click the broom button</td><td><span class="pad">R3</span></td></tr>
				<tr><td>Bag</td><td><span class="kbd">I</span></td><td><span class="pad y">Y</span></td></tr>
				<tr><td>Quest log</td><td><span class="kbd">J</span></td><td><span class="pad">View</span></td></tr>
				<tr><td>Skills / Spellbook</td><td><span class="kbd">K</span> / <span class="kbd">B</span></td><td>Menu → Skills / Spellbook</td></tr>
				<tr><td>World map</td><td><span class="kbd">M</span></td><td><span class="pad">L3</span></td></tr>
				<tr><td>Pause</td><td><span class="kbd">Esc</span></td><td><span class="pad">Menu</span></td></tr>
			</table></div>` },
		{ id: "combat", title: "Combat", html: `
			<h3>The spell triangle</h3>
			<p><b>Attack</b> beats <b>Control</b> (a hit interrupts a winding spell). <b>Control</b> beats <b>Ward</b> (Gust smashes shields). <b>Ward</b> beats <b>Attack</b>. Every spell has a readable wind-up: watch for it.</p>
			<h3>Perfect ward and perfect dodge</h3>
			<p>Raise your ward just as a spell reaches you to <b>reflect</b> it, faster and harder. Roll through a spell at the last moment for a <b>perfect dodge</b>: time slows and your Focus jumps.</p>
			<h3>Focus and the Finisher</h3>
			<p>The thin gold bar under your mana is <b>Focus</b>. Landing spells, combos, perfect wards and perfect dodges fill it; getting hit knocks some out. When it's full, your next Bolt is a <b>Finisher</b>: triple damage, faster, and it smashes straight through wards.</p>
			<h3>Elements and combos</h3>
			<div class="table-wrap"><table>
				<tr><th>Mark</th><th>Hit with</th><th>Combo</th><th>What happens</th></tr>
				<tr><td>Burning (Kindle)</td><td>Gust</td><td><b>Firestorm!</b></td><td>Big damage, fire spreads round them</td></tr>
				<tr><td>Soaked (Ripple)</td><td>Gust</td><td><b>Shock!</b></td><td>Damage and a stun</td></tr>
				<tr><td>Soaked (Ripple)</td><td>Kindle</td><td><b>Steam!</b></td><td>Damage and a short stun</td></tr>
				<tr><td>Rooted (Sprout)</td><td>Kindle</td><td><b>Wildfire!</b></td><td>Big damage, fire spreads</td></tr>
				<tr><td>Burning</td><td>Ripple</td><td>Doused</td><td>Puts the fire out</td></tr>
			</table></div>
			<p><b>The ground joins in:</b> Kindle sets grass alight (it burns anyone standing in it, you included). Ripple leaves a puddle that soaks whoever stands in it. On Galecrest's cliffs the wind bends every spell in flight.</p>
			<div class="tip"><b>Struggling?</b> Pause → Settings → Difficulty → <b>Story</b> makes hits land softer. Drink a Mending Draught with <span class="kbd">R</span> even mid-fight.</div>` },
		{ id: "resonance", title: "Light & Shadow", html: `
			<p>A hidden meter runs from <b>Hollow</b> (−100, violet) to <b>Radiant</b> (+100, gold). Only your wand's glow shows it. Radiant spells nudge it up; Hollow spells pull it down harder. Neutral spells (Bolt, Gust, Kindle, Ripple, Sprout) don't move it.</p>
			<p>It changes how villagers greet you, shop prices (Radiant heroes are paid a little more, Hollow heroes charged a little more), romance, how creatures react, the guilds' hidden sides, how the guilds answer you in Act 3, and which ending your choice leads to.</p>` },
		{ id: "skills", title: "Skills", html: `
			<p>Fourteen skills, levels 1 to 50: <b>Alchemy, Wandcraft, Broomcraft, Flight, Beastcraft, Duelling, Tailoring</b> (the guild skills), <b>Radiant Magic, Hollow Magic</b>, and <b>Herbcraft, Mining, Foraging, Fishing, Cooking</b>. Open the Skills screen (<span class="kbd">K</span>) to see exactly what each level unlocks.</p>` },
		{ id: "guilds", title: "Guilds & Seals", html: `
			<p>Ranks: Initiate → Apprentice → Journeyman → <b>Adept</b> (the Seal Trial) → Master. Each rank needs the guild's skill level and some contracts from its board.</p>
			<div id="guide-guilds"></div>` },
		{ id: "walkthrough", title: "Walkthrough", html: `<p>Every quest step in order, with a hint for the ones people get stuck on. Your quest log (<span class="kbd">J</span>) always shows the current step.</p><div id="guide-quests"></div>` },
		{ id: "stuck", title: "I'm stuck!", html: `<div id="faq"></div>` },
		{ id: "fishing", title: "Fishing", html: `
			<p>Buy a <b>Willow Fishing Rod</b> from Juniper (Trade, 80 Gleam). Look for white rings on the water, face one and press <span class="kbd">E</span>. Wait for the bobber to dip and the <b>!</b>, press <span class="kbd">E</span> to strike, then hold <span class="kbd">E</span> to keep the net on the fish until the catch vial fills. Each cast takes 10 minutes of game time. A Lanternjelly familiar makes the net bigger.</p>
			<div id="guide-fish"></div>` },
		{ id: "cooking", title: "Cooking", html: `<p>Cook at the stew pot beside your hearth. <span class="kbd">E</span> cooks one, <span class="kbd">Shift</span>+<span class="kbd">E</span> cooks all you can. Meals heal far more than raw food, and Juniper buys them. An Elder Wyrmling familiar gives +25% Cooking XP.</p><div id="guide-meals"></div>` },
		{ id: "brewing", title: "Brewing", html: `<p>Brew at the cottage cauldron. Brews take real minutes and keep bubbling while you're away.</p><div id="guide-brews"></div>` },
		{ id: "spells", title: "Spells", html: `<p>Put spells on your four keys in the Spellbook (<span class="kbd">B</span>). Radiant and Hollow spells unlock with their magic skill level.</p><div id="guide-spells"></div>` },
		{ id: "familiars", title: "Familiars", html: `<p>Kneel beside a creature and keep still to <b>calm</b> it (Radiant), or <b>bind</b> it instantly (Hollow, stronger but unhappy, and it sometimes sulks). Choose your active familiar at the basket by the hearth.</p><div id="guide-critters"></div>` },
		{ id: "gear", title: "Brooms & wands", html: `<h3>Brooms</h3><p>You always ride the fastest broom you own. Rallying the Rookery in Act 3 tunes it; a Stormcrow familiar adds 10%.</p><div id="guide-brooms"></div><h3>Wand cores</h3><p>Bring a core to Bartram Knotwood and he'll fit it (one at a time). Cores make your attack spells hit harder.</p><div id="guide-cores"></div>` },
		{ id: "calendar", title: "Calendar & festivals", html: `
			<p>Four seasons of 28 days. The week: Moonday, Tideday, Emberday, Leafday, Galeday, <b>Starday</b> (Market Day: a pedlar in the square who pays 10% more), Restday. <b>Emberday from 18:00</b> is League Night at the Ember Ring: purses doubled.</p>
			<div class="table-wrap"><table><tr><th>Festival</th><th>When</th><th>What happens</th></tr>
			<tr><td>Bloomwake</td><td>Spring 24</td><td>Maypole and cake; leave 5 Bloomwake Daisies at the well for a reward.</td></tr>
			<tr><td>Galecrest Skyrace</td><td>Summer 20</td><td>Kestrel's hoop race in Bloomfield. Gold under 35 s.</td></tr>
			<tr><td>Lanternfall</td><td>Autumn 22</td><td>Lanterns, the Lantern Tree, and weddings from 18:00.</td></tr>
			<tr><td>Frostglow</td><td>Winter 18</td><td>The duelling championship at Cinderhold.</td></tr></table></div>` },
		{ id: "away", title: "While you're away", html: `
			<p>When you close the game, the valley carries on for up to <b>72 real hours</b>: brews finish, crops grow (each full day counts as a watered night), creatures and helpers carry on. Pip writes you a letter about it.</p>
			<p><b>Goblin raids</b> can't happen in your first 96 hours away. After that the chance grows each day. Raiders can take up to 30% of your stored goods, but never buildings, creatures or legendary items, and <b>everything can be won back</b>: follow the trail, beat the band's leader and empty their camp.</p>
			<p>Defences: a <b>Lumen Ward</b> (Radiant), a guard familiar like the Mossback Tortoise, and a spouse at home (halves the chance).</p>` },
		{ id: "romance", title: "Friends & romance", html: `
			<p>Talk to someone once a day and give one gift a day (they each love, like and dislike different things). Hearts come faster if your path matches theirs. Heart scenes play at 2, 4 and 6 hearts, and a confession at 8 for <b>Kestrel</b> (Radiant), <b>Thorne</b> (Twilight) and <b>Grisela</b> (Hollow).</p>
			<p>At 10 hearts, offer a <b>Twin Lantern</b> (500 Gleam from the pedlar or the Lanternfall stall). You'll wed under the arch at the next Lanternfall, from 18:00. Your partner moves into the cottage and halves the goblin raid chance; Grisela leaves you a Midnight Tonic every Restday.</p>
			<h3>Fighting together</h3>
			<p>With a sweetheart or spouse, ask <b>Magister Corvin</b> for a <b>two-on-two</b> once a day. At 4 hearts with Kestrel (and with a broom of your own) she'll challenge you to a <b>sky duel</b> on brooms.</p>` },
		{ id: "achievements", title: "Achievements", html: `<div id="guide-ach"></div>` },
	],

	// Hints for walkthrough steps, matched by the start of the step's text.
	hints: {
		"Grow and harvest": "Water the plot every day. Ripe Glowcaps glow; press E to harvest.",
		"Brew something": "Use the cauldron in the cottage with 2 Glowcaps. Brews take real minutes; check back.",
		"Join a guild": "Odessa Brine at the Cauldron Circle hall in the village. Brew her a Night-Sight Tonic to become an Initiate.",
		"Find Maren's journal pages": "One in the cottage, one in the village, one in the Fernhallow Wilds. The Wilds are behind a bramble thicket: clear it with a Bramble-Clearing Salve (1 Glowcap + 2 Thornroot, Alchemy 5).",
		"Sleep, and dream": "Join a guild and find all three pages first, then sleep in your bed.",
		"Take the letter": "Bramblewick the owl waits at your cottage fence in the morning.",
		"Answer it": "Tamsin's owl tower is just behind the bakery.",
		"Keep your eyes open": "Starday morning in the village square, while the stalls are busy.",
		"Earn the six Seals": "Rise to Adept in each guild and pass its Seal Trial. Order doesn't matter. Ironroot needs a calmed Thornhound; Silkmere needs 8 Timber to mend the ferry; Galecrest needs a Silkmere grip-cloak; Cinderhold needs Apprentice rank and a wand.",
		"Look in the mirrors": "The Mirrorwood opens at five Seals, north of the Wilds. Each mirror gate is a puzzle: your reflection moves with you, sometimes a step ahead.",
		"Frostglow": "Winter 18 at Cinderhold. If it's not Frostglow yet, keep living: the story waits for you.",
		"Rekindle Pip's hearth": "Bring 3 Timber (Bartram's cart sells it, or the pedlar on Starday).",
		"Rally the guilds": "Talk to every master whose Seal you hold. How you earned it changes their answer.",
		"Break the Hush's three strongholds": "The Grey Lodge (past Poachers' Hollow), the Ashen Bastion (past Cinderhold Keep), the Silent Tower (past Galecrest). Each has a Hush captain.",
		"Quillon has found something": "The Lantern Spire is reached by broom from Galecrest.",
		"Walk west from Starfall Moor": "Follow the road west off the moor into the Hollow Reach.",
		"Lanternfall: open the gate": "The gate opens at Lanternfall (Autumn 22). Camp in the Reach to skip ahead; the world carries on as if you were away.",
		"Climb Hollow Keep": "Six floors, one for each memory. If you fall, you're hauled back up: there's no game over.",
	},

	faq: [
		["How do I get into the Fernhallow Wilds?", "A bramble thicket blocks the path east of the cottage. Brew a Bramble-Clearing Salve (1 Glowcap + 2 Thornroot, Alchemy 5) and use it on the thicket."],
		["How do I reach Ironroot Hollow?", "Calm (or bind) a Thornhound in the Fernhallow Wilds. It knows the root tunnels and leads you there."],
		["How do I get to Silkmere?", "Mend the ferry with 8 Ironroot Timber."],
		["How do I get to Galecrest Cliffs?", "Wear a grip-cloak from Silkmere for the cliff path. Kestrel also flies you there once after your first Skyrace."],
		["The mines are too dark!", "Drink a Night-Sight Tonic before going in, and bring a wand. Glimmerdeep Mines need both."],
		["How do I get into the Ember Ring?", "Reach Apprentice rank in any guild and carry a wand; the road east of the village opens to Cinderhold."],
		["Where do I get a broom?", "Kestrel lends you her practice broom for the Galecrest Skyrace. Faster brooms are hidden around the valley (see Brooms & wands)."],
		["How do I fish?", "Buy a rod from Juniper, find white rings on the water, press E, wait for the bite, strike, then hold E to keep the net on the fish."],
		["Nothing is biting in the mine pools.", "Cave fish need Fishing level 14 or more. Level up on ponds first."],
		["Where's the Mirrorwood?", "North of the Fernhallow Wilds. It opens once you hold five Seals."],
		["How do I get married?", "Reach 10 hearts with Kestrel, Thorne or Grisela (after their 8-heart confession), buy a Twin Lantern and offer it. The wedding is at the next Lanternfall from 18:00."],
		["Goblins stole my things!", "Follow the raid trail from the cottage to their camp, beat the band leader and open the loot chests. You get everything back."],
		["My familiar won't help in fights.", "A bound familiar sometimes sulks and refuses. A calmed one helps steadily."],
		["How do I get the Elder Wyrmling?", "Pass the Wardens' Patient Hunt, then talk to Rowan: he gives you the egg it left. It hatches three days later."],
		["What's the gold bar under my mana?", "Your Focus meter. Fill it by fighting well; when it's full your next Bolt is a Finisher."],
		["Can I change the controls or make the text bigger?", "Yes: Pause → Settings → Controls, and Pause → Settings → Text size (Large)."],
		["I chose an ending. Is the game over?", "No. After either ending the valley carries on: hunt the Court's remnants as Archmage, or rule from the Hollow Throne."],
	],

	// ---------------- The Story ----------------
	// era, title, text, spoiler (true = hidden until tapped or "show everything").
	story: [
		["The Past · long ago", "The Weave", "Magic in the valley was once one great thread, the Weave, running through every root, river and wand. The guilds grew up around it, each tending one part of it.", false],
		["The Past · long ago", "Two young witches", "Maren Thistlewick taught a gifted, dark-haired student a forbidden rite: a spiral of light drawn on the floor of a black-glass tower, to pour the Weave's heart into a child. She has regretted it every day since.", true],
		["The Past · 25 years ago", "The Sundering", "On one terrible night the Weave shattered. Its pieces became six Seals, one kept by each guild. A tower of black glass burned. Seven children were born that night. Six died.", false],
		["The Past · 25 years ago", "The seventh child", "The seventh held the Weave's heart, and still does. Vesper Nightlock timed that birth on purpose. The child was hers. Her first attempt, a boy called Fennick, had failed and been left half-hollow.", true],
		["The Past · 25 years ago", "Maren's penance", "Maren carried the baby out of the burning tower, sealed away their memories (and a sliver of their soul) inside a violet stone, and sent them far away to grow up in a grey harbour town where magic doesn't work.", true],
		["The Past · your childhood", "Port Saltmere", "You grew up there with no memories before age seven, a silver scar on your left palm, and a recurring dream of a burning tower. Your foster parents were kind, and careful.", false],
		["The Past · your childhood", "The watchers", "They were paid to watch you.", true],
		["Act 1 · Spring, Year 1", "Arrival", "A letter sealed in violet wax and signed 'M.' brings you to WyrdHollow. Maren is gone and her cottage is a ruin. You wake Pip in the hearth, plant your first garden, join a guild, and find Maren's journal pages: the scar is a Weave-mark, there are six Seals, and you should look in the mirrors.", false],
		["Act 2 · Summer, Year 1 → Winter, Year 2", "The Six Seals", "A letter from your foster parents asks one question too many: has your scar begun to glow? A stranger with a grey ring asks about you at the market. Pip has a plan: earn all six Seals before the grey rings do. Each Seal cracks the violet stone you wear, and a memory comes back.", false],
		["Act 2 · the Heartstone", "Six memories", "A couple counting coins while a child watches. Maren teaching a dark-haired woman a spiral of light. A boy behind glass. The tower on fire and a voice calling your real name. Maren pressing the stone into your hand: 'Hold it. Forget. Live.' And your palm on a heart of light as the tower breaks.", true],
		["Act 2 · the Mirrorwood", "Maren", "At five Seals the Mirrorwood opens. At its heart, in a great mirror, Maren: alive, trapped, unable to step out. 'I never wrote you a letter.' The letter was a lure.", true],
		["Act 2 · Frostglow", "The voice from the tower", "At the winter championship, with the whole valley watching, the lanterns go out. Violet smoke. Vesper Nightlock steps out of it with the Hush behind her, and says your real name.", true],
		["Act 3 · Year 3", "The Hollow Court", "Vesper tells you plainly: she is your mother, and she wants you back. That night the Hush take the person you love most. Fennick, wounded, tells you he is your half-brother. The Gloam turns out to be Vesper's own magic, rotting: she is dying, and the crown is her cure. You rally the guilds, break the Hush's three strongholds, and Quillon finds the last record: you are the seventh Seal.", true],
		["Act 4 · Lanternfall, Year 3", "The Hollow Crown", "At Hollow Keep you climb six floors of memory, free the one they took, and face Vesper: a formal duel, the Gloam pouring out of her, and the crown forged from the six Seals as she reaches for the Weave inside you. The crown is in your hands.", true],
		["The Endings", "Your choice", "Break the crown and give the Weave back to the valley (the Rekindling), or wear it yourself (the Hollow Crown). With your path so far, that makes four endings: the Hero, the Fall, the Heir and the Redemption. Either way the valley carries on, and so do you.", false],
	],
};
