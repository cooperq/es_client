require.config({
  baseUrl: '/es_client/vendor',
  paths: {
    es_client: '..',
    test: '../test/unit'
  },
  shim:{
    'underscore':{
      exports: '_'
    },
    'backbone':{
      deps: ['underscore','jquery'],
      exports: 'Backbone'
    }
  }
});
