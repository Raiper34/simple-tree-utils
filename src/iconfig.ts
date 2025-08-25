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