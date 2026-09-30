# NovaBuild business website

Static website for NovaBuild, a construction company in Islamabad. Plain HTML, CSS and JavaScript with no build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
# or
python -m http.server 8000
```

## Structure

```
index.html        Page content and sections
css/styles.css    Design tokens, layout, responsive rules
js/main.js        Mobile nav, cost estimator, WhatsApp contact form
assets/           Favicon
```

## Before going live

- Replace placeholder contact details in `index.html` (phone, email, office address).
- Set `WHATSAPP_NUMBER` in `js/main.js` to the business number (international format, digits only, e.g. `923001234567`).
- Replace sample projects with real ones. To use photos, set a `background-image` on each `.project-plate`.
- Review the per-square-foot rates in `js/main.js` (`PACKAGES`) against current costs.
- Check the company facts (founding year, project count, warranty terms) in the About section.

## Deploy

Works on GitHub Pages: Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
