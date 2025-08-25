import {IConfig} from "./iconfig.ts";

/**
 * Default configuration options of library
 */
export const DefaultConfig: IConfig = {
    /**
     * Default name of unique identifier property in nodes
     */
    idProp: 'id',
    /**
     * Default name of parent identifier property in nodes
     */
    parentIdProp: 'parentId',
    /**
     * Default name of property where child nodes are stored
     */
    childrenProp: 'children',
}