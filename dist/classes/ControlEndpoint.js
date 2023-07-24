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
exports.ControlEndpointService = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const ControlEndpoint_1 = require("../interfaces/ControlEndpoint");
const contants_1 = require("./contants");
const Utilities_1 = require("./Utilities");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
class ControlEndpointService {
    constructor() { }
    /**
     * checks if the id passed in parameter is a context of control Endpoint
     * @param  {string} id
     * @returns boolean
     */
    isControlPointContext(id) {
        const info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
        const type = info.type.get();
        return type === `${contants_1.CONTROL_POINT_TYPE}GroupContext`;
    }
    /**
     * get and return the control endpoint profile
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
    getControlPointProfilNode(contextId, controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            let realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(controlPointId);
            if (realNode)
                return realNode;
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.findInContext(contextId, contextId, node => {
                if (node.getId().get() === controlPointId) {
                    realNode = node;
                    return true;
                }
                return false;
            });
            return realNode;
        });
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
            if (typeof realNode === 'undefined') {
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
                endpoints: yield realNode.getElement(),
            };
        });
    }
    linkControlPointToNode(nodeId, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLinked = yield this.controlPointProfilIsAlreadyLinked(controlPointId, nodeId);
            if (isLinked)
                return;
            controlPoints = controlPoints || (yield this.getControlPointProfil(controlPointContextId, controlPointId));
            const endpointGroupNodeId = yield Utilities_1.Utilities.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
            const itemsAlreadyLinked = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [contants_1.ROOM_TO_CONTROL_GROUP]);
            const found = itemsAlreadyLinked.find((el) => { var _a; return ((_a = el.referenceId) === null || _a === void 0 ? void 0 : _a.get()) === controlPointId; });
            if (found)
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(found.id.get());
            const node = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(nodeId, endpointGroupNodeId, controlPointContextId, contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            yield this.saveItemLinked(controlPointId, [node.getId().get()], true);
            return node;
        });
    }
    unlinkControlPointToNode(nodeId, controlPointProfilId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profilsLinked = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [contants_1.ROOM_TO_CONTROL_GROUP]);
            if (controlPointProfilId)
                profilsLinked = profilsLinked.filter(el => [el.referenceId.get(), el.id.get()].indexOf(controlPointProfilId) !== -1);
            const promises = profilsLinked.map((el) => __awaiter(this, void 0, void 0, function* () {
                const bool = yield spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(nodeId, el.id.get(), contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                yield this.removeItemLinked(el.referenceId.get(), nodeId);
                return bool;
            }));
            return Promise.all(promises);
        });
    }
    /**
     * get All node linked to the control point
     * @param  {string} controlProfilId
     * @param {boolean} linkDirectlyToGroup - specify only for group
     * @returns Promise
     */
    getElementLinked(nodeId, linkDirectlyToGroup = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
            const type = node.type.get();
            if (type === contants_1.CONTROL_POINT_TYPE || (spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.isGroup(type) && !linkDirectlyToGroup))
                return this.getElementLinkedToProfileOrGroupItems(nodeId);
            // sinon recuperer le referenceId des children
        });
    }
    /**
    * Get all node linked to the nodeId (control endpoint | id of group)
    * @param  {string} nodeId - controlPointId or groupId
    * @returns Promise
    */
    loadElementLinked(nodeId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        const type = realNode.getType().get();
        if (type !== contants_1.CONTROL_POINT_TYPE || !spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.isGroup(type)) {
            throw new Error(`use this method only for profile of controlPoint or for group`);
        }
        if (!realNode || !realNode.info || !realNode.info.linkedItems) {
            let res = new spinal_core_connectorjs_type_1.Lst();
            realNode.info.add_attr({ linkedItems: new spinal_core_connectorjs_type_1.Ptr(res) });
            return Promise.resolve(res);
        }
        return new Promise((resolve, reject) => {
            realNode.info.linkedItems.load((res) => {
                return resolve(res);
            });
        });
    }
    getElementLinkedToProfileOrGroupItems(nodeId) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        const type = node.type.get();
        if (type !== contants_1.CONTROL_POINT_TYPE || !spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.isGroup(type)) {
            throw new Error(`use this method only for profile of controlPoint or for group`);
        }
        return this.loadElementLinked(nodeId).then((res) => {
            if (!res)
                return [];
            const items = [];
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                const node = ControlEndpoint_1.isLinkedDirectlyToGroup(element) ? element.node : element;
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
                items.push(spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(node.getId().get()));
            }
            return items;
        });
    }
    /**
     * link the control point to a node and create the bms endpoints according to the control point profiles
     * @param  {string} nodeId
     * @param  {string} controlPointContextId
     * @param  {string} controlPointId
     * @param {boolean} linkDirectlyToGroup
     * @returns Promise
     */
    linkControlPointToGroup(groupId, controlPointContextId, controlPointId, linkDirectlyToGroup = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const controlPoints = yield this.getControlPointProfil(controlPointContextId, controlPointId);
            if (linkDirectlyToGroup) {
                const node = yield this.linkControlPointToNode(groupId, controlPointContextId, controlPointId, controlPoints);
                return [spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(node.getId().get())];
            }
            const nodes = yield this._LinkGroupItemsNode(groupId, controlPointContextId, controlPointId, controlPoints);
            yield this.saveItemLinked(groupId, [controlPointId], linkDirectlyToGroup);
            return nodes;
            // const groups = await Utilities.getGroups(nodeId);
            // const promises = groups.map(async (group) => {
            //   try {
            //     await this._LinkNode(group.id.get(), controlPointContextId, controlPointId, controlPoints, linkDirectlyToGroup );
            //     await this.saveItemLinked(controlPointId, [group.id.get()],linkDirectlyToGroup);
            //     await this.saveItemLinked(group.id.get(), [controlPointId], linkDirectlyToGroup);
            //     return group;
            //   } catch (error) {
            //     console.error(error);
            //     return;
            //   }
            // });
            // return Promise.all(promises);
        });
    }
    /**
     * unlink the control point to a group and his items
     * @param  {string} groupId
     * @param  {string} controlPointProfilId
     * @returns Promise
     */
    unLinkControlPointToGroup(groupId, controlPointProfilId, isLinkedDirectlyToGroup = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isLinkedDirectlyToGroup)
                return this.unlinkControlPointToNode(groupId, controlPointProfilId);
            const groupItems = yield Utilities_1.Utilities.getGroupItems(groupId);
            const groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
            groupItems.push(groupInfo); // ajouter le group à la liste, pour supprimer le profil si jamais il est directement lier au groupe
            const promises = groupItems.map((element) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return this.unlinkControlPointToNode(element.id.get(), controlPointProfilId);
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }));
            return Promise.all(promises).then((result) => __awaiter(this, void 0, void 0, function* () {
                yield this.removeItemLinked(groupId, controlPointProfilId);
                //@ts-ignore
                return result.flat();
            }));
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
            const diffs = Utilities_1.Utilities.getDifference(res.endpoints.get(), values);
            const profils = yield this.getAllProfils(controlPointId);
            yield Utilities_1.Utilities.create(contextId, diffs.toCreate, profils, res.endpoints);
            yield Utilities_1.Utilities.update(diffs.toUpdate, profils, res.endpoints);
            yield Utilities_1.Utilities.delete(diffs.toRemove, profils, res.endpoints);
            return res;
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
            const rooms = yield Utilities_1.Utilities.getGroupItems(groupId);
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
        return __awaiter(this, void 0, void 0, function* () {
            const profils = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [
                contants_1.ROOM_TO_CONTROL_GROUP,
            ]);
            if (!profilId)
                return profils;
            const found = profils.find((el) => el.referenceId.get() === profilId);
            return found;
        });
    }
    /**
     * get All endpoints Nodes linked to roomId and created according the profil selected
     * @param  {string} roomId - nodeId
     * @param  {string} profilId - controlEndpoint profil id
     * @returns Promise
     */
    getEndpointsNodeLinked(roomId, profilId, referenceLinked) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = referenceLinked || (yield this.getReferencesLinked(roomId, profilId));
            let profilFound = Array.isArray(found) ? found[0] : found;
            if (profilFound) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(profilFound.id.get(), [
                    spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName,
                ]);
            }
            return [];
        });
    }
    /**
     * This method takes as parameter a group item's id and return all control endpoints classify by profil
     * @param  {string} groupItemId
     * @returns Promise
     */
    getControlEndpointLinkedToGroupItem(groupItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profils = yield this.getReferencesLinked(groupItemId);
            const promises = profils.map((element) => __awaiter(this, void 0, void 0, function* () {
                const el = element.get();
                const endpoints = yield this.getEndpointsNodeLinked(groupItemId, el.referenceId, element);
                el.endpoints = endpoints.map((el) => el.get());
                return el;
            }));
            return Promise.all(promises);
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
            const promises = endpointsInfo.map((el) => el.element.load());
            return Promise.all(promises);
        });
    }
    /**
    * This method allows to create and link endpoints to group item according the profil linked to group
    * @param  {string} groupId
    * @param  {string} elementId
    * @returns Promise
    */
    linkControlPointToNewGroupItem(groupId, elementId, controlPointProfilId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profilsLinked = controlPointProfilId
                ? [spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(controlPointProfilId)]
                : yield this.getElementLinked(groupId);
            const promises = profilsLinked.map((profilModel) => __awaiter(this, void 0, void 0, function* () {
                const profil = profilModel.get();
                const controlPointContextId = this.getContextId(profil.id);
                const controlPoints = yield this.getControlPointProfil(controlPointContextId, profil.id);
                const nodeId = yield Utilities_1.Utilities.createNode(controlPoints.name, controlPointContextId, profil.id, controlPoints.endpoints.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(elementId, nodeId, controlPointContextId, contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }));
            return Promise.all(promises);
        });
    }
    /**
     * This method allows to ulink endpoints to group item according the profil linked to group
     * @param  {string} groupId
     * @param  {string} elementId
     * @returns Promise
     */
    unLinkControlPointToGroupItem(groupId, elementId, controlPointProfilId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unlinkControlPointToNode(elementId, controlPointProfilId);
            // const profils = controlPointProfilId
            //   ? [SpinalGraphService.getInfo(controlPointProfilId)]
            //   : await this.getElementLinked(groupId);
            // const elementProfils = await SpinalGraphService.getChildren(elementId, [ROOM_TO_CONTROL_GROUP]);
            // // const profilsLinked = profilsLinkedModel.map((el: any) => el.get());
            // // const elementProfils = (await elementProfilsModel).map(el => el.get());
            // const promises = profils.map((profil) => {
            //   const found = elementProfils.find(
            //     (el) =>
            //       [el.referenceId.get(), el.id.get()].indexOf(profil.id.get()) !== -1
            //   );
            //   if (found) {
            //     return SpinalGraphService.removeChild(
            //       elementId,
            //       found.id.get(),
            //       ROOM_TO_CONTROL_GROUP,
            //       SPINAL_RELATION_PTR_LST_TYPE
            //     );
            //   }
            //   return Promise.resolve(false);
            // });
            // return Promise.all(promises);
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    //                                   PRIVATES                                            //
    ///////////////////////////////////////////////////////////////////////////////////////////
    getAllProfils(controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const elementsLinked = yield this.getElementLinked(controlPointId);
            const promises = [];
            for (const group of elementsLinked) {
                promises.push(Utilities_1.Utilities.getGroupItems(group.id.get()));
            }
            return Promise.all(promises).then((roomsArrays) => {
                const rooms = roomsArrays.flat();
                const promises2 = rooms.map((el) => this.getReferencesLinked(el.id.get(), controlPointId));
                return Promise.all(promises2).then((result) => {
                    return result.flat();
                });
            });
        });
    }
    controlPointProfilIsAlreadyLinked(profilId, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const linkedProm = [this.getElementLinked(nodeId), spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [contants_1.ROOM_TO_CONTROL_GROUP])];
            return Promise.all(linkedProm).then((result) => {
                //@ts-ignore
                const flatted = result.flat();
                const found = flatted.find(el => { var _a, _b; return [(_a = el.id) === null || _a === void 0 ? void 0 : _a.get(), (_b = el.referenceId) === null || _b === void 0 ? void 0 : _b.get()].indexOf(profilId) !== -1; });
                return found ? true : false;
            }).catch((err) => {
                return false;
            });
        });
    }
    getContextId(nodeId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        if (realNode.contextIds) {
            const contextIds = realNode.contextIds.values();
            return contextIds.find((id) => {
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
    removeItemSaved(groupId, profilId) {
        return __awaiter(this, void 0, void 0, function* () {
            let groupItems = yield Utilities_1.Utilities.getGroupItems(groupId);
            const promises = groupItems.map(el => this.removeItemLinked(el.id.get(), profilId));
            promises.push(this.removeItemLinked(groupId, profilId), this.removeItemLinked(profilId, groupId));
            return Promise.all(promises);
        });
    }
    _LinkGroupItemsNode(groupId, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLinked = yield this.controlPointProfilIsAlreadyLinked(controlPointId, groupId);
            if (isLinked)
                return;
            const groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
            const items = yield Utilities_1.Utilities.getGroupItems(groupId);
            const promises = items.map((el) => __awaiter(this, void 0, void 0, function* () {
                return this.linkControlPointToNode(el.id.get(), controlPointContextId, controlPointId, controlPoints);
            }));
            return Promise.all(promises).then((result) => {
                return result.map((el) => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.getId().get()));
            });
        });
    }
    saveItemLinked(profilId, ids, linkedDirectlyToGroup = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.loadElementLinked(profilId);
            ids.forEach((id) => {
                const isLinked = Utilities_1.Utilities.isLinked(items, id);
                if (!isLinked) {
                    const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
                    items.push({ node: realNode, linkedDirectlyToGroup });
                }
            });
            const res = [];
            for (let index = 0; index < items.length; index++) {
                const element = items[index].info.get();
                res.push(element);
            }
            return res;
        });
    }
    removeItemLinked(profileOrGroupId, idOfItemToremove) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.loadElementLinked(profileOrGroupId);
            for (let index = 0; index < items.length; index++) {
                const element = items[index];
                const node = ControlEndpoint_1.isLinkedDirectlyToGroup(element) ? element.node : element;
                if (node.getId().get() === idOfItemToremove) {
                    items.splice(index);
                    return true;
                }
            }
            return false;
        });
    }
}
exports.default = ControlEndpointService;
exports.ControlEndpointService = ControlEndpointService;
//# sourceMappingURL=ControlEndpoint.js.map