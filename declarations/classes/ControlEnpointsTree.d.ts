import { SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import { IControlEndpoint } from '../interfaces/ControlEndpoint';
export default class ControlEnpointsTree {
    constructor();
    /**
     * This method creates a context of control Endpoint
     * @param  {string} contextName - The context of heatmap Name
     * @returns Promise
     */
    createContext(contextName: string): Promise<SpinalNodeRef>;
    /**
     * retrieves and returns all contexts of control Endpoint
     * @returns Promise
     */
    getContexts(): Promise<SpinalNodeRef[]>;
    /**
     * This method creates an endpoint control category
     * @param  {string} contextId
     * @param  {string} categoryName
     * @param  {string} iconName
     * @returns Promise
     */
    createCategory(contextId: string, categoryName: string, iconName: string): Promise<SpinalNodeRef>;
    /**
     * get and return all categories in the context
     * @param  {string} nodeId
     * @returns Promise
     */
    getCategories(nodeId: string): Promise<SpinalNodeRef[]>;
    /**
     * This method creates an endpoint control group
     * @param  {string} contextId
     * @param  {string} categoryId
     * @param  {string} groupName
     * @param  {string} groupColor
     * @returns Promise
     */
    createGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<SpinalNodeRef>;
    /**
     * get and return all groups in the category
     * @param  {string} nodeId
     * @returns Promise
     */
    getGroups(nodeId: string): Promise<SpinalNodeRef[]>;
    /**
     * get All control endpoint node linked to group selected
     * @param  {string} groupId
     * @returns Promise
     */
    getControlPoint(groupId: string): Promise<SpinalNodeRef[]>;
    /**
     * checks if the id passed in parameter is a group of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointGroup(id: string): boolean;
    /**
     * creates and links a profil of control endpoint to the group selected in the context selected
     * @param  {string} contextId
     * @param  {string} groupId
     * @param  {any} controlPointProfil
     * @returns Promise of new groupId and old groupId
     */
    createControlPointProfil(contextId: string, groupId: string, controlPointProfil?: {
        name: string;
        endpoints: IControlEndpoint[];
    }): Promise<{
        old_group: string;
        newGroup: string;
    }>;
}
export { ControlEnpointsTree };
