var cx = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');

var Node = React.createClass({
  displayName: 'UITreeNode',

  renderCollapse() {
    var index = this.props.index;
    var node = index.node;

    if (node.hasChildren || (index.children && index.children.length)) {
      var collapsed = index.node.collapsed;

      return (
        <span
          className={cx('collapse', collapsed ? 'caret-right' : 'caret-down')}
          onMouseDown={function(e) {e.stopPropagation()}}
          onClick={this.handleCollapse}>
        </span>
      );
    }

    return null;
  },

  renderChildren() {
    var index = this.props.index;
    var tree = this.props.tree;
    var dragging = this.props.dragging;

    if(index.children && index.children.length) {
      var childrenStyles = {};
      if(index.node.collapsed) childrenStyles.display = 'none';
      childrenStyles['paddingLeft'] = (this.isRoot(index) && ! this.props.shouldRenderRootNode ? 0 : this.props.paddingLeft  ) + 'px';

      return (
        <div className="children" style={childrenStyles}>
          {index.children.map((child) => {
            var childIndex = tree.getIndex(child);
            return (
              <Node
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
                shouldRenderRootNode={this.props.shouldRenderRootNode}
              />
            );
          })}
        </div>
      );
    }

    return null;
  },

  renderInner(){
    if( this.isRoot() && ! this.props.shouldRenderRootNode ){
      return null;
    }

    var tree = this.props.tree;
    var index = this.props.index;
    var node = index.node;

    return(
        <div className="inner" ref="inner" onMouseDown={this.handleMouseDown}>
          {this.renderCollapse()}
          {tree.renderNode(node)}
        </div>
     )
  },

  isRoot(){
    var index = this.props.index;
    return index.id === 1 ? true : false;
  },

  render() {
    var tree = this.props.tree;
    var index = this.props.index;
    var dragging = this.props.dragging;
    var node = index.node;
    var styles = {};

    return (
      <div className={cx('m-node', {
        'placeholder': index.id === dragging
      })} style={styles}>
        {this.renderInner()}
        {this.renderChildren()}
      </div>
    );
  },

  handleCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if(this.props.onCollapse) this.props.onCollapse(nodeId);
  },

  handleMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;

    if(this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;
