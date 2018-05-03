'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UITreeNode = function (_Component) {
  _inherits(UITreeNode, _Component);

  function UITreeNode() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, UITreeNode);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UITreeNode.__proto__ || Object.getPrototypeOf(UITreeNode)).call.apply(_ref, [this].concat(args))), _this), _this.renderCollapse = function () {
      var index = _this.props.index;


      if (index.children && index.children.length) {
        var collapsed = index.node.collapsed;


        return _react2.default.createElement('span', {
          className: (0, _classnames2.default)('collapse', collapsed ? 'caret-right' : 'caret-down'),
          onMouseDown: function onMouseDown(e) {
            return e.stopPropagation();
          },
          onClick: _this.handleCollapse
        });
      }

      return null;
    }, _this.renderChildren = function () {
      var _this$props = _this.props,
          index = _this$props.index,
          tree = _this$props.tree,
          dragging = _this$props.dragging;


      if (index.children && index.children.length) {
        var childrenStyles = {
          paddingLeft: _this.props.paddingLeft
        };

        return _react2.default.createElement(
          'div',
          { className: 'children', style: childrenStyles },
          index.children.map(function (child) {
            var childIndex = tree.getIndex(child);

            return _react2.default.createElement(UITreeNode, {
              tree: tree,
              index: childIndex,
              key: childIndex.id,
              dragging: dragging,
              paddingLeft: _this.props.paddingLeft,
              onCollapse: _this.props.onCollapse,
              onDragStart: _this.props.onDragStart,
              dragDelay: _this.props.dragDelay
            });
          })
        );
      }

      return null;
    }, _this.handleCollapse = function (e) {
      e.stopPropagation();
      var nodeId = _this.props.index.id;

      if (_this.props.onCollapse) {
        _this.props.onCollapse(nodeId);
      }
    }, _this.handleMouseDown = function (e) {
      var nodeId = _this.props.index.id;
      var dom = _this.refs.inner;
      var eventXY = { clientY: e.clientY, clientX: e.clientX };

      var self = _this;

      if (_this.props.onDragStart) {
        _this.pressTimer = window.setTimeout(function () {
          self.props.onDragStart(nodeId, dom, eventXY);
        }, _this.props.dragDelay);
      }
    }, _this.handleMouseUp = function (e) {
      clearTimeout(_this.pressTimer);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UITreeNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          tree = _props.tree,
          index = _props.index,
          dragging = _props.dragging;
      var node = index.node;

      var styles = {};

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('m-node', {
            placeholder: index.id === dragging
          }),
          style: styles
        },
        _react2.default.createElement(
          'div',
          { className: 'inner', ref: 'inner', onMouseDown: this.handleMouseDown, onMouseUp: this.handleMouseUp },
          this.renderCollapse(),
          tree.renderNode(node)
        ),
        node.collapsed ? null : this.renderChildren()
      );
    }
  }]);

  return UITreeNode;
}(_react.Component);

module.exports = UITreeNode;