import {TreeUtils} from "../src";


const LIST_MOCK_ITEMS = [
  {id: 1, parentId: null, name: 'Node 1'},
  {id: 2, parentId: null, name: 'Node 2'},
  {id: 3, parentId: 1, name: 'Node 3'},
  {id: 4, parentId: 1, name: 'Node 4'},
  {id: 5, parentId: 2, name: 'Node 5'},
  {id: 6, parentId: 3, name: 'Node 6'},
];

const TREE_MOCK_ITEMS = [
  {
    id: 1, parentId: null, name: 'Node 1', children: [
      {
        id: 3, parentId: 1, name: 'Node 3', children: [
          {id: 6, parentId: 3, name: 'Node 6', children: []},
        ]
      },
      {id: 4, parentId: 1, name: 'Node 4', children: []},
    ]
  },
  {
    id: 2, parentId: null, name: 'Node 2', children: [
      {id: 5, parentId: 2, name: 'Node 5', children: []},
    ]
  },
];

const treeUtils = new TreeUtils();

describe('Tree utils methods', () => {

  it('should convert list to tree', () => {
    expect(treeUtils.list2Tree(LIST_MOCK_ITEMS)).toEqual(TREE_MOCK_ITEMS);
  });

  it('should convert tree to list', () => {
    expect(treeUtils.tree2List(TREE_MOCK_ITEMS).sort((a: any, b: any) => a.id - b.id)).toEqual(LIST_MOCK_ITEMS);
  });

  it('should find node by given id', () => {
    expect(treeUtils.findTreeNodeById(TREE_MOCK_ITEMS, 6)).toEqual({id: 6, parentId: 3, name: 'Node 6', children: []});
  });

  it('should delete node by given id', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.deleteNode(mock, 6);
    const out = [
      {
        id: 1, parentId: null, name: 'Node 1', children: [
          {
            id: 3, parentId: 1, name: 'Node 3', children: []
          },
          {id: 4, parentId: 1, name: 'Node 4', children: []},
        ]
      },
      {
        id: 2, parentId: null, name: 'Node 2', children: [
          {id: 5, parentId: 2, name: 'Node 5', children: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should add node to parent with given id', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.addNode(mock, 4, {id: 7, parentId: 4, name: 'Node 7', children: []});
    const out = [
      {
        id: 1, parentId: null, name: 'Node 1', children: [
          {
            id: 3, parentId: 1, name: 'Node 3', children: [
              {id: 6, parentId: 3, name: 'Node 6', children: []}
            ]
          },
          {id: 4, parentId: 1, name: 'Node 4', children: [
              {id: 7, parentId: 4, name: 'Node 7', children: []}
            ]},
        ]
      },
      {
        id: 2, parentId: null, name: 'Node 2', children: [
          {id: 5, parentId: 2, name: 'Node 5', children: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should edit node of given id by given data', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.editNode(mock, 5, {id: 5, parentId: 2, name: 'Node 5 edited', children: []});
    const out = [
      {
        id: 1, parentId: null, name: 'Node 1', children: [
          {
            id: 3, parentId: 1, name: 'Node 3', children: [
              {id: 6, parentId: 3, name: 'Node 6', children: []}
            ]
          },
          {id: 4, parentId: 1, name: 'Node 4', children: []},
        ]
      },
      {
        id: 2, parentId: null, name: 'Node 2', children: [
          {id: 5, parentId: 2, name: 'Node 5 edited', children: []},
        ]
      },
    ]
    expect(mock).toEqual(out);
  });

  it('should find parent of node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findNodeParent(mock, 6).id).toBe(3);
    expect(treeUtils.findNodeParent(mock, 1)).toBeNull();
  });

  it('should find ALL parents of node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllParentNodes(mock, 6).map((item: any) => item.id)).toEqual([1, 3]);
    expect(treeUtils.findAllParentNodes(mock, 4).map((item: any) => item.id)).toEqual([1]);
    expect(treeUtils.findAllParentNodes(mock, 5).map((item: any) => item.id)).toEqual([2]);
    expect(treeUtils.findAllParentNodes(mock, 1).map((item: any) => item.id)).toEqual([]);
  });

  it('should find ALL children of node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllChildrenNodes(mock, 1).map((item: any) => item.id)).toEqual([3, 4, 6]);
    expect(treeUtils.findAllChildrenNodes(mock, 2).map((item: any) => item.id)).toEqual([5]);
    expect(treeUtils.findAllChildrenNodes(mock, 5).map((item: any) => item.id)).toEqual([]);
  });

  it('should find ALL nodes that match callback', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllTreeNodes(mock, item => item.id % 2 === 0).map((item: any) => item.id)).toEqual([2, 4, 6]);
    expect(treeUtils.findAllTreeNodes(mock, item => item.id % 3 === 0).map((item: any) => item.id)).toEqual([3, 6]);
    expect(treeUtils.findAllTreeNodes(mock, item => item.name.includes('Node')).map((item: any) => item.id)).toEqual([1, 2, 3, 4, 6, 5]);
  });
});