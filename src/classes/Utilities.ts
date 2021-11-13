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

import { SpinalGraphService, SpinalNode, SpinalNodeRef, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { SpinalBmsEndpoint, SpinalBmsEndpointGroup, NetworkService } from "spinal-model-bmsnetwork";
import { Lst, Model, Ptr } from "spinal-core-connectorjs_type";
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service'
import { ControlEndpointDataType } from "../dataTypes/ControlEndpointDataType";
import { ControlEndpointType } from "../dataTypes/ControlEndpointType";
import { CONTROL_POINT_TYPE, ROOM_TO_CONTROL_GROUP } from "./contants";
import { IControlEndpoint } from "../interfaces/ControlEndpoint";
import { IDiffResult } from "../interfaces/IDiffResult";
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from "../dataTypes/ControlConfigDataType";

const netWorkService = new NetworkService();

export default abstract class Utilities {

   public static getGroups(nodeId: string): Promise<SpinalNodeRef> {
      return groupManagerService.getGroups(nodeId);
   }

   public static async getGroupItems(groupId: string): Promise<SpinalNodeRef[]> {

      // const groups = await groupManagerService.getGroups(nodeId);
      // const promises = groups.map(el => groupManagerService.getElementsLinkedToGroup(el.id.get()))

      // return Promise.all(promises).then((result: any) => {
      //    return result.flat();
      // })

      return groupManagerService.getElementsLinkedToGroup(groupId);
   }

   public static async createNode(groupName: string, controlPointContextId: string, controlPointId: string, controlPoints: IControlEndpoint[]): Promise<string> {
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

   public static async linkEndpointToProfil(controlPointContextId: string, groupNodeId: string, endpoint: IControlEndpoint): Promise<string> {
      // const endpoint = element.get();
      endpoint["currentValue"] = this.getCurrentValue(endpoint.dataType);
      const endpointObj = this.createEndpointNode(endpoint);

      await SpinalGraphService.addChildInContext(groupNodeId, endpointObj.childId, controlPointContextId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
      // await SpinalGraphService.addChild(groupNodeId, endpointObj.childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);

      await (<any>netWorkService)._createAttributes(endpointObj.childId, endpointObj.res);
      return endpointObj.childId;
   }

   public static createEndpointNode(obj: IControlEndpoint): { childId: string, res: SpinalBmsEndpoint } {
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
         isActive: obj?.isActive || true
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

   public static getCurrentValue(dataType: string): string | number | boolean {
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


   public static isLinked(items: spinal.Lst<SpinalNode<any>>, id: string): boolean {

      for (let index = 0; index < items.length; index++) {
         const nodeId = items[index].getId().get();
         if (nodeId === id) return true;
      }

      return false;

   }



   public static getDifference(oldEndpoint: Array<IControlEndpoint>, newEndpoints: Array<IControlEndpoint>): IDiffResult {
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

   public static isUpdated(controlPoint: IControlEndpoint, oldEndpoint: Array<IControlEndpoint>): boolean {
      const found = oldEndpoint.find(el => el.id === controlPoint.id);
      if (!found) return false;

      const objAreEquals = this.objectsAreEquals(controlPoint, found);
      if (!objAreEquals) return true;

      const configAreEquals = this.configAreEquals(controlPoint.config, found.config);

      if (objAreEquals && configAreEquals) return false;

      return true;
   }


   public static configAreEquals(config1: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType, config2: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType): boolean {

      const config1HasEnum = 'enumeration' in config1;

      if (config1HasEnum) {
         const config2HasEnum = 'enumeration' in config2;
         if (!config2HasEnum) return false;

         const firstConfig = <EnumConfigDataType>config1;
         const secondConfig = <EnumConfigDataType>config2;

         if (firstConfig.enumeration.length !== secondConfig.enumeration.length) return false;

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
         if (typeof config1[key] !== "object" && config1[key] !== config2[key]) {
            return false
         }
         else if (!this.objectsAreEquals(config1[key], config2[key])) {
            return false;
         }
      }

      return true;
   }


   public static objectsAreEquals(object1: { [key: string]: any }, object2: { [key: string]: any }): boolean {
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


   public static create(controlPointContextId: string, newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst): Promise<string[][]> {
      const promises = newList.map(endpoint => {
         endpointsLst.push(endpoint);
         const promises2 = profils.map(async profil => {
            return this.linkEndpointToProfil(controlPointContextId, profil.id.get(), endpoint);
         })

         return Promise.all(promises2);
      });

      return Promise.all(promises)
   }


   public static update(newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst): Promise<void[][]> {
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

   public static delete(newList: Array<IControlEndpoint>, profils: SpinalNodeRef[], endpointsLst): Promise<boolean[][]> {
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

   public static async modEndpoint(endpointId: string, newProfil: { name: string;[key: string]: any }): Promise<void> {
      const info = SpinalGraphService.getInfo(endpointId);
      const realNode = SpinalGraphService.getRealNode(endpointId)
      const element = await info.element.load();

      for (const key of Object.keys(newProfil)) {
         if (key !== "config" && element[key]) element[key].set(newProfil[key])
      }

      realNode.info.name.set(newProfil.name);

   }

   public static setProfilValue(newProfil: { [key: string]: any }, oldProfil: { [key: string]: any }): void {
      for (const key of Object.keys(newProfil)) {
         if (oldProfil[key]) oldProfil[key].set(newProfil[key])
         else oldProfil.add_attr({ [key]: newProfil[key] });
      }
   }

   public static async getEndpointByType(profilId: string, endpointId: string): Promise<string> {
      const endpoints = await this.getProfilEndpoints(profilId);
      const found = endpoints.find(el => el.endpointId.get() === endpointId);

      if (found) {
         return found.id.get();
      }
   }

   public static getProfilEndpoints(profilId: string): Promise<SpinalNodeRef[]> {
      return SpinalGraphService.getChildren(profilId, [SpinalBmsEndpoint.relationName]);
   }

   public static getIndex(liste: SpinalNodeRef[], id: string): number {
      for (let index = 0; index < liste.length; index++) {
         const elementId = liste[index].id.get();
         if (elementId === id) return index;
      }

      return -1;
   }

   public static async linkProfilToGroupItemIfNotExist(itemId: string, controlPointContextId: string, controlPointId: string, controlPoints: { name: string; endpoints: any }): Promise<SpinalNode<any>> {
      const nodeId = await this.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());

      const children = await SpinalGraphService.getChildren(itemId, [ROOM_TO_CONTROL_GROUP]);
      const found = children.find(el => el.referenceId?.get() === controlPointId);

      if (found) return SpinalGraphService.getRealNode(found.id.get());

      return SpinalGraphService.addChildInContext(itemId, nodeId, controlPointContextId, ROOM_TO_CONTROL_GROUP, SPINAL_RELATION_PTR_LST_TYPE);
   }
}

export {
   Utilities
}