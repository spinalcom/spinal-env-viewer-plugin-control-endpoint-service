"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlEnpointsTree = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_env_viewer_plugin_group_manager_service_1 = require("spinal-env-viewer-plugin-group-manager-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const contants_1 = require("./contants");
class ControlEnpointsTree {
    constructor() { }
    ;
    /**
      * This method creates a context of control Endpoint
      * @param  {string} contextName - The context of heatmap Name
      * @returns Promise
      */
    createContext(contextName) {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.createGroupContext(contextName, contants_1.CONTROL_POINT_TYPE).then((context) => {
            const contextId = context.getId().get();
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
        });
    }
    /**
     * retrieves and returns all contexts of control Endpoint
     * @returns Promise
     */
    getContexts() {
        return spinal_env_viewer_plugin_group_manager_service_1.groupManagerService.getGroupContexts(contants_1.CONTROL_POINT_TYPE).then((contexts) => {
            return contexts.map(el => spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.id));
        });
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
        return type === `${contants_1.CONTROL_POINT_TYPE}Group`;
    }
    /**
      * creates and links a profil of control endpoint to the group selected in the context selected
      * @param  {string} contextId
      * @param  {string} groupId
      * @param  {any} controlPointProfil
      * @returns Promise of new groupId and old groupId
      */
    createControlPointProfil(contextId, groupId, controlPointProfil = { name: "unknow", endpoints: [] }) {
        const profilNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: controlPointProfil.name, type: contants_1.CONTROL_POINT_TYPE }, new spinal_core_connectorjs_type_1.Lst(controlPointProfil.endpoints));
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
}
exports.default = ControlEnpointsTree;
exports.ControlEnpointsTree = ControlEnpointsTree;
//# sourceMappingURL=ControlEnpointsTree.js.map