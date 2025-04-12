[![npm version](https://badge.fury.io/js/simple-tree-utils.svg)](https://badge.fury.io/js/simple-tree-utils)
[![docs](https://badgen.net/badge/docs/online/orange)](https://simple-tree-utils.netlify.app)
![npm bundle size](https://img.shields.io/bundlephobia/min/simple-tree-utils)
![NPM](https://img.shields.io/npm/l/simple-tree-utils)
[![CircleCI](https://circleci.com/gh/Raiper34/simple-tree-utils.svg?style=shield)](https://circleci.com/gh/Raiper34/simple-tree-utils)
[![Coverage Status](https://coveralls.io/repos/github/Raiper34/simple-tree-utils/badge.svg?branch=main)](https://coveralls.io/github/Raiper34/simple-tree-utils?branch=main)
[![npm](https://img.shields.io/npm/dt/simple-tree-utils)](https://badge.fury.io/js/simple-tree-utils)
[![npm](https://img.shields.io/npm/dm/simple-tree-utils)](https://badge.fury.io/js/simple-tree-utils)
[![npm](https://img.shields.io/npm/dw/simple-tree-utils)](https://badge.fury.io/js/simple-tree-utils)
[![](https://data.jsdelivr.com/v1/package/npm/simple-tree-utils/badge?style=rounded)](https://www.jsdelivr.com/package/npm/simple-tree-utils)
[![GitHub Repo stars](https://img.shields.io/github/stars/raiper34/simple-tree-utils)](https://github.com/Raiper34/simple-tree-utils)

# Simple Tree Utils
Simple Tree Utils is the library to convert and manipulate with tree-like structures.
Library provides converter from an array of objects to trees like structure and vice versa,
and also methods to manipulate that tree and/or search in that tree.

It is created because I needed to convert the array of objects into a tree to visualize in
[**Angular tree component**](https://www.npmjs.com/package/@circlon/angular-tree-component).
Surely there are plenty of similar libraries, but I think all of them work with their own
models/classes, I needed to use my own data without no extra instantiating,
or adding extra methods/properties into the working model.

### Content
- [🚀 Installation](#-Installation)
- [📚 Documentation](#-documentation)
- [💻 Usage](#-usage)
    - [🌐 Browser](#-browser)
- [⚖️ License](#-license)

# 🚀 Installation
Install **Simple Tree Utils** library using npm
```sh
npm install simple-tree-utils --save
```
or with jsdelivr
```html
<script src="https://cdn.jsdelivr.net/npm/simple-tree-utils@3.1.1/dist/simple-tree-utils.iife.js"></script>
```

# 📚 Documentation
For more details and complete documentation check: https://simple-tree-utils.netlify.app/

# 💻 Usage
First instantiate class with config, or without config.
```ts
const treeUtils = new TreeUtils(); // without config, default values are used (id as idProp, parentId as parentIdProp, children as childrenProp)
const treeUtils2 = new TreeUtils({
  idProp: 'id', // the key of a unique identifier for an object (source object)
  parentIdProp: 'parentId', // the key of a unique parent identifier (source object)
  childrenProp: 'children', // the key, where child nodes are stored (destination object tree)
});
```
After instantiation, you can use tree utils. You can convert the array of the following objects into a tree using `list2Tree` method as following
```ts
const items = [
  {id: 1, parentId: null, name: 'Node 1'},
  {id: 2, parentId: null, name: 'Node 2'},
  {id: 3, parentId: 1, name: 'Node 3'},
  {id: 4, parentId: 1, name: 'Node 4'},
  {id: 5, parentId: 2, name: 'Node 5'},
  {id: 6, parentId: 3, name: 'Node 6'},
];
const output = treeUtils.list2Tree(items);
```
then the output of lift2Tree will be
```ts
const tree = [
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
```
When you got a structure like the above, you can use all the methods stated here: https://simple-tree-utils.netlify.app/classes/treeutils

For example, we can find node by giving callback
```ts
const node = treeUtils.find(tree, item => item.id === 2);
```
If you need a list again, you can convert the tree back to a list using `treeUtils.tree2List` method
```ts
treeUtils.tree2List(tree);
```

# 🌐 Browser
You can also use this library in the browser without compiling using jsDelivr.
Import script into HTML file, and you can access classes through the global `treeUtils` object.
```html
<script src="https://cdn.jsdelivr.net/npm/simple-tree-utils@3.1.1/dist/simple-tree-utils.iife.js"></script>
<script>
    const utils = new simpleTreeUtils.TreeUtils();
    const tree = utils.list2Tree(items);
</script>
```

# ⚖️ License  
[MIT](https://choosealicense.com/licenses/mit/)