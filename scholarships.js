'use strict';
(() => {
  const form = document.getElementById('scholarship-filters');
  const search = document.getElementById('scholarship-search');
  const countrySelect = document.getElementById('country-filter');
  const degree = document.getElementById('degree-filter');
  const route = document.getElementById('route-filter');
  const funding = document.getElementById('funding-filter');
  const countries = [...document.querySelectorAll('.country')];
  const awards = [...document.querySelectorAll('.award')];
  const resultCount = document.getElementById('results-count');
  const empty = document.getElementById('empty-results');
  const normalize = value => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘']/g, '');
  // Index only editorial text, never the visitor's query as HTML.
  const indexedCountries = countries.map(country => ({
    element: country,
    context: normalize([...country.querySelectorAll('.country-heading, .country-intro, .university-guide, .country-prepare')].map(node => node.textContent).join(' ')),
    awards: [...country.querySelectorAll('.award')].map(award => ({element: award, text: normalize(award.textContent)}))
  }));

  function filter() {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let matches = 0;
    let destinations = 0;
    for (const item of indexedCountries) {
      const country = item.element;
      const selectedCountry = countrySelect.value;
      const destinationMatches = selectedCountry === 'all' || selectedCountry === country.dataset.country || (selectedCountry === 'europe-all' && country.dataset.region === 'Europe');
      let visible = 0;
      for (const award of item.awards) {
        const node = award.element;
        const show = destinationMatches && (degree.value === 'all' || node.dataset.degrees.split(' ').includes(degree.value)) && (route.value === 'all' || node.dataset.route === route.value) && (funding.value === 'all' || node.dataset.funding === funding.value) && words.every(word => (item.context + ' ' + award.text).includes(word));
        node.hidden = !show;
        if (show) visible++;
      }
      country.hidden = visible === 0;
      if (visible) destinations++;
      matches += visible;
    }
    resultCount.textContent = `${matches} of ${awards.length} funding routes · ${destinations} destination ${destinations === 1 ? 'section' : 'sections'}`;
    empty.hidden = matches > 0;
  }
  function resetFilters() {
    search.value = '';
    [countrySelect, degree, route, funding].forEach(select => { select.value = 'all'; });
    filter();
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', filter);
  form.addEventListener('change', filter);
  form.addEventListener('reset', event => { event.preventDefault(); resetFilters(); });
  window.addEventListener('pageshow', filter);
  document.getElementById('clear-empty').addEventListener('click', () => { resetFilters(); search.focus(); });

  function revealTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.closest('.country')) {
      if (target.hidden || target.closest('.country').hidden) resetFilters();
      if (target.matches('details')) target.open = true;
      if (target.hidden) target.hidden = false;
      requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
    }
  }
  window.addEventListener('hashchange', revealTarget);
  // A second click on the same anchor must still reveal an item hidden by a filter.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      let target;
      try { target = document.getElementById(decodeURIComponent(link.hash.slice(1))); } catch { return; }
      if (target?.closest('.country')) {
        if (target.hidden || target.closest('.country').hidden) resetFilters();
        if (target.matches('details')) target.open = true;
        if (location.hash === link.hash) requestAnimationFrame(revealTarget);
      }
    });
  });
  form.hidden = false;
  filter();
  revealTarget();

  const storageKey = 'nishankar-scholarship-checklist-v1';
  const checks = [...document.querySelectorAll('[data-check]')];
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) checks.forEach(check => { check.checked = saved[check.dataset.check] === true; });
  } catch { storageAvailable = false; }
  function checklistMessage() {
    document.getElementById('checklist-progress').textContent = `${checks.filter(check => check.checked).length} of ${checks.length} prepared`;
    document.getElementById('checklist-note').textContent = storageAvailable ? 'Progress is saved only in this browser on this device. Keep your own copy of important records.' : 'Progress is available for this visit; browser storage is unavailable. Keep your own copy.';
  }
  function saveChecklist() {
    try { localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(checks.map(check => [check.dataset.check, check.checked])))); }
    catch { storageAvailable = false; }
    checklistMessage();
  }
  checks.forEach(check => check.addEventListener('change', saveChecklist));
  const clear = document.getElementById('clear-checklist');
  clear.hidden = false;
  clear.addEventListener('click', () => { checks.forEach(check => { check.checked = false; }); saveChecklist(); });
  checklistMessage();

  // Expand details for print, including without the print button; restore on exit.
  // Existing filters remain applied so a visitor can print a selected destination.
  let printState = null;
  function preparePrint() {
    if (printState) return;
    printState = [...document.querySelectorAll('details')].map(node => [node, node.open]);
    printState.forEach(([node]) => { if (!node.hidden && !node.closest('[hidden]')) node.open = true; });
  }
  function restorePrint() {
    if (!printState) return;
    printState.forEach(([node, open]) => { node.open = open; });
    printState = null;
  }
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restorePrint);
  const print = document.getElementById('print-guide');
  print.hidden = false;
  print.addEventListener('click', () => { preparePrint(); window.print(); });
})();
