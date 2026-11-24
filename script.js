/* =========================================================
   A LITTLE ADVENTURE FOR HK — Storybook logic
   Pure vanilla JS · no dependencies
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => RM.matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pad = n => String(n).padStart(2, '0');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* =======================================================
     1. ILLUSTRATION LIBRARY (inline SVG, one consistent style)
     ======================================================= */
  const INK = '#5c4130';
  const G = (inner, sw = 2) => `<g stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
  const eyes = (x1, x2, y, r = 4) =>
    `<g class="eyes" style="transform-origin:${(x1 + x2) / 2}px ${y}px">` +
    `<ellipse cx="${x1}" cy="${y}" rx="${r * .82}" ry="${r}" fill="#3b2a20"/><ellipse cx="${x2}" cy="${y}" rx="${r * .82}" ry="${r}" fill="#3b2a20"/>` +
    `<circle cx="${x1 + r * .3}" cy="${y - r * .42}" r="${r * .34}" fill="#fff"/><circle cx="${x2 + r * .3}" cy="${y - r * .42}" r="${r * .34}" fill="#fff"/></g>`;
  const blush = (x1, x2, y) =>
    `<ellipse cx="${x1}" cy="${y}" rx="5.2" ry="3" fill="#f29c9c" opacity=".6"/><ellipse cx="${x2}" cy="${y}" rx="5.2" ry="3" fill="#f29c9c" opacity=".6"/>`;
  const smile = (x, y) => `<path d="M${x - 5} ${y}q2.5 3 5 0q2.5 3 5 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
  const ani = (cls, vb, label, inner) => `<svg class="ani ${cls}" viewBox="${vb}" role="img" aria-label="${label}" focusable="false">${inner}</svg>`;
  const deco = (cls, vb, inner) => `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${inner}</svg>`;
  // merged "blob" outline from circles (outline layer + fill layer)
  const blob = (circles, fill) =>
    circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`).join('') +
    circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 2.2}" fill="${fill}"/>`).join('');

  const RABBIT_FUR = '#fbf6ee';
  const rabbitHead = () => G(
    `<g class="ear-l" style="transform-origin:48px 46px"><ellipse cx="46" cy="27" rx="9" ry="22" fill="${RABBIT_FUR}" transform="rotate(-10 46 27)"/><ellipse cx="46" cy="29" rx="4" ry="14" fill="#f4bcbc" stroke="none" transform="rotate(-10 46 29)"/></g>` +
    `<g class="ear-r" style="transform-origin:72px 46px"><ellipse cx="74" cy="27" rx="9" ry="22" fill="${RABBIT_FUR}" transform="rotate(12 74 27)"/><ellipse cx="74" cy="29" rx="4" ry="14" fill="#f4bcbc" stroke="none" transform="rotate(12 74 29)"/></g>`
  );
  const rabbitFace = () =>
    G(`<ellipse cx="60" cy="64" rx="29" ry="25" fill="${RABBIT_FUR}"/>`) +
    eyes(50, 70, 63) + blush(42, 78, 71) +
    `<path d="M57.5 68h5l-2.5 3z" fill="#e58c8c"/>` + smile(60, 72);

  const ART = {
    rabbit: () => ani('rabbit', '0 0 120 130', 'Thỏ con vẫy tay chào',
      rabbitHead() +
      G(`<ellipse cx="60" cy="101" rx="27" ry="22" fill="${RABBIT_FUR}"/>
         <ellipse cx="60" cy="105" rx="15" ry="13" fill="#fff" stroke="none"/>
         <ellipse cx="45" cy="122" rx="11" ry="5.5" fill="${RABBIT_FUR}"/><ellipse cx="75" cy="122" rx="11" ry="5.5" fill="${RABBIT_FUR}"/>
         <ellipse cx="37" cy="97" rx="6" ry="9" fill="${RABBIT_FUR}"/>
         <g class="wave-arm" style="transform-origin:82px 94px"><ellipse cx="88" cy="83" rx="6.5" ry="12" fill="${RABBIT_FUR}" transform="rotate(35 88 83)"/></g>`) +
      rabbitFace()),

    rabbitSign: () => ani('rabbit rabbit-sign', '0 0 120 132', 'Thỏ cầm biển mời HK',
      rabbitHead() +
      G(`<ellipse cx="60" cy="102" rx="27" ry="22" fill="${RABBIT_FUR}"/>
         <ellipse cx="45" cy="124" rx="11" ry="5.5" fill="${RABBIT_FUR}"/><ellipse cx="75" cy="124" rx="11" ry="5.5" fill="${RABBIT_FUR}"/>`) +
      rabbitFace() +
      `<g class="sign-board">` +
      G(`<rect x="14" y="84" width="92" height="38" rx="8" fill="#f3dc94"/><rect x="18" y="88" width="84" height="30" rx="6" fill="none" stroke-width="1" stroke-dasharray="3 3"/>
         <circle cx="22" cy="86" r="6.5" fill="${RABBIT_FUR}"/><circle cx="98" cy="86" r="6.5" fill="${RABBIT_FUR}"/>`) +
      `<text x="60" y="101" text-anchor="middle" font-family="Patrick Hand, cursive" font-size="12" fill="${INK}" textLength="70" lengthAdjust="spacingAndGlyphs">Mời HK ngoan xinh iuuu của HQ nhé,</text>
       <text x="60" y="116" text-anchor="middle" font-family="Patrick Hand, cursive" font-weight="700" font-size="15.5" fill="#c9605c" textLength="40" lengthAdjust="spacingAndGlyphs">HK! ♥</text></g>`),

    bear: () => ani('bear', '0 0 120 130', 'Gấu ôm hũ mật ong',
      G(`<ellipse cx="60" cy="100" rx="31" ry="23" fill="#b07d56"/>
         <ellipse cx="60" cy="104" rx="18" ry="15" fill="#e7b98f" stroke="none"/>
         <ellipse cx="40" cy="121" rx="12" ry="7" fill="#b07d56"/><ellipse cx="80" cy="121" rx="12" ry="7" fill="#b07d56"/>
         <ellipse cx="40" cy="121" rx="5" ry="3" fill="#e7b98f" stroke="none"/><ellipse cx="80" cy="121" rx="5" ry="3" fill="#e7b98f" stroke="none"/>
         <path d="M47 99q-2 17 13 17q15 0 13-17z" fill="#e9b949"/><rect x="45" y="93" width="30" height="7" rx="3.5" fill="#c98f3a"/>
         <circle cx="46" cy="102" r="6.5" fill="#b07d56"/><circle cx="74" cy="102" r="6.5" fill="#b07d56"/>`) +
      `<text x="60" y="111" text-anchor="middle" font-family="Patrick Hand, cursive" font-size="8" font-weight="700" fill="${INK}" textLength="24" lengthAdjust="spacingAndGlyphs">MẬT ONG</text>` +
      `<g class="bear-head" style="transform-origin:60px 86px">` +
      G(`<circle cx="35" cy="40" r="11" fill="#b07d56"/><circle cx="85" cy="40" r="11" fill="#b07d56"/>
         <circle cx="35" cy="40" r="5.5" fill="#e7b98f" stroke="none"/><circle cx="85" cy="40" r="5.5" fill="#e7b98f" stroke="none"/>
         <ellipse cx="60" cy="62" rx="31" ry="27" fill="#b07d56"/>
         <ellipse cx="60" cy="72" rx="13" ry="10" fill="#f1dcc0"/>`) +
      `<ellipse cx="60" cy="67.5" rx="4.6" ry="3.2" fill="#3b2a20"/><path d="M60 70.5v2.5" stroke="${INK}" stroke-width="1.6"/>` +
      smile(60, 74) + eyes(47, 73, 58) + blush(39, 81, 68) + `</g>`),

    giraffe: () => ani('giraffe', '0 0 120 132', 'Hươu cao cổ ló đầu sau tán lá',
      `<g class="giraffe-peek" style="transform-origin:60px 130px">` +
      G(`<path d="M48 72L45 140H75L72 72z" fill="#f0cf7e"/>
         <line x1="51" y1="36" x2="47" y2="20"/><line x1="69" y1="36" x2="73" y2="20"/>
         <circle cx="47" cy="19" r="4.2" fill="#c58b55"/><circle cx="73" cy="19" r="4.2" fill="#c58b55"/>
         <ellipse cx="34" cy="42" rx="11" ry="5.5" fill="#f0cf7e" transform="rotate(-22 34 42)"/><ellipse cx="86" cy="42" rx="11" ry="5.5" fill="#f0cf7e" transform="rotate(22 86 42)"/>
         <ellipse cx="60" cy="52" rx="24" ry="21" fill="#f0cf7e"/>
         <ellipse cx="60" cy="66" rx="16" ry="10.5" fill="#f7e3b5"/>`) +
      `<g fill="#d39a5b"><ellipse cx="52" cy="86" rx="4" ry="3"/><ellipse cx="66" cy="96" rx="4.5" ry="3.4"/><ellipse cx="54" cy="106" rx="3.6" ry="3"/><ellipse cx="44" cy="44" rx="3" ry="2.4"/><ellipse cx="76" cy="40" rx="3.4" ry="2.6"/><ellipse cx="60" cy="35" rx="2.6" ry="2"/></g>` +
      `<circle cx="55" cy="65" r="1.4" fill="#3b2a20"/><circle cx="65" cy="65" r="1.4" fill="#3b2a20"/>` +
      smile(60, 70) + eyes(50, 70, 49) + blush(40, 80, 58) + `</g>` +
      `<g class="bush" stroke="#4f6b4c" stroke-width="1.8">
         <ellipse cx="16" cy="114" rx="26" ry="17" fill="#8fae86"/><ellipse cx="104" cy="112" rx="26" ry="18" fill="#8fae86"/>
         <ellipse cx="60" cy="124" rx="38" ry="15" fill="#a8bf9a"/>
         <ellipse cx="32" cy="101" rx="17" ry="10" fill="#a8bf9a" transform="rotate(-25 32 101)"/><ellipse cx="88" cy="99" rx="17" ry="10" fill="#9cb98f" transform="rotate(25 88 99)"/>
         <path d="M22 104l18-6M80 98l18 6M40 120l14-4" fill="none"/></g>
       <g fill="#f2b8b5" stroke="${INK}" stroke-width="1"><circle cx="24" cy="110" r="3"/><circle cx="96" cy="108" r="3"/><circle cx="62" cy="120" r="3"/></g>`),

    elephant: () => ani('elephant', '0 0 120 130', 'Voi con đang té nước',
      G(`<g class="ear-l" style="transform-origin:42px 58px"><ellipse cx="29" cy="58" rx="18" ry="22" fill="#c6d2dc"/><ellipse cx="31" cy="58" rx="10" ry="14" fill="#f3c5c5" stroke="none"/></g>
         <g class="ear-r" style="transform-origin:78px 58px"><ellipse cx="91" cy="58" rx="18" ry="22" fill="#c6d2dc"/><ellipse cx="89" cy="58" rx="10" ry="14" fill="#f3c5c5" stroke="none"/></g>
         <ellipse cx="60" cy="100" rx="30" ry="21" fill="#b3c2ce"/>
         <rect x="37" y="106" width="13" height="18" rx="6" fill="#b3c2ce"/><rect x="70" y="106" width="13" height="18" rx="6" fill="#b3c2ce"/>
         <circle cx="60" cy="58" r="26" fill="#b3c2ce"/>`) +
      `<g class="trunk" style="transform-origin:60px 72px">
         <path d="M58 72q-2 16 12 18q12 1 14-14" fill="none" stroke="${INK}" stroke-width="12.5" stroke-linecap="round"/>
         <path d="M58 72q-2 16 12 18q12 1 14-14" fill="none" stroke="#b3c2ce" stroke-width="8" stroke-linecap="round"/></g>
       <g fill="#8fc6dd" stroke="${INK}" stroke-width="1"><circle class="drop d1" cx="85" cy="70" r="3"/><circle class="drop d2" cx="83" cy="70" r="2.4"/><circle class="drop d3" cx="86" cy="71" r="2.2"/><circle class="drop d4" cx="84" cy="69" r="2.8"/></g>` +
      eyes(49, 71, 54) + blush(41, 79, 64) + `<path d="M46 72q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`),

    monkey: () => ani('monkey', '0 0 120 132', 'Khỉ con đu cành cây',
      `<path d="M-6 14Q60 2 126 16" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-6 14Q60 2 126 16" stroke="#8a6447" stroke-width="5.5" fill="none" stroke-linecap="round"/>` +
      G(`<ellipse cx="16" cy="8" rx="9" ry="4.5" fill="#a8bf9a" transform="rotate(-25 16 8)"/><ellipse cx="100" cy="8" rx="9" ry="4.5" fill="#8fae86" transform="rotate(20 100 8)"/><ellipse cx="88" cy="20" rx="8" ry="4" fill="#a8bf9a" transform="rotate(30 88 20)"/>`, 1.4) +
      `<g class="swing" style="transform-origin:60px 10px">` +
      `<path d="M60 10Q63 26 60 42" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M60 10Q63 26 60 42" stroke="#9b6b47" stroke-width="4.6" fill="none" stroke-linecap="round"/>` +
      `<path d="M72 100q26 4 21-17q-3-10-10-4" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M72 100q26 4 21-17q-3-10-10-4" fill="none" stroke="#9b6b47" stroke-width="3" stroke-linecap="round"/>` +
      G(`<circle cx="60" cy="11" r="5" fill="#9b6b47"/>
         <ellipse cx="60" cy="92" rx="15" ry="17" fill="#9b6b47"/><ellipse cx="60" cy="95" rx="9" ry="11" fill="#f1d3b0" stroke="none"/>
         <ellipse cx="51" cy="110" rx="6" ry="8" fill="#9b6b47"/><ellipse cx="69" cy="110" rx="6" ry="8" fill="#9b6b47"/>
         <ellipse cx="43" cy="88" rx="5" ry="10" fill="#9b6b47" transform="rotate(22 43 88)"/>
         <circle cx="38" cy="58" r="8" fill="#9b6b47"/><circle cx="82" cy="58" r="8" fill="#9b6b47"/>
         <circle cx="38" cy="58" r="4" fill="#f1d3b0" stroke="none"/><circle cx="82" cy="58" r="4" fill="#f1d3b0" stroke="none"/>
         <circle cx="60" cy="59" r="21" fill="#9b6b47"/>
         <path d="M60 53c-4-8-16-6-15 4c0 8 6 16 15 16c9 0 15-8 15-16c1-10-11-12-15-4z" fill="#f1d3b0"/>`) +
      eyes(53, 67, 58, 3.6) + blush(46, 74, 66) + smile(60, 66) + `</g>`),

    capybara: () => ani('capybara', '0 -14 140 124', 'Chuột lang nước đội quả quýt',
      `<g class="capy-body" style="transform-origin:80px 98px">` +
      G(`<rect x="50" y="86" width="12" height="16" rx="5" fill="#a0774f"/><rect x="98" y="86" width="12" height="16" rx="5" fill="#a0774f"/>
         <ellipse cx="82" cy="72" rx="44" ry="26" fill="#b88a5e"/>`) + `</g>` +
      G(`<ellipse cx="50" cy="45" rx="6.5" ry="5" fill="#a0774f"/>
         <rect x="10" y="44" width="52" height="38" rx="18" fill="#b88a5e"/>
         <rect x="6" y="58" width="26" height="23" rx="11" fill="#a0774f"/>`) +
      `<g class="orange">` + G(`<circle cx="36" cy="37" r="8.5" fill="#f2a65a"/><path d="M36 29q5-6 10-3q-4 6-10 3z" fill="#8fae86"/>`, 1.6) + `</g>` +
      `<path d="M28 58q3 3.4 6.5 0M44 58q3 3.4 6.5 0" fill="none" stroke="#3b2a20" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="12" cy="64" r="1.5" fill="#3b2a20"/><circle cx="19" cy="64" r="1.5" fill="#3b2a20"/>` +
      `<ellipse cx="30" cy="67" rx="4.6" ry="2.6" fill="#f29c9c" opacity=".6"/><ellipse cx="52" cy="66" rx="4.6" ry="2.6" fill="#f29c9c" opacity=".6"/>` +
      `<path d="M12 72q3.5 2.6 7 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<g class="zzz" font-family="Patrick Hand, cursive" font-weight="700" fill="#6f8f6a"><text x="64" y="30" font-size="12">z</text><text x="74" y="18" font-size="15">z</text><text x="86" y="4" font-size="19">Z</text></g>`),

    bird: (c = '#f2b8b5') => deco('bird', '0 0 52 38',
      G(`<path class="wing" style="transform-origin:25px 21px" d="M24 18C20 6 14 2 6 2C10 12 16 18 24 22Z" fill="${c}" opacity=".75"/>
         <path d="M13 22l-9-3l4 7z" fill="${c}"/><ellipse cx="25" cy="23" rx="13" ry="9" fill="${c}"/><circle cx="36" cy="17" r="7.5" fill="${c}"/>
         <path d="M43 15.6l7 2.4l-7 2.4z" fill="#e9b949"/>
         <path class="wing" style="transform-origin:25px 21px" d="M26 20C24 6 18 0 8 0C12 12 18 20 26 24Z" fill="#fff8ee"/>`, 1.5) +
      `<circle cx="38" cy="16" r="1.5" fill="#3b2a20"/><ellipse cx="34" cy="21" rx="2.4" ry="1.4" fill="#f29c9c" opacity=".7"/>`),

    tree: (c = '#9cb98f') => deco('tree', '0 0 120 170',
      G(`<path d="M50 170C54 140 54 120 50 96L70 96C66 120 66 140 70 170Z" fill="#8a6447"/><path d="M58 150q-8-6-10-14M62 160q8-4 11-12" fill="none" stroke-width="1.5"/>`) +
      blob([[60, 52, 40], [28, 76, 26], [92, 74, 26], [60, 90, 24], [38, 32, 22], [84, 34, 22]], c) +
      `<path d="M38 46q8-6 16-2M70 70q8-4 14 0M30 80q6-4 12-1" stroke="#6f8f6a" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
      `<g fill="#f2b8b5" stroke="${INK}" stroke-width="1.2"><circle cx="44" cy="62" r="4"/><circle cx="80" cy="50" r="4"/><circle cx="62" cy="84" r="4"/><circle cx="94" cy="80" r="3.5"/><circle cx="26" cy="72" r="3.5"/></g>`),

    flower: (c = '#f2b8b5') => deco('flower', '0 0 40 64',
      `<path d="M20 64C18 50 22 40 20 26" stroke="#6f8f6a" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
      `<path d="M20 50C12 46 8 48 5 42C13 39 18 43 20 50Z" fill="#a8bf9a" stroke="#6f8f6a" stroke-width="1.4"/>` +
      `<path d="M20 44C27 40 31 42 34 37C27 34 22 38 20 44Z" fill="#8fae86" stroke="#6f8f6a" stroke-width="1.4"/>` +
      `<g class="bloom">` + [[20, 11], [28.6, 17.2], [25.3, 27.3], [14.7, 27.3], [11.4, 17.2]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="6.6" fill="${c}" stroke="${INK}" stroke-width="1.4"/>`).join('') +
      `<circle cx="20" cy="20" r="4.6" fill="#e9cf7a" stroke="${INK}" stroke-width="1.4"/></g>`),

    mushroom: () => deco('mushroom', '0 0 60 56',
      G(`<path d="M22 55C20 45 22 37 24 30H36C38 37 40 45 38 55Z" fill="#fbf3e2"/><path d="M4 32C4 11 56 11 56 32C46 37 14 37 4 32Z" fill="#e99a92"/>`, 1.8) +
      `<g fill="#fff8ee"><circle cx="17" cy="24" r="3.6"/><circle cx="31" cy="18" r="3"/><circle cx="44" cy="25" r="3.3"/></g>`),

    pond: () => deco('pond', '0 0 200 80',
      `<ellipse cx="100" cy="44" rx="96" ry="30" fill="#a9cfc6" stroke="${INK}" stroke-width="2.2"/>` +
      `<ellipse cx="100" cy="46" rx="80" ry="20" fill="#bfdcd2"/>` +
      `<ellipse class="ripple" cx="78" cy="48" rx="26" ry="6" fill="none" stroke="#fff" stroke-width="1.8"/>` +
      `<ellipse class="ripple r2" cx="128" cy="40" rx="18" ry="4.5" fill="none" stroke="#fff" stroke-width="1.6"/>` +
      G(`<path d="M152 52a13 7.5 0 1 1-2-7.5l-11 5z" fill="#8fae86"/><path d="M48 36a10 6 0 1 1-2-6l-8 4z" fill="#a8bf9a"/>`, 1.6) +
      `<g transform="translate(150 46)" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"><path d="M0 0C-9-2-12-8-10-12C-4-10-1-5 0 0Z" fill="#f6cfcc"/><path d="M0 0C9-2 12-8 10-12C4-10 1-5 0 0Z" fill="#f6cfcc"/><path d="M0 0C-6-4-6-12 0-17C6-12 6-4 0 0Z" fill="#f2b8b5"/></g>`),

    canopy: () => deco('canopy', '0 0 300 60',
      blob([[10, 6, 30], [52, 0, 30], [96, 8, 28], [140, 0, 32], [186, 8, 28], [232, 0, 30], [278, 8, 32]], '#9cb98f') +
      `<path d="M70 28q5 18-2 34M236 30q-5 14 2 28" stroke="#6f8f6a" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<g fill="#a8bf9a" stroke="#6f8f6a" stroke-width="1.2"><ellipse cx="71" cy="46" rx="5" ry="2.6" transform="rotate(30 71 46)"/><ellipse cx="236" cy="46" rx="5" ry="2.6" transform="rotate(-30 236 46)"/></g>`),

    butterfly: (c = '#f2b8b5', c2 = '#e9cf7a') => deco('butterfly', '0 0 40 34',
      `<g class="wing-l" style="transform-origin:20px 17px">` + G(`<ellipse cx="11" cy="11" rx="9" ry="8" fill="${c}"/><ellipse cx="13" cy="24" rx="6" ry="6" fill="${c2}"/>`, 1.4) + `</g>` +
      `<g class="wing-r" style="transform-origin:20px 17px">` + G(`<ellipse cx="29" cy="11" rx="9" ry="8" fill="${c}"/><ellipse cx="27" cy="24" rx="6" ry="6" fill="${c2}"/>`, 1.4) + `</g>` +
      `<ellipse cx="20" cy="18" rx="1.9" ry="9" fill="${INK}"/><path d="M19 10q-3-6-6-7M21 10q3-6 6-7" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`),

    leaf: (c = '#a8bf9a') => deco('leaf', '0 0 20 30',
      `<path d="M10 1C19 9 19 22 10 29C1 22 1 9 10 1Z" fill="${c}" stroke="#6f8f6a" stroke-width="1.3"/><path d="M10 4V27M10 12l-4-3M10 17l4-3M10 22l-4-3" stroke="#6f8f6a" stroke-width="1" fill="none"/>`),

    sprig: () => deco('sprig', '0 0 120 120',
      `<path d="M6 116C26 86 46 58 104 10" fill="none" stroke="#6f8f6a" stroke-width="2" stroke-linecap="round"/>` +
      [[22, 88, -60], [26, 98, 20], [38, 70, -70], [44, 80, 10], [54, 52, -70], [62, 62, 0], [72, 36, -70], [80, 46, -5], [92, 22, -70]].map(([x, y, a]) =>
        `<ellipse cx="${x}" cy="${y}" rx="10" ry="4.6" transform="rotate(${a} ${x} ${y})" fill="#a8bf9a" stroke="#6f8f6a" stroke-width="1.2"/>`).join('') +
      `<g fill="#f2b8b5" stroke="${INK}" stroke-width="1"><circle cx="106" cy="8" r="3.4"/><circle cx="98" cy="30" r="2.8"/><circle cx="16" cy="104" r="2.6"/></g>`),

    flourish: () => deco('flourish-svg', '0 0 240 26',
      `<g fill="none" stroke="#8a6447" stroke-width="1.6" stroke-linecap="round"><path d="M6 13C40 13 52 3 72 7C88 10 86 22 74 20C66 18 70 10 80 11C92 12 98 13 106 13"/><path d="M234 13C200 13 188 3 168 7C152 10 154 22 166 20C174 18 170 10 160 11C148 12 142 13 134 13"/></g>` +
      `<g transform="translate(120 13)" stroke="${INK}" stroke-width="1">` + [0, 72, 144, 216, 288].map(a => {
        const r = a * Math.PI / 180; return `<circle cx="${(Math.sin(r) * 5).toFixed(2)}" cy="${(-Math.cos(r) * 5).toFixed(2)}" r="4" fill="#f2b8b5"/>`;
      }).join('') + `<circle r="3" fill="#e9cf7a"/></g>`),

    garland: () => {
      const cols = ['#f2b8b5', '#e9cf7a', '#a8bf9a', '#fbf3e2', '#d9b8d6'];
      let flags = '';
      for (let i = 0; i < 14; i++) {
        const t = (i + .5) / 14, x = 400 * t, y = (1 - t) ** 2 * 6 + 2 * (1 - t) * t * 46 + t * t * 6;
        flags += `<path d="M${(x - 9).toFixed(1)} ${y.toFixed(1)}L${(x + 9).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y + 20).toFixed(1)}Z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
      }
      return deco('garland', '0 0 400 70', `<path d="M0 6Q200 46 400 6" fill="none" stroke="${INK}" stroke-width="1.6"/>` + flags);
    }
  };

  const hydrate = (root = document) => {
    $$('[data-art]', root).forEach(el => {
      const [name, ...args] = el.dataset.art.split(':');
      if (ART[name]) el.innerHTML = ART[name](...args);
    });
  };

  /* =======================================================
     2. ADVENTURE MAP STOPS
     ======================================================= */
  const pos = (html, style, cls = '') => `<div class="pos ${cls}" style="${style}">${html}</div>`;
  const STOPS = [
    {
      name: 'Cổng Hang Thỏ', who: 'Thỏ Mochi',
      msg: "Chào HK! 👋 Chuyến phiêu lưu chính thức bắt đầu… ngay bây giờ!",
      scene: () => pos(ART.tree('#9cb98f'), 'left:-7%;bottom:12%;width:34%') +
        pos(ART.flower('#f2b8b5'), 'left:70%;bottom:9%;width:8%') + pos(ART.flower('#e9cf7a'), 'left:79%;bottom:11%;width:7%') +
        pos(ART.mushroom(), 'left:86%;bottom:9%;width:11%') +
        pos(ART.rabbit(), 'left:33%;bottom:5%;width:36%', 'animal'),
      side: () => `<span>${ART.mushroom()}</span><span>${ART.flower('#d9b8d6')}</span>`
    },
    {
      name: 'Cây Sồi Mật Ong', who: 'Gấu Bobo',
      msg: "Mình giữ cho HK chỗ mát nhất rồi. Đồ ăn vặt là bắt buộc nha. 🍯",
      scene: () => pos(ART.tree('#8fae86'), 'right:-6%;bottom:8%;width:50%') +
        pos(ART.butterfly('#e9cf7a', '#f2b8b5'), 'left:58%;top:14%;width:10%', 'bf-mini') +
        pos(ART.flower('#f2b8b5'), 'left:6%;bottom:9%;width:8%') +
        pos(ART.bear(), 'left:14%;bottom:4%;width:40%', 'animal'),
      side: () => `<span>${ART.flower('#f2b8b5')}</span><span>${ART.flower('#e9cf7a')}</span>`
    },
    {
      name: 'Lá Thì Thầm', who: 'Hươu Gigi',
      msg: "Suỵt… Từ trên này nhìn thấy cả vườn thú. Có HK ở đây còn đẹp hơn nữa. 🌿",
      scene: () => pos(ART.tree('#a8bf9a'), 'left:-9%;bottom:16%;width:32%') +
        pos(ART.tree('#8fae86'), 'right:-9%;bottom:20%;width:28%') +
        pos(ART.giraffe(), 'left:27%;bottom:-3%;width:46%', 'animal'),
      side: () => `<span>${ART.tree('#a8bf9a')}</span>`
    },
    {
      name: 'Suối Té Nước', who: 'Voi Pip',
      msg: "Tõm tõm! Yên tâm, mình chỉ té nước HK một xíu thôi. 💦",
      scene: () => pos(ART.pond(), 'left:32%;bottom:3%;width:66%') +
        pos(ART.flower('#d9b8d6'), 'left:88%;bottom:30%;width:7%') +
        pos(ART.elephant(), 'left:7%;bottom:6%;width:40%', 'animal'),
      side: () => `<span>${ART.flower('#fbf3e2')}</span><span>${ART.mushroom()}</span>`
    },
    {
      name: 'Dây Leo Đu Đưa', who: 'Khỉ Kiki',
      msg: "Wheee! Luật số 1 khi phiêu lưu: cười ít nhất một trăm lần. 🍌",
      scene: () => pos(ART.canopy(), 'left:-4%;top:-6%;width:108%') +
        pos(ART.flower('#f2b8b5'), 'left:12%;bottom:8%;width:8%') + pos(ART.mushroom(), 'left:78%;bottom:7%;width:12%') +
        pos(ART.monkey(), 'left:24%;top:8%;width:52%', 'animal'),
      side: () => `<span>${ART.mushroom()}</span><span>${ART.flower('#f2b8b5')}</span>`
    },
    {
      name: 'Hồ Sen Lười', who: 'Capybara Quýt',
      msg: "Cứ thong thả thôi HK. Khoảnh khắc đẹp nhất chẳng bao giờ cần vội. 🍊",
      scene: () => pos(ART.pond(), 'left:38%;bottom:4%;width:62%') +
        pos(ART.butterfly('#d9b8d6', '#f2b8b5'), 'left:70%;top:16%;width:10%', 'bf-mini') +
        pos(ART.capybara(), 'left:4%;bottom:8%;width:54%', 'animal'),
      side: () => `<span>${ART.flower('#e9cf7a')}</span><span>${ART.flower('#f2b8b5')}</span>`
    }
  ];

  const buildStops = () => {
    $('#stops').innerHTML = STOPS.map((s, i) => `
      <div class="stop ${i % 2 ? 'right' : 'left'}" data-i="${i}">
        <div class="bubble" role="status"><strong>${s.who}</strong>${s.msg}</div>
        <div class="scene" aria-hidden="true">${s.scene()}</div>
        <button class="sign" type="button" aria-expanded="false" aria-label="${s.name}: chào ${s.who}">
          <span class="sign-name">${s.name}</span><span class="sign-hint">chạm để chào</span>
        </button>
        <div class="side-deco" aria-hidden="true">${s.side()}</div>
      </div>`).join('');
  };

  /* =======================================================
     3. TOAST
     ======================================================= */
  let toastTimer;
  const toast = msg => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  };

  /* =======================================================
     4. MUSIC (gentle music-box lullaby via Web Audio — no files)
     ======================================================= */
  const Music = (() => {
    let ctx = null, master = null, timer = null, step = 0, next = 0, on = false;
    const STEP = 0.3;
    const MEL = [
      72, 0, 76, 0, 79, 0, 76, 0, 77, 0, 76, 74, 72, 0, 0, 0,
      74, 0, 77, 0, 81, 0, 79, 0, 77, 76, 74, 0, 76, 0, 0, 0,
      72, 0, 76, 0, 79, 0, 84, 0, 83, 0, 81, 79, 77, 0, 76, 0,
      74, 0, 77, 76, 74, 0, 71, 0, 72, 0, 0, 0, 0, 0, 0, 0
    ];
    const BASS = [48, 53, 50, 55, 48, 53, 55, 48];
    const freq = m => 440 * Math.pow(2, (m - 69) / 12);

    const init = () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      const delay = ctx.createDelay(); delay.delayTime.value = STEP * 1.5;
      const fb = ctx.createGain(); fb.gain.value = .22;
      const wet = ctx.createGain(); wet.gain.value = .25;
      master.connect(lp); lp.connect(ctx.destination);
      lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
      return true;
    };
    const note = (m, t, dur, vol, type) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq(m);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.05);
    };
    const schedule = () => {
      while (next < ctx.currentTime + 0.25) {
        const m = MEL[step % MEL.length];
        if (m) { note(m, next, 1.4, .3, 'triangle'); note(m + 12, next, .7, .05, 'sine'); }
        const bar = Math.floor(step / 8) % BASS.length;
        if (step % 8 === 0) note(BASS[bar], next, 2.2, .2, 'sine');
        if (step % 8 === 4) { note(BASS[bar] + 7, next, 1.4, .1, 'sine'); note(BASS[bar] + 12, next + STEP, 1.2, .08, 'sine'); }
        next += STEP; step++;
      }
    };
    const start = () => {
      if (!ctx && !init()) { toast('Trình duyệt này không hỗ trợ nhạc'); return; }
      ctx.resume();
      if (!timer) { next = ctx.currentTime + 0.1; timer = setInterval(schedule, 80); }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(.55, ctx.currentTime, .4);
      on = true;
    };
    const stop = () => {
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, .2);
      clearInterval(timer); timer = null; on = false;
    };
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
    return { start, stop, get on() { return on; } };
  })();

  const musicBtn = $('#musicBtn');
  const syncMusicUI = () => {
    musicBtn.classList.toggle('on', Music.on);
    musicBtn.setAttribute('aria-pressed', String(Music.on));
    musicBtn.setAttribute('aria-label', Music.on ? 'Tắt nhạc' : 'Bật nhạc');
    $('.music-label', musicBtn).textContent = Music.on ? 'Nhạc: bật' : 'Nhạc: tắt';
  };
  musicBtn.addEventListener('click', () => {
    if (Music.on) { Music.stop(); store.set('hk-music', 'off'); }
    else { Music.start(); store.set('hk-music', 'on'); }
    syncMusicUI();
  });

  /* =======================================================
     5. CHAPTER 1 — THE BOOK
     ======================================================= */
  const book = $('#book');
  const stage = $('#coverStage');
  const leaves = $$('.leaf', book);
  const beginBtn = $('#beginBtn');
  const hint = $('#hint');
  let opened = false;

  const computeOpenLayout = () => {
    const W = $('#bookWrap').offsetWidth;
    const s = clamp((window.innerWidth * 0.94) / (2 * W), 0.45, 1);
    stage.style.setProperty('--open-scale', s.toFixed(3));
    book.style.setProperty('--open-scale', s.toFixed(3));
    // Rabbit hops to the right edge of the open spread, but stays on screen
    const rabbit = $('#coverRabbit');
    const prev = rabbit.style.transform; rabbit.style.transform = 'none';
    const rr = rabbit.getBoundingClientRect();
    rabbit.style.transform = prev;
    const desired = W * s - W / 2;
    const maxShift = window.innerWidth - 6 - rr.right;
    stage.style.setProperty('--rabbit-shift', `${Math.round(Math.min(desired, maxShift))}px`);
  };

  const scrollToEl = el => el && el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });

  let flippedCount = 0, unlocked = false;
  const leafTimers = [];
  const FLIP_MS = () => (reduced() ? 0 : 1100);

  const updateHint = () => {
    if (!opened) return;
    if (flippedCount < leaves.length) {
      hint.textContent = flippedCount === 0
        ? 'Chạm vào trang bên phải để lật trang 👉'
        : `Lật tiếp nào 👉 (trang ${flippedCount + 1}/${leaves.length + 1})`;
    } else {
      hint.textContent = 'Cuộn xuống hoặc chạm “Bắt đầu” để đọc tiếp ↓';
    }
    book.classList.toggle('can-flip', flippedCount < leaves.length);
  };

  const unlockStory = () => {
    if (unlocked) return;
    unlocked = true;
    document.body.classList.remove('is-locked');
    requestAnimationFrame(() => { buildTrail(); onScroll(); });
  };

  const flipNext = () => {
    if (!opened || flippedCount >= leaves.length) return;
    const i = flippedCount++;
    const leaf = leaves[i];
    clearTimeout(leafTimers[i]);
    leaf.style.zIndex = 30 + i;
    leaf.classList.add('flipped');
    if (flippedCount === leaves.length) {
      beginBtn.tabIndex = 0;
      setTimeout(unlockStory, FLIP_MS());
    }
    updateHint();
  };

  const flipPrev = () => {
    if (!opened || flippedCount === 0) return;
    const i = --flippedCount;
    const leaf = leaves[i];
    leaf.classList.remove('flipped');
    clearTimeout(leafTimers[i]);
    leafTimers[i] = setTimeout(() => { if (!leaf.classList.contains('flipped')) leaf.style.zIndex = ''; }, FLIP_MS());
    beginBtn.tabIndex = -1;
    updateHint();
  };

  const openBook = () => {
    if (opened) return;
    opened = true;
    flippedCount = 0;
    computeOpenLayout();
    if (store.get('hk-music') !== 'off') { Music.start(); syncMusicUI(); }
    book.classList.add('open');
    stage.classList.add('opened');
    book.setAttribute('aria-label', 'Sách đang mở — nhấn Enter hoặc mũi tên phải để lật trang, mũi tên trái để lật lại');
    hint.textContent = 'Ngày xửa ngày xưa…';
    setTimeout(updateHint, FLIP_MS());
  };

  const closeBook = () => {
    opened = false;
    flippedCount = 0;
    book.classList.remove('open', 'can-flip');
    stage.classList.remove('opened');
    leaves.forEach((l, i) => { clearTimeout(leafTimers[i]); l.classList.remove('flipped'); });
    setTimeout(() => leaves.forEach(l => { l.style.zIndex = ''; }), FLIP_MS());
    book.setAttribute('aria-label', 'Mở sách truyện');
    beginBtn.tabIndex = -1;
    hint.textContent = 'Chạm vào sách để mở lại nhé ✨';
  };

  book.addEventListener('click', e => {
    if (!opened) { openBook(); return; }
    if (e.target.closest('#beginBtn')) { scrollToEl($('#ch2')); return; }
    // spine = left edge of the right page: click right side → next, left side → back
    const spine = $('.page-right', book).getBoundingClientRect().left;
    if (e.clientX >= spine) flipNext(); else flipPrev();
  });
  book.addEventListener('keydown', e => {
    if (e.target.closest('#beginBtn')) return;
    if (!opened) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBook(); }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); flipPrev(); }
  });

  $$('[data-next]').forEach(btn => btn.addEventListener('click', () => scrollToEl($(btn.dataset.next))));

  /* =======================================================
     6. FIREFLIES
     ======================================================= */
  const fireflies = (el, n) => {
    if (!el) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'firefly';
      s.style.left = `${rand(2, 98)}%`;
      s.style.top = `${rand(4, 96)}%`;
      s.style.setProperty('--dx', `${rand(-70, 70).toFixed(0)}px`);
      s.style.setProperty('--dy', `${rand(-60, 60).toFixed(0)}px`);
      s.style.animationDuration = `${rand(6, 12).toFixed(1)}s, ${rand(1.4, 3).toFixed(1)}s`;
      s.style.animationDelay = `-${rand(0, 10).toFixed(1)}s, -${rand(0, 3).toFixed(1)}s`;
      frag.appendChild(s);
    }
    el.appendChild(frag);
  };

  /* =======================================================
     7. WINDING TRAIL (built from real stop positions)
     ======================================================= */
  const map = $('#map');
  const trail = $('#trail');
  const road = $('#trailRoad');
  const edge = $('#trailEdge');
  const pawsG = $('#paws');
  const traveler = $('#traveler');
  let trailLen = 0, paws = [], pawIdx = 0;

  const buildTrail = () => {
    const W = map.clientWidth, H = map.offsetHeight;
    if (!W || !H) return;
    trail.setAttribute('width', W);
    trail.setAttribute('height', H);
    trail.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const pts = [[W / 2, 40]];
    $$('.stop', map).forEach(stop => {
      const sign = $('.sign', stop);
      pts.push([stop.offsetLeft + stop.offsetWidth / 2, stop.offsetTop + sign.offsetTop + sign.offsetHeight / 2]);
    });
    const end = $('.map-end', map);
    pts.push([W / 2, end.offsetTop + 20]);

    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const dy = (y1 - y0) * 0.55;
      const bulge = (i % 2 ? 1 : -1) * Math.min(W * 0.08, 60);
      d += ` C${(x0 + bulge).toFixed(1)} ${(y0 + dy).toFixed(1)} ${(x1 - bulge).toFixed(1)} ${(y1 - dy).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    road.setAttribute('d', d);
    edge.setAttribute('d', d);
    trailLen = road.getTotalLength();
    [road, edge].forEach(p => { p.style.strokeDasharray = `${trailLen} ${trailLen}`; });

    // little footprints along the trail
    const NS = 'http://www.w3.org/2000/svg';
    pawsG.textContent = '';
    paws = [];
    const frag = document.createDocumentFragment();
    for (let l = 30, k = 0; l < trailLen - 10; l += 30, k++) {
      const p = road.getPointAtLength(l), q = road.getPointAtLength(Math.min(l + 1, trailLen));
      const ang = Math.atan2(q.y - p.y, q.x - p.x);
      const off = (k % 2 ? 5 : -5);
      const x = p.x + Math.cos(ang + Math.PI / 2) * off, y = p.y + Math.sin(ang + Math.PI / 2) * off;
      const e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1));
      e.setAttribute('rx', '2.6'); e.setAttribute('ry', '4');
      e.setAttribute('transform', `rotate(${(ang * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`);
      frag.appendChild(e);
      paws.push({ el: e, l });
    }
    pawsG.appendChild(frag);
    pawIdx = 0;
    updateTrail(true);
  };

  const updateTrail = (force) => {
    if (!trailLen) return;
    const r = map.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = reduced() ? 1 : clamp((vh * 0.62 - r.top) / r.height, 0, 1);
    const L = trailLen * p;
    const off = (trailLen - L).toFixed(1);
    road.style.strokeDashoffset = off;
    edge.style.strokeDashoffset = off;
    const pt = road.getPointAtLength(Math.max(L, 0.01));
    traveler.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    traveler.style.opacity = p > 0.002 ? '1' : '0';
    if (force) { pawIdx = 0; paws.forEach(pw => pw.el.classList.remove('on')); }
    while (pawIdx < paws.length && paws[pawIdx].l <= L) paws[pawIdx++].el.classList.add('on');
    while (pawIdx > 0 && paws[pawIdx - 1].l > L) paws[--pawIdx].el.classList.remove('on');
  };

  /* =======================================================
     8. STOPS — interaction & stamps
     ======================================================= */
  const collected = new Set();
  const collect = i => {
    if (collected.has(i)) return;
    collected.add(i);
    $$('#stampDots i')[i].classList.add('on');
    $('#stampCount').textContent = collected.size;
    if (collected.size === STOPS.length) {
      $('#passport').classList.add('complete');
      toast('Đủ 6 con dấu rồi! 🏅 Nhà thám hiểm chính thức: HK');
    }
  };
  const hop = el => {
    if (!el || reduced()) return;
    el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
  };
  const toggleStop = stop => {
    const willOpen = !stop.classList.contains('open');
    $$('.stop.open', map).forEach(s => { s.classList.remove('open'); $('.sign', s).setAttribute('aria-expanded', 'false'); });
    if (willOpen) {
      stop.classList.add('open', 'visited');
      $('.sign', stop).setAttribute('aria-expanded', 'true');
      hop($('.animal', stop));
      collect(+stop.dataset.i);
    }
  };
  map.addEventListener('click', e => {
    const trigger = e.target.closest('.sign, .scene');
    if (!trigger) return;
    toggleStop(trigger.closest('.stop'));
  });
  map.addEventListener('animationend', e => { if (e.target.classList.contains('hop')) e.target.classList.remove('hop'); });

  /* =======================================================
     9. TICKET — editable plan
     ======================================================= */
  const T = { date: $('#tDate'), time: $('#tTime'), place: $('#tPlace') };
  const KEY = 'hk-ticket';
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const nextSaturday = () => {
    const d = new Date();
    d.setDate(d.getDate() + (((6 - d.getDay()) + 7) % 7 || 7));
    return isoDate(d);
  };
  const parseDate = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const prettyDate = iso => {
    const d = parseDate(iso);
    return d ? d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' }) : 'Ngày sẽ chốt sau';
  };
  const vals = () => ({ date: T.date.value, time: T.time.value, place: T.place.value.trim() });

  const loadTicket = () => {
    let saved = {};
    try { saved = JSON.parse(store.get(KEY) || '{}') || {}; } catch (e) { saved = {}; }
    const q = new URLSearchParams(location.search);
    const v = {
      date: nextSaturday(), time: '16:00', place: 'Cổng chính · Đường Nguyễn Bỉnh Khiêm',
      ...saved
    };
    if (q.get('date') && parseDate(q.get('date'))) v.date = q.get('date');
    if (q.get('time') && /^\d{2}:\d{2}$/.test(q.get('time'))) v.time = q.get('time');
    if (q.get('place')) v.place = q.get('place').slice(0, 70);
    T.date.value = v.date; T.time.value = v.time; T.place.value = v.place;
    updateStub();
  };
  const updateStub = () => {
    const d = parseDate(T.date.value);
    $('#stubDate').textContent = d
      ? `${d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}${T.time.value ? ' · ' + T.time.value : ''}`
      : '—';
  };
  let saveTimer;
  Object.values(T).forEach(inp => inp.addEventListener('input', () => {
    updateStub();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set(KEY, JSON.stringify(vals())), 250);
  }));
  Object.values(T).forEach(inp => inp.addEventListener('change', () => toast('Đã lưu ✿')));

  const ticket = $('#ticket');
  const stampBtn = $('#stampBtn');
  const setStamp = on => {
    ticket.classList.toggle('stamped', on);
    stampBtn.textContent = on ? 'Bỏ dấu ↺' : 'Đóng dấu 💮';
  };
  stampBtn.addEventListener('click', () => {
    const on = !ticket.classList.contains('stamped');
    setStamp(on);
    if (on) toast('Chuyến phiêu lưu đã được duyệt! 💮');
  });

  const downloadICS = () => {
    const { date, time, place } = vals();
    const d = parseDate(date);
    if (!d) { toast('Chọn ngày trước nhé 🗓️'); T.date.focus(); return; }
    const [hh, mm] = (time || '08:30').split(':').map(Number);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh || 0, mm || 0);
    const end = new Date(start.getTime() + 4 * 3600e3);
    const f = dt => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    const esc = s => String(s).replace(/([,;\\])/g, '\\$1');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//A Little Adventure for HK//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:hk-adventure-${Date.now()}@storybook`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${f(start)}`,
      `DTEND:${f(end)}`,
      `SUMMARY:${esc('Chuyến Phiêu Lưu Nhỏ Cho HK 🐾')}`,
      `LOCATION:${esc('Thảo Cầm Viên Sài Gòn' + (place ? ' – ' + place : ''))}`,
      `DESCRIPTION:${esc('Hươu cao cổ, voi, chuột lang nước… và kem. Hẹn gặp HK ở đó nhé! 💕')}`,
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Sắp đến giờ phiêu lưu rồi!', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'little-adventure-hk.ics';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 800);
    toast('Đã lưu file lịch 💌');
  };
  $('#icsBtn').addEventListener('click', downloadICS);

  const copyText = async text => {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) { /* fall through */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  };
  $('#linkBtn').addEventListener('click', async () => {
    const { date, time, place } = vals();
    const q = new URLSearchParams();
    if (date) q.set('date', date);
    if (time) q.set('time', time);
    if (place) q.set('place', place);
    const link = `${location.href.split(/[?#]/)[0]}?${q.toString()}`;
    const ok = await copyText(link);
    toast(ok ? 'Đã sao chép link mời — gửi cho HK thôi! 🔗' : 'Không sao chép tự động được — hãy copy thanh địa chỉ nhé.');
  });

  /* =======================================================
     10. CELEBRATION
     ======================================================= */
  const Confetti = (() => {
    const c = $('#confetti');
    const ctx = c.getContext('2d');
    const COLS = ['#f2b8b5', '#e9cf7a', '#a8bf9a', '#e08f8c', '#fff3c4', '#d9b8d6', '#8fc6dd'];
    let parts = [], raf = 0, W = 0, H = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const heart = (r) => {
      ctx.beginPath();
      ctx.moveTo(0, r * .35);
      ctx.bezierCurveTo(-r, -r * .3, -r * .45, -r, 0, -r * .45);
      ctx.bezierCurveTo(r * .45, -r, r, -r * .3, 0, r * .35);
      ctx.fill();
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter(p => p.y < H + 40 && p.life < 420);
      for (const p of parts) {
        p.life++;
        p.vy = p.vy * 0.985 + 0.2;
        p.vx *= 0.985;
        p.x += p.vx + Math.sin(p.life * 0.08 + p.seed) * 0.7;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.shape === 0) ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.r / 2.4, 0, Math.PI * 2); ctx.fill(); }
        else heart(p.r * 0.9);
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(tick);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    };
    const burst = (n = 170) => {
      size();
      for (let i = 0; i < n; i++) {
        const fromSide = i % 2;
        parts.push({
          x: fromSide ? (i % 4 === 1 ? -10 : W + 10) : W / 2 + rand(-W * .15, W * .15),
          y: fromSide ? H * rand(.5, .8) : H * .6,
          vx: fromSide ? (i % 4 === 1 ? rand(4, 12) : rand(-12, -4)) : rand(-7, 7),
          vy: rand(-17, -8),
          r: rand(7, 13), rot: rand(0, 6), vr: rand(-.2, .2), seed: rand(0, 6),
          c: COLS[i % COLS.length], shape: i % 3, life: 0
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('resize', () => { if (raf) size(); });
    return { burst };
  })();

  const floatHearts = (n = 30) => {
    const box = $('#hearts');
    const EM = ['💗', '💕', '💖', '🌸', '✿', '💞', '🐾', '🌼'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'float-heart';
      s.textContent = EM[i % EM.length];
      s.style.left = `${rand(2, 96)}vw`;
      s.style.fontSize = `${rand(18, 44).toFixed(0)}px`;
      s.style.animationDuration = `${rand(3.6, 6.4).toFixed(1)}s`;
      s.style.animationDelay = `${rand(0, 1.4).toFixed(2)}s`;
      s.style.setProperty('--drift', `${rand(-90, 90).toFixed(0)}px`);
      s.addEventListener('animationend', () => s.remove(), { once: true });
      frag.appendChild(s);
    }
    box.appendChild(frag);
  };

  const celebrate = $('#celebrate');
  let lastFocus = null;
  const openCelebrate = () => {
    const { date, time, place } = vals();
    $('#celebrateDetails').innerHTML =
      `📅 <strong>${prettyDate(date)}</strong>${time ? ` · ⏰ <strong>${time}</strong>` : ''}<br>📍 ${place ? place.replace(/[<>&]/g, '') : 'Thảo Cầm Viên Sài Gòn'}`;
    lastFocus = document.activeElement;
    celebrate.hidden = false;
    $('#ccClose').focus({ preventScroll: true });
  };
  const closeCelebrate = () => {
    celebrate.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  $$('[data-answer]').forEach(btn => btn.addEventListener('click', () => {
    store.set('hk-answer', btn.dataset.answer);
    $('#clearing').classList.add('party');
    setStamp(true);
    if (!reduced()) { Confetti.burst(); floatHearts(); setTimeout(() => Confetti.burst(90), 900); }
    if (!Music.on && store.get('hk-music') !== 'off') { Music.start(); syncMusicUI(); }
    setTimeout(openCelebrate, reduced() ? 0 : 650);
  }));
  $('#ccClose').addEventListener('click', closeCelebrate);
  $('#ccIcs').addEventListener('click', downloadICS);
  $('#ccAgain').addEventListener('click', () => {
    closeCelebrate();
    $('#clearing').classList.remove('party');
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    setTimeout(closeBook, reduced() ? 0 : 900);
  });
  celebrate.addEventListener('click', e => { if (e.target === celebrate) closeCelebrate(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !celebrate.hidden) closeCelebrate();
    if (e.key === 'Escape') $$('.stop.open', map).forEach(s => toggleStop(s));
  });
  // simple focus trap inside the dialog
  celebrate.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button', celebrate);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* =======================================================
     11. SCROLL: observers, progress ribbon, trail
     ======================================================= */
  const ribbon = $('#ribbonFill');
  let ticking = false, mapVisible = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ribbon.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max, 0, 1) : 0})`;
      if (mapVisible) updateTrail();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const setupObservers = () => {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal, .turn, .stop').forEach(el => el.classList.add('in-view'));
      $$('.chapter').forEach(c => c.classList.add('is-visible'));
      mapVisible = true;
      return;
    }
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in-view'); revealIO.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .turn, .stop').forEach(el => revealIO.observe(el));

    const chapterIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        en.target.classList.toggle('is-visible', en.isIntersecting);
        if (en.target.id === 'ch3') { mapVisible = en.isIntersecting; if (mapVisible) updateTrail(); }
      });
    }, { threshold: 0, rootMargin: '120px 0px' });
    $$('.chapter').forEach(c => chapterIO.observe(c));
  };

  /* =======================================================
     12. RESIZE handling
     ======================================================= */
  let rT;
  const onResize = () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      if (opened) computeOpenLayout();
      buildTrail();
      onScroll();
    }, 180);
  };
  window.addEventListener('resize', onResize);
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(map);

  /* =======================================================
     13. LOADER & BOOT
     ======================================================= */
  const loader = $('#loader');
  const LOADER_LINES = ['Đang gom đom đóm…', 'Đang đánh thức các bạn thú…', 'Đang vẽ đường vào rừng…', 'Đang thắt một chiếc nơ xinh…'];
  let li = 0;
  const loaderTimer = setInterval(() => { li = (li + 1) % LOADER_LINES.length; $('#loaderText').textContent = LOADER_LINES[li]; }, 700);
  const t0 = performance.now();
  const hideLoader = () => {
    const wait = Math.max(0, (reduced() ? 200 : 1600) - (performance.now() - t0));
    setTimeout(() => {
      clearInterval(loaderTimer);
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 900);
      buildTrail();
    }, wait);
  };

  // Boot
  hydrate();
  buildStops();
  fireflies($('#fireflies1'), window.innerWidth < 600 ? 14 : 24);
  fireflies($('#fireflies5'), 12);
  loadTicket();
  syncMusicUI();
  setupObservers();
  if (window.scrollY > 0) window.scrollTo(0, 0);

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 2500))]).then(() => {
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader, { once: true });
  });
})();
