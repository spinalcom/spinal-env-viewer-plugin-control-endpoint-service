
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

   private listenLinkItemToGroupEvent() {

      spinalEventEmitter.on(groupManagerService.constants.ELEMENT_LINKED_TO_GROUP_EVENT, async (data) => {
         console.log("item linked To group event");

         const profilsLinked: any = await this.getElementLinked(data.groupId);

         const promises = profilsLinked.map(async (profilModel) => {
            const profil = profilModel.get();
            const controlPointContextId = this.getContextId(profil.id);
            const controlPoints = await this.getControlPointProfil(controlPointContextId, profil.id);
            const nodeId = await Utilities.createNode(controlPoints.name, controlPointContextId, profil.id, controlPoints.endpoints.get());
            return SpinalGraphService.addChildInContext(data.elementId, nodeId, controlPointContextId, ROOM_TO_CONTROL_GROUP, SPINAL_RELATION_PTR_LST_TYPE)
         })

         return Promise.all(promises);
      })
   }

   private listenUnLinkItemToGroupEvent() {
      spinalEventEmitter.on(groupManagerService.constants.ELEMENT_UNLINKED_TO_GROUP_EVENT, async (data) => {
         console.log("item unlinked To group event");

         const profilsLinkedModel = await this.getElementLinked(data.groupId);
         const elementProfilsModel = SpinalGraphService.getChildren(data.elementId, [ROOM_TO_CONTROL_GROUP]);

         const profilsLinked = profilsLinkedModel.map((el: any) => el.get());
         const elementProfils = (await elementProfilsModel).map(el => el.get());

         const promises = elementProfils.map((profil) => {
            const found = profilsLinked.find(el => el.id === profil.referenceId);
            if (found) {
               return SpinalGraphService.removeChild(data.elementId, profil.id, ROOM_TO_CONTROL_GROUP, SPINAL_RELATION_PTR_LST_TYPE);
            }
            return Promise.resolve(false);
         })

         return Promise.all(promises);
      })
   }
}

interface SpinalControlEndpointService extends ControlEnpointsTree, ControlEndpointService { };

applyMixins(SpinalControlEndpointService, [ControlEnpointsTree, ControlEndpointService]);


export {
   SpinalControlEndpointService
}