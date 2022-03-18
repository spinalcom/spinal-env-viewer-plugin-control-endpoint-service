import { SpinalNode, SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import { IControlEndpoint, IControlEndpointModel } from '../interfaces/ControlEndpoint';
export default class ControlEndpointService {
    constructor();
    /**
     * checks if the id passed in parameter is a context of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointContext(id: string): boolean;
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
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    linkControlPointToGroup(nodeId: string, controlPointContextId: string, controlPointId: string): Promise<Array<SpinalNodeRef>>;
    /**
     * unlink the control point to a group and his items
     * @param  {string} groupId
     * @param  {string} controlPointProfilId
     * @returns Promise
     */
    unLinkControlPointToGroup(groupId: string, controlPointProfilId: string): Promise<boolean[]>;
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
     * get All node linked to the control point
     * @param  {string} controlProfilId
     * @returns Promise
     */
    getElementLinked(controlProfilId: string): Promise<Array<SpinalNodeRef>>;
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
     * Get all node linked to the nodeId (control endpoint | id of group)
     * @param  {string} nodeId - controlPointId or groupId
     * @returns Promise
     */
    loadElementLinked(nodeId: string): Promise<spinal.Lst<SpinalNode<any>>>;
    /**
     * This method takes as parameter a group item's id and return all control endpoints classify by profil
     * @param  {string} groupItemId
     * @returns Promise
     */
    getControlEndpointLinkedToGroupItem(groupItemId: string): Promise<{
        id: string;
        name: string;
        type: string;
        endpoints: {
            id: string;
            name: string;
            type: string;
        }[];
    }[]>;
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
    controlPointProfilIsAlreadyLinked(profilId: string, groupId: string): Promise<boolean>;
    getContextId(nodeId: string): string;
    formatRooms(profilId: string, rooms: SpinalNodeRef[]): Promise<{
        id: string;
        type: string;
        name: string;
        bimObjects: [];
        endpoints: IControlEndpointModel[];
    }[]>;
    saveItemLinked(profilId: string, ids: string[]): Promise<{
        id: string;
        name: string;
        type: string;
    }[]>;
    removeItemSaved(groupId: any, profilId: string): Promise<boolean[]>;
    _LinkNode(groupId: string, controlPointContextId: string, controlPointId: string, controlPoints: any): Promise<SpinalNodeRef[]>;
    removeItemFromLst(lst: spinal.Lst<SpinalNode<any>>, itemId: string): boolean;
}
export { ControlEndpointService };
