module.exports = {
  module: 'jab-react-tree',
  children: [{
    module: 'dist',
    collapsed: true,
    children: [{
      module: 'node.js',
      leaf: true
    }, {
      module: 'jab-react-tree.css',
      leaf: true
    }, {
      module: 'jab-react-tree.js',
      leaf: true
    }, {
      module: 'tree.js',
      leaf: true
    }]
  }, {
    module: 'example',
    children: [{
      module: 'app.js',
      leaf: true
    }, {
      module: 'app.less',
      leaf: true
    }, {
      module: 'index.html',
      leaf: true
    }]
  }, {
    module: 'lib',
    children: [{
      module: 'node.js',
      leaf: true
    }, {
      module: 'jab-react-tree.js',
      leaf: true
    }, {
      module: 'jab-react-tree.less',
      leaf: true
    }, {
      module: 'tree.js',
      leaf: true
    }]
  }, {
    module: '.gitiignore',
    leaf: true
  }, {
    module: 'index.js',
    leaf: true
  }, {
    module: 'LICENSE',
    leaf: true
  }, {
    module: 'Makefile',
    leaf: true
  }, {
    module: 'package.json',
    leaf: true
  }, {
    module: 'README.md',
    leaf: true
  }, {
    module: 'webpack.config.js',
    leaf: true
  }]
}
