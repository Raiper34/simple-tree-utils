/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Class to transform and manipulate tree like structures
 */
export class TreeUtils {

  /**
   * Convert list to tree like structure
   * @param list list of objects (object need to have id and parentId)
   * @param parentId id of parent node
   */
  list2Tree(list: any[], parentId: any = null): any[] {
    return TreeUtils.deepCopy(list)
        .filter((item: any) => item.parentId === parentId)
        .map((item: any) => ({
          ...item,
          children: this.list2Tree(list, item.id)
        }));
  }

  /**
   * Convert tree like structure to list
   * @param tree tree of objects (object need to have child property and parentId)
   * @param parentId
   */
  tree2List(tree: any[], parentId: any = null): any[] {
    return TreeUtils.deepCopy(tree).reduce((acc: any, curr: any) => {
      const {children, ...rest} = curr;
      return [
        ...acc,
        {...rest, parentId},
        ...(children.length ? this.tree2List(children, rest.id) : [])
      ];
    }, [])
  }

  findTreeNodeById(tree: any[], id: any): any {
    return this.findTreeNode(tree, item => item.id === id);
  }

  findTreeNode(tree: any[], fn: (item: any) => boolean): any {
    const node = tree.find(item => fn(item));
    if (node) {
      return node;
    }
    return tree.reduce((acc, curr) =>
        acc || this.findTreeNode(curr.children || [], fn), null
    );
  }

  deleteNode(tree: any[], id: any): any {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      return tree.splice(index, 1)[0];
    }
    return tree.reduce((acc, curr) => acc || this.deleteNode(curr.children, id), null);
  }

  addNode(tree: any[], parentId: any, childData: any): void {
    if (parentId == null) {
      tree.push(childData);
      return;
    }
    const index = tree.findIndex(item => item.id == parentId);
    if (index != -1) {
      tree[index].children.push({children: [], ...childData});
      return;
    }
    tree.forEach(item => this.addNode(item.children, parentId, childData));
  }

  editNode(tree: any[], id: any, data: any): void {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      tree[index] = {id: tree[index].id, children: [], ...data};
      return;
    }
    tree.forEach(item => this.editNode(item.children, id, data));
  }

  findAllChildrenNodes(tree: any[], id: any): any[] {
    const node = this.findTreeNodeById(tree, id);
    return node ? [
      ...node.children,
      ...node.children.reduce((acc: any, curr: any) => ([...acc, ...this.getChildrenNodes(curr)]), [])
    ] : [];
  }

  private getChildrenNodes(node: any): any[] {
    return [
      ...node.children,
      ...node.children.reduce((acc: any, curr: any) => ([...acc, ...this.getChildrenNodes(curr)]), [])
    ];
  }

  findAllParentNodes(tree: any[], id: any): any[] {
    const parents = [];
    let parent = this.findNodeParent(tree, id);
    while (parent) {
      parents.push(parent);
      parent = this.findNodeParent(tree, parent.id);
    }
    return parents.reverse();
  }

  findNodeParent(tree: any[], id: any, parent: any = null): any {
    const node = tree.find(item => item.id === id);
    if (node) {
      return parent;
    }
    return tree.reduce((acc, curr) =>
        acc || this.findNodeParent(curr.children || [], id, curr), null
    );
  }

  private static deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */