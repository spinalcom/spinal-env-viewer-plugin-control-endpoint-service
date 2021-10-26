import { SpinalGraphService, SpinalNodeRef, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { SpinalBmsEndpoint, SpinalBmsEndpointGroup, NetworkService } from "spinal-model-bmsnetwork";
import { Lst, Model, Ptr } from "spinal-core-connectorjs_type";
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service'
import { ControlEndpointDataType } from "../dataTypes/ControlEndpointDataType";
import { ControlEndpointType } from "../dataTypes/ControlEndpointType";
import { CONTROL_POINT_TYPE, ROOM_TO_CONTROL_GROUP } from "./contants";

const netWorkService = new NetworkService();

export default class Utilities {
   constructor() { }

   public static getGroups(nodeId: string): Promise<SpinalNodeRef> {
      return groupManagerService.getGroups(nodeId);
   }

   public static async getGroupItems(groupId: string): Promise<Array<any>> {

      // const groups = await groupManagerService.getGroups(nodeId);
      // const promises = groups.map(el => groupManagerService.getElementsLinkedToGroup(el.id.get()))

      // return Promise.all(promises).then((result: any) => {
      //    return result.flat();
      // })

      return groupManagerService.getElementsLinkedToGroup(groupId);
   }

   public static async createNode(groupName: string, controlPointContextId: string, controlPointId: string, controlPoints: Array<any>): Promise<string> {
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

   public static async linkEndpointToProfil(controlPointContextId: string, groupNodeId: string, endpoint: any) {
      // const endpoint = element.get();
      endpoint["currentValue"] = this.getCurrentValue(endpoint.dataType);
      const endpointObj = this.createEndpointNode(endpoint);

      await SpinalGraphService.addChildInContext(groupNodeId, endpointObj.childId, controlPointContextId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);
      // await SpinalGraphService.addChild(groupNodeId, endpointObj.childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);

      await (<any>netWorkService)._createAttributes(endpointObj.childId, endpointObj.res);
      return endpointObj.childId;
   }

   public static createEndpointNode(obj: any): { childId: string, res: SpinalBmsEndpoint } {
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


   public static isLinked(items: typeof Lst, id: string): boolean {

      for (let index = 0; index < items.length; index++) {
         const nodeId = items[index].getId().get();
         if (nodeId === id) return true;
      }

      return false;

   }





   public static getDifference(oldEndpoint: Array<any>, newEndpoints: Array<any>) {
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

   public static isUpdated(controlPoint, oldEndpoint) {
      const found = oldEndpoint.find(el => el.id === controlPoint.id);
      if (!found) return false;

      const objAreEquals = this.objectsAreEquals(controlPoint, found);
      if (!objAreEquals) return true;

      const configAreEquals = this.configAreEquals(controlPoint.config, found.config);

      if (objAreEquals && configAreEquals) return false;

      return true;
   }


   public static configAreEquals(config1, config2) {

      const isEnum = typeof config1.enumeration !== "undefined";

      if (isEnum) {
         const enum2 = typeof config2.enumeration !== "undefined";
         if (!enum2) return false;
         if (config1.enumeration.length !== config2.enumeration.length) return false;

         for (let index = 0; index < config1.enumeration.length; index++) {
            const el1 = config1.enumeration[index]
            const el2 = config2.enumeration[index]
            if (!this.objectsAreEquals(el1, el2)) {
               return false
            }
         }

         return true;

      } else if (!isEnum) {
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

   }


   public static objectsAreEquals(object1, object2) {
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


   public static create(controlPointContextId, newList, profils, endpointsLst) {
      const promises = newList.map(endpoint => {
         endpointsLst.push(endpoint);
         const promises2 = profils.map(async profil => {
            return this.linkEndpointToProfil(controlPointContextId, profil.id.get(), endpoint);
         })

         return Promise.all(promises2);
      });

      return Promise.all(promises);
   }

   public static update(newList, profils, endpointsLst) {
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

   public static delete(newList, profils, endpointsLst) {
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

   public static setProfilValue(newProfil, oldProfil) {
      for (const key of Object.keys(newProfil)) {
         if (oldProfil[key]) oldProfil[key].set(newProfil[key])
         else oldProfil.add_attr({ [key]: newProfil[key] });
      }
   }

   public static async getEndpointByType(profilId, endpointId) {
      const endpoints = await this.getProfilEndpoints(profilId);
      const found = endpoints.find(el => el.endpointId.get() === endpointId);

      if (found) {
         return found.id.get();
      }
   }

   public static getProfilEndpoints(profilId) {
      return SpinalGraphService.getChildren(profilId, [SpinalBmsEndpoint.relationName]);
   }

   public static getIndex(liste, id) {
      for (let index = 0; index < liste.length; index++) {
         const elementId = liste[index].id.get();
         if (elementId === id) return index;
      }

      return -1;
   }

   public static async linkProfilToGroupItemIfNotExist(itemId: string, controlPointContextId, controlPointId, controlPoints: { name: string; endpoints: any }) {
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