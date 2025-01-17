import {beforeEach, describe, expect, it} from 'vitest'
import {TreeUtils} from "../src";

function getMockedList(parentCustomId: any = null): any[] {
  return [
    {customId: 1, parentCustomId, name: 'Node 1'},
    {customId: 2, parentCustomId, name: 'Node 2'},
    {customId: 3, parentCustomId: 1, name: 'Node 3'},
    {customId: 4, parentCustomId: 1, name: 'Node 4'},
    {customId: 5, parentCustomId: 2, name: 'Node 5'},
    {customId: 6, parentCustomId: 3, name: 'Node 6'},
  ]
}

function getMockedTree(parentCustomId: any = null): any[] {
  return [
    {
      customId: 1, parentCustomId, name: 'Node 1', customChildren: [
        {
          customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: [
            {customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []},
          ]
        },
        {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: []},
      ]
    },
    {
      customId: 2, parentCustomId, name: 'Node 2', customChildren: [
        {customId: 5, parentCustomId: 2, name: 'Node 5', customChildren: []},
      ]
    },
  ]
}

const TREE_MOCK_ITEMS2 = [
  {
    customId: 1, parentCustomId: null, name: 'Node 1', customChildren: [
      {
        customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: [
          {customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []},
        ]
      },
      {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: []},
    ]
  },
  {
    customId: 2, parentCustomId: null, name: 'Node 2', customChildren: [
      {customId: 5, parentCustomId: 2, name: 'Node 5', customChildren: []},
      {customId: 6, parentCustomId: 2, name: 'Node 6', customChildren: []},
      {customId: 7, parentCustomId: 2, name: 'Node 7', customChildren: []},
    ]
  },
];

const treeUtils = new TreeUtils({
  idProp: 'customId',
  parentIdProp: 'parentCustomId',
  childrenProp: 'customChildren',
});

describe('Tree utils methods', () => {

  let mock: any;

  beforeEach(() => {
    mock = JSON.parse(JSON.stringify(getMockedTree(null)));
  })

  it('should setup converter with defaults when parameter is not provided', () => {
    const treeUtils = new TreeUtils();
    expect(treeUtils.list2Tree([{id: 1, parentId: null, name: 'Node 1'}]))
        .toEqual([{id: 1, parentId: null, name: 'Node 1', children: []}]);
  });

  it('should convert list to tree', () => {
    expect(treeUtils.list2Tree(getMockedList())).toEqual(getMockedTree());
  });

  it('should convert tree to list', () => {
    expect(treeUtils.tree2List(getMockedTree()).sort((a: any, b: any) => a.customId - b.customId)).toEqual(getMockedList());
  });

  it('should get node by given customId', () => {
    expect(treeUtils.get(getMockedTree(), 6)).toEqual({customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []});
  });

  it('should not fail, when children prop is missing', () => {
    const input = [
      {customId: 1, parentCustomId: null, name: 'Node 1'}
    ]
    expect(treeUtils.get(input, 6)).toBeNull();
    expect(treeUtils.getParent(input, 6)).toBeNull();
  });

  it('should delete node by given customId', () => {
    treeUtils.delete(mock, 6);
    const out = [
      {
        customId: 1, parentCustomId: null, name: 'Node 1', customChildren: [
          {
            customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: []
          },
          {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: []},
        ]
      },
      {
        customId: 2, parentCustomId: null, name: 'Node 2', customChildren: [
          {customId: 5, parentCustomId: 2, name: 'Node 5', customChildren: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should add node to parent with given customId', () => {
    treeUtils.add(mock, 4, {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []});
    const out = [
      {
        customId: 1, parentCustomId: null, name: 'Node 1', customChildren: [
          {
            customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: [
              {customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []}
            ]
          },
          {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: [
              {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []}
            ]},
        ]
      },
      {
        customId: 2, parentCustomId: null, name: 'Node 2', customChildren: [
          {customId: 5, parentCustomId: 2, name: 'Node 5', customChildren: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should add node to root', () => {
    treeUtils.add(mock, null, {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []});
    const out = [
      {
        customId: 1, parentCustomId: null, name: 'Node 1', customChildren: [
          {
            customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: [
              {customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []}
            ]
          },
          {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: []},
        ]
      },
      {
        customId: 2, parentCustomId: null, name: 'Node 2', customChildren: [
          {customId: 5, parentCustomId: 2, name: 'Node 5', customChildren: []},
        ]
      },
      {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []}
    ]
    expect(mock).toEqual(out);
  });

  it('should edit node of given customId by given data', () => {
    treeUtils.edit(mock, 5, {customId: 5, parentCustomId: 2, name: 'Node 5 edited', customChildren: []});
    const out = [
      {
        customId: 1, parentCustomId: null, name: 'Node 1', customChildren: [
          {
            customId: 3, parentCustomId: 1, name: 'Node 3', customChildren: [
              {customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []}
            ]
          },
          {customId: 4, parentCustomId: 1, name: 'Node 4', customChildren: []},
        ]
      },
      {
        customId: 2, parentCustomId: null, name: 'Node 2', customChildren: [
          {customId: 5, parentCustomId: 2, name: 'Node 5 edited', customChildren: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should find parent of node', () => {
    expect(treeUtils.getParent(mock, 6).customId).toBe(3);
    expect(treeUtils.getParent(mock, 1)).toBeNull();
  });

  it('should get ancestors of node', () => {
    expect(treeUtils.getAncestors(mock, 6).map((item: any) => item.customId)).toEqual([1, 3]);
    expect(treeUtils.getAncestors(mock, 4).map((item: any) => item.customId)).toEqual([1]);
    expect(treeUtils.getAncestors(mock, 5).map((item: any) => item.customId)).toEqual([2]);
    expect(treeUtils.getAncestors(mock, 1).map((item: any) => item.customId)).toEqual([]);
  });

  it('should get descendants of node', () => {
    expect(treeUtils.getDescendants(mock, 1).map((item: any) => item.customId)).toEqual([3, 4, 6]);
    expect(treeUtils.getDescendants(mock, 2).map((item: any) => item.customId)).toEqual([5]);
    expect(treeUtils.getDescendants(mock, 5).map((item: any) => item.customId)).toEqual([]);
  });

  it('should not get descendants of nonexisting node', () => {
    expect(treeUtils.getDescendants(mock, 666).map((item: any) => item.customId)).toEqual([]);
  });

  it('should find ALL nodes that match callback', () => {
    expect(treeUtils.filter(mock, item => item.customId % 2 === 0).map((item: any) => item.customId)).toEqual([2, 4, 6]);
    expect(treeUtils.filter(mock, item => item.customId % 3 === 0).map((item: any) => item.customId)).toEqual([3, 6]);
    expect(treeUtils.filter(mock, item => item.name.includes('Node')).map((item: any) => item.customId)).toEqual([1, 2, 3, 4, 6, 5]);
  });

  it('should get neighbours of node', () => {
    expect(treeUtils.getNeighbours(mock, 1).map((item: any) => item.customId)).toEqual([3, 4]);
    expect(treeUtils.getNeighbours(mock, 3).map((item: any) => item.customId)).toEqual([1, 6]);
    expect(treeUtils.getNeighbours(mock, 5).map((item: any) => item.customId)).toEqual([2]);
  });

  it('should get siblings of node', () => {
    expect(treeUtils.getSiblings(mock, 1).map((item: any) => item.customId)).toEqual([]);
    expect(treeUtils.getSiblings(mock, 3).map((item: any) => item.customId)).toEqual([4]);
    expect(treeUtils.getSiblings(mock, 5).map((item: any) => item.customId)).toEqual([]);
  });

  it('should get leafs in subtree from node', () => {
    expect(treeUtils.getLeafs(mock, 1).map((item: any) => item.customId)).toEqual([4, 6]);
    expect(treeUtils.getLeafs(mock, 2).map((item: any) => item.customId)).toEqual([5]);
    expect(treeUtils.getLeafs(mock, 3).map((item: any) => item.customId)).toEqual([6]);
    expect(treeUtils.getLeafs(mock, 6).map((item: any) => item.customId)).toEqual([]);
  });

  it('should NOT get leafs for nonexisting node', () => {
    expect(treeUtils.getLeafs(mock, 30).map((item: any) => item.customId)).toEqual([]);
  });

  it('should get size of tree', () => {
    expect(treeUtils.getSize(mock, 1)).toBe(4);
    expect(treeUtils.getSize(mock, 2)).toBe(2);
    expect(treeUtils.getSize(mock, 3)).toBe(2);
  });

  it('should get size of tree', () => {
    expect(treeUtils.getBreath(mock, 1)).toBe(2);
    expect(treeUtils.getBreath(mock, 2)).toBe(1);
    expect(treeUtils.getBreath(mock, 3)).toBe(1);
    expect(treeUtils.getBreath(mock, 6)).toBe(0);
  });

  it('should get depth of tree', () => {
    expect(treeUtils.getDepth(mock, 1)).toBe(0);
    expect(treeUtils.getDepth(mock, 4)).toBe(1);
    expect(treeUtils.getDepth(mock, 6)).toBe(2);
  });

  it('should get level of tree', () => {
    expect(treeUtils.getLevel(mock, 1)).toBe(1);
    expect(treeUtils.getLevel(mock, 4)).toBe(2);
    expect(treeUtils.getLevel(mock, 6)).toBe(3);
  });

  it('should get degree of tree', () => {
    expect(treeUtils.getDegree(mock, 1)).toBe(2);
    expect(treeUtils.getDegree(mock, 3)).toBe(1);
    expect(treeUtils.getDegree(mock, 6)).toBe(0);
  });

  it('should get tree degree of tree', () => {
    expect(treeUtils.getTreeDegree(TREE_MOCK_ITEMS2)).toBe(3);
  });

  it('should get nodes at specific level', () => {
    expect(treeUtils.getNodesAtLevel(mock, 0).map((item: any) => item.customId)).toEqual([1, 2]);
    expect(treeUtils.getNodesAtLevel(mock, 1).map((item: any) => item.customId)).toEqual([3, 4, 5]);
    expect(treeUtils.getNodesAtLevel(mock, 2).map((item: any) => item.customId)).toEqual([6]);
  });

  it('should get width at specific level', () => {
    expect(treeUtils.getWidth(mock, 0)).toBe(2);
    expect(treeUtils.getWidth(mock, 1)).toBe(3);
    expect(treeUtils.getWidth(mock, 2)).toBe(1);
  });

  it('should get height of node', () => {
    expect(treeUtils.getHeight(mock, 1)).toBe(2);
    expect(treeUtils.getHeight(mock, 2)).toBe(1);
    expect(treeUtils.getHeight(mock, 3)).toBe(1);
    expect(treeUtils.getHeight(mock, 4)).toBe(0);
    expect(treeUtils.getHeight(mock, 5)).toBe(0);
    expect(treeUtils.getHeight(mock, 6)).toBe(0);
  });

  it('should get distance between 2 nodes', () => {
    expect(treeUtils.getDistance(mock, 1, 2)).toBe(-1);
    expect(treeUtils.getDistance(mock, 3, 4)).toBe(2);
    expect(treeUtils.getDistance(mock, 4, 6)).toBe(3);
    expect(treeUtils.getDistance(mock, 2, 5)).toBe(1);
    expect(treeUtils.getDistance(mock, 1, 1)).toBe(0);
  });

  it('should get path nodes of node', () => {
    expect(treeUtils.getPathNodes(mock, 6).map((item: any) => item.customId)).toEqual([1, 3]);
    expect(treeUtils.getPathNodes(mock, 4).map((item: any) => item.customId)).toEqual([1]);
    expect(treeUtils.getPathNodes(mock, 5).map((item: any) => item.customId)).toEqual([2]);
    expect(treeUtils.getPathNodes(mock, 1).map((item: any) => item.customId)).toEqual([]);
  });
});