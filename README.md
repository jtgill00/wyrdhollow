# WyrdHollow: Part 1 — website

The official site: a single page with three views (Home, Guide, Story), no
build step and no libraries. It works straight from GitHub Pages.

## Put it online with GitHub Pages

1. On github.com, create a new **public** repository (for example `wyrdhollow`).
2. Upload **the contents of this `website` folder** (not the folder itself):
   `index.html`, `css/`, `js/`, `assets/`, `.nojekyll`.
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
