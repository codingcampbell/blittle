module.exports = (async, util) => async({
  html: {
    boxSizing: 'border-box',
    fontSize: '62.5%'
  },

  '*, *:before, *:after': {
    boxSizing: 'inherit'
  },

  body: {
    fontFamily: 'helvetica, arial'
  }
});
