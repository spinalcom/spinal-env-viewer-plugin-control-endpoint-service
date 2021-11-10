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
const ControlEnpointsTree_1 = require("./ControlEnpointsTree");
const ControlEndpoint_1 = require("./ControlEndpoint");
const contants_1 = require("./contants");
const spinal_env_viewer_plugin_event_emitter_1 = require("spinal-env-viewer-plugin-event-emitter");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const Utilities_1 = require("./Utilities");
function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors.forEach(baseConstructor => {
        Object.getOwnPropertyNames(baseConstructor.prototype)
            .forEach(name => {
            Object.defineProperty(derivedConstructor.prototype, name, Object.
                getOwnPropertyDescriptor(baseConstructor.prototype, name));
        });
    });
}
class SpinalControlEndpointService {
    constructor() {
        this.CONTROL_POINT_TYPE = contants_1.CONTROL_POINT_TYPE;
        this.CONTROL_GROUP_TYPE = contants_1.CONTROL_GROUP_TYPE;
        this.CONTROL_GROUP_TO_CONTROLPOINTS = contants_1.CONTROL_GROUP_TO_CONTROLPOINTS;
        this.ROOM_TO_CONTROL_GROUP = contants_1.ROOM_TO_CONTROL_GROUP;
        this.listenLinkItemToGroupEvent();
        this.listenUnLinkItemToGroupEvent();
    }
    listenLinkItemToGroupEvent() {
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_LINKED_TO_GROUP_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("item linked To group event");
            const profilsLinked = yield this.getElementLinked(data.groupId);
            const promises = profilsLinked.map((profilModel) => __awaiter(this, void 0, void 0, function* () {
                const profil = profilModel.get();
                const controlPointContextId = this.getContextId(profil.id);
                const controlPoints = yield this.getControlPointProfil(controlPointContextId, profil.id);
                const nodeId = yield Utilities_1.Utilities.createNode(controlPoints.name, controlPointContextId, profil.id, controlPoints.endpoints.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(data.elementId, nodeId, controlPointContextId, contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }));
            return Promise.all(promises);
        }));
    }
    listenUnLinkItemToGroupEvent() {
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_UNLINKED_TO_GROUP_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("item unlinked To group event");
            const profilsLinkedModel = yield this.getElementLinked(data.groupId);
            const elementProfilsModel = spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(data.elementId, [contants_1.ROOM_TO_CONTROL_GROUP]);
            const profilsLinked = profilsLinkedModel.map((el) => el.get());
            const elementProfils = (yield elementProfilsModel).map(el => el.get());
            const promises = elementProfils.map((profil) => {
                const found = profilsLinked.find(el => el.id === profil.referenceId);
                if (found) {
                    return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(data.elementId, profil.id, contants_1.ROOM_TO_CONTROL_GROUP, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                }
                return Promise.resolve(false);
            });
            return Promise.all(promises);
        }));
    }
}
exports.SpinalControlEndpointService = SpinalControlEndpointService;
;
applyMixins(SpinalControlEndpointService, [ControlEnpointsTree_1.ControlEnpointsTree, ControlEndpoint_1.ControlEndpointService]);
//# sourceMappingURL=SpinalControlEndpointService.js.map