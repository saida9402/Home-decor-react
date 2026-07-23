/**
 * Events — hand-authored entries for the homepage carousel.
 *
 * Local, hardcoded copy (no CMS behind this section yet). Each entry maps
 * 1:1 to the fields Events.tsx renders. Images are local files served from
 * /img/events/{slug}.jpg; a missing file falls back to a neutral ground
 * (see Events.tsx onError), so no broken-image icon is shown.
 */
export interface Event {
	id: number;
	title: string;
	host: string;
	description: string;
	date: string;
	location: string;
	image: string;
}

export const events: Event[] = [
	{
		id: 1,
		title: 'Workshop: Natural Dyeing',
		host: 'Craft Studio',
		description: 'A hands-on afternoon with indigo, madder and weld.',
		date: '18 Jan 2026',
		location: 'Lisbon, Príncipe Real',
		image: '/img/events/natural-dyeing.jpg',
	},
	{
		id: 2,
		title: 'New Showroom Opening',
		host: 'Home Decor',
		description: 'Our third space opens this spring in the Marais.',
		date: '02 Mar 2026',
		location: 'Paris, Le Marais',
		image: '/img/events/showroom-opening.jpg',
	},
	{
		id: 3,
		title: 'The Winter Edit — Preview Night',
		host: 'Home Decor',
		description: 'First look at new textiles in stone, clay and flax.',
		date: '12 Dec 2026',
		location: 'London, Shoreditch',
		image: '/img/events/winter-edit.jpg',
	},
	{
		id: 4,
		title: 'Meet the Weavers',
		host: 'Atelier Porto',
		description: 'An evening with the makers behind our handloom throws.',
		date: '27 Sep 2026',
		location: 'Porto, Portugal',
		image: '/img/events/meet-the-weavers.jpg',
	},
	{
		id: 5,
		title: 'Ceramics Masterclass',
		host: 'Studio Terra',
		description: 'Throw, trim and glaze your own stoneware vessel.',
		date: '14 Apr 2026',
		location: 'Copenhagen, Nørrebro',
		image: '/img/events/ceramics-masterclass.jpg',
	},
	{
		id: 6,
		title: 'Styling the Quiet Home',
		host: 'Editorial Team',
		description: 'A talk on negative space, texture and slow interiors.',
		date: '09 Jun 2026',
		location: 'Milan, Brera',
		image: '/img/events/quiet-home.jpg',
	},
];
