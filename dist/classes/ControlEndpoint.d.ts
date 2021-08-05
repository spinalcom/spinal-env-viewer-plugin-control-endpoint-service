import { SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { Model } from "spinal-core-connectorjs_type";
import { IControlEndpoint } from "../interfaces/ControlEndpoint";
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
        endpoints: any;
    }>;
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    linkControlPointToGroup(nodeId: string, controlPointContextId: string, controlPointId: string): Promise<Array<SpinalNodeRef>>;
    _LinkNode(groupId: string, controlPointContextId: string, controlPointId: string, controlPoints: any): Promise<SpinalNodeRef[]>;
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
    getAllProfils(controlPointId: string): Promise<any>;
    controlPointProfilIsAlreadyLinked(profilId: string, groupId: string): Promise<boolean>;
    getContextId(nodeId: string): string;
    formatRooms(profilId: string, rooms: Array<typeof Model>): Promise<any[]>;
    /**
     * get All endpoints linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsLinked(nodeId: string, profilId: string): Promise<Array<any>>;
    saveItemLinked(profilId: string, ids: Array<string>): Promise<Array<string>>;
}
export { ControlEndpointService };
