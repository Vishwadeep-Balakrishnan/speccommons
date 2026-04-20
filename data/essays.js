/* ========================================
   Speculative Commons — Essay Registry
   ========================================
   Single source of truth for all essays.
   The homepage grid and essay pages both
   reference this data.

   STATUS VALUES:
     'published'   → clickable, links to essay page
     'in-progress'  → visible but not clickable
     'forthcoming' → visible but not clickable
     'archived'    → hidden from homepage grid

   To add a new essay:
     1. Add an entry here
     2. Create the essay HTML file at /essays/<slug>.html
     3. Done — the homepage grid updates automatically

   To remove an essay:
     1. Delete or set status to 'archived'
     2. Optionally remove the HTML file

   ======================================== */

window.ESSAYS = [
  {
    slug: 'neglected-philanthropic-opportunities',
    title: 'Turning Wastewater into the World’s Cheapest Fuels',
    subtitle: '',
    description: 'Converting sewage and wastes into affordable, scalable fuel with net negative input costs to reduce energy costs for billions while turning waste into resources.',
    tag: 'Project',
    year: '2026',
    status: 'forthcoming',
    date: '2025-04-12',
    readingTime: '14 min',
    coverFrom: '#ddd8ce',
    coverTo: '#c9c4b8',
    coverImage: null
  },
  {
    slug: 'early-funding-and-asymmetric-impact',
    title: 'Early funding and asymmetric impact',
    subtitle: 'How small bets produced outsized societal returns',
    description: 'Examining historical case studies where small, early-stage philanthropic bets produced outsized societal returns — from the Green Revolution to mRNA vaccine research.',
    tag: 'Essay',
    year: '2025',
    status: 'archived',
    date: '2025-02-20',
    readingTime: '11 min',
    coverFrom: '#d5dbd6',
    coverTo: '#c2cac4',
    coverImage: null
  },
  {
    slug: 'mapping-underfunded-cause-areas',
    title: 'Mapping underfunded cause areas',
    subtitle: 'A living framework for structural neglect',
    description: 'Building a living framework for identifying and evaluating cause areas that are structurally neglected by mainstream philanthropy, using quantitative and qualitative signals.',
    tag: 'Framework',
    year: '2025',
    status: 'archived',
    date: null,
    readingTime: null,
    coverFrom: '#dbd6ce',
    coverTo: '#cec8be',
    coverImage: null
  },
  {
    slug: 'first-principles-philanthropy-research',
    title: 'First-principles philanthropy research',
    subtitle: 'Independence from social proof and trend cycles',
    description: 'Developing a rigorous methodology for evaluating philanthropic opportunities from first principles — independent of social proof, trend cycles, or institutional momentum.',
    tag: 'Methodology',
    year: '2025',
    status: 'archived',
    date: null,
    readingTime: null,
    coverFrom: '#d2d5db',
    coverTo: '#c0c4cc',
    coverImage: null
  }
];
