import { SpinalNode, SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import { SpinalBmsEndpoint } from 'spinal-model-bmsnetwork';
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from '../dataTypes/ControlConfigDataType';
import { IControlEndpoint } from '../interfaces/ControlEndpoint';
import { IDiffResult } from '../interfaces/IDiffResult';
export default abstract class Utilities {
    static getGroups(nodeId: string): Promise<SpinalNodeRef>;
    static getGroupItems(groupId: string): Promise<SpinalNodeRef[]>;
    static createNode(groupName: string, controlPointContextId: string, controlPointId: string, controlPoints: IControlEndpoint[]): Promise<string>;
    static linkEndpointToProfil(controlPointContextId: string, groupNodeId: string, endpoint: IControlEndpoint): Promise<string>;
    static createEndpointNode(obj: IControlEndpoint): {
        childId: string;
        res: SpinalBmsEndpoint;
    };
    static getCurrentValue(dataType: string): string | number | boolean;
    static isLinked(items: spinal.Lst<SpinalNode<any>>, id: string): boolean;
    static getDifference(oldEndpoint: Array<IControlEndpoint>, newEndpoints: Array<IControlEndpoint>): IDiffResult;
    static isUpdated(controlPoint: IControlEndpoint, oldEndpoint: Array<IControlEndpoint>): boolean;
    static configAreEquals(config1: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType, config2: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType): boolean;
    static objectsAreEquals(object1: {
        [key: string]: any;
    }, object2: {
        [key: string]: any;
    }): boolean;
    static create(controlPointContextId: string, newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst: any): Promise<string[][]>;
    static update(newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst: any): Promise<void[][]>;
    static delete(newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst: any): Promise<boolean[][]>;
    static modEndpoint(endpointId: string, newProfil: {
        name: string;
        [key: string]: any;
    }): Promise<void>;
    static setProfilValue(newProfil: {
        [key: string]: any;
    }, oldProfil: {
        [key: string]: any;
    }): void;
    static getEndpointByType(profilId: string, endpointId: string): Promise<string>;
    static getProfilEndpoints(profilId: string): Promise<SpinalNodeRef[]>;
    static getIndex(liste: SpinalNodeRef[], id: string): number;
    static linkProfilToGroupItemIfNotExist(itemId: string, controlPointContextId: string, controlPointId: string, controlPoints: {
        name: string;
        endpoints: any;
    }): Promise<SpinalNode<any>>;
}
export { Utilities };
