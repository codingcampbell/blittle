var flex = function(value) {
  var prefixes = ['-webkit-', '-ms-', '']

  return key => {
    var result = {};
    prefixes.forEach(prefix => {
      var k = prefix + key;
      k = k.replace(/-ms-align-items/, '-ms-flex-align');
      k = k.replace(/-ms-justify-content/, '-ms-flex-pack');
      result[k] = value;
    });

    return result;
  };
};

var displayFlex = function() {
  return () => ({
    '  display': '-ms-flexbox',
    ' display': '-webkit-flex',
    display: 'flex',
  });
};

module.exports = (async, util) => async({
  html: {
    boxSizing: 'border-box',
    fontSize: '62.5%'
  },

  '*, *:before, *:after': {
    boxSizing: 'inherit'
  },

  'html, body': {
    padding: 0,
    margin: 0
  },

  body: {
    background: '#fff',
    fontFamily: 'Orbitron, helvetica, arial',
    fontSize: '2.4rem',
    display: displayFlex(),
    'flex-direction': flex('column'),
    'justify-content': flex('center'),
    'align-items': flex('center'),
    'padding': '25px 0'
  },

  h1: {
    fontSize: '5.0rem',
    fontWeight: 700,
    margin: 0
  },

  a: {
    color: '#4285f4'
  },

  '#content': {
    background: '#000',
    display: displayFlex(),
    'flex-direction': flex('row'),
    'justify-content': flex('center'),
    'align-items': flex('center')
  },

  '#canvas-container': {
    background: '#000'
  },

  '#thumbnails': {
    margin: '5px',
    display: displayFlex(),
    'flex-direction': flex('column'),

    canvas: {
      cursor: 'pointer',
      margin: '10px',
      '-webkit-transition': '-webkit-transform 0.2s ease',
      transition: 'transform 0.2s ease',

      '&:hover': {
        '-webkit-transform': 'scale3d(1.1, 1.1, 1)',
        transform: 'scale3d(1.1, 1.1, 1)'
      }
    }
  }
});
