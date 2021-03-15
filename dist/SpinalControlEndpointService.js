"use strict";
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
exports.SpinalControlEndpointService = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const spinal_env_viewer_context_geographic_service_1 = require("spinal-env-viewer-context-geographic-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const _1 = require(".");
const spinal_env_viewer_plugin_event_emitter_1 = require("spinal-env-viewer-plugin-event-emitter");
const netWorkService = new spinal_model_bmsnetwork_1.default();
/**
 * @class SpinalControlEndpointService
 *  @property {string} CONTROL_POINT_TYPE - typeof control point node
 *  @property {string} CONTROL_GROUP_TYPE  - typeof control point group node
 *  @property {string} CONTROL_GROUP_TO_CONTROLPOINTS  - relation between control point group and control point
 *  @property {string} ROOM_TO_CONTROL_GROUP - Relation between room and control point group
 */
class SpinalControlEndpointService {
    constructor() {
        this.CONTROL_POINT_TYPE = "SpinalControlPoint";
        this.CONTROL_GROUP_TYPE = "CONTROL_GROUP";
        this.CONTROL_GROUP_TO_CONTROLPOINTS = "hasControlGroup";
        this.ROOM_TO_CONTROL_GROUP = "hasControlPoints";
        this.listenLinkItemToGroupEvent();
        this.listenUnLinkItemToGroupEvent();
    }
    /**
     * This method creates a context of control Endpoint
     * @param  {string} contextName - The context of heatmap Name
     * @returns Promise
     */
    createContext(contextName) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.createGroupContext(contextName, this.CONTROL_POINT_TYPE).then((context) => {
            const contextId = context.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
        });
    }
    /**
     * retrieves and returns all contexts of control Endpoint
     * @returns Promise
     */
    getContexts() {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroupContexts(this.CONTROL_POINT_TYPE).then((contexts) => {
            return contexts.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id));
        });
    }
    /**
     * checks if the id passed in parameter is a context of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointContext(id) {
        const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
        const type = info.type.get();
        return type === `${this.CONTROL_POINT_TYPE}GroupContext`;
    }
    /**
     * This method creates an endpoint control category
     * @param  {string} contextId
     * @param  {string} categoryName
     * @param  {string} iconName
     * @returns Promise
     */
    createCategory(contextId, categoryName, iconName) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addCategory(contextId, categoryName, iconName).then((result) => {
            const nodeId = result.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        });
    }
    /**
     * get and return all categories in the context
     * @param  {string} nodeId
     * @returns Promise
     */
    getCategories(nodeId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getCategories(nodeId).then((result) => {
            return result.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id.get()));
        });
    }
    /**
     * This method creates an endpoint control group
     * @param  {string} contextId
     * @param  {string} categoryId
     * @param  {string} groupName
     * @param  {string} groupColor
     * @returns Promise
     */
    createGroup(contextId, categoryId, groupName, groupColor) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.addGroup(contextId, categoryId, groupName, groupColor).then((result) => {
            const nodeId = result.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        });
    }
    /**
     * get and return all groups in the category
     * @param  {string} nodeId
     * @returns Promise
     */
    getGroups(nodeId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroups(nodeId).then((result) => {
            return result.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id.get()));
        });
    }
    /**
     * checks if the id passed in parameter is a group of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointGroup(id) {
        const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
        const type = info.type.get();
        return type === `${this.CONTROL_POINT_TYPE}Group`;
    }
    /**
     * creates and links a profil of control endpoint to the group selected in the context selected
     * @param  {string} contextId
     * @param  {string} groupId
     * @param  {any} controlPointProfil
     * @returns Promise
     */
    createControlPointProfil(contextId, groupId, controlPointProfil = { name: "unknow", endpoints: [] }) {
        const profilNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: controlPointProfil.name, type: this.CONTROL_POINT_TYPE }, new spinal_core_connectorjs_type_1.Lst(controlPointProfil.endpoints));
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.linkElementToGroup(contextId, groupId, profilNodeId);
    }
    /**
     * get All control endpoint node linked to group selected
     * @param  {string} groupId
     * @returns Promise
     */
    getControlPoint(groupId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getElementsLinkedToGroup(groupId);
    }
    /**
     * get All control endpoint profile  linked to control endpoint node
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
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
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    linkControlPointToRooms(nodeId, controlPointContextId, controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLinked = yield this.controlPointProfilIsAlreadyLinked(controlPointId, nodeId);
            if (isLinked)
                return;
            const controlPoints = yield this.getControlPointProfil(controlPointContextId, controlPointId);
            const rooms = yield this.getAllRooms(nodeId);
            // const ids = [nodeId];
            const promises = rooms.map((el) => __awaiter(this, void 0, void 0, function* () {
                const nodeId = yield this.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(el.id.get(), nodeId, controlPointContextId, this.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                // .then((result) => {
                // ids.push(el.id.get());
                // return result;
                // })
            }));
            return Promise.all(promises).then((result) => {
                this.saveItemLinked(controlPointId, [nodeId]);
                this.saveItemLinked(nodeId, [controlPointId]);
                return result.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.getId().get()));
            });
        });
    }
    /**
     * Edit the control point profile and update the bms endpoints associated according to the control point profiles
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @param  {Array} values
     * @returns Promise
     */
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
    /**
     * get All node linked to the control point
     * @param  {string} controlProfilId
     * @returns Promise
     */
    getElementLinked(controlProfilId) {
        return __awaiter(this, void 0, void 0, function* () {
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
    /**
     * For a selected group format the control point profiles and the rooms of this group
     * @param  {string} groupId
     * @returns Promise
     */
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
    /**
     * get and return the endpoint linked to nodeId and created according the profil selected
     * @param  {string} nodeId
     * @param  {string} profilId
     * @returns Promise
     */
    getReferencesLinked(nodeId, profilId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [this.ROOM_TO_CONTROL_GROUP]).then(profils => {
            const found = profils.find(el => el.referenceId.get() === profilId);
            return found;
        });
    }
    /**
     * get All endpoints linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsLinked(nodeId, profilId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpointsInfo = yield this.getEndpointsNodeLinked(nodeId, profilId);
            const promises = endpointsInfo.map(el => el.element.load());
            return Promise.all(promises);
        });
    }
    /**
     * get All endpoints Nodes linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsNodeLinked(roomId, profilId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profilFound = yield this.getReferencesLinked(roomId, profilId);
            if (profilFound) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(profilFound.id.get(), [spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName]);
            }
            return [];
        });
    }
    /**
     * Get all node linked to the nodeId (control endpoint | id of group)
     * @param  {string} nodeId - controlPointId or groupId
     * @returns Promise
     */
    loadElementLinked(nodeId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        if (!realNode || !realNode.info || !realNode.info.linkedItems) {
            let res = new spinal_core_connectorjs_type_1.Lst();
            realNode.info.add_attr({ linkedItems: new spinal_core_connectorjs_type_1.Ptr(res) });
            return Promise.resolve(res);
        }
        ;
        return new Promise((resolve, reject) => {
            realNode.info.linkedItems.load((res) => {
                return resolve(res);
            });
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
            const contextIds = realNode.contextIds.values();
            return contextIds.find(id => {
                return this.isControlPointContext(id);
            });
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
    /////////////////////////////////////////////////////////////
    //                      Event listener                     //
    /////////////////////////////////////////////////////////////
    listenLinkItemToGroupEvent() {
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_LINKED_TO_GROUP_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            const profilsLinked = yield this.getElementLinked(data.groupId);
            const promises = profilsLinked.map((profilModel) => __awaiter(this, void 0, void 0, function* () {
                const profil = profilModel.get();
                const controlPointContextId = this.getContextId(profil.id);
                const controlPoints = yield this.getControlPointProfil(controlPointContextId, profil.id);
                const nodeId = yield this.createNode(controlPoints.name, controlPointContextId, profil.id, controlPoints.endpoints.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(data.elementId, nodeId, controlPointContextId, this.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }));
            return Promise.all(promises);
        }));
    }
    listenUnLinkItemToGroupEvent() {
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_UNLINKED_TO_GROUP_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            const profilsLinkedModel = yield this.getElementLinked(data.groupId);
            const elementProfilsModel = spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(data.elementId, [this.ROOM_TO_CONTROL_GROUP]);
            const profilsLinked = profilsLinkedModel.map((el) => el.get());
            const elementProfils = (yield elementProfilsModel).map(el => el.get());
            const promises = elementProfils.map((profil) => {
                const found = profilsLinked.find(el => el.id === profil.referenceId);
                if (found) {
                    return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(data.elementId, profil.id, this.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                }
                return Promise.resolve(false);
            });
            return Promise.all(promises);
        }));
    }
}
exports.SpinalControlEndpointService = SpinalControlEndpointService;
//# sourceMappingURL=SpinalControlEndpointService.js.map