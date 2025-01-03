/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * IConfig interface for configuring whole class during instantiating
 */
export interface IConfig {
  /**
   * Name of unique identifier property in nodes
   */
  idProp?: string,
  /**
   * Name of parent identifier property in nodes
   */
  parentIdProp?: string,
  /**
   * Name of property where child nodes are stored
   */
  childrenProp?: string,
}

/**
 * Default name of unique identifier property in nodes
 */
const DEFAULT_ID_PROP = 'id';
/**
 * Default name of parent identifier property in nodes
 */
const DEFAULT_PARENT_ID_PROP = 'parentId';
/**
 * Default name of property where child nodes are stored
 */
const DEFAULT_CHILDREN_PROP = 'children';

/**
 * Class to transform and manipulate tree like structures
 */
export class TreeUtils {

  /**
   * Name of unique identifier property in nodes (default value is `id`)
   */
  private readonly idProp: string;
  /**
   * Name of parent identifier property in nodes (default value is `parentId`)
   */
  private readonly parentIdProp: string;
  /**
   * Name of property where child nodes are stored (default value is `children`)
   */
  private readonly childrenProp: string;

  /**
   * Constructor of class
   * @param config - to configure class, if configuration option is omitted, default one is used
   */
  constructor(config?: IConfig) {
    this.idProp = config?.idProp || DEFAULT_ID_PROP;
    this.parentIdProp = config?.parentIdProp || DEFAULT_PARENT_ID_PROP;
    this.childrenProp = config?.childrenProp || DEFAULT_CHILDREN_PROP;
  }

  /**
   * Convert list to tree like structure
   * @param list list of objects, objects need to have id (as you configured, or 'id' by default) and parentId property (as you configured, or 'parentId' by default)
   * @param parentId id of parent node
   */
  list2Tree(list: any[], parentId: any = null): any[] {
    return TreeUtils.deepCopy(list)
        .filter((item: any) => item[this.parentIdProp] === parentId)
        .map((item: any) => ({
          ...item,
          [this.childrenProp]: this.list2Tree(list, item[this.idProp])
        }));
  }

  /**
   * Convert tree like structure to list
   * @param tree tree of objects, objects need to have children (as you configured, or 'children' by default) and parentId property (as you configured, or 'parentId' by default)
   * @param parentId
   */
  tree2List(tree: any[], parentId: any = null): any[] {
    return TreeUtils.deepCopy(tree).reduce((acc: any, curr: any) => {
      const {[this.childrenProp]: children, ...rest} = curr;
      return [
        ...acc,
        {...rest, [this.parentIdProp]: parentId},
        ...(children.length ? this.tree2List(children, rest[this.idProp]) : [])
      ];
    }, [])
  }

  /**
   * Method to find node in tree structure by given id
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @returns found node
   */
  findById(tree: any[], id: any): any {
    return this.find(tree, item => item[this.idProp] === id);
  }

  /**
   * Method to find node in tree structure by given callback function
   * @param tree - tree structure to search in
   * @param fn - callback function to find node
   * @returns found node
   * @example
   * ```ts
   * utils.findTreeNode(tree, item => item.id === myId);
   * ```
   */
  find(tree: any[], fn: (item: any) => boolean): any {
    const node = tree.find(item => fn(item));
    if (node) {
      return node;
    }
    return tree.reduce((acc, curr) =>
        acc || this.find(curr[this.childrenProp] || [], fn), null
    );
  }

  /**
   * Method to find all nodes in tree structure by given callback function
   * @param tree - tree structure to search in
   * @param fn - callback function to find all nodes
   * @returns all found nodes
   * @example
   * ```ts
   * utils.findAllTreeNodes(tree, item => item.id === myId);
   * ```
   */
  findAll(tree: any[], fn: (item: any) => boolean): any {
    const nodes = tree.filter(item => fn(item));
    return tree.reduce((acc, curr) => (
        [...acc, ...(curr[this.childrenProp].length ? this.findAll(curr[this.childrenProp], fn) : [])]
    ), nodes);
  }

  /**
   * Method to delete node in tree by given id (mutable operation!)
   * @param tree - tree structure for node deleting
   * @param id - identifier of node to delete
   */
  delete(tree: any[], id: any): any {
    const index = tree.findIndex(item => item[this.idProp] == id);
    if (index != -1) {
      return tree.splice(index, 1)[0];
    }
    return tree.reduce((acc, curr) => acc || this.delete(curr[this.childrenProp], id), null);
  }

  /**
   * Method to add new node to tree (mutable operation!)
   * @param tree - tree structure for node adding
   * @param parentId - identifier of parent node, null if new node should be on root level
   * @param childData - data of new node
   */
  add(tree: any[], parentId: any, childData: any): void {
    if (parentId == null) {
      tree.push(childData);
      return;
    }
    const index = tree.findIndex(item => item[this.idProp] == parentId);
    if (index != -1) {
      tree[index][this.childrenProp].push({[this.childrenProp]: [], ...childData});
      return;
    }
    tree.forEach(item => this.add(item[this.childrenProp], parentId, childData));
  }

  /**
   * Method to update node by id with given data in tree (mutable operation!)
   * @param tree - tree structure for node editing
   * @param id - identifier of node to be updated
   * @param data - new data of node (you should also pass children if you want to keep it)
   */
  edit(tree: any[], id: any, data: any): void {
    const index = tree.findIndex(item => item[this.idProp] == id);
    if (index != -1) {
      tree[index] = {[this.idProp]: tree[index][this.idProp], [this.childrenProp]: [], ...data};
      return;
    }
    tree.forEach(item => this.edit(item[this.childrenProp], id, data));
  }

  /**
   * Method to get descendant nodes of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @returns all found children nodes
   */
  getDescendants(tree: any[], id: any): any[] {
    const node = this.findById(tree, id);
    return node ? this.getDescendantNodes(node): [];
  }

  /**
   * Helper method to recursively get all descendant nodes of given node in tree structure
   * @param node - we want to get all of its children
   * @returns all found children nodes
   * @private
   */
  private getDescendantNodes(node: any): any[] {
    return [
      ...node[this.childrenProp],
      ...node[this.childrenProp].reduce((acc: any, curr: any) => ([...acc, ...this.getDescendantNodes(curr)]), [])
    ];
  }

  /**
   * Method to get ancestors of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @returns all found parent nodes
   */
  getAncestors(tree: any[], id: any): any[] {
    const parents = [];
    let parent = this.getParent(tree, id);
    while (parent) {
      parents.push(parent);
      parent = this.getParent(tree, parent[this.idProp]);
    }
    return parents.reverse();
  }

  /**
   * Method to get nodes that are part of path from root
   * Alias for {@link TreeUtils.getAncestors | getAncestors} method
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @returns all nodes that are part of path (ordered from root)
   */
  getPathNodes(tree: any[], id: any): any[] {
    return this.getAncestors(tree, id);
  }

  /**
   * Method to get parent of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @param parent - parent node, if we found something (for recursion only)
   * @returns found parent node
   */
  getParent(tree: any[], id: any, parent: any = null): any {
    const node = tree.find(item => item[this.idProp] === id);
    if (node) {
      return parent;
    }
    return tree.reduce((acc, curr) =>
        acc || this.getParent(curr[this.childrenProp] || [], id, curr), null
    );
  }

  /**
   * Method to get children of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   */
  getChildren(tree: any[], id: any): any[] {
    return this.findById(tree, id)?.[this.childrenProp] || [];
  }

  /**
   * Method to get neighbours (neighbour is parent or child) of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   */
  getNeighbours(tree: any[], id: any): any {
    return [this.getParent(tree, id), ...this.getChildren(tree, id)].filter(item => item);
  }

  /**
   * Method to get siblings of given node in tree structure
   * @param tree - tree structure to search in
   * @param id - identifier of node
   */
  getSiblings(tree: any[], id: any): any {
    return (this.getParent(tree, id)?.[this.childrenProp] || []).filter((item: any) => item[this.idProp] !== id);
  }

  /**
   * Method to get leafs of subtree from given node
   * @param tree - tree structure to search in
   * @param id - identifier of node
   */
  getLeafs(tree: any[], id: any): any {
    return this.findAll(this.getSubTree(tree, id), item => !item[this.childrenProp].length);
  }

  /**
   * Method to get subtree from given node (children of node)
   * Alias for {@link TreeUtils.getChildren | getChildren} method
   * @param tree - tree structure to search in
   * @param id - identifier of node
   * @returns subtree
   */
  getSubTree(tree: any[], id: any): any[] {
    return this.getChildren(tree, id);
  }

  /**
   * Method to get size of subtree (number of nodes in the subtree)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns size of subtree
   */
  getSize(tree: any[], id: any): number {
    return this.tree2List(this.getSubTree(tree, id)).length + 1;
  }

  /**
   * Method to get breath of subtree (the number of leaves in subtree)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns breath of subtree
   */
  getBreath(tree: any[], id: any): number {
    return this.getLeafs(tree, id).length;
  }

  /**
   * Method to get depth of node (the depth of a node is the length of the path to its root i.e., its root path)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns depth of node
   */
  getDepth(tree: any[], id: any): number {
    return this.getPathNodes(tree, id).length;
  }

  /**
   * Method to get level of node (the level of a node is the number of edges along the unique path between it and the root node)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns level of node
   */
  getLevel(tree: any[], id: any): number {
    return this.getDepth(tree, id) + 1;
  }

  /**
   * Method to get degree of node (for a given node, its number of children. A leaf, by definition, has degree zero)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns degree of node
   */
  getDegree(tree: any[], id: any): number {
    return this.getChildren(tree, id).length;
  }

  /**
   * Method to get degree of tree (the degree of a tree is the maximum degree of a node in the tree)
   * @param tree - tree structure
   * @returns degree of tree
   */
  getTreeDegree(tree: any[]): number {
    return tree.reduce((acc, curr) => Math.max(acc, curr[this.childrenProp].length, this.getTreeDegree(curr[this.childrenProp])), 0);
  }

  /**
   * Method to get nodes in tree at specific level
   * @param tree - tree structure to search in
   * @param level - desired level
   * @param actualLevel - actual level, that is searched
   * @returns all nodes, that are on specific level
   */
  getNodesAtLevel(tree: any[], level: number, actualLevel = 0): any[] {
    return tree.reduce((acc, curr) => [
        ...acc,
        ...(level === actualLevel ? [curr] : []),
        ...(actualLevel < level ? this.getNodesAtLevel(curr[this.childrenProp], level, actualLevel + 1) : []),
    ],[]);
  }

  /**
   * Method to get width on level in tree (the number of nodes in a level)
   * @param tree - tree structure
   * @param level - desired level
   * @returns width on desired level
   */
  getWidth(tree: any[], level: number): number {
    return this.getNodesAtLevel(tree, level).length;
  }

  /**
   * Method to get height of node (the height of a node is the length of the longest downward path to a leaf from that node)
   * @param tree - tree structure
   * @param id - identifier of node
   * @returns height of node
   */
  getHeight(tree: any[], id: any): number {
    return this.getHeightNode(this.getSubTree(tree, id));
  }

  /**
   * Helper method to get height of node from children recursively
   * @param tree - tree structure
   * @param height - actual computed height
   * @private
   * @returns height of node
   */
  private getHeightNode(tree: any[], height: number = 0): number {
    return tree.reduce((acc, curr) => Math.max(acc, this.getHeightNode(curr[this.childrenProp], height + 1)), height);
  }

  /**
   * Method to get distance between 2 nodes
   * @param tree - tree structure
   * @param id1 - identifier of first node
   * @param id1 - identifier of second node
   * @returns distance between 2 nodes
   */
  getDistance(tree: any[], id1: any, id2: any): number {
    const ancestors1 = [...this.getPathNodes(tree, id1), this.findById(tree, id1)];
    const ancestors2 = [...this.getPathNodes(tree, id2), this.findById(tree, id2)];
    const common = [...ancestors1].reverse().find(element => ancestors2.includes(element));
    if (!common) {
      return -1;
    }
    const commonIndex1 = ancestors1.findIndex(item => item.id === common.id);
    const commonIndex2 = ancestors2.findIndex(item => item.id === common.id);
    return (ancestors1.length - commonIndex1 - 1) + (ancestors2.length - commonIndex2 - 1);
  }

  /**
   * Helper method to deep clone object
   * @param obj - object to be cloned
   * @private
   * @returns deep cloned object
   */
  private static deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */