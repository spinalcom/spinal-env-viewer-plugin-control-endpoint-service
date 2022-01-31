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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalControlEndpointService = void 0;
const spinal_env_viewer_plugin_event_emitter_1 = require("spinal-env-viewer-plugin-event-emitter");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const contants_1 = require("./contants");
const ControlEndpoint_1 = require("./ControlEndpoint");
const ControlEnpointsTree_1 = require("./ControlEnpointsTree");
function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors.forEach((baseConstructor) => {
        Object.getOwnPropertyNames(baseConstructor.prototype).forEach((name) => {
            Object.defineProperty(derivedConstructor.prototype, name, Object.getOwnPropertyDescriptor(baseConstructor.prototype, name));
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
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_LINKED_TO_GROUP_EVENT, ({ groupId, elementId }) => {
            this.linkControlPointToNewGroupItem(groupId, elementId);
        });
    }
    listenUnLinkItemToGroupEvent() {
        spinal_env_viewer_plugin_event_emitter_1.spinalEventEmitter.on(spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.constants.ELEMENT_UNLINKED_TO_GROUP_EVENT, ({ groupId, elementId }) => {
            this.unLinkControlPointToGroupItem(groupId, elementId);
        });
    }
}
exports.SpinalControlEndpointService = SpinalControlEndpointService;
applyMixins(SpinalControlEndpointService, [
    ControlEnpointsTree_1.ControlEnpointsTree,
    ControlEndpoint_1.ControlEndpointService,
]);
//# sourceMappingURL=SpinalControlEndpointService.js.map