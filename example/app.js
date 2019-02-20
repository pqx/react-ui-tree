import '../lib/react-ui-tree.less';
import './theme.less';
import './app.less';
import cx from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tree from '../lib/react-ui-tree.js';
import tree from './tree';
import links from './quicklinks'
import packageJSON from '../package.json';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Typography from 'material-ui/Typography';


class SearchTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
        query : "",
        original_tree: tree,
        current_tree: tree,
        file_node: {
          link:"",
          module:""
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
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

  changeUrl(node) {
    this.setState({file_node: node});
  }

  getNewTree(thisQuery) {
      let original_tree_clone = _.cloneDeep(this.state.original_tree);
      let newTree = this.recursiveTreeConstruct(thisQuery, original_tree_clone);
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

  recursiveTreeConstruct(query, thisTree) {

    // We will check if the current level has the matched pattern.
    // Exception is that we need the parent always.
    if(thisTree.module != null) {
      if(thisTree.module.toLowerCase().indexOf(query.toLowerCase()) > -1 && thisTree.module != "Logs") {
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
          <Grid container>
          <Grid item xs={4}>
            <br/>
            <br/>
            <Typography variant="headline" component="h3">
              QuickLinks
            </Typography>
            <Paper>
              <div className="quickLinks">
                <QuickLinks />
              </div>
            </Paper>
            <br/>
            <br/>
            <br/>
            <Typography variant="headline" component="h3">
              Log Tree
            </Typography>

            <div className="app">
              <div className="tree">
              <FormControl onSubmit={this.handleSubmit}>
                <InputLabel htmlFor="file-query">Search For files</InputLabel>
                <Input id="file-query" type="text" value={this.state.query} onChange={this.handleChange} name="search_query" />
              </FormControl>
                <TreeComponent
                  tree={this.state.current_tree}
                  changeUrl={this.changeUrl}
                />
              </div>
            </div>
            </Grid>
            <Grid item xs={8} xl={8}>
              <br/>
              <br/>

            <Typography variant="headline" component="h3">
              File Preview
            </Typography>

              <Paper className="preview_holder">
              <RenderFile node={this.state.file_node}/>
              </Paper>
            </Grid>
            </Grid>
    )
  };
}

class RenderFile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      node: this.props.node
    }
  }



  render() {

    return (
      <span>
        <Typography component="p">
          Current File = {this.props.node.module}
        </Typography>
        <Typography component="p">
          <a href={this.props.node.link} target="blank">Open in new tab</a>
        </Typography>
        <iframe id="preview_window" src={this.props.node.link} />
      </span>
    )
  }
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
       Searching For - {this.props.query}
      </div>
    )
  }
}

class QuickLinks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      links: links
    };
  }

  returnRow = row => {
    console.log(row)
    return (
      <tr>
        <td>{row.component}</td>
        <td><a href="{row.link}">{row.link}</a></td>
      </tr>
    )
  }

  render() {
    return (
      <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell>QuickLinks </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    links.map(function(link, i) {
                      return <TableRow>
                              <TableCell>{link.head}</TableCell>
                              <TableCell><a href={link.link}>{link.component}</a></TableCell>
                            </TableRow>;
                    })
                  }
                </TableBody>
      </Table>
    )
  };
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
        {node.module}
      </span>
    );
  };


  onClickNode = node => {
    this.setState({
      active: node
    });
    this.props.changeUrl(node);
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