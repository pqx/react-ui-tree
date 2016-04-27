'use strict';

var Tree = require('./tree');
var Node = require('./node');

module.exports = React.createClass({
  displayName: 'UITree',

  propTypes: {
    tree: React.PropTypes.object.isRequired,
    paddingLeft: React.PropTypes.number,
    renderNode: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      paddingLeft: 20
    };
  },
  getInitialState: function getInitialState() {
    return this.init(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!this._updated) this.setState(this.init(nextProps));else this._updated = false;
  },
  init: function init(props) {
    var tree = new Tree(props.tree);
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    tree.updateNodesPosition();

    if (props.afterInitialize) props.afterInitialize(this);

    return {
      tree: tree,
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  },
  getDraggingDom: function getDraggingDom() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;

    if (dragging && dragging.id) {
      var draggingIndex = tree.getIndex(dragging.id);
      var draggingStyles = {
        top: dragging.y,
        left: dragging.x,
        width: dragging.w
      };

      return React.createElement(
        'div',
        { className: 'm-draggable', style: draggingStyles },
        React.createElement(Node, {
          tree: tree,
          index: draggingIndex,
          paddingLeft: this.props.paddingLeft
        })
      );
    }

    return null;
  },
  render: function render() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var draggingDom = this.getDraggingDom();

    return React.createElement(
      'div',
      { className: 'm-tree' },
      draggingDom,
      React.createElement(Node, {
        tree: tree,
        index: tree.getIndex(1),
        key: 1,
        paddingLeft: this.props.paddingLeft,
        onDragStart: this.dragStart,
        onCollapse: this.toggleCollapse,
        dragging: dragging && dragging.id
      })
    );
  },
  dragStart: function dragStart(id, dom, e) {
    this.dragging = {
      id: id,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop
    };

    this._startX = dom.offsetLeft;
    this._startY = dom.offsetTop;
    this._offsetX = e.clientX;
    this._offsetY = e.clientY;
    this._start = true;

    this.oldIndex = this.state.tree.getIndex(id);

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.dragEnd);
  },

  // oh
  drag: function drag(e) {
    if (this._start) {
      this.setState({
        dragging: this.dragging
      });
      this._start = false;
    }

    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var paddingLeft = this.props.paddingLeft;
    var newIndex = null;
    var index = tree.getIndex(dragging.id);
    var collapsed = index.node.collapsed;

    var _startX = this._startX;
    var _startY = this._startY;
    var _offsetX = this._offsetX;
    var _offsetY = this._offsetY;

    var pos = {
      x: _startX + e.clientX - _offsetX,
      y: _startY + e.clientY - _offsetY
    };
    dragging.x = pos.x;
    dragging.y = pos.y;

    var diffX = dragging.x - paddingLeft / 2 - (index.left - 2) * paddingLeft;
    var diffY = dragging.y - dragging.h / 2 - (index.top - 2) * dragging.h;

    if (diffX < 0) {
      // left
      if (index.parent && !index.next) {
        newIndex = tree.move(index.id, index.parent, 'after');
      }
    } else if (diffX > paddingLeft) {
      // right
      if (index.prev) {
        var prevNode = tree.getIndex(index.prev).node;
        if (!prevNode.collapsed && !prevNode.leaf) {
          newIndex = tree.move(index.id, index.prev, 'append');
        }
      }
    }

    if (newIndex) {
      index = newIndex;
      newIndex.node.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    if (diffY < 0) {
      // up
      var above = tree.getNodeByTop(index.top - 1);
      newIndex = tree.move(index.id, above.id, 'before');
    } else if (diffY > dragging.h) {
      // down
      if (index.next) {
        var below = tree.getIndex(index.next);
        if (below.children && below.children.length && !below.node.collapsed) {
          newIndex = tree.move(index.id, index.next, 'prepend');
        } else {
          newIndex = tree.move(index.id, index.next, 'after');
        }
      } else {
        var below = tree.getNodeByTop(index.top + index.height);
        if (below && below.parent !== index.id) {
          if (below.children && below.children.length) {
            newIndex = tree.move(index.id, below.id, 'prepend');
          } else {
            newIndex = tree.move(index.id, below.id, 'after');
          }
        }
      }
    }

    if (newIndex) {
      newIndex.node.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    this.setState({
      tree: tree,
      dragging: dragging
    });
  },
  dragEnd: function dragEnd() {
    var tree = this.state.tree;
    var index = tree.getIndex(this.dragging.id);

    this.setState({
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    this.change(tree);
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.dragEnd);

    if (this.oldIndex.parent != index.parent) {
      var node = index.node;
      var parentId = tree.getIndex(index.parent).node.id;

      console.log("We should call onParentChange");

      // The parent node was changed and we should update the server
      if (this.props.onParentChange) this.props.onParentChange(node, parentId);
    }
  },
  change: function change(tree) {
    this._updated = true;
    if (this.props.onChange) this.props.onChange(tree.obj);
  },
  openNode: function(ancestors, nodeId) {
    if (ancestors.length > 0) {
      var region = ancestors.pop();
      var index = this.state.tree.getIndexByNodeId(region.id);
      this.fetchChildren(index, function() {this.openNode(ancestors, nodeId)}.bind(this));
    } else {
      $("#"+nodeId).click();
    }
  },
  toggleCollapse: function toggleCollapse(nodeId) {
    var tree = this.state.tree;
    var index = tree.getIndex(nodeId);
    var node = index.node;
    node.collapsed = !node.collapsed;
    if (!node.collapsed && node.isParent) { // We're going to call the server so don't update the tree yet.
      this.fetchChildren(index);
      LocationManager.fetchRegions(node.id);
    } else {
      tree.updateNodesPosition();
      this.setState({
        tree: tree
      });

      this.change(tree);
    }
  },
  fetchChildren: function(index, successCallback) {
    var tree = this.state.tree;
    var node = index.node;
    var url = 'region_containers/'+node.id+'/children';

    Utility.makeAjaxCall(url,
      function(data) {
        var children = data.children;
        if (children.length && children.length > 0) {
          index.children = []; //empty the children array
          index.node.children = [];
          children.map(function(obj) {
            tree.insert(obj, index.id, 0)
          })
        }
        node.collapsed = false;
        tree.updateNodesPosition();
        this.setState({
          tree: tree
        });

        this.change(tree);
        if(successCallback) {
          successCallback()
        }
      }.bind(this),
      function() {console.log("Ajax failed")},'GET', 'json',''
    )
  },
  removeNode: function (indexId) {
    var tree = this.state.tree;

    tree.remove(indexId)

    this.setState({
      tree: tree
    });

    this.change(tree);
  }
});