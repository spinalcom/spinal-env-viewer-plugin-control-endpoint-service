import { Model } from 'spinal-core-connectorjs_type';
import { IControlEndpoint } from '../interfaces/ControlEndpoint';
export declare const ControlPointObj: IControlEndpoint;
export declare class SpinalControlPoint extends Model {
    constructor(controlPoint?: IControlEndpoint);
    bindDataType(): void;
}
