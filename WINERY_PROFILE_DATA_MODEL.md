# Winery Profile Data Model v0.1

Each winery profile should contain the following structured sections.

## Planning essentials
- Hours by venue or experience
- Last verified date
- Holiday/private-event caveat
- Address and map
- Phone
- Reservations
- Recommended visit length
- Group policy
- Food availability
- Best time to visit
- Accessibility notes
- Children and dog policies
- Transportation and rideshare notes

## Editorial
- Vinny Verdict
- Known for
- Experience summary
- Best for
- May not suit
- First-visit tips
- Andrew's pick
- Antonio's pick
- Personal tasting dates

## Events
The prototype stores curated events in `data.js`.

Production options, in order of preference:
1. Winery-provided API
2. Public RSS or ICS calendar feed
3. Approved scheduled scraper/server-side sync
4. Winery partner dashboard
5. Manual editorial curation with last-refreshed date
6. Official-calendar link as fallback

Client-side scraping from GitHub Pages is not recommended because of CORS, reliability, legal, and page-structure issues.

## Reviews
The platform should separate:
- Out in the Vines editorial review
- Andrew and Antonio tasting notes
- Structured visitor notes
- Third-party review links
- Vinny Welcome Standard report

Avoid importing changing third-party star ratings without an authorized API and clear attribution.

## Visitor-note prompts
- What wine should nobody skip?
- What made you feel welcome?
- What should a first-time visitor know?
- Was the atmosphere accurately described?
- Did accessibility, group, dog, or family information match reality?
- When did you visit?

## Data governance
Every operational field should include:
- Source URL
- Last verified date
- Verification method
- Reviewer/editor
- Change history
