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
// import { SpinalControlEndpointService } from "./SpinalControlEndpointService";
const config_1 = require("./models/config");
exports.getConfig = config_1.getConfig;
exports.BoolConfig = config_1.BoolConfig;
exports.EnumConfig = config_1.EnumConfig;
exports.NumberConfig = config_1.NumberConfig;
const controlPointsModel_1 = require("./models/controlPointsModel");
exports.SpinalControlPoint = controlPointsModel_1.SpinalControlPoint;
exports.ControlPointObj = controlPointsModel_1.ControlPointObj;
const CalculationRulesDataType_1 = require("./dataTypes/CalculationRulesDataType");
exports.CalculationRule = CalculationRulesDataType_1.CalculationRule;
const ControlEndpointDataType_1 = require("./dataTypes/ControlEndpointDataType");
exports.ControlEndpointDataType = ControlEndpointDataType_1.ControlEndpointDataType;
const ControlEndpointType_1 = require("./dataTypes/ControlEndpointType");
exports.ControlEndpointType = ControlEndpointType_1.ControlEndpointType;
const SpinalControlEndpointService_1 = require("./classes/SpinalControlEndpointService");
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
console.log("hello from control-endpoint-service");
//# sourceMappingURL=index.js.map