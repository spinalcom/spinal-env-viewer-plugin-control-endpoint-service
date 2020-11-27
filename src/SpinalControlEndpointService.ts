/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { Lst, Model, Ptr } from "spinal-core-connectorjs_type";
import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service'
import { IControlEndpoint } from "./interfaces/ControlEndpoint";
import geographicService from 'spinal-env-viewer-context-geographic-service'
import NetworkService, { SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { ControlEndpointDataType, ControlEndpointType } from ".";


const netWorkService = new NetworkService();

export class SpinalControlEndpointService {
    public CONTROL_POINT_TYPE: string = "SpinalControlPoint";
    public CONTROL_GROUP_TYPE: string = "CONTROL_GROUP";
    public CONTROL_GROUP_TO_CONTROLPOINTS: string = "hasControlGroup";
    public ROOM_TO_CONTROL_GROUP: string = "hasControlPoints";

    constructor() { }

    public createContext(contextName: string): Promise<typeof Model> {
        return groupManagerService.createGroupContext(contextName, this.CONTROL_POINT_TYPE).then((context) => {
            const contextId = context.getId().get();
            return SpinalGraphService.getInfo(contextId);
        })
    }

    public getContexts(): Promise<Array<typeof Model>> {
        return groupManagerService.getGroupContexts(this.CONTROL_POINT_TYPE).then((contexts) => {
            return contexts.map(el => SpinalGraphService.getInfo(el.id));
        })
    }

    public isControlPointContext(id: string): boolean {
        const info = SpinalGraphService.getInfo(id);
        const type = info.type.get();

        return type === `${this.CONTROL_POINT_TYPE}GroupContext`;
    }

    public createCategory(contextId: string, categoryName: string, iconName: string): Promise<typeof Model> {
        return groupManagerService.addCategory(contextId, categoryName, iconName).then((result) => {
            const nodeId = result.getId().get();
            return SpinalGraphService.getInfo(nodeId);
        })
    }

    public getCategories(nodeId: string): Promise<Array<typeof Model>> {
        return groupManagerService.getCategories(nodeId).then((result) => {
            return result.map(el => SpinalGraphService.getInfo(el.id.get()));
        })
    }

    public createGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<typeof Model> {
        return groupManagerService.addGroup(contextId, categoryId, groupName, groupColor).then((result) => {
            const nodeId = result.getId().get();
            return SpinalGraphService.getInfo(nodeId);
        })
    }

    public getGroups(nodeId: string): Promise<Array<typeof Model>> {
        return groupManagerService.getGroups(nodeId).then((result) => {
            return result.map(el => SpinalGraphService.getInfo(el.id.get()));
        })
    }

    public isControlPointGroup(id: string): boolean {
        const info = SpinalGraphService.getInfo(id);
        const type = info.type.get();

        return type === `${this.CONTROL_POINT_TYPE}Group`;
    }

    public createControlPointProfil(contextId: string, groupId: string, controlPointProfil: { name: string; endpoints: Array<IControlEndpoint> } = { name: "unknow", endpoints: [] }): Promise<any> {
        const profilNodeId = SpinalGraphService.createNode({ name: controlPointProfil.name, type: this.CONTROL_POINT_TYPE }, new Lst(controlPointProfil.endpoints));
        return groupManagerService.linkElementToGroup(contextId, groupId, profilNodeId);
    }

    public getControlPoint(groupId: string): Promise<Array<typeof Model>> {
        return groupManagerService.getElementsLinkedToGroup(groupId);
    }

    public async getControlPointProfil(contextId: string, controlPointId: string): Promise<{ name: string, endpoints: any }> {
        let realNode = SpinalGraphService.getRealNode(controlPointId);

        if (typeof realNode === "undefined") {
            await SpinalGraphService.findInContext(contextId, contextId, (node) => {
                if (node.getId().get() === controlPointId) {
                    (<any>SpinalGraphService)._addNode(node);
                    realNode = node;
                    return true;
                }

                return false;
            })
        }

        return {
            name: realNode.getName().get(),
            endpoints: await realNode.getElement()
        }

    }

    public async linkControlPointToRooms(roomNodeId: string, controlPointContextId: string, controlPointId: string): Promise<Array<any>> {

        const isLinked = await this.controlPointProfilIsAlreadyLinked(controlPointId, roomNodeId);

        if (isLinked) return;


        const controlPoints = await this.getControlPointProfil(controlPointContextId, controlPointId);
        const rooms = await this.getAllRooms(roomNodeId);
        // const ids = [roomNodeId];

        const promises = rooms.map(async el => {
            const nodeId = await this.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
            return SpinalGraphService.addChildInContext(el.id.get(), nodeId, controlPointContextId, this.ROOM_TO_CONTROL_GROUP, SPINAL_RELATION_PTR_LST_TYPE)
            // .then((result) => {
            // ids.push(el.id.get());
            // return result;
            // })
        })

        return Promise.all(promises).then((result) => {
            this.saveItemLinked(controlPointId, [roomNodeId]);
            this.saveItemLinked(roomNodeId, [controlPointId]);
            return result;
        })
    }

    public async editControlPointProfil(contextId: string, controlPointId: string, values: Array<IControlEndpoint>): Promise<{ name: string, endpoints: any }> {
        const res = await this.getControlPointProfil(contextId, controlPointId);
        // res.endpoints.set(values);
        const diffs = this.getDifference(res.endpoints.get(), values);

        const profils = await this.getAllProfils(controlPointId);

        await this.create(contextId, diffs.toCreate, profils, res.endpoints);
        await this.update(contextId, diffs.toUpdate, profils, res.endpoints);
        await this.delete(contextId, diffs.toRemove, profils, res.endpoints);

        return res;
    }

    public async getElementLinked(controlProfilId: string): Promise<Array<typeof Model>> {
        // const realNode = SpinalGraphService.getRealNode(controlProfilId);
        // if (!realNode || !realNode.info || !realNode.info.linkedItems) return [];

        // return new Promise((resolve, reject) => {
        //     realNode.info.linkedItems.load((res) => {
        //         const items = [];
        //         for (let index = 0; index < res.length; index++) {
        //             const node = res[index];
        //             (<any>SpinalGraphService)._addNode(node);
        //             items.push(node.info.get());

        //         }
        //         return resolve(items);
        //     })
        // });

        return this.loadElementLinked(controlProfilId).then((res) => {
            if (!res) return [];

            const items = [];
            for (let index = 0; index < res.length; index++) {
                const node = res[index];
                (<any>SpinalGraphService)._addNode(node);
                items.push(SpinalGraphService.getInfo(node.getId().get()));

            }
            return items;

        })
    }

    public async getDataFormated(groupId: string): Promise<any> {
        const elementLinked = await this.getElementLinked(groupId);
        const rooms = await this.getAllRooms(groupId);

        const promises = elementLinked.map(async element => {
            const el = (<any>element).get();
            const contextId = this.getContextId(el.id);
            const controlPointProfil = await this.getControlPointProfil(contextId, el.id);
            el['endpointProfils'] = controlPointProfil.endpoints.get();
            el['rooms'] = await this.formatRooms(el.id, rooms);
            return el;
        })

        return Promise.all(promises);
    }

    public getReferencesLinked(roomId: string, profilId: string): Promise<any> {
        return SpinalGraphService.getChildren(roomId, [this.ROOM_TO_CONTROL_GROUP]).then(profils => {
            const found = profils.find(el => el.referenceId.get() === profilId)
            return found;
        });
    }

    public async getEndpointsLinked(roomId: string, profilId: string): Promise<Array<any>> {

        const endpointsInfo = await this.getEndpointsNodeLinked(roomId, profilId);
        const promises = endpointsInfo.map(el => el.element.load());
        return Promise.all(promises);

    }

    public async getEndpointsNodeLinked(roomId: string, profilId: string): Promise<Array<any>> {
        const profilFound = await this.getReferencesLinked(roomId, profilId);

        if (profilFound) {
            return SpinalGraphService.getChildren(profilFound.id.get(), [SpinalBmsEndpoint.relationName]);
        }
        return [];
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //                                   PRIVATE                                             //
    ///////////////////////////////////////////////////////////////////////////////////////////

    private async getAllRooms(nodeId: string): Promise<Array<any>> {
        const info = SpinalGraphService.getInfo(nodeId);
        if (info.type.get() === geographicService.constants.ROOM_TYPE || info.type.get() === geographicService.constants.EQUIPMENT_TYPE) {
            return [info];
        }
        const groups = await groupManagerService.getGroups(nodeId);
        const promises = groups.map(el => groupManagerService.getElementsLinkedToGroup(el.id.get()))

        return Promise.all(promises).then((result: any) => {
            return result.flat();
        })
    }

    private async createNode(groupName: string, controlPointContextId: string, controlPointId: string, controlPoints: Array<any>): Promise<string> {
        const groupNodeId = SpinalGraphService.createNode({
            name: groupName,
            referenceId: controlPointId,
            type: SpinalBmsEndpointGroup.nodeTypeName
        }, new Model());

        const promises = controlPoints.map(async endpoint => {
            return this.linkEndpointToProfil(controlPointContextId, groupNodeId, endpoint)
        })

        await Promise.all(promises);
        return groupNodeId

    }

    private async linkEndpointToProfil(controlPointContextId: string, groupNodeId: string, endpoint: any) {
        // const endpoint = element.get();
        endpoint["currentValue"] = this.getCurrentValue(endpoint.dataType);
        const endpointObj = this.createEndpointNode(endpoint);

        await SpinalGraphService.addChildInContext(groupNodeId, endpointObj.childId, controlPointContextId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
        // await SpinalGraphService.addChild(groupNodeId, endpointObj.childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);

        await (<any>netWorkService)._createAttributes(endpointObj.childId, endpointObj.res);
        return endpointObj.childId;
    }

    private createEndpointNode(obj: any): { childId: string, res: SpinalBmsEndpoint } {
        const res = new SpinalBmsEndpoint(
            obj.name,
            obj.path,
            obj.currentValue,
            obj.unit,
            ControlEndpointDataType[obj.dataType],
            ControlEndpointType[obj.type],
            obj.id,
        );

        res.add_attr({
            alias: obj.alias,
            command: obj.command,
            saveTimeSeries: obj.saveTimeSeries,
            // config: obj.config
        })

        const childId = SpinalGraphService.createNode({
            type: SpinalBmsEndpoint.nodeTypeName,
            endpointId: obj.id,
            name: obj.name
        }, res);

        return { childId, res };

        // await SpinalGraphService.addChildInContext(
        //     parentId,
        //     childId,
        //     this.contextId,
        //     SpinalBmsEndpoint.relationName,
        //     SPINAL_RELATION_PTR_LST_TYPE,
        //   );

    }

    private getCurrentValue(dataType: string): string | number | boolean {
        switch (dataType) {
            case ControlEndpointDataType.Boolean:
                return false;
            case ControlEndpointDataType.Float:
            case ControlEndpointDataType.Integer:
            case ControlEndpointDataType.Integer16:
            case ControlEndpointDataType.Real:
            case ControlEndpointDataType.Double:
            case ControlEndpointDataType.Long:
                return 0;
            default:
                return "";
        }
    }

    private async saveItemLinked(profilIds: string, ids: Array<string>): Promise<Array<string>> {
        const realNode = SpinalGraphService.getRealNode(profilIds);
        let items = await this.loadElementLinked(profilIds);

        // if (!realNode || !realNode.info || !realNode.info.linkedItems) {
        //     const _ptr = new Ptr(new Lst(ids));
        //     realNode.info.add_attr({ linkedItems: _ptr });
        //     return ids;
        // }




        ids.forEach(id => {
            const isLinked = this.isLinked(items, id)

            if (!isLinked) {
                const realNode = SpinalGraphService.getRealNode(id);
                items.push(realNode);
            }
        })


        const res = []

        for (let index = 0; index < items.length; index++) {
            const element = items[index].info.get();
            res.push(element);
        }

        return res;

        // const _ptr = new Ptr(new Lst(items));

        // realNode.info.mod_attr('linkedItems', _ptr);
        // return ite;
    }

    private loadElementLinked(controlProfilId: string): Promise<any> {
        const realNode = SpinalGraphService.getRealNode(controlProfilId);
        if (!realNode || !realNode.info || !realNode.info.linkedItems) {
            let res = new Lst();
            realNode.info.add_attr({ linkedItems: new Ptr(res) });
            return Promise.resolve(res);
        };

        return new Promise((resolve, reject) => {
            realNode.info.linkedItems.load((res) => {
                // const items = [];
                // for (let index = 0; index < res.length; index++) {
                //     const node = res[index];
                //     (<any>SpinalGraphService)._addNode(node);
                //     items.push(node.info.get());

                // }
                return resolve(res);
            })
        });
    }

    private isLinked(items: typeof Lst, id: string): boolean {

        for (let index = 0; index < items.length; index++) {
            const nodeId = items[index].getId().get();
            if (nodeId === id) return true;
        }

        return false;

    }

    private getContextId(nodeId: string) {
        const realNode = SpinalGraphService.getRealNode(nodeId);
        if (realNode.contextIds) {
            return realNode.contextIds._attribute_names[0];
        }
    }

    private formatRooms(profilId: string, rooms: Array<typeof Model>) {
        const promises = rooms.map(async (room: any) => {
            let obj = room.get();
            obj['bimObjects'] = []
            obj['endpoints'] = await this.getEndpointsLinked(obj.id, profilId);
            return obj;
        })

        return Promise.all(promises);
    }

    private async controlPointProfilIsAlreadyLinked(profilId: string, groupId: string): Promise<boolean> {
        const linked = await this.getElementLinked(groupId);
        const found = linked.find((el: any) => el.id.get() === profilId);

        return typeof found !== "undefined";
    }

    private getDifference(oldEndpoint: Array<any>, newEndpoints: Array<any>) {
        const toCreate = newEndpoints.filter(el => {
            const found = oldEndpoint.find(el2 => el2.id === el.id);
            return typeof found === "undefined";
        })

        const toRemove = oldEndpoint.filter(el => {
            const found = newEndpoints.find(el2 => el2.id === el.id);
            return typeof found === "undefined";
        })

        const toUpdate = newEndpoints.filter(el => this.isUpdated(el, oldEndpoint));

        return {
            toCreate,
            toUpdate,
            toRemove
        }
    }

    private isUpdated(controlPoint, oldEndpoint) {
        const found = oldEndpoint.find(el => el.id === controlPoint.id);
        if (!found) return false;

        const objAreEquals = this.objectsAreEquals(controlPoint, found);
        if (!objAreEquals) return true;

        const configAreEquals = this.configAreEquals(controlPoint.config, found.config);

        if (objAreEquals && configAreEquals) return false;

        return true;
    }

    private objectsAreEquals(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (key !== 'config' && object1[key] !== object2[key]) {
                return false;
            }
        }

        return true;
    }

    private configAreEquals(config1, config2) {

        const isEnum = typeof config1.enumeration !== "undefined";

        if (isEnum) {
            const enum2 = typeof config2.enumeration !== "undefined";
            if (!enum2) return false;
            if (config1.enumeration.length !== config2.enumeration.length) return false;

            for (let index = 0; index < config1.enumeration.length; index++) {
                const el1 = config1.enumeration[index]
                const el2 = config2.enumeration[index]
                if (!this.objectsAreEquals(el1, el2)) {
                    return false
                }
            }

            return true;

        } else if (!isEnum) {
            const keys1 = Object.keys(config1);
            const keys2 = Object.keys(config2);

            if (keys1.length !== keys2.length) {
                return false;
            }

            for (const key of keys1) {
                if (typeof config1[key] !== "object" && config1[key] !== config2[key]) {
                    return false
                }
                else if (!this.objectsAreEquals(config1[key], config2[key])) {
                    return false;
                }
            }

            return true;
        }


    }

    private async getAllProfils(controlPointId: string) {
        const elementsLinked = await this.getElementLinked(controlPointId);
        const promises = [];

        for (const group of elementsLinked) {
            promises.push(this.getAllRooms((<any>group).id.get()))
        }

        return Promise.all(promises).then((roomsArrays) => {
            const rooms = (<any>roomsArrays).flat();
            const promises2 = rooms.map(el => this.getReferencesLinked(el.id.get(), controlPointId));
            return Promise.all(promises2).then((result) => {
                return (<any>result).flat()
            })
        })
    }

    private getProfilEndpoints(profilId) {
        return SpinalGraphService.getChildren(profilId, [SpinalBmsEndpoint.relationName]);
    }

    private create(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(endpoint => {
            endpointsLst.push(endpoint);
            const promises2 = profils.map(async profil => {
                return this.linkEndpointToProfil(controlPointContextId, profil.id.get(), endpoint);
            })

            return Promise.all(promises2);
        });

        return Promise.all(promises);
    }

    private update(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(element => {
            const index = this.getIndex(endpointsLst, element.id);
            this.setProfilValue(element, endpointsLst[index]);
            const promises2 = profils.map(async profil => {
                const endpointId = await this.getEndpointByType(profil.id.get(), element.id);
                return this.modEndpoint(endpointId, element);
            })
            return Promise.all(promises2);
        })

        return Promise.all(promises)
    }

    private delete(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(element => {
            const index = this.getIndex(endpointsLst, element.id);
            endpointsLst.splice(index);
            const promises2 = profils.map(async profil => {
                const endpointId = await this.getEndpointByType(profil.id.get(), element.id);
                return SpinalGraphService.removeChild(profil.id.get(), endpointId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
            })

            return Promise.all(promises2);
        })

        return Promise.all(promises);
    }

    private async getEndpointByType(profilId, endpointId) {
        const endpoints = await this.getProfilEndpoints(profilId);
        const found = endpoints.find(el => el.endpointId.get() === endpointId);

        if (found) {
            return found.id.get();
        }
    }

    private getIndex(liste, id) {
        for (let index = 0; index < liste.length; index++) {
            const elementId = liste[index].id.get();
            if (elementId === id) return index;
        }

        return -1;
    }

    private setProfilValue(newProfil, oldProfil) {
        for (const key of Object.keys(newProfil)) {
            if (oldProfil[key]) oldProfil[key].set(newProfil[key])
            else oldProfil.add_attr({ [key]: newProfil[key] });
        }
    }

    private async modEndpoint(endpointId, newProfil) {
        const info = SpinalGraphService.getInfo(endpointId);
        const realNode = SpinalGraphService.getRealNode(endpointId)
        const element = await info.element.load();

        for (const key of Object.keys(newProfil)) {
            if (key !== "config" && element[key]) element[key].set(newProfil[key])
        }

        realNode.info.name.set(newProfil.name);

    }
}