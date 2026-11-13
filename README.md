# WyrdHollow: Part 1 — website

The official site: a single page with four views (Home, Guide, Story, Play), no
build step and no libraries. It works straight from GitHub Pages.

## Put it online with GitHub Pages

1. On github.com, create a new **public** repository (for example `wyrdhollow`).
2. Upload **the contents of this `website` folder** (not the folder itself):
   `index.html`, `css/`, `js/`, `assets/`, `play/`, `.nojekyll`.
   The easiest way: on the new repository's page click **"uploading an existing
   file"**, drag everything in, then **Commit changes**.
   (Hidden files like `.nojekyll` may need dragging in on their own, or turn
   on "show hidden files" in Finder with Cmd+Shift+.)
3. In the repository, go to **Settings → Pages**. Under **Build and
   deployment**, set **Source: Deploy from a branch**, **Branch: main**,
   folder **/ (root)**, and **Save**.
4. After a minute or two the site is live at
   `https://<your-username>.github.io/<repository-name>/`.
   (Name the repository `<your-username>.github.io` and it lives at that
   address instead.)

## The address: www.wyrdhollow.com

The domain is registered at Cloudflare. The `CNAME` file in this folder tells
GitHub Pages the site's name: don't delete it. Cloudflare's DNS has four `A`
records for `wyrdhollow.com` (185.199.108-111.153) and a `CNAME` for `www`
pointing at `jtgill00.github.io`, all set to "DNS only" (grey cloud).

## The playable game (Play page)

The `play/` folder is the whole game, built for web browsers (about 45 MB).
The **Play** page (`#/play`) only loads it when someone presses Start.
Upload `play/` with everything else. It isn't kept in git because it's big
and rebuilt each time.

After the game changes, rebuild it from the game's project folder:

```
/Applications/Godot.app/Contents/MacOS/Godot --headless --path . --export-release "Web" website/play/index.html
```

then upload the `play/` folder again (replace the old files).

**Upload it with GitHub Desktop, not the website.** github.com only accepts
files up to 25 MB when you drag them in, and `index.wasm` is about 40 MB.
GitHub Desktop has no such limit:

1. In GitHub Desktop: **File → Clone Repository**, then pick your site's
   repository. Do this once; it makes a folder on your Mac.
2. Copy everything inside this `website` folder into that folder, replacing
   the old files.
3. Back in GitHub Desktop, write a summary (for example "Add the Play page"),
   click **Commit to main**, then **Push origin**.

- It's a **release** build, so the Shift test shortcuts don't work in it.
- Saves live in each player's browser, separate from the Steam version.
- Phones and tablets get on-screen touch controls. On a phone, Start opens
  the game on its own page so it fills the screen (turn it sideways).
- GitHub's limit is 100 MB per file. The biggest file, `index.wasm`, is about
  40 MB.

## When you get the Steam App ID

Open `js/content.js` and set `steamUrl` at the top to your store page, for
example `"https://store.steampowered.com/app/1234567/WyrdHollow_Part_1/"`.
Every "Wishlist" button then goes there. Until then they say
"Steam page coming soon".

## Updating it

- **Words** (features, guide pages, FAQ, story, walkthrough hints):
  `js/content.js`.
- **Game data** (fish, meals, creatures, brooms, cores, spells, achievements,
  quests, screenshots, sprites) is built from the game's own files. After the
  game changes, run this from the game's project folder:

  ```
  python3 tools/build_website.py
  ```

  then upload the changed files again. When you change `css` or `js` files,
  bump the `?v=3` numbers in `index.html` so visitors get the new version.

## What's in it

- **Radiant / Hollow switch:** re-skins the whole site in gold or violet (it
  remembers your choice).
- **The Weave:** the drifting threads of light behind everything, which follow
  your mouse.
- **Home:** hero, features, Light & Shadow, a pinned sideways gallery, an
  interactive world map, the cast (real animated sprites), the six guilds,
  familiars and all 33 achievements.
- **Guide:** searchable; controls, combat, a full walkthrough with hints,
  an "I'm stuck!" FAQ, and tables of every fish, meal, brew, spell,
  familiar, broom and wand core.
- **Story:** the whole story, past and present, as a timeline. Spoilers stay
  blurred until tapped or until "Show everything".

Everything respects "reduce motion" and works on phones.
