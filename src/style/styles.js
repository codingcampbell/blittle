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
    background: '#000',
    fontFamily: 'helvetica, arial',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});
