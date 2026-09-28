# Mex Taco House · accessibility fix

Scanned 2026-09-25 with axe-core (WCAG 2.2 AA + best practice) at desktop and phone widths: index.html, menu.html, news.html, contact.html. This is the highest-risk site of the three: restaurants are the most-sued category, and this one has the most failures.

> **How to use this file.** In Claude Code or Cursor, opened at this project's root, say: "Read ACCESSIBILITY-FIX.md and do everything in it." The findings section is the scan result from 2026-09-25; "The job" section is the work. When it reports done, follow the manual checks, then ask Smart Scale to rescan.

> **Pages in this repo.** index.html, menu.html, news.html, contact.html, and the separate mobile pages m-index.html, m-menu.html, m-news.html, m-contact.html, plus admin-news.html. Every fix below applies to all of them; the mobile pages are the easiest to miss.

## Findings

Passes: lang attribute, a skip link exists, no overlay widget, most images have alt text.

1. **Critical: buttons with no name.** News carousel arrows (`#prev-news`, `#next-news`, `.carousel-arrow`) and the search button (`.search-popup__btn`) are icon-only with no text or label. Screen readers say "button".
2. **Serious: icon-only social links with no name** (Instagram, Facebook, Yelp, plus one more), repeated on every page. 6 per page.
3. **Serious: keyboard focus is invisible.** 43 of 53 focusable elements on the home page (all nav links, Order Now, footer links) have outline removed with nothing in its place. A keyboard user cannot see where they are.
4. **No `<main>` landmark, and the skip link points to `#main-content` which does not exist.** So the skip link is broken and the page has no main region.
5. **Serious: tiny touch targets.** Swiper slider dots are 12×12px; WCAG 2.2 wants 24×24 or spacing.
6. **Headings are a mess.** Two H1s on the home page, no H1 on the menu page, and levels skip (H2 to H4, H5/H6 used as section labels in the footer, "Phone & Hours" H3 straight after H1).
7. **Contrast failures** (mostly footer and ordering blocks): gray #9b9b9b and #999999 on #f8f9fa (2.6 to 2.7 : 1), Uber Eats green #06c167 on white and white on that green (2.4 : 1), white on the orange catering badge #d97706 (3.2 : 1), brand red #dc2626 on black at 14 to 18px (4.0 to 4.3 : 1), gray #6b7280 on black (4.3 : 1).
8. **Undetermined contrast** (78 on home, 178 on menu): text over the hero video, promo banner gradients, nav over an image, and the menu's dotted price leaders drawn with CSS pseudo-elements. Needs a manual check.
9. **Google Maps iframe has no title** (contact page).
10. **Reviews scroller on mobile** is a scrollable region a keyboard cannot reach.
11. **Auto-playing motion:** hero video, promo marquee, and auto-advancing sliders have no pause control and ignore reduced-motion. WCAG 2.2.2 requires a pause for anything moving longer than five seconds.
12. Two `<nav>` elements without distinguishing labels (menu page).

---

## The job

Make this static HTML/CSS/JS site (index.html, menu.html, news.html, contact.html, about, gallery, and any other pages, built with Bootstrap, Swiper, and Font Awesome) conform to WCAG 2.2 Level AA without changing the visual design. An axe-core scan on 2026-09-25 found the issues listed below; fix each one on every page where it appears, then do the manual checks, then verify. Do not install an accessibility overlay widget (accessiBe, UserWay, AudioEye or similar). Because this is plain HTML, apply each fix to every page that contains the shared header, footer, and ordering blocks.

Fix these specific findings:

1. Buttons with no accessible name: the news carousel arrows (#prev-news, #next-news, and .carousel-arrow.prev / .next on news.html) and the search button (.search-popup__btn). Give each an aria-label ("Previous news item", "Next news item", "Open search") and set aria-hidden="true" on the Font Awesome <i> inside.
2. Icon-only social links in the header and footer (Instagram, Facebook, Yelp, and the fourth Facebook link) have no name. Add aria-label="Mex Taco House on Instagram" style labels to each <a>, aria-hidden="true" on the icons, and include "(opens in new tab)" in the label since they use target="_blank".
3. Keyboard focus is invisible on almost every link and button because outline is removed in CSS. Find every outline: none / outline: 0 rule and replace it with a :focus-visible style: a 3px solid outline in a color that meets 3:1 against its background, with 2px offset. Confirm nav links, Order Now, slider controls, and footer links all show it.
4. There is no <main> element and the skip link targets #main-content which does not exist. Wrap the page content after the header in <main id="main-content" tabindex="-1"> on every page so the skip link works and every page has header, nav, main, and footer landmarks. Where there are two <nav> elements, give each an aria-label ("Primary", "Footer").
5. Swiper pagination bullets are 12×12px. Make them at least 24×24px (a padded hit area is fine, the visible dot can stay small) or space them 24px apart.
6. Headings: index.html has two H1s (keep one, demote the other), menu.html has no H1 (add one, "Menu" or similar), and levels skip on every page (H2 to H4 in the features grid, H5 and H6 in the footer and "Quick Links" columns, H3 "Phone & Hours" right after H1 on contact.html). Rework the heading levels so each page has exactly one H1 and no level is skipped. Footer column titles that are not real section headings should be <p> or <div> styled to look the same.
7. Color contrast, measured at the listed sizes, needs 4.5:1 for text under 24px:
   - gray #9b9b9b and #999999 on #f8f9fa (order-ahead copy, hours line): 2.6 to 2.7. Use #6b6b6b or darker.
   - Uber Eats green #06c167 as text on white, and white text on that green button: 2.4. Use a darker green (around #0a7a44 or darker) for text and for the button background.
   - white text on the orange catering badge #d97706: 3.2. Darken the orange (around #b45309) or use dark text.
   - brand red #dc2626 on black / #0d0d0d in the footer (phone number, "Business Hours", "Closed") at 14 to 18px: 4.0 to 4.3. Use a slightly lighter red for small text on black (around #ef4444, which passes) or make those items 24px+.
   - gray #6b7280 on black (copyright, order-ahead line): 4.3. Use #9ca3af or lighter.
   Apply the same substitutions wherever those colors are used for text under 24px.
8. axe could not measure text over the hero video, over the promo banner gradients, nav links over images, and the menu's dotted price leaders. Put a solid or near-solid dark scrim behind text on the video and banners so it measures at least 4.5:1, and make sure menu item names and prices are real text in the HTML, not CSS content, so screen readers read them.
9. The Google Maps iframe on contact.html needs a title attribute, for example "Map showing the Mex Taco House location".
10. The reviews scroller on mobile (.reviews-container) is a scrollable region with no keyboard access. Either give the container tabindex="0" with an aria-label, or make the reviews a normal stacked list on small screens.
11. Motion: the hero video, the promo marquee, and every auto-advancing slider must have a visible pause/play control, must stop when prefers-reduced-motion is set, and must not loop audio. If the hero video has no audio and is purely decorative, mark it aria-hidden and keep the pause control. Auto-advancing Swiper instances should pause on hover and focus.
12. Every link that opens a new tab (DoorDash, Uber Eats, social, Yelp, Google Maps) needs "(opens in new tab)" as visually hidden text inside the link.

Then do these manual checks and fix what you find:

13. Every image needs real alt text describing the dish, event, or photo. Decorative images and background-image divs that carry text must have that text in HTML, not in the image. Menu photos should name the dish.
14. Any form on the site (contact, catering, hiring) needs a visible label for every field tied with for/id, required fields marked in text, and error messages in text associated to the field.
15. The mobile menu toggle needs aria-expanded and aria-controls, and Escape should close it.
16. Remove inline onmouseover / onmouseout style handlers on buttons in favor of CSS :hover and :focus-visible so keyboard users get the same feedback.

Add an accessibility statement page (accessibility.html) linked from the footer of every page. It should state that the site targets WCAG 2.2 AA, list any known limitations, and give the restaurant's phone and an email for accessibility problems, with a commitment to respond.

Verify when done: run axe-core against every page (for example npx @axe-core/cli with the tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, or a small Playwright script) and make it pass with zero violations at 1366px and 390px widths. Then do a full keyboard-only walkthrough of the home page, the menu, and the contact page and confirm focus is always visible and every control is reachable. Report what you changed, file by file, and anything you could not fix.
