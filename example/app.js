import '../lib/react-ui-tree.less';
import './theme.less';
import './app.less';
import cx from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tree from '../lib/react-ui-tree.js';
import tree from './tree';
import packageJSON from '../package.json';

class App extends Component {
  state = {
    active: null,
    tree: tree
  };

  renderNode = node => {
    return (
      <span
        className={cx('node', {
          'is-active': node === this.state.active
        })}
        onClick={this.onClickNode.bind(null, node)}
      >
        {node.module}
      </span>
    );
  };

  onClickNode = node => {
    this.setState({
      active: node
    });
  };

  render() {
    return (
      <div className="app">
        <div className="tree">
          <Tree
            paddingLeft={20}
            tree={this.state.tree}
            onChange={this.handleChange}
            isNodeCollapsed={this.isNodeCollapsed}
            renderNode={this.renderNode}
          />
        </div>
        <div className="inspector">
          <h1>
            {packageJSON.name} {packageJSON.version}
          </h1>
          <button onClick={this.updateTree}>update tree</button>
          <pre>{JSON.stringify(this.state.tree, null, '  ')}</pre>
        </div>
      </div>
    );
  }

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

  updateTree = () => {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
    this.setState({
      tree: tree
    });
  };
}

ReactDOM.render(<App />, document.getElementById('app'));
