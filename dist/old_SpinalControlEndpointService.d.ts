import { Model } from 'spinal-core-connectorjs_type';
import { IControlEndpoint } from './interfaces/ControlEndpoint';
/**
 * @class SpinalControlEndpointService
 *  @property {string} CONTROL_POINT_TYPE - typeof control point node
 *  @property {string} CONTROL_GROUP_TYPE  - typeof control point group node
 *  @property {string} CONTROL_GROUP_TO_CONTROLPOINTS  - relation between control point group and control point
 *  @property {string} ROOM_TO_CONTROL_GROUP - Relation between room and control point group
 */
export declare class SpinalControlEndpointService {
    CONTROL_POINT_TYPE: string;
    CONTROL_GROUP_TYPE: string;
    CONTROL_GROUP_TO_CONTROLPOINTS: string;
    ROOM_TO_CONTROL_GROUP: string;
    constructor();
    /**
     * This method creates a context of control Endpoint
     * @param  {string} contextName - The context of heatmap Name
     * @returns Promise
     */
    createContext(contextName: string): Promise<typeof Model>;
    /**
     * retrieves and returns all contexts of control Endpoint
     * @returns Promise
     */
    getContexts(): Promise<Array<typeof Model>>;
    /**
     * checks if the id passed in parameter is a context of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointContext(id: string): boolean;
    /**
     * This method creates an endpoint control category
     * @param  {string} contextId
     * @param  {string} categoryName
     * @param  {string} iconName
     * @returns Promise
     */
    createCategory(contextId: string, categoryName: string, iconName: string): Promise<typeof Model>;
    /**
     * get and return all categories in the context
     * @param  {string} nodeId
     * @returns Promise
     */
    getCategories(nodeId: string): Promise<Array<typeof Model>>;
    /**
     * This method creates an endpoint control group
     * @param  {string} contextId
     * @param  {string} categoryId
     * @param  {string} groupName
     * @param  {string} groupColor
     * @returns Promise
     */
    createGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<typeof Model>;
    /**
     * get and return all groups in the category
     * @param  {string} nodeId
     * @returns Promise
     */
    getGroups(nodeId: string): Promise<Array<typeof Model>>;
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
     * @returns Promise
     */
    createControlPointProfil(contextId: string, groupId: string, controlPointProfil?: {
        name: string;
        endpoints: Array<IControlEndpoint>;
    }): Promise<any>;
    /**
     * get All control endpoint node linked to group selected
     * @param  {string} groupId
     * @returns Promise
     */
    getControlPoint(groupId: string): Promise<Array<typeof Model>>;
    /**
     * get All control endpoint profile  linked to control endpoint node
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    getControlPointProfil(contextId: string, controlPointId: string): Promise<{
        name: string;
        endpoints: any;
    }>;
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    linkControlPointToGroup(nodeId: string, controlPointContextId: string, controlPointId: string): Promise<Array<any>>;
    /**
     * Edit the control point profile and update the bms endpoints associated according to the control point profiles
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @param  {Array} values
     * @returns Promise
     */
    editControlPointProfil(contextId: string, controlPointId: string, values: Array<IControlEndpoint>): Promise<{
        name: string;
        endpoints: any;
    }>;
    /**
     * get All node linked to the control point
     * @param  {string} controlProfilId
     * @returns Promise
     */
    getElementLinked(controlProfilId: string): Promise<Array<typeof Model>>;
    /**
     * For a selected group format the control point profiles and the rooms of this group
     * @param  {string} groupId
     * @returns Promise
     */
    getDataFormated(groupId: string): Promise<any>;
    /**
     * get and return the endpoint linked to nodeId and created according the profil selected
     * @param  {string} nodeId
     * @param  {string} profilId
     * @returns Promise
     */
    getReferencesLinked(nodeId: string, profilId: string): Promise<any>;
    /**
     * get All endpoints linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsLinked(nodeId: string, profilId: string): Promise<Array<any>>;
    /**
     * get All endpoints Nodes linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsNodeLinked(roomId: string, profilId: string): Promise<Array<any>>;
    /**
     * Get all node linked to the nodeId (control endpoint | id of group)
     * @param  {string} nodeId - controlPointId or groupId
     * @returns Promise
     */
    loadElementLinked(nodeId: string): Promise<any>;
    private getGroupItems;
    private createNode;
    private linkEndpointToProfil;
    private createEndpointNode;
    private getCurrentValue;
    private saveItemLinked;
    private isLinked;
    private getContextId;
    private formatRooms;
    private controlPointProfilIsAlreadyLinked;
    private getDifference;
    private isUpdated;
    private objectsAreEquals;
    private configAreEquals;
    private getAllProfils;
    private getProfilEndpoints;
    private create;
    private update;
    private delete;
    private getEndpointByType;
    private getIndex;
    private setProfilValue;
    private modEndpoint;
    private listenLinkItemToGroupEvent;
    private listenUnLinkItemToGroupEvent;
}
