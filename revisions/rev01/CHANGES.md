# Revision 01 — Layout Changes

---

## Change 01 — Index Text Alignment

On the project list page, change the top value for the `(INDEX)` text from `158` to `150`. The `(INDEX)` label must be optically aligned with the project numbers. Use your best judgement to achieve optical alignment.

**Reference:** `change01 - index text.png`

---

## Change 02 — Project Info Slide Top Padding

On the project information slide, the text must be positioned at the same distance from the top of the window as the text/image on the information page. This value is approximately `158` — please double check against the actual information page and match it exactly.

**Reference:** `change02 - project info slide.png`

---

## Change 03 — Fine Print Alignment

On the information page, the last two lines — `ACT ARCHITECTS` and the `JEAN ARCHITECTS...` line — should be aligned with the `(PHONE)` / `(EMAIL)` / `(IG)` column above them, not with the `(CONTACT)` label. Adjust their left alignment accordingly.

**Reference:** `change03 - fineprint aligmnet.png`

---

## Change 04 — Active Nav Link Bug

**Bug:** If the user is on the project index page and clicks the index nav link, the page goes blank and they cannot navigate. The same issue occurs on the information page — clicking the information nav link causes the same blank/broken state.

Fix the nav links so that clicking the current active page does not cause a blank or broken state. The page should either do nothing, or gracefully handle the re-click.

No reference image.

---

## Change 05 — Column Spacing Consistency

On both the index page and the project information page, the second columns are not consistently aligned. The gap between columns looks too small.

In the Figma file, the first column is `2` units wide. Please replicate this in the Tailwind grid setup — use the equivalent `col-span-2` (or matching grid column definition) to ensure the second column aligns consistently across both pages.

**Reference:** `change05 - spacing.png`
