// Regenerate the static guide after editing scholarships-data.json.
// No build step or JavaScript is required to read the deployed guide.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'scholarships-data.json'), 'utf8'));
const reviewedLabel = new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.reviewed + 'T00:00:00Z'));
const e = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const labels = {'fees-stipend':'Fees + living support', tuition:'Tuition only', partial:'Partial support', salary:'Paid research position', variable:'Coverage varies'};
const ids = new Set();
const external = (label, url) => {
  if (!url.startsWith('https://')) throw new Error('Expected HTTPS: ' + url);
  return `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} <span aria-hidden="true">↗</span></a>`;
};
const awards = data.countries.flatMap(country => country.awards);
for (const item of [...data.countries, ...awards]) {
  if (!item.id || ids.has(item.id)) throw new Error('Missing or duplicate ID: ' + item.id);
  ids.add(item.id);
}
for (const award of awards) {
  for (const key of ['name','degrees','study','route','funding','coverage','eligibility','apply','documents','timing','sources']) {
    if (!award[key]?.length) throw new Error(`${award.id}: missing ${key}`);
  }
  if (!labels[award.funding] || award.degrees.some(degree => !['masters', 'phd'].includes(degree))) throw new Error('Invalid award: ' + award.id);
}

const awardHTML = award => `<details class="award" id="${e(award.id)}" data-degrees="${e(award.degrees.join(' '))}" data-route="${e(award.route)}" data-funding="${e(award.funding)}">
  <summary><span class="award-heading">${e(award.name)}</span><span class="tags"><span class="tag">${e(award.study)}</span>${award.route === 'sri-lanka' ? '<span class="tag local">Sri Lanka route</span>' : '<span class="tag">International applicants</span>'}<span class="tag funding">${e(labels[award.funding])}</span></span><span class="award-preview">${e(award.coverage)}</span></summary>
  <div class="award-body"><dl>
    <dt>Requirements &amp; Sri Lankan eligibility</dt><dd>${e(award.eligibility)}</dd>
    <dt>How to apply</dt><dd>${e(award.apply)}</dd>
    <dt>What you need</dt><dd>${e(award.documents)}</dd>
    <dt>When to prepare / apply</dt><dd>${e(award.timing)}</dd>
  </dl><p class="source-links"><strong>Official sources:</strong> ${award.sources.map(([label,url]) => external(label,url)).join(' · ')}</p><p class="review-date">Source review: <time datetime="${data.reviewed}">${reviewedLabel}</time> · verify the current call before applying.</p><a class="permalink" href="#${e(award.id)}">Link to this opportunity</a></div>
</details>`;

const countryHTML = country => `<section class="country" id="${e(country.id)}" data-country="${e(country.id)}" data-region="${e(country.region)}" aria-labelledby="${e(country.id)}-heading">
  <div class="country-heading"><h3 id="${e(country.id)}-heading">${e(country.name)}</h3><span class="country-region">${e(country.region)}</span></div>
  <p class="country-intro">${e(country.intro)}</p>
  <details class="university-guide"><summary>Universities &amp; entry requirements</summary><div class="table-scroll"><table><caption>Examples to explore in ${e(country.name)}; programme rules control admission.</caption><thead><tr><th scope="col">University / route</th><th scope="col">What to check</th></tr></thead><tbody>${country.universities.map(university => `<tr><th scope="row">${external(university.name, university.url)}</th><td>${e(university.requirements)}</td></tr>`).join('')}</tbody></table></div></details>
  <p class="country-prepare"><strong>How to prepare:</strong> ${e(country.prepare)}</p>
  ${country.awards.map(awardHTML).join('\n')}
  ${country.id === 'sweden' ? '<p class="related-route">Looking for a PhD? Explore <a href="#msca">MSCA Doctoral Network vacancies</a>, including projects at Swedish hosts. Apply to a specific advertised position and check the host’s doctoral entry conditions.</p>' : ''}
  <p class="back-top"><a href="#finder">Back to filters ↑</a></p>
</section>`;

const checklist = [
  ['identity','Check passport validity and consistent names across certificates; arrange an explanation for any differences.'],
  ['degrees','Request degree / provisional certificates, full transcripts and the official grading scale from your university.'],
  ['equivalence','Check whether your three- or four-year degree is accepted. Ask admissions before paying for an equivalence evaluation.'],
  ['translations','Arrange certified English translations and any certifications requested by the exact application route.'],
  ['cv','Prepare a concise academic CV with education, thesis, projects, work, awards and your actual contribution to publications.'],
  ['statement','Draft a tailored statement of purpose: why this subject, this programme and your next career step.'],
  ['proposal','For research routes, prepare a proposal or research statement in the format requested. Do not send a generic proposal to every lab.'],
  ['references','Ask suitable referees early, confirm their availability and track their separate submission deadlines.'],
  ['language','Check accepted English tests, minimum component scores and validity dates. Obtain a medium-of-instruction letter if a waiver is permitted.'],
  ['experience','Request work certificates showing dates and role if applying to awards that require professional experience.'],
  ['budget','Budget for applications, tests, documents, travel and initial living costs; confirm what the award excludes and when payments start.'],
  ['deadlines','Record the university, scholarship, nomination and referee deadlines with the correct time zone. Save submission receipts.']
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Master's &amp; PhD Scholarships for Sri Lankan Students | Nishankar</title>
  <meta name="author" content="Nishankar Sathiyamohan">
  <meta name="description" content="Country-wise master's and PhD scholarship guide for Sri Lankan students: universities, requirements, funding, official application links, documents and preparation.">
  <link rel="canonical" href="https://www.nishankar.space/scholarships.html">
  <meta property="og:title" content="Master's &amp; PhD Scholarship Guide for Sri Lankan Students">
  <meta property="og:description" content="Find funding by country, compare requirements and prepare your applications with official sources and a practical checklist.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.nishankar.space/scholarships.html">
  <meta property="og:image" content="https://www.nishankar.space/optimized/My/profile.webp">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="optimized/icon.webp" type="image/webp">
  <link rel="stylesheet" href="stylesheet.css">
  <link rel="stylesheet" href="scholarships.css">
  <script src="scholarships.js" defer></script>
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:"Master's & PhD Scholarship Guide for Sri Lankan Students",url:'https://www.nishankar.space/scholarships.html',dateModified:data.reviewed,inLanguage:'en',author:{'@type':'Person',name:'Nishankar Sathiyamohan',url:'https://www.nishankar.space/'},description:'Country-wise postgraduate funding routes, official sources, university requirements and application preparation.'}).replace(/</g,'\\u003c')}</script>
</head>
<body>
<a class="skip-link" href="#content">Skip to main content</a>
<div class="page scholarship-page">
  <aside class="sidebar">
    <a class="side-photo-link" href="index.html"><img width="640" height="800" class="side-photo" decoding="async" alt="Portrait of Nishankar Sathiyamohan" src="optimized/My/profile.webp"></a>
    <p class="side-name"><a href="index.html">Nishankar Sathiyamohan</a></p>
    <nav class="side-nav" aria-label="Site"><ul>
      <li><a href="index.html">About &amp; research</a></li>
      <li><a href="projects.html">Projects</a></li>
      <li><a href="quantum.html">Quantum Lab</a></li>
      <li><a href="scholarships.html" aria-current="page">Scholarships</a></li>
      <li><a href="index.html#contact">Contact</a></li>
    </ul></nav>
    <nav class="guide-nav" aria-label="Scholarship guide"><p class="small-label">On this page</p><ul>
      <li><a href="#finder">Find funding</a></li><li><a href="#sri-lankan-students">Sri Lankan applicants</a></li><li><a href="#documents">What you need</a></li><li><a href="#preparation">How to prepare</a></li><li><a href="#questions">Common questions</a></li>
    </ul></nav>
  </aside>
  <div class="content"><main id="content">
    <header class="guide-hero">
      <p class="small-label">Study abroad · a practical guide</p>
      <h1>Funding for your<br><em>next degree.</em></h1>
      <p class="guide-dek">Master's and PhD scholarships, country by country. A starting point for Sri Lankan students to find universities, understand requirements and prepare a strong application.</p>
      <div class="guide-stats"><span><strong>13</strong> countries</span><span><strong>${awards.length}</strong> funding routes</span><span><strong>2</strong> degree levels</span></div>
      <p class="review-note">Reviewed <time datetime="${data.reviewed}">${reviewedLabel}</time> · Official sources linked with every opportunity.</p>
      <p class="guide-note">This is a guide to funding routes, not a live list of open calls. Dates, university participation and eligibility can change. An admission offer and a scholarship offer are separate unless the programme explicitly combines them.</p>
    </header>

    <section id="sri-lankan-students" class="sri-section">
      <h2>Start here if you are applying from Sri Lanka</h2>
      <p><strong>Country-specific routes:</strong> explore <a href="#mext-sri-lanka">MEXT</a>, <a href="#gks">GKS</a>, <a href="#csc-a">Chinese Government Type A</a>, <a href="#australia-awards">Australia Awards</a>, <a href="#fulbright">Fulbright</a>, <a href="#chevening">Chevening</a> and <a href="#commonwealth">Commonwealth</a>. These use a Sri Lankan call or country-eligible process; they are not all exclusive to Sri Lankans.</p>
      <p><strong>International awards:</strong> Sri Lankan students can also compete for nationality-open university and international funding, subject to each programme's conditions. A “Sri Lanka route” label identifies the application channel, not a guarantee of selection.</p>
      <p>Monitor <a href="https://mohe.gov.lk/" target="_blank" rel="noopener noreferrer">Sri Lankan Ministry of Higher Education notices ↗</a> and the relevant embassy or award provider. A ministry nomination deadline can be earlier than the overseas deadline.</p>
    </section>

    <section id="finder">
      <h2>Explore countries &amp; funding</h2>
      <p class="section-note">Choose a destination, then open an opportunity for requirements, documents and application steps. University examples are starting points, not a complete list.</p>
      <form id="scholarship-filters" class="filters" role="search" hidden>
        <div class="search-field"><label for="scholarship-search">Search scholarships, universities or requirements</label><input type="search" id="scholarship-search" placeholder="e.g. MEXT, research, work experience" autocomplete="off"></div>
        <div class="filter-row"><div><label for="country-filter">Destination</label><select id="country-filter"><option value="all">All destinations</option><option value="europe-all">Europe — all routes</option>${data.countries.map(country => `<option value="${e(country.id)}">${e(country.name)}</option>`).join('')}</select></div>
        <div><label for="degree-filter">Degree</label><select id="degree-filter"><option value="all">Master's &amp; PhD</option><option value="masters">Master's</option><option value="phd">PhD</option></select></div>
        <div><label for="route-filter">Eligibility route</label><select id="route-filter"><option value="all">All routes</option><option value="sri-lanka">Sri Lanka / country route</option><option value="international">International applicants</option></select></div>
        <div><label for="funding-filter">Funding</label><select id="funding-filter"><option value="all">All funding types</option>${Object.entries(labels).map(([value,label])=>`<option value="${value}">${e(label)}</option>`).join('')}</select></div></div>
        <div class="filter-footer"><p id="results-count" role="status" aria-live="polite" aria-atomic="true"></p><button type="reset" class="text-button">Reset filters</button></div>
      </form>
      <noscript><p>All opportunities are available below. Search filters and saved checklist progress need JavaScript.</p></noscript>
      <nav class="country-index" aria-label="Browse a destination">${data.countries.map(country => `<a href="#${e(country.id)}">${e(country.name)}</a>`).join('')}</nav>
      <p class="funding-key"><strong>Read the coverage:</strong> “Fees + living support” may exclude costs or have limits. “Tuition only” needs a living-cost plan. “Paid research position” is employment under the host's terms.</p>
      <div id="empty-results" class="empty-results" hidden><h3>No matching opportunities</h3><p>Try a broader search or reset the filters to see every destination.</p><button type="button" id="clear-empty" class="text-button">Show all opportunities</button></div>
      <div id="country-results">${data.countries.map(countryHTML).join('\n')}</div>
    </section>

    <section id="documents">
      <div class="section-heading"><h2>What you need</h2><button type="button" id="print-guide" class="outline-button" hidden>Print guide / save PDF</button></div>
      <p>A working checklist, not a substitute for the award's official document list. Do not order medicals, police reports or paid credential evaluations until you know they are needed and will be valid at submission.</p>
      <p id="checklist-note" class="section-note">Tick items as you prepare. Keep your own copy of important records.</p>
      <fieldset class="document-checklist"><legend>Application preparation checklist</legend>${checklist.map(([id,label])=>`<label><input type="checkbox" data-check="${id}"><span>${e(label)}</span></label>`).join('\n')}</fieldset>
      <div class="checklist-footer"><p id="checklist-progress" role="status" aria-live="polite"></p><button type="button" id="clear-checklist" class="text-button" hidden>Clear checklist</button></div>
      <details class="faq"><summary>A note on Sri Lankan qualifications and English waivers</summary><p>Send the degree title, duration, transcript and grading scale to admissions if equivalence is unclear. A three-year general degree and a four-year honours degree may be assessed differently. Do not convert your own marks into a foreign GPA unless the application explicitly asks you to.</p><p>A medium-of-instruction letter is useful only when the university accepts it for a waiver. An English-taught degree does not automatically waive IELTS or TOEFL for every university or scholarship.</p></details>
    </section>

    <section id="preparation">
      <h2>How to prepare</h2>
      <p class="section-note">Suggested planning timeline, counted backwards from your earliest deadline. Start sooner if you need language testing, research experience or a nomination.</p>
      <ol class="timeline">
        <li><strong>9–12 months before · decide your direction</strong><p>Choose taught master's, research master's or PhD. Shortlist courses or labs by fit, check degree equivalence, and build a table of admission and funding requirements.</p></li>
        <li><strong>6–9 months before · strengthen your evidence</strong><p>Complete a substantial project, thesis or relevant work. Prepare an academic CV, request transcripts, plan required tests and identify referees who know your work.</p></li>
        <li><strong>3–6 months before · tailor your application</strong><p>Read the programme guidance and recent lab work. Write specific statements and research plans. Contact supervisors where requested; follow office-led procedures where they are required.</p></li>
        <li><strong>1–3 months before · assemble and review</strong><p>Match every document to the checklist, confirm translations and references, check nomination steps, and rehearse explaining your project, contribution and future plans.</p></li>
        <li><strong>Before the deadline · submit and confirm</strong><p>Submit early, check the time zone and save receipts. Make sure referees and any hard-copy documents arrive by their own deadlines. Monitor official messages for interviews or missing items.</p></li>
      </ol>
      <div class="degree-advice"><div><h3>For a master's application</h3><p>Show that your previous study prepares you for the course. Explain the skills you want, why this curriculum fits, and how you will use it. For development awards, connect this to a specific need in Sri Lanka.</p></div><div><h3>For a PhD application</h3><p>Show research readiness: a clear question, relevant methods, evidence of your contribution and a plausible next step. Explain the fit with the supervisor or project. Publications can help, but the individual programme decides what evidence it requires.</p></div></div>
      <details class="faq"><summary>How to approach a potential supervisor</summary><p>First check whether direct contact is encouraged. Where appropriate, send a short, individual email: introduce your degree and research, explain a concrete connection to their recent work, suggest your question, and ask whether they expect to take funded students. Attach a concise CV and a relevant research summary if requested.</p><p>Keep the message specific and accurate. Supervisor interest is useful, but does not replace formal admission or a written funding offer.</p></details>
    </section>

    <section id="questions"><h2>Common questions</h2>
      <details class="faq"><summary>What GPA or IELTS score do I need?</summary><p>There is no single country-wide score. The university, department and scholarship may set different requirements, including component scores. Use the linked entry rules and check how your Sri Lankan qualification is assessed. Meeting a minimum does not guarantee selection.</p></details>
      <details class="faq"><summary>Do I need a master's before a PhD?</summary><p>It depends on the programme. Some accept a relevant bachelor's with strong research preparation; others require a master's. Check the exact degree route, including integrated master's–PhD options.</p></details>
      <details class="faq"><summary>Is every scholarship here fully funded?</summary><p>No. Funding labels separate fee-and-living support, tuition-only awards, partial contributions and research employment. Read the offer for duration, renewal, insurance, international tuition, travel, dependants and any work or return-home conditions.</p></details>
      <details class="faq"><summary>Can I apply to more than one scholarship?</summary><p>Follow each scheme's rules. Some restrict track choices, course choices or holding other funding. You can prepare several suitable applications, but check restrictions before submitting or accepting awards.</p></details>
      <details class="faq"><summary>Are these deadlines updated automatically?</summary><p>No. This page was reviewed on ${reviewedLabel}. Dates identify the cited cycle where available; they are not automatically rolled forward. Always open the official source for the current call, eligibility and exact closing time.</p></details>
    </section>
  </main><footer class="site-foot"><p>A scholarship resource by <a href="index.html">Nishankar Sathiyamohan</a> · Source review: ${reviewedLabel}.</p><p>Programme and university links lead to official providers. Preparation suggestions are general guidance; the current provider's instructions control each application.</p><p><a href="#content">Back to top ↑</a></p></footer></div>
</div>
</body>
</html>
`;
writeFileSync(resolve(root, 'scholarships.html'), html.replace(/[ \t]+$/gm, ''), 'utf8');
console.log(`Generated scholarships.html: ${data.countries.length - 1} countries + Europe, ${awards.length} funding routes.`);
