/**
 * Katalog aspek + Key Behaviour dan daftar program untuk halaman IDP statis.
 *
 * Halaman idp-app bukan bagian dari app React, jadi ia tidak bisa mengimpor
 * src/data/model/aspects.generated.ts. Sumber yang sama dibaca langsung dari
 * CSV yang sudah tersaji statis di /data/ — dengan begitu aspek di Create IDP
 * selalu ikut berubah saat katalog di Admin Settings diperbarui, tanpa perlu
 * menyalin daftarnya ke dalam HTML.
 *
 * Daftar programnya sendiri bisa disunting user lewat halaman Program Library.
 * Tidak ada backend di sini, jadi hasil suntingannya disimpan di localStorage;
 * selama belum pernah disunting, yang dipakai adalah daftar bawaan yang
 * diturunkan dari katalog aspek.
 *
 * Pakai: AspectLibrary.ready().then(function(lib){ lib.aspects; lib.programs; })
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'idp-program-library-v1';

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

  var KINDS = ['Training', 'Coaching', 'Job Assignment'];

  /**
   * Program bawaan dibuat dari nama aspeknya.
   *
   * Katalog program sungguhan belum ada di data mana pun; yang dibutuhkan
   * halaman ini hanya isi yang masuk akal untuk dipilih, dan menautkannya ke
   * aspek membuat kolom Aspect terisi benar tanpa daftar terpisah yang harus
   * ikut dirawat.
   */
  var PREFIX = { 'Training': 'Pelatihan ', 'Coaching': 'Coaching ', 'Job Assignment': 'Penugasan ' };

  function defaultPrograms(aspects) {
    var out = [];
    aspects.forEach(function (a) {
      KINDS.forEach(function (kind, ki) {
        // Satu jenis per aspek selalu ada; dua lainnya berselang supaya
        // daftarnya tidak seragam kaku.
        if (ki !== 0 && (a.name.length + ki) % 2 !== 0) return;
        out.push({ id: 'p' + out.length, name: PREFIX[kind] + a.name, kind: kind, aspect: a.name });
      });
    });
    return out;
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) { return null; }
  }

  function writeStore(programs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs.map(function (p) {
        // KB tidak ikut disimpan: ia milik katalog aspek, bukan milik program.
        // Menyimpannya berarti daftar tersimpan jadi basi tiap katalog berubah.
        return { id: p.id, name: p.name, kind: p.kind, aspect: p.aspect };
      })));
    } catch (e) { console.error('simpan program library', e); }
  }

  var _promise = null;
  var _state = null;

  /** KB ditempelkan saat dibaca supaya selalu ikut katalog terbaru. */
  function withKB(program) {
    program.keyBehaviours = _state.kbByAspect[program.aspect] || [];
    return program;
  }

  function refresh() {
    _state.programs.forEach(withKB);
    return _state;
  }

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

      _state = {
        aspects: aspects,
        kbByAspect: kbByAspect,
        programs: readStore() || defaultPrograms(aspects),
        kinds: KINDS
      };
      return refresh();
    });
  }

  function nextId(programs) {
    var max = 0;
    programs.forEach(function (p) {
      var n = parseInt(String(p.id).replace(/^p/, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return 'p' + (max + 1);
  }

  window.AspectLibrary = {
    ready: function () {
      if (!_promise) _promise = load();
      return _promise;
    },

    addProgram: function (data) {
      var p = {
        id: nextId(_state.programs),
        name: (data.name || '').trim(),
        kind: data.kind || KINDS[0],
        aspect: data.aspect || ''
      };
      _state.programs.push(withKB(p));
      writeStore(_state.programs);
      return p;
    },

    updateProgram: function (id, data) {
      var p = _state.programs.find(function (x) { return x.id === id; });
      if (!p) return null;
      p.name = (data.name || '').trim();
      p.kind = data.kind || p.kind;
      p.aspect = data.aspect || p.aspect;
      withKB(p);
      writeStore(_state.programs);
      return p;
    },

    deleteProgram: function (id) {
      var i = _state.programs.findIndex(function (x) { return x.id === id; });
      if (i === -1) return false;
      _state.programs.splice(i, 1);
      writeStore(_state.programs);
      return true;
    },

    /** Kembali ke daftar bawaan — membuang seluruh suntingan user. */
    resetPrograms: function () {
      _state.programs = defaultPrograms(_state.aspects);
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      return refresh().programs;
    },

    /** True kalau daftarnya pernah disunting user. */
    isCustomized: function () { return readStore() !== null; }
  };
})();
