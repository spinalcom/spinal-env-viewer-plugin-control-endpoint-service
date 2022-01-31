"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalControlPoint = exports.ControlPointObj = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const ControlEndpointDataType_1 = require("../dataTypes/ControlEndpointDataType");
const ControlEndpointType_1 = require("../dataTypes/ControlEndpointType");
const config_1 = require("./config");
exports.ControlPointObj = Object.freeze({
    name: '',
    alias: '',
    path: '',
    unit: '',
    dataType: ControlEndpointDataType_1.ControlEndpointDataType.Float,
    type: ControlEndpointType_1.ControlEndpointType.Temperature,
    command: 0,
    saveTimeSeries: 0,
    config: (0, config_1.getConfig)(ControlEndpointDataType_1.ControlEndpointDataType.Float),
    icon: 'device_thermostat',
    isActive: true,
});
class SpinalControlPoint extends spinal_core_connectorjs_type_1.Model {
    constructor(controlPoint) {
        super();
        if (controlPoint) {
            controlPoint.config = (0, config_1.getConfig)(controlPoint.dataType);
        }
        if (typeof controlPoint === 'undefined') {
            controlPoint = exports.ControlPointObj;
        }
        this.add_attr(controlPoint);
        this.bindDataType();
    }
    bindDataType() {
        this.dataType.bind(() => {
            const type = this.dataType.get();
            this.mod_attr('config', (0, config_1.getConfig)(type));
        });
    }
}
exports.SpinalControlPoint = SpinalControlPoint;
spinal_core_connectorjs_type_1.spinalCore.register_models([SpinalControlPoint]);
//# sourceMappingURL=controlPointsModel.js.map