/* ==========================================================================
   Renders the editable data files in /data (publications, news, members)
   and keeps the research-page contents bar in step with scrolling.
   ========================================================================== */
(function () {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isExternal(href) { return /^https?:\/\//.test(href); }
  function linkAttrs(href) {
    return 'href="' + esc(href) + '"' + (isExternal(href) ? ' target="_blank" rel="noopener"' : '');
  }

  /* ---------- Publications ---------- */

  // Manuscripts in preparation (status: "in-prep") are listed first on the publications page
  // and left out of the home page and research-page summaries.
  var ALL_PUBS = (window.LAB_PUBLICATIONS || []).slice().sort(function (a, b) { return (b.year || 9999) - (a.year || 9999); });
  var PUBS = ALL_PUBS.filter(function (p) { return p.status !== 'in-prep'; });
  var HIGHLIGHT = window.LAB_HIGHLIGHT_AUTHORS || [];

  function groupOf(p) { return p.status === 'in-prep' ? 'In preparation' : String(p.year); }

  function authorsHTML(authors) {
    var html = esc(authors);
    HIGHLIGHT.forEach(function (name) {
      html = html.split(esc(name)).join('<strong>' + esc(name) + '</strong>');
    });
    return html;
  }

  function pubHref(p) {
    if (p.url) return p.url;
    if (p.doi) return 'https://doi.org/' + p.doi;
    return '';
  }

  // Typeset chemical formulae in titles, e.g. "CO2" -> "CO₂".
  function titleHTML(t) {
    return esc(t).replace(/\bCO2\b/g, 'CO₂');
  }

  function venueHTML(p) {
    var parts = [];
    if (p.journal) {
      var v = '<i>' + esc(p.journal) + '</i>';
      if (p.volume) v += ', ' + esc(p.volume) + (p.issue ? '(' + esc(p.issue) + ')' : '');
      if (p.article) v += ', ' + esc(p.article);
      parts.push(v + '.');
    }
    if (p.note) parts.push(esc(p.note) + '.');
    var s = parts.join(' ');
    if (p.doi) s += '<a class="pub-doi" ' + linkAttrs('https://doi.org/' + p.doi) + '>doi:' + esc(p.doi) + '</a>';
    else if (p.url) s += '<a class="pub-doi" ' + linkAttrs(p.url) + '>Link</a>';
    if (p.pdf) s += '<a class="pub-doi" ' + linkAttrs(p.pdf) + '>PDF</a>';
    return s;
  }

  function pubHTML(p, showYear) {
    var href = pubHref(p);
    var title = href ? '<a ' + linkAttrs(href) + '>' + titleHTML(p.title) + '</a>' : titleHTML(p.title);
    return '<article class="pub">' +
      (showYear ? '<div class="pub-year">' + esc(p.year) + '</div>' : '') +
      '<div><h3 class="pub-title">' + title + '</h3>' +
      '<p class="pub-authors">' + authorsHTML(p.authors) + '</p>' +
      '<p class="pub-venue">' + venueHTML(p) + '</p></div>' +
      '</article>';
  }

  $$('[data-pubs="latest"]').forEach(function (el) {
    var n = parseInt(el.getAttribute('data-limit') || '3', 10);
    el.innerHTML = PUBS.slice(0, n).map(function (p) { return pubHTML(p, true); }).join('');
  });

  $$('[data-pubs-related]').forEach(function (el) {
    var theme = el.getAttribute('data-pubs-related');
    var items = PUBS.filter(function (p) { return (p.themes || []).indexOf(theme) !== -1; }).slice(0, 4);
    if (!items.length) {
      el.innerHTML = '<li>Publications on this theme will appear here.</li>';
      return;
    }
    el.innerHTML = items.map(function (p) {
      var href = pubHref(p);
      var t = href ? '<a ' + linkAttrs(href) + '>' + titleHTML(p.title) + '</a>' : titleHTML(p.title);
      return '<li><span class="yr">' + esc(p.year) + '</span><span>' + t + '. <i>' + esc(p.journal) + '</i></span></li>';
    }).join('');
  });

  var pubRoot = $('[data-pubs="all"]');
  if (pubRoot) {
    var search = $('#pub-search');
    var filterWrap = $('[data-pub-filters]');
    var countEl = $('[data-pub-count]');
    var state = { q: '', year: 'all' };
    var years = ALL_PUBS.map(groupOf).filter(function (y, i, a) { return a.indexOf(y) === i; });

    if (filterWrap) {
      filterWrap.innerHTML = ['all'].concat(years).map(function (y) {
        return '<button type="button" class="filter" data-year="' + esc(y) + '" aria-pressed="' + (y === 'all') + '">' +
          (y === 'all' ? 'All' : esc(y)) + '</button>';
      }).join('');
      filterWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter');
        if (!btn) return;
        state.year = btn.getAttribute('data-year');
        $$('.filter', filterWrap).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        renderAll();
      });
    }
    if (search) {
      search.addEventListener('input', function () { state.q = search.value.trim().toLowerCase(); renderAll(); });
    }

    var renderAll = function () {
      var list = ALL_PUBS.filter(function (p) {
        if (state.year !== 'all' && groupOf(p) !== state.year) return false;
        if (!state.q) return true;
        return (p.title + ' ' + p.authors + ' ' + (p.journal || '') + ' ' + groupOf(p)).toLowerCase().indexOf(state.q) !== -1;
      });
      if (countEl) countEl.textContent = list.length + ' of ' + ALL_PUBS.length + ' entries';
      if (!list.length) {
        pubRoot.innerHTML = '<div class="empty"><b>No matching publications</b>Try a different word or year.</div>';
        return;
      }
      var html = '';
      years.forEach(function (y) {
        var group = list.filter(function (p) { return groupOf(p) === y; });
        if (!group.length) return;
        var heading = y === 'In preparation' ? 'In prep.' : esc(y);
        var noun = y === 'In preparation' ? ' manuscript' : ' paper';
        html += '<section class="year-group"><h2>' + heading + '<span>' + group.length + noun + (group.length > 1 ? 's' : '') + '</span></h2><div>' +
          group.map(function (p) { return pubHTML(p, false); }).join('') + '</div></section>';
      });
      pubRoot.innerHTML = html;
    };
    renderAll();
  }

  /* ---------- Conference presentations and theses ---------- */

  var presRoot = $('[data-presentations]');
  if (presRoot) {
    var PRES = (window.LAB_PRESENTATIONS || []).slice().sort(function (a, b) { return b.year - a.year; });
    // Shown with the paper layout: a meeting reads like a journal, a thesis like a note.
    var asPub = function (p) {
      var thesis = p.type === 'thesis';
      return { year: p.year, authors: p.authors, title: p.title, journal: thesis ? '' : p.meeting,
        note: thesis ? p.meeting : '', article: p.number, doi: p.doi, url: p.url };
    };
    var presGroups = [
      { label: 'Conference presentations', one: 'abstract', many: 'abstracts', items: PRES.filter(function (p) { return p.type !== 'thesis'; }) },
      { label: 'Theses', one: 'thesis', many: 'theses', items: PRES.filter(function (p) { return p.type === 'thesis'; }) }
    ].filter(function (g) { return g.items.length; });
    if (!presGroups.length) {
      presRoot.closest('section').hidden = true;
    } else {
      presRoot.innerHTML = presGroups.map(function (g) {
        return '<section class="pub-group"><h3>' + g.label + '<span>' + g.items.length + ' ' + (g.items.length > 1 ? g.many : g.one) + '</span></h3><div>' +
          g.items.map(function (p) { return pubHTML(asPub(p), true); }).join('') + '</div></section>';
      }).join('');
    }
  }

  /* ---------- News ---------- */

  function formatDate(d) {
    var parts = String(d).split('-');
    if (parts.length > 1) return MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
    return parts[0];
  }

  $$('[data-news]').forEach(function (el) {
    var n = parseInt(el.getAttribute('data-limit') || '99', 10);
    var items = (window.LAB_NEWS || []).slice(0, n);
    el.innerHTML = items.map(function (item) {
      var title = item.link ? '<a ' + linkAttrs(item.link) + '>' + esc(item.title) + '</a>' : esc(item.title);
      return '<article class="news-item"><time datetime="' + esc(item.date) + '">' + esc(formatDate(item.date)) + '</time>' +
        '<div><h3>' + title + '</h3>' + (item.text ? '<p>' + esc(item.text) + '</p>' : '') + '</div></article>';
    }).join('');
  });

  /* ---------- Members ---------- */

  var GROUPS = [
    { id: 'postdoc', label: 'Postdoctoral researchers' },
    { id: 'grad', label: 'Graduate students' },
    { id: 'undergrad', label: 'Undergraduate researchers' },
    { id: 'staff', label: 'Staff' }
  ];

  function initials(name) {
    return String(name).split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }

  // A member profile, laid out like the PI's: photo on the left, details on the right.
  function personHTML(m) {
    var photo = m.photo
      ? '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy">'
      : '<span class="initials" aria-hidden="true">' + esc(initials(m.name)) + '</span>';
    var name = m.url ? '<a ' + linkAttrs(m.url) + '>' + esc(m.name) + '</a>' : esc(m.name);
    var role = esc(m.role) + (m.position ? ' · ' + esc(m.position) : '');

    var links = '';
    if (m.email) links += '<a class="btn btn-dark" href="mailto:' + esc(m.email) + '">Email</a>';
    if (m.url) links += '<a class="btn btn-outline" ' + linkAttrs(m.url) + '>Website</a>';

    var education = '';
    if (Array.isArray(m.education) && m.education.length) {
      education = '<section><h4>Education</h4><ul class="cv">' + m.education.map(function (e) {
        return '<li><span class="cv-years">' + esc(e[0]) + '</span><div><b>' + esc(e[1]) + '</b><span>' + esc(e[2] || '') + '</span></div></li>';
      }).join('') + '</ul></section>';
    } else if (m.education) {
      education = '<section><h4>Education</h4><p>' + esc(m.education) + '</p></section>';
    }
    var research = '';
    if (m.research || m.skills) {
      research = '<section>' +
        (m.research ? '<h4>Current research</h4><p>' + titleHTML(m.research) + '</p>' : '') +
        (m.skills ? '<h4>Skills</h4><p>' + esc(m.skills) + '</p>' : '') + '</section>';
    }
    var projects = m.projects && m.projects.length
      ? '<section><h4>Selected projects</h4><ul class="plain-list">' +
        m.projects.map(function (p) { return '<li>' + titleHTML(p) + '</li>'; }).join('') + '</ul></section>'
      : '';
    var interests = m.interests ? '<section><h4>Outside the lab</h4><p>' + esc(m.interests) + '</p></section>' : '';

    return '<article class="member' + (m.placeholder ? ' is-placeholder' : '') + '">' +
      '<div class="member-photo">' + photo + '</div>' +
      '<div class="member-body">' +
      '<p class="member-role">' + role + '</p>' +
      '<h3>' + name + '</h3>' +
      (m.bio ? '<p class="member-bio">' + esc(m.bio) + '</p>' : '') +
      (links ? '<p class="member-links">' + links + '</p>' : '') +
      (education || research ? '<div class="facts">' + education + research + '</div>' : '') +
      (projects || interests ? '<div class="facts">' + projects + interests + '</div>' : '') +
      '</div></article>';
  }

  var membersRoot = $('[data-members]');
  if (membersRoot) {
    // Entries still marked `placeholder: true` stay in the data file but are not shown.
    var members = (window.LAB_MEMBERS || []).filter(function (m) { return !m.placeholder; });
    var html = '';
    var used = GROUPS.filter(function (g) { return members.some(function (m) { return m.group === g.id; }); });
    var byGroup = function (g) { return members.filter(function (m) { return m.group === g.id; }); };
    if (!members.length) {
      html = '<div class="empty"><b>Group members</b>will be listed here.</div>';
    } else if (members.length <= 8) {
      // Small group: one list in group order; each profile already shows its role.
      var ordered = [];
      used.forEach(function (g) { ordered = ordered.concat(byGroup(g)); });
      html = '<div class="members">' + ordered.map(personHTML).join('') + '</div>';
    } else {
      used.forEach(function (g) {
        var list = byGroup(g);
        html += '<div class="group-label"><h3>' + g.label + '</h3><span>' + list.length + '</span></div>' +
          '<div class="members">' + list.map(personHTML).join('') + '</div>';
      });
    }
    var alumni = window.LAB_ALUMNI || [];
    if (alumni.length) {
      html += '<div class="group-label"><h3>Former members</h3><span>' + alumni.length + '</span></div>' +
        '<ul class="related">' + alumni.map(function (a) {
          return '<li><span class="yr">' + esc(a.years || '') + '</span><span><b>' + esc(a.name) + '</b>, ' + esc(a.role || '') +
            (a.now ? '; now ' + esc(a.now) : '') + '</span></li>';
        }).join('') + '</ul>';
    }
    membersRoot.innerHTML = html;
  }

  /* ---------- Research contents bar ---------- */

  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.r-block[id]').forEach(function (s) { tocObserver.observe(s); });
  }

  /* ---------- Footer year ---------- */

  $$('[data-current-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
