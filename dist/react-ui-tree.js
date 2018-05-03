'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UITree = function (_Component) {
  _inherits(UITree, _Component);

  function UITree(props) {
    _classCallCheck(this, UITree);

    var _this = _possibleConstructorReturn(this, (UITree.__proto__ || Object.getPrototypeOf(UITree)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = _this.init(props);
    return _this;
  }

  _createClass(UITree, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!this._updated) {
        this.setState(this.init(nextProps));
      } else {
        this._updated = false;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var tree = this.state.tree;
      var dragging = this.state.dragging;
      var draggingDom = this.getDraggingDom();

      return _react2.default.createElement(
        'div',
        { className: 'm-tree' },
        draggingDom,
        _react2.default.createElement(_node2.default, {
          tree: tree,
          index: tree.getIndex(1),
          key: 1,
          paddingLeft: this.props.paddingLeft,
          onDragStart: this.dragStart,
          onCollapse: this.toggleCollapse,
          dragging: dragging && dragging.id,
          dragDelay: this.props.dragDelay || 0
        })
      );
    }

    // oh

  }]);

  return UITree;
}(_react.Component);

UITree.propTypes = {
  tree: _propTypes2.default.object.isRequired,
  paddingLeft: _propTypes2.default.number,
  renderNode: _propTypes2.default.func.isRequired
};
UITree.defaultProps = {
  paddingLeft: 20
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.init = function (props) {
    var tree = new _tree2.default(props.tree);
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    tree.updateNodesPosition();

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
  };

  this.getDraggingDom = function () {
    var _state = _this2.state,
        tree = _state.tree,
        dragging = _state.dragging;


    if (dragging && dragging.id) {
      var draggingIndex = tree.getIndex(dragging.id);
      var draggingStyles = {
        top: dragging.y,
        left: dragging.x,
        width: dragging.w
      };

      return _react2.default.createElement(
        'div',
        { className: 'm-draggable', style: draggingStyles },
        _react2.default.createElement(_node2.default, {
          tree: tree,
          index: draggingIndex,
          paddingLeft: _this2.props.paddingLeft
        })
      );
    }

    return null;
  };

  this.dragStart = function (id, dom, e) {

    var rootIndex = _this2.state.tree.getIndex(1);

    if (_this2.props.disableDragging) {
      return;
    }
    if (_this2.props.disableRootDrag && id == 1) {
      return;
    }
    if (_this2.props.dragFirstLevelOnly && !rootIndex.children.includes(id)) {
      return;
    }

    _this2.dragging = {
      id: id,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop
    };

    _this2._startX = dom.offsetLeft;
    _this2._startY = dom.offsetTop;
    _this2._offsetX = e.clientX;
    _this2._offsetY = e.clientY;
    _this2._start = true;

    window.addEventListener('mousemove', _this2.drag);
    window.addEventListener('mouseup', _this2.dragEnd);
  };

  this.drag = function (e) {
    if (_this2._start) {
      _this2.setState({
        dragging: _this2.dragging
      });
      _this2._start = false;
    }

    var tree = _this2.state.tree;
    var dragging = _this2.state.dragging;
    var paddingLeft = _this2.props.paddingLeft;
    var newIndex = null;
    var index = tree.getIndex(dragging.id);

    var noIndex = false;

    var tempCollapsed = void 0;

    if (index == null) {
      tempCollapsed = false;
      noIndex = true;
    } else {
      tempCollapsed = index.node.collapsed;
    }

    var collapsed = tempCollapsed;
    var _startX = _this2._startX;
    var _startY = _this2._startY;
    var _offsetX = _this2._offsetX;
    var _offsetY = _this2._offsetY;

    var pos = {
      x: _startX + (_this2.props.disableHorizontalDrag ? 0 : e.clientX - _offsetX),
      y: _startY + (noIndex ? 0 : e.clientY - _offsetY)
    };
    dragging.x = pos.x;
    dragging.y = pos.y;

    if (noIndex) {
      return;
    }

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
        var _below = tree.getNodeByTop(index.top + index.height);
        if (_below && _below.parent !== index.id) {
          if (_below.children && _below.children.length && !_below.node.collapsed) {
            newIndex = tree.move(index.id, _below.id, 'prepend');
          } else {
            newIndex = tree.move(index.id, _below.id, 'after');
          }
        }
      }
    }

    if (newIndex) {
      newIndex.node.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    _this2.setState({
      tree: tree,
      dragging: dragging
    });
  };

  this.dragEnd = function () {
    _this2.setState({
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    _this2.change(_this2.state.tree);
    window.removeEventListener('mousemove', _this2.drag);
    window.removeEventListener('mouseup', _this2.dragEnd);
  };

  this.change = function (tree) {
    _this2._updated = true;
    if (_this2.props.onChange) _this2.props.onChange(tree.obj);
  };

  this.toggleCollapse = function (nodeId) {
    var tree = _this2.state.tree;
    var index = tree.getIndex(nodeId);
    var node = index.node;
    node.collapsed = !node.collapsed;
    tree.updateNodesPosition();

    _this2.setState({
      tree: tree
    });

    _this2.change(tree);
  };
};

module.exports = UITree;