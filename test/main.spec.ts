import {TreeUtils} from "../src";


const LIST_MOCK_ITEMS = [
  {customId: 1, parentCustomId: null, name: 'Node 1'},
  {customId: 2, parentCustomId: null, name: 'Node 2'},
  {customId: 3, parentCustomId: 1, name: 'Node 3'},
  {customId: 4, parentCustomId: 1, name: 'Node 4'},
  {customId: 5, parentCustomId: 2, name: 'Node 5'},
  {customId: 6, parentCustomId: 3, name: 'Node 6'},
];

const TREE_MOCK_ITEMS = [
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
    ]
  },
];

const treeUtils = new TreeUtils({
  idProp: 'customId',
  parentIdProp: 'parentCustomId',
  childrenProp: 'customChildren',
});

describe('Tree utils methods', () => {

  it('should setup converter with defaults when parameter is not provided', () => {
    const treeUtils = new TreeUtils();
    expect(treeUtils.list2Tree([{id: 1, parentId: null, name: 'Node 1'}]))
        .toEqual([{id: 1, parentId: null, name: 'Node 1', children: []}]);
  });

  it('should convert list to tree', () => {
    expect(treeUtils.list2Tree(LIST_MOCK_ITEMS)).toEqual(TREE_MOCK_ITEMS);
  });

  it('should convert tree to list', () => {
    expect(treeUtils.tree2List(TREE_MOCK_ITEMS).sort((a: any, b: any) => a.customId - b.customId)).toEqual(LIST_MOCK_ITEMS);
  });

  it('should find node by given customId', () => {
    expect(treeUtils.findTreeNodeById(TREE_MOCK_ITEMS, 6)).toEqual({customId: 6, parentCustomId: 3, name: 'Node 6', customChildren: []});
  });

  it('should not fail, when children prop is missing', () => {
    const input = [
      {customId: 1, parentCustomId: null, name: 'Node 1'}
    ]
    expect(treeUtils.findTreeNodeById(input, 6)).toBeNull();
    expect(treeUtils.findNodeParent(input, 6)).toBeNull();
  });

  it('should delete node by given customId', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.deleteNode(mock, 6);
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
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.addNode(mock, 4, {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []});
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
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.addNode(mock, null, {customId: 7, parentCustomId: 4, name: 'Node 7', customChildren: []});
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
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    treeUtils.editNode(mock, 5, {customId: 5, parentCustomId: 2, name: 'Node 5 edited', customChildren: []});
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
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findNodeParent(mock, 6).customId).toBe(3);
    expect(treeUtils.findNodeParent(mock, 1)).toBeNull();
  });

  it('should find ALL parents of node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllParentNodes(mock, 6).map((item: any) => item.customId)).toEqual([1, 3]);
    expect(treeUtils.findAllParentNodes(mock, 4).map((item: any) => item.customId)).toEqual([1]);
    expect(treeUtils.findAllParentNodes(mock, 5).map((item: any) => item.customId)).toEqual([2]);
    expect(treeUtils.findAllParentNodes(mock, 1).map((item: any) => item.customId)).toEqual([]);
  });

  it('should find ALL customChildren of node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllChildrenNodes(mock, 1).map((item: any) => item.customId)).toEqual([3, 4, 6]);
    expect(treeUtils.findAllChildrenNodes(mock, 2).map((item: any) => item.customId)).toEqual([5]);
    expect(treeUtils.findAllChildrenNodes(mock, 5).map((item: any) => item.customId)).toEqual([]);
  });

  it('should not find ALL customChildren of nonexisting node', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllChildrenNodes(mock, 666).map((item: any) => item.customId)).toEqual([]);
  });

  it('should find ALL nodes that match callback', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    expect(treeUtils.findAllTreeNodes(mock, item => item.customId % 2 === 0).map((item: any) => item.customId)).toEqual([2, 4, 6]);
    expect(treeUtils.findAllTreeNodes(mock, item => item.customId % 3 === 0).map((item: any) => item.customId)).toEqual([3, 6]);
    expect(treeUtils.findAllTreeNodes(mock, item => item.name.includes('Node')).map((item: any) => item.customId)).toEqual([1, 2, 3, 4, 6, 5]);
  });
});