### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [3.2.0](https://github.com/Raiper34/simple-tree-utils/compare/3.1.2...3.2.0)

- feat(delete): allow delete multiple nodes in delete method [`#18`](https://github.com/Raiper34/simple-tree-utils/issues/18)
- refactor(config): move config interface and config defaults into separated files [`a38b3f9`](https://github.com/Raiper34/simple-tree-utils/commit/a38b3f9cbd3bb3f1ad2e96560a9dd5d0e2acfd0c)
- docs(readme): improve readme installation instructions [`b93eaba`](https://github.com/Raiper34/simple-tree-utils/commit/b93eaba5c80f2db86757696f669f1f71bb026559)
- fix(children): fix methods, to be able to work also, when children property is undefined [`e4d24b2`](https://github.com/Raiper34/simple-tree-utils/commit/e4d24b22655f9a31d8a69a7cd093dc6ddec78c0b)

#### [3.1.2](https://github.com/Raiper34/simple-tree-utils/compare/3.1.1...3.1.2)

> 20 April 2025

- fix(delete): fix delete and deleteBy methods, because implementation did not work properly [`64dc710`](https://github.com/Raiper34/simple-tree-utils/commit/64dc7109753b19214fc8fb55c203da8f589ab4ba)

#### [3.1.1](https://github.com/Raiper34/simple-tree-utils/compare/3.1.0...3.1.1)

> 12 April 2025

- fix(deleteby): fix deleteBy filter is not function bug [`0f91992`](https://github.com/Raiper34/simple-tree-utils/commit/0f919922bfe7491f62edebb5df6183f14c745202)

#### [3.1.0](https://github.com/Raiper34/simple-tree-utils/compare/3.0.1...3.1.0)

> 12 April 2025

- feat(deleteby): add deleteBy method to delete nodes by given callback [`c62afc9`](https://github.com/Raiper34/simple-tree-utils/commit/c62afc9059b2f7c6a81ef488ede2c419f43a948c)
- feat(computepaths): add computePaths method to compute paths for all nodes [`e30e6a8`](https://github.com/Raiper34/simple-tree-utils/commit/e30e6a8713471a0fc9976f6e5b16248fec767198)
- feat(foreach): add forEach moethod to iterate over each nodes [`1352f44`](https://github.com/Raiper34/simple-tree-utils/commit/1352f44a409d7726ea2e68a3983b188f555bf912)

#### [3.0.1](https://github.com/Raiper34/simple-tree-utils/compare/3.0.0...3.0.1)

> 11 April 2025

- fix(tree2list): ability to parse tree with nodes that does not contain children property [`30e8f49`](https://github.com/Raiper34/simple-tree-utils/commit/30e8f4957a9ef10cb63d367b3121299d4f491b8f)

### [3.0.0](https://github.com/Raiper34/simple-tree-utils/compare/2.3.1...3.0.0)

> 6 February 2025

- build(vite): add vite to build everrything with one tool and remove browserify and uglify [`18a70be`](https://github.com/Raiper34/simple-tree-utils/commit/18a70bec173263f03459ad331af4e67f7a775db6)
- docs(readme): automatic version dump [`662e335`](https://github.com/Raiper34/simple-tree-utils/commit/662e335739bf18d4d58535a39927c87ac83ec2ae)
- docs(website): modernize website api documentation [`7119871`](https://github.com/Raiper34/simple-tree-utils/commit/71198715b7a669d012bd4bc0587a76b1bbf77994)
- docs(readme): improve style of readme [`ab3f309`](https://github.com/Raiper34/simple-tree-utils/commit/ab3f309189bb3636a9b8780c472c4665f23b3015)

#### [2.3.1](https://github.com/Raiper34/simple-tree-utils/compare/2.3.0...2.3.1)

> 1 February 2025

- fix(method): make helper _add method as private [`cc690de`](https://github.com/Raiper34/simple-tree-utils/commit/cc690ded79c3909ddb8f76afaea8170b719f1616)

#### [2.3.0](https://github.com/Raiper34/simple-tree-utils/compare/2.2.0...2.3.0)

> 1 February 2025

- feat(addunshift): addUnshift method to add item as first child, instead of last one [`59d761b`](https://github.com/Raiper34/simple-tree-utils/commit/59d761b286a95b4d7e459aabd716ba84ce13e918)

#### [2.2.0](https://github.com/Raiper34/simple-tree-utils/compare/2.1.0...2.2.0)

> 17 January 2025

- feat(method): add method now supports adding multiple items at once [`d4f4d5d`](https://github.com/Raiper34/simple-tree-utils/commit/d4f4d5dc4ed6d7e36fbc8d3cca3e106b1b9e453e)

#### [2.1.0](https://github.com/Raiper34/simple-tree-utils/compare/2.0.0...2.1.0)

> 8 January 2025

- feat(list2tree): add ability to define custom tree roots [`#17`](https://github.com/Raiper34/simple-tree-utils/issues/17)
- docs(changelog): add changelog to project [`2bc7738`](https://github.com/Raiper34/simple-tree-utils/commit/2bc7738a31bcad8617e80267e4c619385d26f885)

### [2.0.0](https://github.com/Raiper34/simple-tree-utils/compare/1.0.2...2.0.0)

> 3 January 2025

- feat(method): getPathNodes presented [`#15`](https://github.com/Raiper34/simple-tree-utils/issues/15)
- feat(methods): getDistance presented [`#8`](https://github.com/Raiper34/simple-tree-utils/issues/8)
- feat(methods): getNodesAtLevel, getWidth, getHeight, getTreeDegree methods presented [`#5`](https://github.com/Raiper34/simple-tree-utils/issues/5) [`#6`](https://github.com/Raiper34/simple-tree-utils/issues/6) [`#10`](https://github.com/Raiper34/simple-tree-utils/issues/10) [`#14`](https://github.com/Raiper34/simple-tree-utils/issues/14)
- feat(methods): getSize, getBreath, getDepth, getLevel, getDegree  methods presented [`#13`](https://github.com/Raiper34/simple-tree-utils/issues/13) [`#12`](https://github.com/Raiper34/simple-tree-utils/issues/12) [`#9`](https://github.com/Raiper34/simple-tree-utils/issues/9) [`#7`](https://github.com/Raiper34/simple-tree-utils/issues/7) [`#4`](https://github.com/Raiper34/simple-tree-utils/issues/4)
- feat(methods): getLeafs method presented [`#13`](https://github.com/Raiper34/simple-tree-utils/issues/13)
- build(node): update node to v22, typescript to v5 and all possible dependencies [`ce4acc0`](https://github.com/Raiper34/simple-tree-utils/commit/ce4acc087ce75d218f069f2e18e2bf911824c465)
- refactor(api): refactor publis api to be more JSish way [`798e264`](https://github.com/Raiper34/simple-tree-utils/commit/798e2645af5e2f96aa5c7992aa6cff495abef197)
- feat(api): rename public API methods [`3e7bbc8`](https://github.com/Raiper34/simple-tree-utils/commit/3e7bbc8260e0a91f9f150ba2268f8b0899df6467)
- docs(comments): add missing documentation comments [`3744f64`](https://github.com/Raiper34/simple-tree-utils/commit/3744f64ab9974024a5a3f3685c016584a479f2ba)
- feat(methods): getNeighbours and getSiblings methods presented [`0ae9eed`](https://github.com/Raiper34/simple-tree-utils/commit/0ae9eed204c13a46c01cb681fd567696db7d612f)
- refactor(naming): refactor naming of main file with all logic [`d1f7e75`](https://github.com/Raiper34/simple-tree-utils/commit/d1f7e7518829c583767cf70de5199bf9e5032da3)
- docs(readme): fix readme method usage instruction [`07aa1cf`](https://github.com/Raiper34/simple-tree-utils/commit/07aa1cff8a6e86044992904c91d140894234c005)
- docs(readme): unify badges [`20c2f4d`](https://github.com/Raiper34/simple-tree-utils/commit/20c2f4d884d695229796c25dc026ff6a423bcff0)
