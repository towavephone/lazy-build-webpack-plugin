var isBrowser = typeof window !== 'undefined';

var GLOBAL_ANIMATION_KEY = '__lazyCompileWebpackPlugin';

function noop() {}

// modified from https://matthewrayfield.com/articles/animating-urls-with-javascript-and-emojis
var figures = [
  '🕐',
  '🕑',
  '🕒',
  '🕓',
  '🕔',
  '🕕',
  '🕖',
  '🕗',
  '🕘',
  '🕙',
  '🕚',
  '🕛',
];

function startAnimation() {
  if (!isBrowser) return noop;
  if (window[GLOBAL_ANIMATION_KEY]) return noop;

  window[GLOBAL_ANIMATION_KEY] = true;

  var originTitle = document.title;
  function animationLoop() {
    const updateTitle = () => {
      document.title = 'Compiling ' + figures[Math.floor((Date.now() / 100) % figures.length)];
    }
    return setInterval(updateTitle, 50);
  }
  
  const loopHandle = animationLoop();

  return () => {
    window[GLOBAL_ANIMATION_KEY] = false;
    clearInterval(loopHandle);
    document.title = originTitle;
  };
}

function compile(endpoints, activationUrl) {
  var ready;
  var prom = new Promise(resolve => {
    ready = resolve;
    if (!isBrowser) return;
    endpoints.forEach(function(endpoint) {
      var img = new Image();
      img.src = activationUrl.replace('{host}', endpoint);
    });
  });
  prom.ready = ready;

  return prom;
}

module.exports = {
  isBrowser,
  startAnimation: startAnimation,
  compile: compile,
};
