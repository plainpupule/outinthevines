# Out in the Vines — GitHub Pages Prototype v0.2

A mobile-first faux product prototype for an inclusive Temecula wine-country guide starring Vinny.

## Included

- Five winery profiles: Leoness, Akash, Doffo, Europa Village, and Wilson Creek
- Vinny quick-match flow
- Search and experience filters
- Local browser favorites
- Three-stop "My Day" builder
- Faux interactive map
- Andrew and Antonio recommendation placeholders
- Vinny Welcome Rating interface with explicit demo labels
- Installable PWA manifest and basic offline caching
- Responsive desktop and mobile design

## Publish on GitHub Pages

1. Create a new public GitHub repository.
2. Upload every file in this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will provide the live Pages URL.

## Replace the temporary branding

The prototype includes an original inline SVG interpretation of Vinny and a type-based Out in the Vines lockup so it can run immediately.

When you have separate transparent PNG/SVG exports, replace:
- The `.vinny-illustration` SVG in `index.html`
- The `.vinny-mini` emoji in `index.html`
- `icon.svg`
- The text lockup inside `.brand`

## Edit winery content

All winery records are in `data.js`. Add Andrew and Antonio's real picks by updating:
- `andrew`
- `andrewNote`
- `antonio`
- `antonioNote`

Demo ratings are intentionally not factual assessments. Replace them only after completing and documenting the inclusivity review process.

## Important

Current winery offerings, hours, age policies, event schedules, and reservation rules can change. The production version should attach a `lastVerified` date and source log to every operational field.


## Version 0.2

- Adds prototype photography to winery cards and profiles
- Adds visible photo disclosures
- Adds a trust-principles strip to the homepage
- Adds `PRODUCT_FOUNDATION.md`
- Adds `DESIGN_SYSTEM.md`

The current remote photographs are visual placeholders and are not represented as photographs of the named wineries.

For launch, replace each `image` field in `data.js` with an owned or licensed file, for example:

```js
image: "assets/wineries/leoness-hero.jpg"
```
