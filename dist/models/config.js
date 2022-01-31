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
exports.getConfig = exports.NumberConfig = exports.EnumConfig = exports.BoolConfig = void 0;
const CalculationRulesDataType_1 = require("../dataTypes/CalculationRulesDataType");
const ControlEndpointDataType_1 = require("../dataTypes/ControlEndpointDataType");
exports.BoolConfig = {
    min: { value: false, color: '#008000' },
    max: { value: true, color: '#FF0000' },
    calculation_rule: CalculationRulesDataType_1.CalculationRule.Reference,
};
exports.EnumConfig = {
    enumeration: [],
    calculation_rule: CalculationRulesDataType_1.CalculationRule.Reference,
};
exports.NumberConfig = {
    min: { value: 0, color: '#FF0000' },
    average: { value: 15, color: '#ffff00' },
    max: { value: 30, color: '#008000' },
    calculation_rule: CalculationRulesDataType_1.CalculationRule.Reference,
};
const getConfig = function (dataType) {
    switch (dataType) {
        case ControlEndpointDataType_1.ControlEndpointDataType.Boolean:
            return exports.BoolConfig;
        case ControlEndpointDataType_1.ControlEndpointDataType.Enum:
            return exports.EnumConfig;
        case ControlEndpointDataType_1.ControlEndpointDataType.Float:
        case ControlEndpointDataType_1.ControlEndpointDataType.Integer:
        case ControlEndpointDataType_1.ControlEndpointDataType.Integer16:
        case ControlEndpointDataType_1.ControlEndpointDataType.Real:
        case ControlEndpointDataType_1.ControlEndpointDataType.Double:
        case ControlEndpointDataType_1.ControlEndpointDataType.Long:
            return exports.NumberConfig;
    }
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map