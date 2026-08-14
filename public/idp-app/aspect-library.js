/**
 * Katalog aspek + Key Behaviour untuk halaman IDP statis.
 *
 * Halaman idp-app bukan bagian dari app React, jadi ia tidak bisa mengimpor
 * src/data/model/aspects.generated.ts. Sumber yang sama dibaca langsung dari
 * CSV yang sudah tersaji statis di /data/ — dengan begitu aspek di Create IDP
 * selalu ikut berubah saat katalog di Admin Settings diperbarui, tanpa perlu
 * menyalin daftarnya ke dalam HTML.
 *
 * Pakai: AspectLibrary.ready().then(function(lib){ lib.aspects; lib.programs; })
 */
(function () {
  'use strict';

  /** Pembaca CSV seadanya: cukup untuk tanda kutip dan koma di dalam sel. */
  function parseCSV(text) {
    var rows = [], row = [], cell = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (quoted) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else quoted = false;
        } else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 || (r[0] || '').trim() !== ''; });
  }

  /**
   * Nama program dibuat dari nama aspeknya.
   *
   * Katalog program sungguhan belum ada di data mana pun; yang dibutuhkan
   * halaman ini hanya isi yang masuk akal untuk dipilih, dan menautkannya ke
   * aspek membuat kolom Aspect terisi benar tanpa daftar terpisah yang harus
   * ikut dirawat.
   */
  var PROGRAM_TEMPLATES = [
    { prefix: 'Pelatihan ', kind: 'Training' },
    { prefix: 'Coaching ', kind: 'Coaching' },
    { prefix: 'Penugasan ', kind: 'Job Assignment' }
  ];

  var _promise = null;

  function load() {
    return Promise.all([
      fetch('/data/aspects.csv').then(function (r) { return r.text(); }),
      fetch('/data/aspect_key_behaviours.csv').then(function (r) { return r.text(); })
    ]).then(function (res) {
      var aspectRows = parseCSV(res[0]).slice(1);
      var kbRows = parseCSV(res[1]).slice(1);

      var kbByAspect = {};
      kbRows.forEach(function (r) {
        var name = (r[0] || '').trim();
        if (!name) return;
        (kbByAspect[name] = kbByAspect[name] || []).push({
          level: parseInt(r[1], 10) || 0,
          label: (r[2] || '').trim()
        });
      });
      Object.keys(kbByAspect).forEach(function (k) {
        kbByAspect[k].sort(function (a, b) { return a.level - b.level; });
      });

      var aspects = aspectRows.map(function (r) {
        var name = (r[0] || '').trim();
        return {
          name: name,
          category: (r[1] || '').trim(),
          description: (r[2] || '').trim(),
          keyBehaviours: kbByAspect[name] || []
        };
      }).filter(function (a) { return a.name; });

      var programs = [];
      aspects.forEach(function (a) {
        PROGRAM_TEMPLATES.forEach(function (t, ti) {
          programs.push({
            id: 'p' + programs.length,
            name: t.prefix + a.name,
            kind: t.kind,
            aspect: a.name,
            category: a.category,
            keyBehaviours: a.keyBehaviours,
            // Satu template per aspek saja yang selalu ada; dua lainnya
            // dibuat berselang supaya daftarnya tidak seragam kaku.
            _keep: ti === 0 || (a.name.length + ti) % 2 === 0
          });
        });
      });
      programs = programs.filter(function (p) { return p._keep; });

      return { aspects: aspects, programs: programs, kbByAspect: kbByAspect };
    });
  }

  window.AspectLibrary = {
    ready: function () {
      if (!_promise) _promise = load();
      return _promise;
    }
  };
})();
