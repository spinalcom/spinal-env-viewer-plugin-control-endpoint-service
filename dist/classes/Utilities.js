"use strict";
/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
exports.Utilities = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const ControlEndpointDataType_1 = require("../dataTypes/ControlEndpointDataType");
const ControlEndpointType_1 = require("../dataTypes/ControlEndpointType");
const contants_1 = require("./contants");
const netWorkService = new spinal_model_bmsnetwork_1.NetworkService();
class Utilities {
    static getGroups(nodeId) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroups(nodeId);
    }
    static getGroupItems(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const groups = await groupManagerService.getGroups(nodeId);
            // const promises = groups.map(el => groupManagerService.getElementsLinkedToGroup(el.id.get()))
            // return Promise.all(promises).then((result: any) => {
            //    return result.flat();
            // })
            return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getElementsLinkedToGroup(groupId);
        });
    }
    static createNode(groupName, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: groupName,
                referenceId: controlPointId,
                type: spinal_model_bmsnetwork_1.SpinalBmsEndpointGroup.nodeTypeName,
            }, new spinal_core_connectorjs_type_1.Model());
            const promises = controlPoints.map((endpoint) => __awaiter(this, void 0, void 0, function* () {
                return this.linkEndpointToProfil(controlPointContextId, groupNodeId, endpoint);
            }));
            yield Promise.all(promises);
            return groupNodeId;
        });
    }
    static linkEndpointToProfil(controlPointContextId, groupNodeId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // const endpoint = element.get();
            endpoint['currentValue'] = this.getCurrentValue(endpoint.dataType);
            const endpointObj = this.createEndpointNode(endpoint);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(groupNodeId, endpointObj.childId, controlPointContextId, spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            // await SpinalGraphService.addChild(groupNodeId, endpointObj.childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
            yield netWorkService._createAttributes(endpointObj.childId, endpointObj.res);
            return endpointObj.childId;
        });
    }
    static createEndpointNode(obj) {
        const res = new spinal_model_bmsnetwork_1.SpinalBmsEndpoint(obj.name, obj.path, obj.currentValue, obj.unit, ControlEndpointDataType_1.ControlEndpointDataType[obj.dataType], ControlEndpointType_1.ControlEndpointType[obj.type], obj.id);
        res.add_attr({
            alias: obj.alias,
            command: obj.command,
            saveTimeSeries: obj.saveTimeSeries,
            isActive: (obj === null || obj === void 0 ? void 0 : obj.isActive) || true,
            // config: obj.config
        });
        const childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            type: spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName,
            endpointId: obj.id,
            name: obj.name,
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
    static getCurrentValue(dataType) {
        switch (dataType) {
            case ControlEndpointDataType_1.ControlEndpointDataType.Boolean:
                return false;
            case ControlEndpointDataType_1.ControlEndpointDataType.Float:
            case ControlEndpointDataType_1.ControlEndpointDataType.Integer:
            case ControlEndpointDataType_1.ControlEndpointDataType.Integer16:
            case ControlEndpointDataType_1.ControlEndpointDataType.Real:
            case ControlEndpointDataType_1.ControlEndpointDataType.Double:
            case ControlEndpointDataType_1.ControlEndpointDataType.Long:
                return 0;
            default:
                return '';
        }
    }
    static isLinked(items, id) {
        for (let index = 0; index < items.length; index++) {
            const nodeId = items[index].getId().get();
            if (nodeId === id)
                return true;
        }
        return false;
    }
    static getDifference(oldEndpoint, newEndpoints) {
        const toCreate = newEndpoints.filter((el) => {
            const found = oldEndpoint.find((el2) => el2.id === el.id);
            return typeof found === 'undefined';
        });
        const toRemove = oldEndpoint.filter((el) => {
            const found = newEndpoints.find((el2) => el2.id === el.id);
            return typeof found === 'undefined';
        });
        const toUpdate = newEndpoints.filter((el) => this.isUpdated(el, oldEndpoint));
        return {
            toCreate,
            toUpdate,
            toRemove,
        };
    }
    static isUpdated(controlPoint, oldEndpoint) {
        const found = oldEndpoint.find((el) => el.id === controlPoint.id);
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
    static configAreEquals(config1, config2) {
        const config1HasEnum = 'enumeration' in config1;
        if (config1HasEnum) {
            const config2HasEnum = 'enumeration' in config2;
            if (!config2HasEnum)
                return false;
            const firstConfig = config1;
            const secondConfig = config2;
            if (firstConfig.enumeration.length !== secondConfig.enumeration.length)
                return false;
            for (let index = 0; index < firstConfig.enumeration.length; index++) {
                const el1 = firstConfig.enumeration[index];
                const el2 = secondConfig.enumeration[index];
                if (!this.objectsAreEquals(el1, el2)) {
                    return false;
                }
            }
            return true;
        }
        const keys1 = Object.keys(config1);
        const keys2 = Object.keys(config2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (typeof config1[key] !== 'object' && config1[key] !== config2[key]) {
                return false;
            }
            else if (!this.objectsAreEquals(config1[key], config2[key])) {
                return false;
            }
        }
        return true;
    }
    static objectsAreEquals(object1, object2) {
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
    static create(controlPointContextId, newList, profils, endpointsLst) {
        const promises = newList.map((endpoint) => {
            endpointsLst.push(endpoint);
            const promises2 = profils.map((profil) => __awaiter(this, void 0, void 0, function* () {
                return this.linkEndpointToProfil(controlPointContextId, profil.id.get(), endpoint);
            }));
            return Promise.all(promises2);
        });
        return Promise.all(promises);
    }
    static update(newList, profils, endpointsLst) {
        const promises = newList.map((element) => {
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
    static delete(newList, profils, endpointsLst) {
        const promises = newList.map((element) => {
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
    static modEndpoint(endpointId, newProfil) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(endpointId);
            const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(endpointId);
            const element = yield info.element.load();
            for (const key of Object.keys(newProfil)) {
                if (key !== 'config' && element[key])
                    element[key].set(newProfil[key]);
            }
            realNode.info.name.set(newProfil.name);
        });
    }
    static setProfilValue(newProfil, oldProfil) {
        for (const key of Object.keys(newProfil)) {
            if (oldProfil[key])
                oldProfil[key].set(newProfil[key]);
            else
                oldProfil.add_attr({ [key]: newProfil[key] });
        }
    }
    static getEndpointByType(profilId, endpointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoints = yield this.getProfilEndpoints(profilId);
            const found = endpoints.find((el) => el.endpointId.get() === endpointId);
            if (found) {
                return found.id.get();
            }
        });
    }
    static getProfilEndpoints(profilId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(profilId, [
            spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName,
        ]);
    }
    static getIndex(liste, id) {
        for (let index = 0; index < liste.length; index++) {
            const elementId = liste[index].id.get();
            if (elementId === id)
                return index;
        }
        return -1;
    }
    static linkProfilToGroupItemIfNotExist(itemId, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeId = yield this.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
            const children = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(itemId, [
                contants_1.ROOM_TO_CONTROL_GROUP,
            ]);
            const found = children.find((el) => { var _a; return ((_a = el.referenceId) === null || _a === void 0 ? void 0 : _a.get()) === controlPointId; });
            if (found)
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(found.id.get());
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(itemId, nodeId, controlPointContextId, contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
        });
    }
}
exports.default = Utilities;
exports.Utilities = Utilities;
//# sourceMappingURL=Utilities.js.map