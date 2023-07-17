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

import { Lst, Ptr } from 'spinal-core-connectorjs_type';
import { SpinalGraphService, SpinalNode, SpinalNodeRef, SPINAL_RELATION_PTR_LST_TYPE, } from 'spinal-env-viewer-graph-service';
import { SpinalBmsEndpoint } from 'spinal-model-bmsnetwork';
import { IControlEndpoint, IControlEndpointModel, isLinkedDirectlyToGroup, ILinkedToGroupRes, } from '../interfaces/ControlEndpoint';
import { CONTROL_POINT_TYPE, ROOM_TO_CONTROL_GROUP } from './contants';
import { Utilities } from './Utilities';
import { IControlPointRes } from '../interfaces/IControlPointRes';
import {groupManagerService} from 'spinal-env-viewer-plugin-group-manager-service'

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
   * get and return the control endpoint profile
   * @param  {string} contextId
   * @param  {string} controlPointId
   * @returns Promise
   */
  public async getControlPointProfilNode(contextId: string, controlPointId: string): Promise<SpinalNode> {
    let realNode = SpinalGraphService.getRealNode(controlPointId);
    if (realNode) return realNode;
    
    await SpinalGraphService.findInContext(contextId, contextId, node => {
      if (node.getId().get() === controlPointId) {
          realNode = node;
          return true;
      }
      
      return false;
    })
      
    return realNode;
  }

  /**
   * get All control endpoint profile  linked to control endpoint node
   * @param  {string} contextId
   * @param  {string} controlPointId
   * @returns Promise
   */
  public async getControlPointProfil(contextId: string, controlPointId: string ): Promise<{ name: string; endpoints: spinal.Lst<IControlEndpointModel> }> {
    let realNode = SpinalGraphService.getRealNode(controlPointId);

    if (typeof realNode === 'undefined') {
      await SpinalGraphService.findInContext(contextId, contextId, (node) => {
        if (node.getId().get() === controlPointId) {
          (<any>SpinalGraphService)._addNode(node);
          realNode = node;
          return true;
        }

        return false;
      });
    }

    return {
      name: realNode.getName().get(),
      endpoints: await realNode.getElement(),
    };
  }

  public async  linkControlPointToNode(nodeId: string, controlPointContextId: string, controlPointId: string, controlPoints?: {name: string; endpoints: spinal.Lst<IControlEndpointModel>}): Promise<SpinalNode> {
    const isLinked = await this.controlPointProfilIsAlreadyLinked(controlPointId, nodeId);
    if (isLinked) return;
    
    controlPoints = controlPoints || await this.getControlPointProfil(controlPointContextId, controlPointId);
   
    const endpointGroupNodeId = await Utilities.createNode(controlPoints.name, controlPointContextId, controlPointId, controlPoints.endpoints.get());
    const itemsAlreadyLinked = await SpinalGraphService.getChildren(nodeId, [ROOM_TO_CONTROL_GROUP]);
    
    const found = itemsAlreadyLinked.find((el) => el.referenceId?.get() === controlPointId);
    
    if (found) return SpinalGraphService.getRealNode(found.id.get());

    const node = await SpinalGraphService.addChildInContext(nodeId,endpointGroupNodeId, controlPointContextId, ROOM_TO_CONTROL_GROUP, SPINAL_RELATION_PTR_LST_TYPE);
    
    await this.saveItemLinked(controlPointId, [node.getId().get()], true);
    return node;
  }

  public async  unlinkControlPointToNode(nodeId: string, controlPointProfilId?: string): Promise<boolean[]> {
    let profilsLinked = await SpinalGraphService.getChildren(nodeId, [ROOM_TO_CONTROL_GROUP]);
    if (controlPointProfilId)
      profilsLinked = profilsLinked.filter(el => [el.referenceId.get(), el.id.get()].indexOf(controlPointProfilId) !== -1)
  
    const promises = profilsLinked.map(async el => {
      const bool = await  SpinalGraphService.removeChild(nodeId, el.id.get(),ROOM_TO_CONTROL_GROUP,SPINAL_RELATION_PTR_LST_TYPE);
      await this.removeItemLinked(el.referenceId.get(), nodeId);
      return bool;
    })

    return Promise.all(promises);
  }


  /**
   * get All node linked to the control point
   * @param  {string} controlProfilId
   * @param {boolean} linkDirectlyToGroup - specify only for group 
   * @returns Promise
   */
  public async getElementLinked(nodeId: string, linkDirectlyToGroup: boolean = false): Promise<SpinalNodeRef[]> {
    const node = SpinalGraphService.getInfo(nodeId);
    const type = node.type.get();
    
    if (type === CONTROL_POINT_TYPE || (groupManagerService.isGroup(type) && !linkDirectlyToGroup)) return this.getElementLinkedToProfileOrGroupItems(nodeId);     

    // sinon recuperer le referenceId des children
  }

   /**
   * Get all node linked to the nodeId (control endpoint | id of group)
   * @param  {string} nodeId - controlPointId or groupId
   * @returns Promise
   */
  public loadElementLinked(nodeId: string): Promise<spinal.Lst<SpinalNode<any>> | spinal.Lst<ILinkedToGroupRes>> {
    const realNode = SpinalGraphService.getRealNode(nodeId);
    const type = realNode.getType().get();
    
    if (type !== CONTROL_POINT_TYPE || !groupManagerService.isGroup(type)) {
      throw new Error(`use this method only for profile of controlPoint or for group`);
    }

    if (!realNode || !realNode.info || !realNode.info.linkedItems) {
      let res: spinal.Lst<SpinalNode<any>> = new Lst();
      realNode.info.add_attr({ linkedItems: new Ptr(res) });
      return Promise.resolve(res);
    }

    return new Promise((resolve, reject) => {
      realNode.info.linkedItems.load((res) => {
        return resolve(res);
      });
    });
  }

  public getElementLinkedToProfileOrGroupItems(nodeId: string): Promise<SpinalNodeRef[]> {
    const node = SpinalGraphService.getInfo(nodeId);
    const type = node.type.get();
    
    if (type !== CONTROL_POINT_TYPE || !groupManagerService.isGroup(type)) {
      throw new Error(`use this method only for profile of controlPoint or for group`);
    }

    return this.loadElementLinked(nodeId).then((res) => {
      if (!res) return [];

      const items = [];
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        const node = isLinkedDirectlyToGroup(element) ? element.node : element;

        (<any>SpinalGraphService)._addNode(node);
        items.push(SpinalGraphService.getInfo(node.getId().get()));
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
  public async linkControlPointToGroup(groupId: string, controlPointContextId: string, controlPointId: string, linkDirectlyToGroup: boolean = false ): Promise<Array<SpinalNodeRef>> {

    const controlPoints = await this.getControlPointProfil(controlPointContextId, controlPointId );

    if (linkDirectlyToGroup) {
      const node = await this.linkControlPointToNode(groupId, controlPointContextId, controlPointId, controlPoints);
      return [SpinalGraphService.getInfo(node.getId().get())];
    }

    const nodes = await this._LinkGroupItemsNode(groupId,controlPointContextId, controlPointId, controlPoints)
    await this.saveItemLinked(groupId, [controlPointId], linkDirectlyToGroup);
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
  }

  /**
   * unlink the control point to a group and his items
   * @param  {string} groupId
   * @param  {string} controlPointProfilId
   * @returns Promise
   */
  public async unLinkControlPointToGroup(groupId: string, controlPointProfilId: string, isLinkedDirectlyToGroup: boolean = false): Promise<boolean[]> {
    
    if (isLinkedDirectlyToGroup) return this.unlinkControlPointToNode(groupId, controlPointProfilId);

    const groupItems = await Utilities.getGroupItems(groupId);

    const groupInfo = SpinalGraphService.getInfo(groupId);
    groupItems.push(groupInfo); // ajouter le group à la liste, pour supprimer le profil si jamais il est directement lier au groupe

    const promises = groupItems.map(async (element) => {
      try {
        return this.unlinkControlPointToNode(element.id.get(),controlPointProfilId);
      } catch (error) {
        console.error(error);
        return false;
      }
    });

    return Promise.all(promises).then(async (result) => {
      await this.removeItemLinked(groupId, controlPointProfilId);
      return result.flat();
    });
  }

  /**
   * Edit the control point profile and update the bms endpoints associated according to the control point profiles
   * @param  {string} contextId
   * @param  {string} controlPointId
   * @param  {Array} values
   * @returns Promise
   */
  public async editControlPointProfil(contextId: string, controlPointId: string, values: IControlEndpoint[]): Promise<{ name: string; endpoints: spinal.Lst<IControlEndpointModel> }> {
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
   * For a selected group format the control point profiles and the rooms of this group
   * @param  {string} groupId
   * @returns Promise
   */
  public async getDataFormated(groupId: string): Promise<{id: string;name: string;type: string;endpointProfils: IControlEndpoint[];}[]> {
    const elementLinked = await this.getElementLinked(groupId);
    const rooms = await Utilities.getGroupItems(groupId);

    const promises = elementLinked.map(async (element) => {
      const el = element.get();
      const contextId = this.getContextId(el.id);
      const controlPointProfil = await this.getControlPointProfil(
        contextId,
        el.id
      );
      el['endpointProfils'] = controlPointProfil.endpoints.get();
      el['rooms'] = await this.formatRooms(el.id, rooms);
      return el;
    });

    return Promise.all(promises);
  }

  /**
   * get and return the endpoint linked to nodeId and created according the profil selected
   * @param  {string} nodeId
   * @param  {string} profilId
   * @returns Promise
   */
  public async getReferencesLinked(nodeId: string, profilId?: string): Promise<SpinalNodeRef | SpinalNodeRef[]> {
    const profils = await SpinalGraphService.getChildren(nodeId, [
      ROOM_TO_CONTROL_GROUP,
    ]);

    if (!profilId) return profils;

    const found = profils.find((el) => el.referenceId.get() === profilId);
    return found;
  }

  /**
   * get All endpoints Nodes linked to roomId and created according the profil selected
   * @param  {string} roomId - nodeId
   * @param  {string} profilId - controlEndpoint profil id
   * @returns Promise
   */
  public async getEndpointsNodeLinked(roomId: string, profilId: string, referenceLinked?: SpinalNodeRef): Promise<SpinalNodeRef[]> {
    const found =
      referenceLinked || (await this.getReferencesLinked(roomId, profilId));
    let profilFound = Array.isArray(found) ? found[0] : found;

    if (profilFound) {
      return SpinalGraphService.getChildren(profilFound.id.get(), [
        SpinalBmsEndpoint.relationName,
      ]);
    }

    return [];
  }

 

  /**
   * This method takes as parameter a group item's id and return all control endpoints classify by profil
   * @param  {string} groupItemId
   * @returns Promise
   */
  public async getControlEndpointLinkedToGroupItem(groupItemId: string): Promise<IControlPointRes[]> {
    const profils = await this.getReferencesLinked(groupItemId);

    const promises = profils.map(async (element) => {
      const el = element.get();
      const endpoints = await this.getEndpointsNodeLinked(groupItemId,el.referenceId,element);
      el.endpoints = endpoints.map((el) => el.get());
      return el;
    });

    return Promise.all(promises);
  }

  /**
   * get All endpoints linked to roomId and created according the profil selected
   * @param  {string} roomId - nodeId
   * @param  {string} profilId - controlEndpoint profil id
   * @returns Promise
   */
  public async getEndpointsLinked(nodeId: string, profilId: string): Promise<spinal.Model[]> {
    const endpointsInfo = await this.getEndpointsNodeLinked(nodeId, profilId);
    const promises = endpointsInfo.map((el) => el.element.load());
    return Promise.all(promises);
  }

  /**
  * This method allows to create and link endpoints to group item according the profil linked to group
  * @param  {string} groupId
  * @param  {string} elementId
  * @returns Promise
  */
  public async linkControlPointToNewGroupItem(groupId: string, elementId: string, controlPointProfilId?: string): Promise<SpinalNode<any>[]> {
    const profilsLinked = controlPointProfilId
      ? [SpinalGraphService.getInfo(controlPointProfilId)]
      : await this.getElementLinked(groupId);

    const promises = profilsLinked.map(async (profilModel) => {
      const profil = profilModel.get();
      const controlPointContextId = this.getContextId(profil.id);
      const controlPoints = await this.getControlPointProfil(
        controlPointContextId,
        profil.id
      );
      const nodeId = await Utilities.createNode(controlPoints.name, controlPointContextId,profil.id,controlPoints.endpoints.get());
      
      return SpinalGraphService.addChildInContext(elementId,nodeId,controlPointContextId,ROOM_TO_CONTROL_GROUP,SPINAL_RELATION_PTR_LST_TYPE);
    });

    return Promise.all(promises);
  }

   /**
    * This method allows to ulink endpoints to group item according the profil linked to group
    * @param  {string} groupId
    * @param  {string} elementId
    * @returns Promise
    */
   public async unLinkControlPointToGroupItem(groupId: string, elementId: string, controlPointProfilId?: string): Promise<boolean[]> {
    
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
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  //                                   PRIVATES                                            //
  ///////////////////////////////////////////////////////////////////////////////////////////

  public async getAllProfils(controlPointId: string): Promise<SpinalNodeRef[]> {
    const elementsLinked = await this.getElementLinked(controlPointId);
    const promises = [];

    for (const group of elementsLinked) {
      promises.push(Utilities.getGroupItems((<any>group).id.get()));
    }

    return Promise.all(promises).then((roomsArrays: any) => {
      const rooms = roomsArrays.flat();
      const promises2 = rooms.map((el) =>
        this.getReferencesLinked(el.id.get(), controlPointId)
      );
      return Promise.all(promises2).then((result) => {
        return (<any>result).flat();
      });
    });
  }

  public async controlPointProfilIsAlreadyLinked(profilId: string, nodeId: string ): Promise<boolean> {
    const linkedProm = [this.getElementLinked(nodeId), SpinalGraphService.getChildren(nodeId, [ROOM_TO_CONTROL_GROUP])]
    
    return Promise.all(linkedProm).then((result) => {
      const flatted = result.flat();
      const found = flatted.find(el => [el.id?.get(), el.referenceId?.get()].indexOf(profilId) !== -1);
      
      return found ? true : false;
    }).catch((err) => {
      return false;
    });

  }

  public getContextId(nodeId: string): string {
    const realNode = SpinalGraphService.getRealNode(nodeId);
    if (realNode.contextIds) {
      const contextIds = realNode.contextIds.values();
      return contextIds.find((id) => {
        return this.isControlPointContext(id);
      });
    }
  }

  public formatRooms(profilId: string, rooms: SpinalNodeRef[]): Promise<{
      id: string;
      type: string;
      name: string;
      bimObjects: [];
      endpoints: IControlEndpointModel[];}[]> {
    const promises = rooms.map(async (room: any) => {
      let obj = room.get();
      obj['bimObjects'] = [];
      obj['endpoints'] = await this.getEndpointsLinked(obj.id, profilId);
      return obj;
    });

    return Promise.all(promises);
  }

  

   public async removeItemSaved(groupId, profilId: string): Promise<boolean[]> {
     let groupItems = await Utilities.getGroupItems(groupId);

     const promises = groupItems.map(el => this.removeItemLinked(el.id.get(), profilId));
     promises.push(this.removeItemLinked(groupId, profilId), this.removeItemLinked(profilId, groupId));
     return Promise.all(promises);    
   }

  public async _LinkGroupItemsNode(groupId: string, controlPointContextId: string, controlPointId: string, controlPoints: {name: string; endpoints: spinal.Lst<IControlEndpointModel>}): Promise<SpinalNodeRef[]> {
    const isLinked = await this.controlPointProfilIsAlreadyLinked(controlPointId, groupId);
    if (isLinked) return;

    const groupInfo = SpinalGraphService.getInfo(groupId);

    const items = await Utilities.getGroupItems(groupId);

    const promises = items.map(async (el) => {
      return this.linkControlPointToNode(el.id.get(), controlPointContextId, controlPointId, controlPoints);
    });

    return Promise.all(promises).then((result) => {
      return result.map((el) => SpinalGraphService.getInfo(el.getId().get()));
    });
  }

  public async saveItemLinked(profilId: string, ids: string[], linkedDirectlyToGroup : boolean = false): Promise<{ id: string; name: string; type: string }[]> {
    let items = await this.loadElementLinked(profilId);

    ids.forEach((id) => {
      const isLinked = Utilities.isLinked(items, id);

      if (!isLinked) {
        const realNode = SpinalGraphService.getRealNode(id);
        items.push({node : realNode, linkedDirectlyToGroup});
      }
    });

    const res = [];

    for (let index = 0; index < items.length; index++) {
      const element = items[index].info.get();
      res.push(element);
    }

    return res;
  }

  public async removeItemLinked(profileOrGroupId: string, idOfItemToremove: string): Promise<boolean> {
    let items = await this.loadElementLinked(profileOrGroupId);

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      const node = isLinkedDirectlyToGroup(element) ? element.node : element;

      if (node.getId().get() === idOfItemToremove) {
        items.splice(index);
        return true;
      }
    }

    return false;
  }


}

export { ControlEndpointService };
