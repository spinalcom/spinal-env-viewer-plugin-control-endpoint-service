/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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

import { Model, spinalCore } from "spinal-core-connectorjs_type"
import { ControlEndpointType } from "../dataTypes/ControlEndpointType";
import { ControlEndpointDataType } from '../dataTypes/ControlEndpointDataType'
import { IControlEndpoint } from "../interfaces/ControlEndpoint";
import { getConfig } from "./config";

export const ControlPointObj: IControlEndpoint = Object.freeze({
    name: "",
    alias: "",
    path: "",
    unit: "",
    dataType: ControlEndpointDataType.Float,
    type: ControlEndpointType.Temperature,
    command: 0,
    saveTimeSeries: 0,
    config: getConfig(ControlEndpointDataType.Float),
    icon: "device_thermostat"
})

export class SpinalControlPoint extends Model {
    constructor(controlPoint?: IControlEndpoint) {
        super();

        if (controlPoint) {
            controlPoint.config = getConfig(controlPoint.dataType);
        }

        if (typeof controlPoint === "undefined") {
            controlPoint = ControlPointObj
        }

        this.add_attr(controlPoint);
        this.bindDataType();
    }

    bindDataType() {
        this.dataType.bind(() => {
            const type = this.dataType.get();
            this.mod_attr('config', getConfig(type));
        })
    }
}

spinalCore.register_models([SpinalControlPoint])