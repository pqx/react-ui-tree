# react-ui-tree [![Build Status](https://travis-ci.org/pqx/react-ui-tree.svg)](https://travis-ci.org/pqx/react-ui-tree)
React tree component

This project was initially developed for a webpage builder. It maintains an internal tree structure within the component through [js-tree](https://github.com/wangzuo/js-tree).
### Demo
[https://pqx.github.io/react-ui-tree/example](https://pqx.github.io/react-ui-tree/example)
### Installation
``` sh
npm install react-ui-tree --save
```
### Usage
``` javascript
<Tree
  paddingLeft={20}              // left padding for children nodes in pixels
  tree={this.state.tree}        // tree object
  onChange={this.handleChange}  // onChange(tree) tree object changed
  renderNode={this.renderNode}  // renderNode(node) return react element
  static={false}                //static trees cannot have their structure modified
/>

// a sample tree object
// node.children & node.collapsed properties are hardcoded
{
  "module": "react-ui-tree",
  "children": [{
    "collapsed": true,
    "module": "dist",
    "children": [{
      "module": "node.js"
    }]
  }]
}
```
check [app.js](https://github.com/pqx/react-ui-tree/blob/gh-pages/example/app.js) for a working example
### License
MIT
