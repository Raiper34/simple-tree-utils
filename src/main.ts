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
    return node ? [
      ...node[this.childrenProp],
      ...node[this.childrenProp].reduce((acc: any, curr: any) => ([...acc, ...this.getDescendantNodes(curr)]), [])
    ] : [];
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