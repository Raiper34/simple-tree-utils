import {TreeUtils} from "../src/main";


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

describe('', () => {
  it('1', () => {
    expect(TreeUtils.list2Tree(LIST_MOCK_ITEMS)).toEqual(TREE_MOCK_ITEMS);
  });

  it('2', () => {
    expect(TreeUtils.tree2List(TREE_MOCK_ITEMS).sort((a: any, b: any) => a.id - b.id)).toEqual(LIST_MOCK_ITEMS);
  });

  it('3', () => {
    expect(TreeUtils.findTreeNodeById(TREE_MOCK_ITEMS, 6)).toEqual({id: 6, parentId: 3, name: 'Node 6', children: []});
  });

  it('4', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    TreeUtils.deleteNode(mock, 6);
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

  it('5', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    TreeUtils.addNode(mock, 4, {id: 7, parentId: 4, name: 'Node 7', children: []});
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

  it('6', () => {
    const mock = JSON.parse(JSON.stringify(TREE_MOCK_ITEMS));
    TreeUtils.editNode(mock, 5, {id: 5, parentId: 2, name: 'Node 5 edited', children: []});
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
});
