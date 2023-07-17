import { SpinalNode, SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import { IControlEndpoint, IControlEndpointModel, ILinkedToGroupRes } from '../interfaces/ControlEndpoint';
import { IControlPointRes } from '../interfaces/IControlPointRes';
export default class ControlEndpointService {
    constructor();
    /**
     * checks if the id passed in parameter is a context of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointContext(id: string): boolean;
    /**
     * get and return the control endpoint profile
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    getControlPointProfilNode(contextId: string, controlPointId: string): Promise<SpinalNode>;
    /**
     * get All control endpoint profile  linked to control endpoint node
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    getControlPointProfil(contextId: string, controlPointId: string): Promise<{
        name: string;
        endpoints: spinal.Lst<IControlEndpointModel>;
    }>;
    linkControlPointToNode(nodeId: string, controlPointContextId: string, controlPointId: string, controlPoints?: {
        name: string;
        endpoints: spinal.Lst<IControlEndpointModel>;
    }): Promise<SpinalNode>;
    unlinkControlPointToNode(nodeId: string, controlPointProfilId?: string): Promise<boolean[]>;
    /**
     * get All node linked to the control point
     * @param  {string} controlProfilId
     * @param {boolean} linkDirectlyToGroup - specify only for group
     * @returns Promise
     */
    getElementLinked(nodeId: string, linkDirectlyToGroup?: boolean): Promise<SpinalNodeRef[]>;
    /**
    * Get all node linked to the nodeId (control endpoint | id of group)
    * @param  {string} nodeId - controlPointId or groupId
    * @returns Promise
    */
    loadElementLinked(nodeId: string): Promise<spinal.Lst<SpinalNode<any>> | spinal.Lst<ILinkedToGroupRes>>;
    getElementLinkedToProfileOrGroupItems(nodeId: string): Promise<SpinalNodeRef[]>;
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @param {boolean} linkDirectlyToGroup
     * @returns Promise
     */
    linkControlPointToGroup(groupId: string, controlPointContextId: string, controlPointId: string, linkDirectlyToGroup?: boolean): Promise<Array<SpinalNodeRef>>;
    /**
     * unlink the control point to a group and his items
     * @param  {string} groupId
     * @param  {string} controlPointProfilId
     * @returns Promise
     */
    unLinkControlPointToGroup(groupId: string, controlPointProfilId: string, isLinkedDirectlyToGroup?: boolean): Promise<boolean[]>;
    /**
     * Edit the control point profile and update the bms endpoints associated according to the control point profiles
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @param  {Array} values
     * @returns Promise
     */
    editControlPointProfil(contextId: string, controlPointId: string, values: IControlEndpoint[]): Promise<{
        name: string;
        endpoints: spinal.Lst<IControlEndpointModel>;
    }>;
    /**
     * For a selected group format the control point profiles and the rooms of this group
     * @param  {string} groupId
     * @returns Promise
     */
    getDataFormated(groupId: string): Promise<{
        id: string;
        name: string;
        type: string;
        endpointProfils: IControlEndpoint[];
    }[]>;
    /**
     * get and return the endpoint linked to nodeId and created according the profil selected
     * @param  {string} nodeId
     * @param  {string} profilId
     * @returns Promise
     */
    getReferencesLinked(nodeId: string, profilId?: string): Promise<SpinalNodeRef | SpinalNodeRef[]>;
    /**
     * get All endpoints Nodes linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsNodeLinked(roomId: string, profilId: string, referenceLinked?: SpinalNodeRef): Promise<SpinalNodeRef[]>;
    /**
     * This method takes as parameter a group item's id and return all control endpoints classify by profil
     * @param  {string} groupItemId
     * @returns Promise
     */
    getControlEndpointLinkedToGroupItem(groupItemId: string): Promise<IControlPointRes[]>;
    /**
     * get All endpoints linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsLinked(nodeId: string, profilId: string): Promise<spinal.Model[]>;
    /**
    * This method allows to create and link endpoints to group item according the profil linked to group
    * @param  {string} groupId
    * @param  {string} elementId
    * @returns Promise
    */
    linkControlPointToNewGroupItem(groupId: string, elementId: string, controlPointProfilId?: string): Promise<SpinalNode<any>[]>;
    /**
     * This method allows to ulink endpoints to group item according the profil linked to group
     * @param  {string} groupId
     * @param  {string} elementId
     * @returns Promise
     */
    unLinkControlPointToGroupItem(groupId: string, elementId: string, controlPointProfilId?: string): Promise<boolean[]>;
    getAllProfils(controlPointId: string): Promise<SpinalNodeRef[]>;
    controlPointProfilIsAlreadyLinked(profilId: string, nodeId: string): Promise<boolean>;
    getContextId(nodeId: string): string;
    formatRooms(profilId: string, rooms: SpinalNodeRef[]): Promise<{
        id: string;
        type: string;
        name: string;
        bimObjects: [];
        endpoints: IControlEndpointModel[];
    }[]>;
    removeItemSaved(groupId: any, profilId: string): Promise<boolean[]>;
    _LinkGroupItemsNode(groupId: string, controlPointContextId: string, controlPointId: string, controlPoints: {
        name: string;
        endpoints: spinal.Lst<IControlEndpointModel>;
    }): Promise<SpinalNodeRef[]>;
    saveItemLinked(profilId: string, ids: string[], linkedDirectlyToGroup?: boolean): Promise<{
        id: string;
        name: string;
        type: string;
    }[]>;
    removeItemLinked(profileOrGroupId: string, idOfItemToremove: string): Promise<boolean>;
}
export { ControlEndpointService };
