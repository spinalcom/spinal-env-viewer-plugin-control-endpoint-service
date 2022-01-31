import { ControlEndpointService } from './ControlEndpoint';
import { ControlEnpointsTree } from './ControlEnpointsTree';
declare class SpinalControlEndpointService {
    CONTROL_POINT_TYPE: string;
    CONTROL_GROUP_TYPE: string;
    CONTROL_GROUP_TO_CONTROLPOINTS: string;
    ROOM_TO_CONTROL_GROUP: string;
    constructor();
    private listenLinkItemToGroupEvent;
    private listenUnLinkItemToGroupEvent;
}
interface SpinalControlEndpointService extends ControlEnpointsTree, ControlEndpointService {
}
export { SpinalControlEndpointService };
