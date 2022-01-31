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

import { Lst } from 'spinal-core-connectorjs_type';
import {
  SpinalGraphService,
  SpinalNodeRef,
} from 'spinal-env-viewer-graph-service';
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service';
import { IControlEndpoint } from '../interfaces/ControlEndpoint';
import { CONTROL_POINT_TYPE } from './contants';

export default class ControlEnpointsTree {
  constructor() {}

  /**
   * This method creates a context of control Endpoint
   * @param  {string} contextName - The context of heatmap Name
   * @returns Promise
   */
  public createContext(contextName: string): Promise<SpinalNodeRef> {
    return groupManagerService
      .createGroupContext(contextName, CONTROL_POINT_TYPE)
      .then((context) => {
        const contextId = context.getId().get();
        return SpinalGraphService.getInfo(contextId);
      });
  }

  /**
   * retrieves and returns all contexts of control Endpoint
   * @returns Promise
   */
  public getContexts(): Promise<SpinalNodeRef[]> {
    return groupManagerService
      .getGroupContexts(CONTROL_POINT_TYPE)
      .then((contexts) => {
        return contexts.map((el) => SpinalGraphService.getInfo(el.id));
      });
  }

  /**
   * This method creates an endpoint control category
   * @param  {string} contextId
   * @param  {string} categoryName
   * @param  {string} iconName
   * @returns Promise
   */
  public createCategory(
    contextId: string,
    categoryName: string,
    iconName: string
  ): Promise<SpinalNodeRef> {
    return groupManagerService
      .addCategory(contextId, categoryName, iconName)
      .then((result) => {
        const nodeId = result.getId().get();
        return SpinalGraphService.getInfo(nodeId);
      });
  }

  /**
   * get and return all categories in the context
   * @param  {string} nodeId
   * @returns Promise
   */
  public getCategories(nodeId: string): Promise<SpinalNodeRef[]> {
    return groupManagerService.getCategories(nodeId).then((result) => {
      return result.map((el) => SpinalGraphService.getInfo(el.id.get()));
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
  public createGroup(
    contextId: string,
    categoryId: string,
    groupName: string,
    groupColor: string
  ): Promise<SpinalNodeRef> {
    return groupManagerService
      .addGroup(contextId, categoryId, groupName, groupColor)
      .then((result) => {
        const nodeId = result.getId().get();
        return SpinalGraphService.getInfo(nodeId);
      });
  }

  /**
   * get and return all groups in the category
   * @param  {string} nodeId
   * @returns Promise
   */
  public getGroups(nodeId: string): Promise<SpinalNodeRef[]> {
    return groupManagerService.getGroups(nodeId).then((result) => {
      return result.map((el) => SpinalGraphService.getInfo(el.id.get()));
    });
  }

  /**
   * get All control endpoint node linked to group selected
   * @param  {string} groupId
   * @returns Promise
   */
  public getControlPoint(groupId: string): Promise<SpinalNodeRef[]> {
    return groupManagerService.getElementsLinkedToGroup(groupId);
  }

  /**
   * checks if the id passed in parameter is a group of control Endpoint
   * @param  {string} id
   * @returns boolean
   */
  public isControlPointGroup(id: string): boolean {
    const info = SpinalGraphService.getInfo(id);
    const type = info.type.get();

    return type === `${CONTROL_POINT_TYPE}Group`;
  }

  /**
   * creates and links a profil of control endpoint to the group selected in the context selected
   * @param  {string} contextId
   * @param  {string} groupId
   * @param  {any} controlPointProfil
   * @returns Promise of new groupId and old groupId
   */
  public createControlPointProfil(
    contextId: string,
    groupId: string,
    controlPointProfil: { name: string; endpoints: IControlEndpoint[] } = {
      name: 'unknow',
      endpoints: [],
    }
  ): Promise<{ old_group: string; newGroup: string }> {
    const profilNodeId = SpinalGraphService.createNode(
      { name: controlPointProfil.name, type: CONTROL_POINT_TYPE },
      new Lst(controlPointProfil.endpoints)
    );
    return groupManagerService.linkElementToGroup(
      contextId,
      groupId,
      profilNodeId
    );
  }
}

export { ControlEnpointsTree };
