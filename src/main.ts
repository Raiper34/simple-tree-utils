/* eslint-disable @typescript-eslint/no-explicit-any */

interface IConfig {
  idProp?: string,
  parentIdProp?: string,
  childrenProp?: string,
}

const DEFAULT_ID_PROP = 'id';
const DEFAULT_PARENT_ID_PROP = 'parentId';
const DEFAULT_CHILDREN_PROP = 'children';

/**
 * Class to transform and manipulate tree like structures
 */
export class TreeUtils {

  private readonly idProp: string;
  private readonly parentIdProp: string;
  private readonly childrenProp: string;

  constructor(config?: IConfig) {
    this.idProp = config?.idProp || DEFAULT_ID_PROP;
    this.parentIdProp = config?.parentIdProp || DEFAULT_PARENT_ID_PROP;
    this.childrenProp = config?.childrenProp || DEFAULT_CHILDREN_PROP;
  }

  /**
   * Convert list to tree like structure
   * @param list list of objects (object need to have id and parentId)
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
   * @param tree tree of objects (object need to have child property and parentId)
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

  findTreeNodeById(tree: any[], id: any): any {
    return this.findTreeNode(tree, item => item[this.idProp] === id);
  }

  findTreeNode(tree: any[], fn: (item: any) => boolean): any {
    const node = tree.find(item => fn(item));
    if (node) {
      return node;
    }
    return tree.reduce((acc, curr) =>
        acc || this.findTreeNode(curr[this.childrenProp] || [], fn), null
    );
  }

  findAllTreeNodes(tree: any[], fn: (item: any) => boolean): any {
    const nodes = tree.filter(item => fn(item));
    return tree.reduce((acc, curr) => (
        [...acc, ...(curr[this.childrenProp].length ? this.findAllTreeNodes(curr[this.childrenProp], fn) : [])]
    ), nodes);
  }

  deleteNode(tree: any[], id: any): any {
    const index = tree.findIndex(item => item[this.idProp] == id);
    if (index != -1) {
      return tree.splice(index, 1)[0];
    }
    return tree.reduce((acc, curr) => acc || this.deleteNode(curr[this.childrenProp], id), null);
  }

  addNode(tree: any[], parentId: any, childData: any): void {
    if (parentId == null) {
      tree.push(childData);
      return;
    }
    const index = tree.findIndex(item => item[this.idProp] == parentId);
    if (index != -1) {
      tree[index][this.childrenProp].push({[this.childrenProp]: [], ...childData});
      return;
    }
    tree.forEach(item => this.addNode(item[this.childrenProp], parentId, childData));
  }

  editNode(tree: any[], id: any, data: any): void {
    const index = tree.findIndex(item => item[this.idProp] == id);
    if (index != -1) {
      tree[index] = {[this.idProp]: tree[index][this.idProp], [this.childrenProp]: [], ...data};
      return;
    }
    tree.forEach(item => this.editNode(item[this.childrenProp], id, data));
  }

  findAllChildrenNodes(tree: any[], id: any): any[] {
    const node = this.findTreeNodeById(tree, id);
    return node ? [
      ...node[this.childrenProp],
      ...node[this.childrenProp].reduce((acc: any, curr: any) => ([...acc, ...this.getChildrenNodes(curr)]), [])
    ] : [];
  }

  private getChildrenNodes(node: any): any[] {
    return [
      ...node[this.childrenProp],
      ...node[this.childrenProp].reduce((acc: any, curr: any) => ([...acc, ...this.getChildrenNodes(curr)]), [])
    ];
  }

  findAllParentNodes(tree: any[], id: any): any[] {
    const parents = [];
    let parent = this.findNodeParent(tree, id);
    while (parent) {
      parents.push(parent);
      parent = this.findNodeParent(tree, parent[this.idProp]);
    }
    return parents.reverse();
  }

  findNodeParent(tree: any[], id: any, parent: any = null): any {
    const node = tree.find(item => item[this.idProp] === id);
    if (node) {
      return parent;
    }
    return tree.reduce((acc, curr) =>
        acc || this.findNodeParent(curr[this.childrenProp] || [], id, curr), null
    );
  }

  private static deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */