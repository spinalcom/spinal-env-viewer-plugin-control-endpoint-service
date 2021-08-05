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
exports.ControlEndpointService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const Utilities_1 = require("./Utilities");
const contants_1 = require("./contants");
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
    linkControlPointToGroup(nodeId, controlPointContextId, controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const controlPoints = yield this.getControlPointProfil(controlPointContextId, controlPointId);
            const groups = yield Utilities_1.Utilities.getGroups(nodeId);
            const promises = groups.map((group) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this._LinkNode(group.id.get(), controlPointContextId, controlPointId, controlPoints);
                    return group;
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }));
            return Promise.all(promises).then((result) => {
                result.map((group) => {
                    this.saveItemLinked(controlPointId, [group.id.get()]);
                    this.saveItemLinked(group.id.get(), [controlPointId]);
                });
                return result.map((el) => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id.get()));
            });
        });
    }
    _LinkNode(groupId, controlPointContextId, controlPointId, controlPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLinked = yield this.controlPointProfilIsAlreadyLinked(controlPointId, groupId);
            if (isLinked)
                return;
            const items = yield Utilities_1.Utilities.getGroupItems(groupId);
            const promises = items.map((el) => __awaiter(this, void 0, void 0, function* () {
                return Utilities_1.Utilities.linkProfilToGroupItemIfNotExist(el.id.get(), controlPointContextId, controlPointId, controlPoints);
            }));
            return Promise.all(promises).then((result) => {
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
            const diffs = Utilities_1.Utilities.getDifference(res.endpoints.get(), values);
            const profils = yield this.getAllProfils(controlPointId);
            yield Utilities_1.Utilities.create(contextId, diffs.toCreate, profils, res.endpoints);
            yield Utilities_1.Utilities.update(diffs.toUpdate, profils, res.endpoints);
            yield Utilities_1.Utilities.delete(diffs.toRemove, profils, res.endpoints);
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
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [contants_1.ROOM_TO_CONTROL_GROUP]).then(profils => {
            const found = profils.find(el => el.referenceId.get() === profilId);
            return found;
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
    getAllProfils(controlPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const elementsLinked = yield this.getElementLinked(controlPointId);
            const promises = [];
            for (const group of elementsLinked) {
                promises.push(Utilities_1.Utilities.getGroupItems(group.id.get()));
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
    controlPointProfilIsAlreadyLinked(profilId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const linked = yield this.getElementLinked(groupId);
            const found = linked.find((el) => el.id.get() === profilId);
            return typeof found !== "undefined";
        });
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
    saveItemLinked(profilId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.loadElementLinked(profilId);
            ids.forEach(id => {
                const isLinked = Utilities_1.Utilities.isLinked(items, id);
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
        });
    }
}
exports.default = ControlEndpointService;
exports.ControlEndpointService = ControlEndpointService;
//# sourceMappingURL=ControlEndpoint.js.map