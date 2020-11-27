"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const spinal_env_viewer_context_geographic_service_1 = require("spinal-env-viewer-context-geographic-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const _1 = require(".");
const netWorkService = new spinal_model_bmsnetwork_1.default();
class SpinalControlEndpointService {
    constructor() {
        this.CONTROL_POINT_TYPE = "SpinalControlPoint";
        this.CONTROL_GROUP_TYPE = "CONTROL_GROUP";
        this.CONTROL_GROUP_TO_CONTROLPOINTS = "hasControlGroup";
        this.ROOM_TO_CONTROL_GROUP = "hasControlPoints";
    }
    createContext(contextName) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.createGroupContext(contextName, this.CONTROL_POINT_TYPE).then((context) => {
            const contextId = context.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
        });
    }
    getContexts() {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroupContexts(this.CONTROL_POINT_TYPE).then((contexts) => {
            return contexts.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id));
        });
    }
    isControlPointContext(id) {
        const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
        const type = info.type.get();
        return type === `${this.CONTROL_POINT_TYPE}GroupContext`;
    }
    createCategory(contextId, categoryName, iconName) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addCategory(contextId, categoryName, iconName).then((result) => {
            const nodeId = result.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        });
    }
    getCategories(nodeId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getCategories(nodeId).then((result) => {
            return result.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id.get()));
        });
    }
    createGroup(contextId, categoryId, groupName, groupColor) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addGroup(contextId, categoryId, groupName, groupColor).then((result) => {
            const nodeId = result.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        });
    }
    getGroups(nodeId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroups(nodeId).then((result) => {
            return result.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id.get()));
        });
    }
    isControlPointGroup(id) {
        const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
        const type = info.type.get();
        return type === `${this.CONTROL_POINT_TYPE}Group`;
    }
    createControlPointProfil(contextId, groupId, controlPointProfil = { name: "unknow", endpoints: [] }) {
        const profilNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: controlPointProfil.name, type: this.CONTROL_POINT_TYPE }, new spinal_core_connectorjs_type_1.Lst(controlPointProfil.endpoints));
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.linkElementToGroup(contextId, groupId, profilNodeId);
    }
    getControlPoint(groupId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getElementsLinkedToGroup(groupId);
    }
    getControlPointProfil(contextId, controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            let realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(controlPointId);
            if (typeof realNode === "undefined") {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.findInContext(contextId, contextId, (node) => {
                    if (node.getId().get() === controlPointId) {
                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
                        realNode = node;
                        return true;
                    }
                    return false;
                });
            }
            return {
                name: realNode.getName().get(),
                endpoints: yield realNode.getElement()
            };
        });
    }
    linkControlPointToRooms(roomNodeId, controlPointContextId, controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLinked = yield this.controlPointProfilIsAlreadyLinked(controlPointId, roomNodeId);
            if (isLinked)
                return;
            const controlPoints = yield this.getControlPointProfil(controlPointContextId, controlPointId);
            const rooms = yield this.getAllRooms(roomNodeId);
            // const ids = [roomNodeId];
            const promises = rooms.map((el) => __awaiter(this, void 0, void 0, function* () {
                const nodeId = yield this.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(el.id.get(), nodeId, controlPointContextId, this.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                // .then((result) => {
                // ids.push(el.id.get());
                // return result;
                // })
            }));
            return Promise.all(promises).then((result) => {
                this.saveItemLinked(controlPointId, [roomNodeId]);
                this.saveItemLinked(roomNodeId, [controlPointId]);
                return result;
            });
        });
    }
    editControlPointProfil(contextId, controlPointId, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getControlPointProfil(contextId, controlPointId);
            // res.endpoints.set(values);
            const diffs = this.getDifference(res.endpoints.get(), values);
            const profils = yield this.getAllProfils(controlPointId);
            yield this.create(contextId, diffs.toCreate, profils, res.endpoints);
            yield this.update(contextId, diffs.toUpdate, profils, res.endpoints);
            yield this.delete(contextId, diffs.toRemove, profils, res.endpoints);
            return res;
        });
    }
    getElementLinked(controlProfilId) {
        return __awaiter(this, void 0, void 0, function* () {
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
                if (!res)
                    return [];
                const items = [];
                for (let index = 0; index < res.length; index++) {
                    const node = res[index];
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
                    items.push(spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(node.getId().get()));
                }
                return items;
            });
        });
    }
    getDataFormated(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const elementLinked = yield this.getElementLinked(groupId);
            const rooms = yield this.getAllRooms(groupId);
            const promises = elementLinked.map((element) => __awaiter(this, void 0, void 0, function* () {
                const el = element.get();
                const contextId = this.getContextId(el.id);
                const controlPointProfil = yield this.getControlPointProfil(contextId, el.id);
                el['endpointProfils'] = controlPointProfil.endpoints.get();
                el['rooms'] = yield this.formatRooms(el.id, rooms);
                return el;
            }));
            return Promise.all(promises);
        });
    }
    getReferencesLinked(roomId, profilId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(roomId, [this.ROOM_TO_CONTROL_GROUP]).then(profils => {
            const found = profils.find(el => el.referenceId.get() === profilId);
            return found;
        });
    }
    getEndpointsLinked(roomId, profilId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpointsInfo = yield this.getEndpointsNodeLinked(roomId, profilId);
            const promises = endpointsInfo.map(el => el.element.load());
            return Promise.all(promises);
        });
    }
    getEndpointsNodeLinked(roomId, profilId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profilFound = yield this.getReferencesLinked(roomId, profilId);
            if (profilFound) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(profilFound.id.get(), [spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName]);
            }
            return [];
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    //                                   PRIVATE                                             //
    ///////////////////////////////////////////////////////////////////////////////////////////
    getAllRooms(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
            if (info.type.get() === spinal_env_viewer_context_geographic_service_1.default.constants.ROOM_TYPE || info.type.get() === spinal_env_viewer_context_geographic_service_1.default.constants.EQUIPMENT_TYPE) {
                return [info];
            }
            const groups = yield spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroups(nodeId);
            const promises = groups.map(el => spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getElementsLinkedToGroup(el.id.get()));
            return Promise.all(promises).then((result) => {
                return result.flat();
            });
        });
    }
    createNode(groupName, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: groupName,
                referenceId: controlPointId,
                type: spinal_model_bmsnetwork_1.SpinalBmsEndpointGroup.nodeTypeName
            }, new spinal_core_connectorjs_type_1.Model());
            const promises = controlPoints.map((endpoint) => __awaiter(this, void 0, void 0, function* () {
                return this.linkEndpointToProfil(controlPointContextId, groupNodeId, endpoint);
            }));
            yield Promise.all(promises);
            return groupNodeId;
        });
    }
    linkEndpointToProfil(controlPointContextId, groupNodeId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // const endpoint = element.get();
            endpoint["currentValue"] = this.getCurrentValue(endpoint.dataType);
            const endpointObj = this.createEndpointNode(endpoint);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(groupNodeId, endpointObj.childId, controlPointContextId, spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            // await SpinalGraphService.addChild(groupNodeId, endpointObj.childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
            yield netWorkService._createAttributes(endpointObj.childId, endpointObj.res);
            return endpointObj.childId;
        });
    }
    createEndpointNode(obj) {
        const res = new spinal_model_bmsnetwork_1.SpinalBmsEndpoint(obj.name, obj.path, obj.currentValue, obj.unit, _1.ControlEndpointDataType[obj.dataType], _1.ControlEndpointType[obj.type], obj.id);
        res.add_attr({
            alias: obj.alias,
            command: obj.command,
            saveTimeSeries: obj.saveTimeSeries,
        });
        const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            type: spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName,
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
    getCurrentValue(dataType) {
        switch (dataType) {
            case _1.ControlEndpointDataType.Boolean:
                return false;
            case _1.ControlEndpointDataType.Float:
            case _1.ControlEndpointDataType.Integer:
            case _1.ControlEndpointDataType.Integer16:
            case _1.ControlEndpointDataType.Real:
            case _1.ControlEndpointDataType.Double:
            case _1.ControlEndpointDataType.Long:
                return 0;
            default:
                return "";
        }
    }
    saveItemLinked(profilIds, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profilIds);
            let items = yield this.loadElementLinked(profilIds);
            // if (!realNode || !realNode.info || !realNode.info.linkedItems) {
            //     const _ptr = new Ptr(new Lst(ids));
            //     realNode.info.add_attr({ linkedItems: _ptr });
            //     return ids;
            // }
            ids.forEach(id => {
                const isLinked = this.isLinked(items, id);
                if (!isLinked) {
                    const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
                    items.push(realNode);
                }
            });
            const res = [];
            for (let index = 0; index < items.length; index++) {
                const element = items[index].info.get();
                res.push(element);
            }
            return res;
            // const _ptr = new Ptr(new Lst(items));
            // realNode.info.mod_attr('linkedItems', _ptr);
            // return ite;
        });
    }
    loadElementLinked(controlProfilId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(controlProfilId);
        if (!realNode || !realNode.info || !realNode.info.linkedItems) {
            let res = new spinal_core_connectorjs_type_1.Lst();
            realNode.info.add_attr({ linkedItems: new spinal_core_connectorjs_type_1.Ptr(res) });
            return Promise.resolve(res);
        }
        ;
        return new Promise((resolve, reject) => {
            realNode.info.linkedItems.load((res) => {
                // const items = [];
                // for (let index = 0; index < res.length; index++) {
                //     const node = res[index];
                //     (<any>SpinalGraphService)._addNode(node);
                //     items.push(node.info.get());
                // }
                return resolve(res);
            });
        });
    }
    isLinked(items, id) {
        for (let index = 0; index < items.length; index++) {
            const nodeId = items[index].getId().get();
            if (nodeId === id)
                return true;
        }
        return false;
    }
    getContextId(nodeId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        if (realNode.contextIds) {
            return realNode.contextIds._attribute_names[0];
        }
    }
    formatRooms(profilId, rooms) {
        const promises = rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
            let obj = room.get();
            obj['bimObjects'] = [];
            obj['endpoints'] = yield this.getEndpointsLinked(obj.id, profilId);
            return obj;
        }));
        return Promise.all(promises);
    }
    controlPointProfilIsAlreadyLinked(profilId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const linked = yield this.getElementLinked(groupId);
            const found = linked.find((el) => el.id.get() === profilId);
            return typeof found !== "undefined";
        });
    }
    getDifference(oldEndpoint, newEndpoints) {
        const toCreate = newEndpoints.filter(el => {
            const found = oldEndpoint.find(el2 => el2.id === el.id);
            return typeof found === "undefined";
        });
        const toRemove = oldEndpoint.filter(el => {
            const found = newEndpoints.find(el2 => el2.id === el.id);
            return typeof found === "undefined";
        });
        const toUpdate = newEndpoints.filter(el => this.isUpdated(el, oldEndpoint));
        return {
            toCreate,
            toUpdate,
            toRemove
        };
    }
    isUpdated(controlPoint, oldEndpoint) {
        const found = oldEndpoint.find(el => el.id === controlPoint.id);
        if (!found)
            return false;
        const objAreEquals = this.objectsAreEquals(controlPoint, found);
        if (!objAreEquals)
            return true;
        const configAreEquals = this.configAreEquals(controlPoint.config, found.config);
        if (objAreEquals && configAreEquals)
            return false;
        return true;
    }
    objectsAreEquals(object1, object2) {
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
    configAreEquals(config1, config2) {
        const isEnum = typeof config1.enumeration !== "undefined";
        if (isEnum) {
            const enum2 = typeof config2.enumeration !== "undefined";
            if (!enum2)
                return false;
            if (config1.enumeration.length !== config2.enumeration.length)
                return false;
            for (let index = 0; index < config1.enumeration.length; index++) {
                const el1 = config1.enumeration[index];
                const el2 = config2.enumeration[index];
                if (!this.objectsAreEquals(el1, el2)) {
                    return false;
                }
            }
            return true;
        }
        else if (!isEnum) {
            const keys1 = Object.keys(config1);
            const keys2 = Object.keys(config2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (const key of keys1) {
                if (typeof config1[key] !== "object" && config1[key] !== config2[key]) {
                    return false;
                }
                else if (!this.objectsAreEquals(config1[key], config2[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    getAllProfils(controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const elementsLinked = yield this.getElementLinked(controlPointId);
            const promises = [];
            for (const group of elementsLinked) {
                promises.push(this.getAllRooms(group.id.get()));
            }
            return Promise.all(promises).then((roomsArrays) => {
                const rooms = roomsArrays.flat();
                const promises2 = rooms.map(el => this.getReferencesLinked(el.id.get(), controlPointId));
                return Promise.all(promises2).then((result) => {
                    return result.flat();
                });
            });
        });
    }
    getProfilEndpoints(profilId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(profilId, [spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName]);
    }
    create(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(endpoint => {
            endpointsLst.push(endpoint);
            const promises2 = profils.map((profil) => __awaiter(this, void 0, void 0, function* () {
                return this.linkEndpointToProfil(controlPointContextId, profil.id.get(), endpoint);
            }));
            return Promise.all(promises2);
        });
        return Promise.all(promises);
    }
    update(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(element => {
            const index = this.getIndex(endpointsLst, element.id);
            this.setProfilValue(element, endpointsLst[index]);
            const promises2 = profils.map((profil) => __awaiter(this, void 0, void 0, function* () {
                const endpointId = yield this.getEndpointByType(profil.id.get(), element.id);
                return this.modEndpoint(endpointId, element);
            }));
            return Promise.all(promises2);
        });
        return Promise.all(promises);
    }
    delete(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map(element => {
            const index = this.getIndex(endpointsLst, element.id);
            endpointsLst.splice(index);
            const promises2 = profils.map((profil) => __awaiter(this, void 0, void 0, function* () {
                const endpointId = yield this.getEndpointByType(profil.id.get(), element.id);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(profil.id.get(), endpointId, spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }));
            return Promise.all(promises2);
        });
        return Promise.all(promises);
    }
    getEndpointByType(profilId, endpointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoints = yield this.getProfilEndpoints(profilId);
            const found = endpoints.find(el => el.endpointId.get() === endpointId);
            if (found) {
                return found.id.get();
            }
        });
    }
    getIndex(liste, id) {
        for (let index = 0; index < liste.length; index++) {
            const elementId = liste[index].id.get();
            if (elementId === id)
                return index;
        }
        return -1;
    }
    setProfilValue(newProfil, oldProfil) {
        for (const key of Object.keys(newProfil)) {
            if (oldProfil[key])
                oldProfil[key].set(newProfil[key]);
            else
                oldProfil.add_attr({ [key]: newProfil[key] });
        }
    }
    modEndpoint(endpointId, newProfil) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(endpointId);
            const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(endpointId);
            const element = yield info.element.load();
            for (const key of Object.keys(newProfil)) {
                if (key !== "config" && element[key])
                    element[key].set(newProfil[key]);
            }
            realNode.info.name.set(newProfil.name);
        });
    }
}
exports.SpinalControlEndpointService = SpinalControlEndpointService;
//# sourceMappingURL=SpinalControlEndpointService.js.map