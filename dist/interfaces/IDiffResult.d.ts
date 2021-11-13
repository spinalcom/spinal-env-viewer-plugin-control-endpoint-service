import { IControlEndpoint } from "./ControlEndpoint";
export interface IDiffResult {
    toCreate: IControlEndpoint[];
    toUpdate: IControlEndpoint[];
    toRemove: IControlEndpoint[];
}
