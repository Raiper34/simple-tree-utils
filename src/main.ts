export class TreeUtils {

  static list2Tree(list: any[], parentId: number | null = null): any {
    return list
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: this.list2Tree(list, item.id)
      }));
  }

  static tree2List(tree: any[], parentId: any = null): any {
    return tree.reduce((acc, curr) => {
      const {children, ...rest} = curr;
      return [
        ...acc,
        {...rest, parentId},
        ...(children.length ? this.tree2List(children, rest.id) : [])
      ];
    }, [])
  }

  static findTreeNodeById(tree: any[], id: any): any {
    const node = tree.find(item => item.id === id);
    if (node) {
      return node;
    }
    return tree.reduce((acc, curr) =>
      acc || this.findTreeNodeById(curr.children || [], id), null
    );
  }

  static deleteNode(tree: any[], id: any): void {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      tree.splice(index, 1);
      return;
    }
    tree.forEach(item => {
      item.children && this.deleteNode(item.children, id);
    });
  }

  static addNode(tree: any[], parentId: any, child: any): void {
    if (parentId == null) {
      tree.push(child);
      return;
    }
    const index = tree.findIndex(item => item.id == parentId);
    if (index != -1) {
      tree[index].children = tree[index].children ? [...tree[index].children, child] : [child];
      return;
    }
    tree.forEach(item => {
      item.children && this.addNode(item.children, parentId, child);
    });
  }

  static editNode(tree: any[], id: any, data: any): void {
    const index = tree.findIndex(item => item.id == id);
    if (index != -1) {
      tree[index] = {
        id: tree[index].id,
        ...data,
        ...(data.children ? {children: []} : {})
      };
      return;
    }
    tree.forEach(item => {
      item.children && this.editNode(item.children, id, data);
    });
  }
}
