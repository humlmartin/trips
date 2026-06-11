(function(){
  'use strict';
  // Pokud už uživatel zadal heslo v tomto prohlížeči, nedělej nic
  if (localStorage.getItem('trips-unlock') === '1') return;

  // Skryj obsah dokud nedostaneme správné heslo
  var hideStyle = document.createElement('style');
  hideStyle.id = 'gate-hide';
  hideStyle.textContent = 'body > *:not(#trips-gate){visibility:hidden!important}';
  document.head.appendChild(hideStyle);

  var EXPECTED = '7eda9aca8f23c9b28a38b55ce2e2f7ed444b6c90a7b339e4fcdda1cb02a4a341';

  function init(){
    var gate = document.createElement('div');
    gate.id = 'trips-gate';
    gate.style.cssText = [
      'position:fixed','inset:0','background:#f7f1df','z-index:2147483647',
      'display:flex','align-items:center','justify-content:center',
      'font-family:"Iowan Old Style","Palatino Linotype","Palatino",Georgia,serif',
      'color:#2b1d12'
    ].join(';');
    gate.innerHTML = ''
      + '<div style="text-align:center;max-width:380px;padding:40px 24px;width:100%;box-sizing:border-box">'
      +   '<svg viewBox="0 0 32 32" width="44" height="44" style="margin-bottom:18px" aria-hidden="true">'
      +     '<path d="M16 1 L19 8 L26 7 L22 13 L29 16 L22 19 L26 25 L19 24 L16 31 L13 24 L6 25 L10 19 L3 16 L10 13 L6 7 L13 8 Z" fill="#b03a0a"/>'
      +   '</svg>'
      +   '<h1 style="font-weight:400;font-size:36px;margin:0 0 28px;letter-spacing:0.01em;line-height:1">C<em style="color:#b03a0a;font-style:italic">e</em>sty</h1>'
      +   '<form id="gate-form" novalidate>'
      +     '<input id="gate-pwd" type="password" placeholder="heslo" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;padding:14px 16px;border:1px solid #d6c7a3;background:#fff;font-size:16px;font-family:inherit;text-align:center;letter-spacing:0.05em;outline:none;box-sizing:border-box;color:#2b1d12">'
      +     '<button type="submit" style="margin-top:12px;width:100%;padding:13px;background:#b03a0a;color:#fff;border:none;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-family:inherit;cursor:pointer;font-weight:600">Vstoupit</button>'
      +   '</form>'
      +   '<div style="margin-top:14px;font-size:12px;opacity:0.55;font-style:italic;letter-spacing:0.02em">nápověda: poslední klub ve Vladivostoku</div>'
      +   '<div id="gate-err" style="margin-top:10px;font-size:12px;color:#b03a0a;letter-spacing:0.12em;text-transform:uppercase;opacity:0;transition:opacity 0.2s">špatné heslo</div>'
      + '</div>';
    document.body.appendChild(gate);

    var input = document.getElementById('gate-pwd');
    var err = document.getElementById('gate-err');
    var form = document.getElementById('gate-form');
    setTimeout(function(){ input.focus(); }, 50);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var pwd = input.value;
      if (!pwd || !window.crypto || !window.crypto.subtle) {
        err.style.opacity = '1';
        return;
      }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd)).then(function(buf){
        var hex = Array.prototype.map.call(new Uint8Array(buf), function(b){
          return ('0' + b.toString(16)).slice(-2);
        }).join('');
        if (hex === EXPECTED) {
          localStorage.setItem('trips-unlock', '1');
          gate.remove();
          var s = document.getElementById('gate-hide'); if (s) s.remove();
        } else {
          err.style.opacity = '1';
          input.value = '';
          input.focus();
        }
      }).catch(function(){
        err.style.opacity = '1';
      });
    });

    input.addEventListener('input', function(){ err.style.opacity = '0'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
