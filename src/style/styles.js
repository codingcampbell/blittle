module.exports = (async, util) => async({
  html: {
    boxSizing: 'border-box',
    fontSize: '62.5%'
  },

  '*, *:before, *:after': {
    boxSizing: 'inherit'
  },

  'html, body': {
    height: '100%',
    overflow: 'hidden',
    padding: 0,
    margin: 0
  },

  body: {
    background: '#fff',
    fontFamily: 'Orbitron, helvetica, arial',
    fontSize: '2.4rem',
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center'
  },

  h1: {
    fontSize: '5.0rem',
    fontWeight: 700,
    margin: 0
  },

  '#content': {
    background: '#000',
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    'align-items': 'center'
  },

  '#canvas-container': {
    background: '#000',
  },

  '#thumbnails': {
    margin: '5px',
    display: 'flex',
    'flex-direction': 'column',

    canvas: {
      cursor: 'pointer',
      margin: '10px',
      transition: 'transform 0.2s ease',

      '&:hover': {
        transform: 'scale3d(1.1, 1.1, 1)'
      }
    }
  }
});
