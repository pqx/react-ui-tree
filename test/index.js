var assert = require('assert');
var Tree = require('../lib/tree');

describe('tree', function() {
  var tree = new Tree({
    module: 'root',
    collapsed: false,
    children: [
      {
        module: 'a',
        collapsed: false,
        children: [
          {
            module: 'c',
            collapsed: false
          }
        ]
      },
      {
        module: 'b',
        collapsed: false
      }
    ]
  });

  it('updateNodesPosition()', function() {
    tree.updateNodesPosition();
    var indexes = tree.indexes;
    assert.strictEqual(tree.getIndex(1).top, 1);
    assert.strictEqual(tree.getIndex(1).left, 1);
    assert.strictEqual(tree.getIndex(2).top, 2);
    assert.strictEqual(tree.getIndex(2).left, 2);
    assert.strictEqual(tree.getIndex(3).top, 3);
    assert.strictEqual(tree.getIndex(3).left, 3);
    assert.strictEqual(tree.getIndex(4).top, 4);
    assert.strictEqual(tree.getIndex(4).left, 2);
  });

  it('move()', function() {
    tree.move();
  });

  it('getNodeByTop()', function() {
    assert.deepEqual(tree.getNodeByTop(1).id, 1);
    assert.deepEqual(tree.getNodeByTop(2).id, 2);
    assert.deepEqual(tree.getNodeByTop(3).id, 3);
    assert.deepEqual(tree.getNodeByTop(4).id, 4);
  });
});
