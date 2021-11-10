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

import { SpinalGraphService, SpinalNodeRef, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service'
import { Lst, Model, Ptr } from "spinal-core-connectorjs_type";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
import { IControlEndpoint } from "../interfaces/ControlEndpoint";
import { Utilities } from "./Utilities";

import { CONTROL_POINT_TYPE, ROOM_TO_CONTROL_GROUP } from "./contants";

export default class ControlEndpointService {

   constructor() { }

   /**
    * checks if the id passed in parameter is a context of control Endpoint
    * @param  {string} id
    * @returns boolean
    */
   public isControlPointContext(id: string): boolean {
      const info = SpinalGraphService.getInfo(id);
      const type = info.type.get();

      return type === `${CONTROL_POINT_TYPE}GroupContext`;
   }



   /**
     * get All control endpoint profile  linked to control endpoint node
     * @param  {string} contextId
     * @param  {string} controlPointId
     * @returns Promise
     */
   public async getControlPointProfil(contextId: string, controlPointId: string): Promise<{ name: string, endpoints: any }> {
      let realNode = SpinalGraphService.getRealNode(controlPointId);

      if (typeof realNode === "undefined") {
         await SpinalGraphService.findInContext(contextId, contextId, (node) => {
            if (node.getId().get() === controlPointId) {
               (<any>SpinalGraphService)._addNode(node);
               realNode = node;
               return true;
            }

            return false;
         })
      }

      return {
         name: realNode.getName().get(),
         endpoints: await realNode.getElement()
      }

   }


   /**
    * link the control point to a node and create the bms endpoints according to the control point profiles
    * @param  {string} nodeId
    * @param  {string} controlPointContextId
    * @param  {string} controlPointId
    * @returns Promise
    */
   public async linkControlPointToGroup(nodeId: string, controlPointContextId: string, controlPointId: string): Promise<Array<SpinalNodeRef>> {

      const controlPoints = await this.getControlPointProfil(controlPointContextId, controlPointId);

      const groups = await Utilities.getGroups(nodeId);

      const promises = groups.map(async group => {
         try {
            await this._LinkNode(group.id.get(), controlPointContextId, controlPointId, controlPoints);
            return group;
         } catch (error) {
            console.error(error);
            return;
         }

      })

      return Promise.all(promises).then((result) => {
         result.map((group: any) => {
            this.saveItemLinked(controlPointId, [group.id.get()]);
            this.saveItemLinked(group.id.get(), [controlPointId]);
         })

         return result.map((el: any) => SpinalGraphService.getInfo(el.id.get()));
      })
   }

   public async _LinkNode(groupId: string, controlPointContextId: string, controlPointId: string, controlPoints) {

      const isLinked = await this.controlPointProfilIsAlreadyLinked(controlPointId, groupId);
      if (isLinked) return;

      const items = await Utilities.getGroupItems(groupId);
      const promises = items.map(async el => {
         return Utilities.linkProfilToGroupItemIfNotExist(el.id.get(), controlPointContextId, controlPointId, controlPoints);
      })

      return Promise.all(promises).then((result) => {
         return result.map(el => SpinalGraphService.getInfo(el.getId().get()));
      })
   }

   /**
    * Edit the control point profile and update the bms endpoints associated according to the control point profiles
    * @param  {string} contextId
    * @param  {string} controlPointId
    * @param  {Array} values
    * @returns Promise
    */
   public async editControlPointProfil(contextId: string, controlPointId: string, values: Array<IControlEndpoint>): Promise<{ name: string, endpoints: any }> {
      const res = await this.getControlPointProfil(contextId, controlPointId);
      // res.endpoints.set(values);
      const diffs = Utilities.getDifference(res.endpoints.get(), values);

      const profils = await this.getAllProfils(controlPointId);

      await Utilities.create(contextId, diffs.toCreate, profils, res.endpoints);
      await Utilities.update(diffs.toUpdate, profils, res.endpoints);
      await Utilities.delete(diffs.toRemove, profils, res.endpoints);

      return res;
   }



   /**
    * get All node linked to the control point
    * @param  {string} controlProfilId
    * @returns Promise
    */
   public async getElementLinked(controlProfilId: string): Promise<Array<typeof Model>> {

      return this.loadElementLinked(controlProfilId).then((res) => {
         if (!res) return [];

         const items = [];
         for (let index = 0; index < res.length; index++) {
            const node = res[index];
            (<any>SpinalGraphService)._addNode(node);
            items.push(SpinalGraphService.getInfo(node.getId().get()));

         }
         return items;

      })
   }

   /**
    * For a selected group format the control point profiles and the rooms of this group
    * @param  {string} groupId
    * @returns Promise
    */
   public async getDataFormated(groupId: string): Promise<any> {
      const elementLinked = await this.getElementLinked(groupId);
      const rooms = await Utilities.getGroupItems(groupId);

      const promises = elementLinked.map(async element => {
         const el = (<any>element).get();
         const contextId = this.getContextId(el.id);
         const controlPointProfil = await this.getControlPointProfil(contextId, el.id);
         el['endpointProfils'] = controlPointProfil.endpoints.get();
         el['rooms'] = await this.formatRooms(el.id, rooms);
         return el;
      })

      return Promise.all(promises);
   }


   /**
    * get and return the endpoint linked to nodeId and created according the profil selected
    * @param  {string} nodeId 
    * @param  {string} profilId
    * @returns Promise
    */
   public async getReferencesLinked(nodeId: string, profilId?: string): Promise<any> {

      const profils = await SpinalGraphService.getChildren(nodeId, [ROOM_TO_CONTROL_GROUP]);

      if (!profilId) return profils;

      const found = profils.find(el => el.referenceId.get() === profilId)
      return found;
   }



   /**
    * get All endpoints Nodes linked to roomId and created according the profil selected
    * @param  {string} roomId - nodeId
    * @param  {string} profilId - controlEndpoint profil id
    * @returns Promise
    */
   public async getEndpointsNodeLinked(roomId: string, profilId: string, referenceLinked?: SpinalNodeRef): Promise<Array<any>> {

      const profilFound = referenceLinked || await this.getReferencesLinked(roomId, profilId);

      if (profilFound) {
         return SpinalGraphService.getChildren(profilFound.id.get(), [SpinalBmsEndpoint.relationName]);
      }

      return [];
   }


   /**
    * Get all node linked to the nodeId (control endpoint | id of group)
    * @param  {string} nodeId - controlPointId or groupId
    * @returns Promise
    */
   public loadElementLinked(nodeId: string): Promise<any> {
      const realNode = SpinalGraphService.getRealNode(nodeId);
      if (!realNode || !realNode.info || !realNode.info.linkedItems) {
         let res = new Lst();
         realNode.info.add_attr({ linkedItems: new Ptr(res) });
         return Promise.resolve(res);
      };

      return new Promise((resolve, reject) => {
         realNode.info.linkedItems.load((res) => {
            return resolve(res);
         })
      });
   }

   public async getControlEndpointLinkedToGroupItem(nodeId: string): Promise<any> {
      const profils = await this.getReferencesLinked(nodeId);

      const promises = profils.map(async element => {
         const el = element.get()
         const endpoints = await this.getEndpointsNodeLinked(nodeId, el.referenceId, element);
         el.endpoints = endpoints.map(el => el.get());
         return el;
      })

      return Promise.all(promises);
   }


   ///////////////////////////////////////////////////////////////////////////////////////////
   //                                   PRIVATE                                             //
   ///////////////////////////////////////////////////////////////////////////////////////////


   public async getAllProfils(controlPointId: string) {
      const elementsLinked = await this.getElementLinked(controlPointId);
      const promises = [];

      for (const group of elementsLinked) {
         promises.push(Utilities.getGroupItems((<any>group).id.get()))
      }

      return Promise.all(promises).then((roomsArrays) => {
         const rooms = (<any>roomsArrays).flat();
         const promises2 = rooms.map(el => this.getReferencesLinked(el.id.get(), controlPointId));
         return Promise.all(promises2).then((result) => {
            return (<any>result).flat()
         })
      })
   }

   public async controlPointProfilIsAlreadyLinked(profilId: string, groupId: string): Promise<boolean> {
      const linked = await this.getElementLinked(groupId);
      const found = linked.find((el: any) => el.id.get() === profilId);

      return typeof found !== "undefined";
   }

   public getContextId(nodeId: string) {
      const realNode = SpinalGraphService.getRealNode(nodeId);
      if (realNode.contextIds) {
         const contextIds = realNode.contextIds.values();
         return contextIds.find(id => {
            return this.isControlPointContext(id);
         })
      }
   }

   public formatRooms(profilId: string, rooms: Array<typeof Model>) {
      const promises = rooms.map(async (room: any) => {
         let obj = room.get();
         obj['bimObjects'] = []
         obj['endpoints'] = await this.getEndpointsLinked(obj.id, profilId);
         return obj;
      })

      return Promise.all(promises);
   }




   /**
    * get All endpoints linked to roomId and created according the profil selected
    * @param  {string} roomId - nodeId
    * @param  {string} profilId - controlEndpoint profil id
    * @returns Promise
    */
   public async getEndpointsLinked(nodeId: string, profilId: string): Promise<Array<any>> {
      const endpointsInfo = await this.getEndpointsNodeLinked(nodeId, profilId);
      const promises = endpointsInfo.map(el => el.element.load());
      return Promise.all(promises);

   }


   public async saveItemLinked(profilId: string, ids: Array<string>): Promise<Array<string>> {
      let items = await this.loadElementLinked(profilId);

      ids.forEach(id => {
         const isLinked = Utilities.isLinked(items, id)

         if (!isLinked) {
            const realNode = SpinalGraphService.getRealNode(id);
            items.push(realNode);
         }
      })


      const res = []

      for (let index = 0; index < items.length; index++) {
         const element = items[index].info.get();
         res.push(element);
      }

      return res;
   }






   /////////////////////////////////////////////////////////////
   //                      Event listener                     //
   /////////////////////////////////////////////////////////////






}


export {
   ControlEndpointService
}