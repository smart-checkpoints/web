# Brand exports

Raster copies of the mark and the lockup, for the places that cannot take an
SVG: GitHub, social profiles, slide decks.

Nothing here is drawn by hand. It is all generated from the geometry in
`../src/components/LogoMark.tsx`, so the source of truth stays in one place.
These files are not served by the site; `public/` holds what the site itself
uses.

| File | Size | Where it goes |
| --- | --- | --- |
| `avatar-512.png` | 512x512 | GitHub organisation and repository avatars |
| `avatar-1024.png` | 1024x1024 | anywhere that wants a larger upload |
| `avatar-512-transparent.png` | 512x512 | avatars on a surface that is not white |
| `avatar.svg` | vector | the source the three avatars are cut from |
| `social-preview-1280x640.png` | 1280x640 | GitHub repository social preview |
| `lockup-1600.png` | 1600 wide | README headers, slides |

## Why the avatar has that much padding

Every extreme point of the mark sits on a single circle: 34 units out to a node
centre plus the 22.5 unit ring. The avatar square is centred on that circle and
the mark covers 70% of it, so the figure survives being cropped to a circle,
which is what most platforms do, without losing a ring.

## Regenerating

The avatars come from the same square as `src/app/icon.svg`, at a wider
coverage. Change the geometry in `LogoMark.tsx` and these need re-exporting to
match.
