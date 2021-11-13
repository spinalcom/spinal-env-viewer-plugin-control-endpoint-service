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


import { ControlEnpointsTree } from "./ControlEnpointsTree";
import { ControlEndpointService } from "./ControlEndpoint";

import {
   CONTROL_POINT_TYPE,
   CONTROL_GROUP_TYPE,
   CONTROL_GROUP_TO_CONTROLPOINTS,
   ROOM_TO_CONTROL_GROUP
} from "./contants";

import { spinalEventEmitter } from "spinal-env-viewer-plugin-event-emitter";
import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service'
import { Utilities } from "./Utilities";

function applyMixins(derivedConstructor: any, baseConstructors: any[]) {
   baseConstructors.forEach(baseConstructor => {
      Object.getOwnPropertyNames(baseConstructor.prototype)
         .forEach(name => {
            Object.defineProperty(derivedConstructor.prototype,
               name,
               Object.
                  getOwnPropertyDescriptor(
                     baseConstructor.prototype,
                     name
                  )
            );
         });
   });
}


class SpinalControlEndpointService {
   public CONTROL_POINT_TYPE: string = CONTROL_POINT_TYPE;
   public CONTROL_GROUP_TYPE: string = CONTROL_GROUP_TYPE;
   public CONTROL_GROUP_TO_CONTROLPOINTS: string = CONTROL_GROUP_TO_CONTROLPOINTS;
   public ROOM_TO_CONTROL_GROUP: string = ROOM_TO_CONTROL_GROUP;

   constructor() {
      this.listenLinkItemToGroupEvent();
      this.listenUnLinkItemToGroupEvent();
   }

   private listenLinkItemToGroupEvent(): void {

      spinalEventEmitter.on(groupManagerService.constants.ELEMENT_LINKED_TO_GROUP_EVENT, ({ groupId, elementId }) => {
         this.linkControlPointToNewGroupItem(groupId, elementId);
      })
   }

   private listenUnLinkItemToGroupEvent(): void {
      spinalEventEmitter.on(groupManagerService.constants.ELEMENT_UNLINKED_TO_GROUP_EVENT, ({ groupId, elementId }) => {
         this.unLinkControlPointToGroupItem(groupId, elementId);
      })
   }
}

interface SpinalControlEndpointService extends ControlEnpointsTree, ControlEndpointService { };

applyMixins(SpinalControlEndpointService, [ControlEnpointsTree, ControlEndpointService]);


export {
   SpinalControlEndpointService
}