# jab-react-tree [![Build Status](https://travis-ci.org/gabchang/jab-react-tree.svg)](https://travis-ci.org/gabchang/jab-react-tree)
React tree component

This is a fork of [react-ui-tree](https://pqx.github.io/react-ui-tree) by [Wang Zuo](https://github.com/pqx).
This project was initially developed for a webpage builder. It maintains an internal tree structure within the component through [js-tree](https://github.com/wangzuo/js-tree).

### Demo
[https://gabchang.github.io/jab-react-tree](https://gabchang.github.io/jab-react-tree)

### Installation
``` sh
npm install jab-react-tree --save
```

### Properties

  * paddingLeft {Number}              
    Left padding for children nodes in pixels
  * tree {Object}
    Tree object (nested)
  * onChange {Func}
    Gets the full tree object as parameter
  * renderNode {Func}
    Return react element
  * onDragStart {Func}
    Gets the dragging node as parameter
  * onDragEnd {Func}
    Gets the dropped node as parameter

### Tree object

A nested object :

```
const tree = {
  <your custom node props>
  children: [
    {
      <your custom node props>
    },
    ...
  ]
}
```

### Node object

```
{
  id    : {Number}, // The internal node id
  top   : {Number}, // internal id
  left  : {Number}, // internal id
  prev  : {Number}, // internal id
  next  : {Number}, // internal id
  parent: {Number}, // internal id
  node  : {Object}, // Node state with your custom props
}
```

### Node.node

```
{
  collapsed: {Bool} // Open or closed state
  leaf     : {Bool} // If true, can not have child
  ...(your custom props)
}
```

### Usage
``` javascript
<Tree
  paddingLeft={20}              // left padding for children nodes in pixels
  tree={this.state.tree}        // tree object
  onChange={this.handleChange}  // onChange(tree) tree object changed
  renderNode={this.renderNode}  // renderNode(node) return react element
  onDragStart={ (node) => () }  // onDragStart(node) the dragging tree node
  onDragEnd={ (node) => () }    // onDragEnd(node) the dropped tree node
/>

// a sample tree object
// node.children, node.collapsed, node.leaf properties are hardcoded
{
  "module": "jab-react-tree",
  "children": [{
    "collapsed": true,
    "module": "dist",
    "children": [{
      "module": "node.js"
    }]
  }]
}
```
check [app.js](https://github.com/gabchang/jab-react-tree/blob/master/example/app.js) for a working example

### Development
- npm install
- npm start
- http://localhost:8888/example

### License
MIT
