import '../lib/react-ui-tree.less';
import './theme.less';
import './app.less';
import cx from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tree from '../lib/react-ui-tree.js';
import tree from './tree';
import packageJSON from '../package.json';
import _ from 'lodash';

class SearchTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
        query : "",
        original_tree: tree,
        current_tree: tree
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.query);
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({query: event.target.value});
    let thisQuery = event.target.value;
    if(thisQuery.length > 0) {
      this.getNewTree(thisQuery);
    }
    else {
      this.setState({current_tree: this.state.original_tree});
    }
    // we need to change the current tree state so that
    // we get the new tree rendered automatically.
  }

  getNewTree(thisQuery) {
      let original_tree_clone = _.cloneDeep(this.state.original_tree);
      let newTree = this.recursiveTreeConstruct(thisQuery, original_tree_clone, original_tree_clone.module);
      if(newTree != null) {
        this.setState({current_tree: newTree});
      }
      else {
        this.setState({
            current_tree: {
              module: "No results"
            }
        });
    }
  }

  recursiveTreeConstruct(query, thisTree, rootElement) {

    // We will check if the current level has the matched pattern.
    // Exception is that we need the parent always.
    if(thisTree.module != null) {
      if(thisTree.module.toLowerCase().indexOf(query.toLowerCase()) > -1 && thisTree.module != rootElement) {
        thisTree.collapsed = false;
        // maybe add a close all children function...?
        return thisTree;
      }
      // If it doesn't, then we check if the below path has matched pattern.
      else if(thisTree.children != null) {
        let newChildNodes = [];
        thisTree.children.forEach(node => {
          let newnode = this.recursiveTreeConstruct(query, node);
          if(newnode) {
            newChildNodes.push(newnode);
          }
        });

        if(newChildNodes.length > 0) {
          thisTree.children = newChildNodes;
          thisTree.collapsed = false;
          return thisTree;
        }
        else {
          return null;
        }
      }
    }
    return null;
  }

  render() {
    return (

          <div className="app">
            <div className="tree">
            <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.query} onChange={this.handleChange} name="search_query" />
            </form>
            <DisplayQuery
              query={this.state.query}
            />
              <TreeComponent
                tree={this.state.current_tree}
              />
            </div>
          </div>
    )
  };
}

class DisplayQuery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.query
    }
  }

  render() {
    return (
      <div>
       {this.props.query}
      </div>
    )
  }
}

class TreeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: null
    };
  }

  renderNode = node => {
    return (
      <span
        className={cx('node', {
          'is-active': node === this.state.active
        })}
        onClick={this.onClickNode.bind(null, node)}
      >
      <a href={node.link}>
        {node.module}
       </a>
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
              <Tree
                paddingLeft={20}
                tree={this.props.tree}
                draggable={false}
                onChange={this.handleChange}
                isNodeCollapsed={this.isNodeCollapsed}
                renderNode={this.renderNode}
              />
    );
  }
}

ReactDOM.render(<SearchTree />, document.getElementById('app'));