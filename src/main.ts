export class TreeUtils {

  static list2Tree(list: any[], parentId: any = null): any[] {
    return this.deepCopy(list)
      .filter((item: any) => item.parentId === parentId)
      .map((item: any) => ({
        ...item,
        children: this.list2Tree(list, item.id)
      }));
  }

  static tree2List(tree: any[], parentId: any = null): any[] {
    return this.deepCopy(tree).reduce((acc: any, curr: any) => {
      const {children, ...rest} = curr;
      return [
        ...acc,
        {...rest, parentId},
        ...(children.length ? this.tree2List(children, rest.id) : [])
      ];
    }, [])
  }

  static findTreeNodeById(tree: any[], id: any): any {
    return this.findTreeNode(tree, item => item.id === id);
  }

  static findTreeNode(tree: any[], fn: (item: any) => boolean): any {
    const node = tree.find(item => fn(item));
    if (node) {
      return node;
    }
    return tree.reduce((acc, curr) =>
        acc || this.findTreeNode(curr.children || [], fn), null
    );
  }

  static deleteNode(tree: any[], id: any): any {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      return tree.splice(index, 1)[0];
    }
    return tree.reduce((acc, curr) => acc || this.deleteNode(curr.children, id), null);
  }

  static addNode(tree: any[], parentId: any, childData: any): void {
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

  static editNode(tree: any[], id: any, data: any): void {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      tree[index] = {id: tree[index].id, children: [], ...data};
      return;
    }
    tree.forEach(item => this.editNode(item.children, id, data));
  }

  private static deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
