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
exports.ControlEndpointType = exports.ControlEndpointDataType = exports.CalculationRule = exports.ControlPointObj = exports.SpinalControlPoint = exports.getConfig = exports.NumberConfig = exports.EnumConfig = exports.BoolConfig = exports.spinalHeatmapService = exports.spinalControlPointService = void 0;
const SpinalControlEndpointService_1 = require("./SpinalControlEndpointService");
const config_1 = require("./models/config");
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return config_1.getConfig; } });
Object.defineProperty(exports, "BoolConfig", { enumerable: true, get: function () { return config_1.BoolConfig; } });
Object.defineProperty(exports, "EnumConfig", { enumerable: true, get: function () { return config_1.EnumConfig; } });
Object.defineProperty(exports, "NumberConfig", { enumerable: true, get: function () { return config_1.NumberConfig; } });
const controlPointsModel_1 = require("./models/controlPointsModel");
Object.defineProperty(exports, "SpinalControlPoint", { enumerable: true, get: function () { return controlPointsModel_1.SpinalControlPoint; } });
Object.defineProperty(exports, "ControlPointObj", { enumerable: true, get: function () { return controlPointsModel_1.ControlPointObj; } });
const CalculationRulesDataType_1 = require("./dataTypes/CalculationRulesDataType");
Object.defineProperty(exports, "CalculationRule", { enumerable: true, get: function () { return CalculationRulesDataType_1.CalculationRule; } });
const ControlEndpointDataType_1 = require("./dataTypes/ControlEndpointDataType");
Object.defineProperty(exports, "ControlEndpointDataType", { enumerable: true, get: function () { return ControlEndpointDataType_1.ControlEndpointDataType; } });
const ControlEndpointType_1 = require("./dataTypes/ControlEndpointType");
Object.defineProperty(exports, "ControlEndpointType", { enumerable: true, get: function () { return ControlEndpointType_1.ControlEndpointType; } });
const spinalControlPointService = new SpinalControlEndpointService_1.SpinalControlEndpointService();
exports.spinalControlPointService = spinalControlPointService;
const spinalHeatmapService = spinalControlPointService;
exports.spinalHeatmapService = spinalHeatmapService;
const globalRoot = typeof window === "undefined" ? global : window;
if (typeof globalRoot.spinal === 'undefined')
    globalRoot.spinal = {};
if (typeof globalRoot.spinal.spinalHeatmapService === 'undefined') {
    globalRoot.spinal.spinalHeatmapService = spinalControlPointService;
}
if (typeof globalRoot.spinal.spinalControlPointService === 'undefined') {
    globalRoot.spinal.spinalControlPointService = spinalControlPointService;
}
//# sourceMappingURL=index.js.map