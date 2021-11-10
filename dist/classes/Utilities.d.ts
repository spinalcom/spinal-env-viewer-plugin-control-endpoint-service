import { SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
import { Lst } from "spinal-core-connectorjs_type";
export default class Utilities {
    constructor();
    static getGroups(nodeId: string): Promise<SpinalNodeRef>;
    static getGroupItems(groupId: string): Promise<Array<any>>;
    static createNode(groupName: string, controlPointContextId: string, controlPointId: string, controlPoints: Array<any>): Promise<string>;
    static linkEndpointToProfil(controlPointContextId: string, groupNodeId: string, endpoint: any): Promise<string>;
    static createEndpointNode(obj: any): {
        childId: string;
        res: SpinalBmsEndpoint;
    };
    static getCurrentValue(dataType: string): string | number | boolean;
    static isLinked(items: typeof Lst, id: string): boolean;
    static getDifference(oldEndpoint: Array<any>, newEndpoints: Array<any>): {
        toCreate: any[];
        toUpdate: any[];
        toRemove: any[];
    };
    static isUpdated(controlPoint: any, oldEndpoint: any): boolean;
    static configAreEquals(config1: any, config2: any): boolean;
    static objectsAreEquals(object1: any, object2: any): boolean;
    static create(controlPointContextId: any, newList: any, profils: any, endpointsLst: any): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
    static update(newList: any, profils: any, endpointsLst: any): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
    static delete(newList: any, profils: any, endpointsLst: any): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
    static modEndpoint(endpointId: string, newProfil: {
        name: string;
        [key: string]: any;
    }): Promise<void>;
    static setProfilValue(newProfil: any, oldProfil: any): void;
    static getEndpointByType(profilId: any, endpointId: any): Promise<any>;
    static getProfilEndpoints(profilId: any): Promise<SpinalNodeRef[]>;
    static getIndex(liste: any, id: any): number;
    static linkProfilToGroupItemIfNotExist(itemId: string, controlPointContextId: any, controlPointId: any, controlPoints: {
        name: string;
        endpoints: any;
    }): Promise<import("spinal-model-graph/declarations/src/Nodes/SpinalNode").default<any>>;
}
export { Utilities };
