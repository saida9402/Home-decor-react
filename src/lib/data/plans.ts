/**
 * ⚠ PLACEHOLDER — THIS ENTIRE ARRAY IS UNVERIFIED SAMPLE COPY.
 *
 * Every entry below describes an event that did not happen. Titles,
 * descriptions, locations and dates are invented, and the bylines are
 * masked because fabricated human attributions are the riskiest part —
 * an invented author name reads as a factual claim about the business.
 *
 * To release The Journal section, replace each entry with a real one:
 *   - title    — drop the "[PLACEHOLDER] " prefix
 *   - desc     — real copy
 *   - author   — a real byline, or remove the field's use in Events.tsx
 *   - date     — a real dateline, replacing "[DATE TBC]"
 *   - location — a real location
 *
 * The four `img` paths are ALSO placeholders: they currently point at
 * food/restaurant photography left over from the original template, two
 * of which carry a third party's trademark. They are on the deployment
 * blocker list and need replacing with 1200x900 .webp home-decor imagery.
 *
 * Guard for when CI exists — this must return no matches before deploy:
 *   grep -rn '\[PLACEHOLDER\]' build/ src/
 */
export const plans = [
	{
		title: '[PLACEHOLDER] The Winter Edit',
		desc: 'New textiles in stone, clay and flax — in store from Friday.',
		author: 'PLACEHOLDER — no byline',
		date: '[DATE TBC]',
		location: 'London, Shoreditch',
		img: '/img/discount.webp',
	},
	{
		title: '[PLACEHOLDER] Workshop: Natural Dyeing',
		desc: 'A hands-on afternoon with indigo, madder and weld.',
		author: 'PLACEHOLDER — no byline',
		date: '[DATE TBC]',
		location: 'Lisbon, Príncipe Real',
		img: '/img/fresh.webp',
	},
	{
		title: '[PLACEHOLDER] New Showroom',
		desc: 'Our third space opens this spring in the Marais.',
		author: 'PLACEHOLDER — no byline',
		date: '[DATE TBC]',
		location: 'Paris, Le Marais',
		img: '/img/coming.webp',
	},
	{
		title: '[PLACEHOLDER] Behind the Loom',
		desc: 'Meet the weavers behind our handloom throws.',
		author: 'PLACEHOLDER — no byline',
		date: '[DATE TBC]',
		location: 'Porto, Portugal',
		img: '/img/food-city.webp',
	},
];
