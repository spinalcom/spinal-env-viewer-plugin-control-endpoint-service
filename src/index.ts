/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import { SpinalControlEndpointService } from './classes/SpinalControlEndpointService';
import { CalculationRule } from './dataTypes/CalculationRulesDataType';
import { ControlEndpointDataType } from './dataTypes/ControlEndpointDataType';
import { ControlEndpointType } from './dataTypes/ControlEndpointType';
import { BoolConfig, EnumConfig, getConfig, NumberConfig } from './models/config';
import { ControlPointObj, SpinalControlPoint, } from './models/controlPointsModel';
export * from "./classes/contants";


const spinalControlPointService = new SpinalControlEndpointService();
const spinalHeatmapService = spinalControlPointService;

const globalRoot: any = typeof window === 'undefined' ? global : window;

if (typeof globalRoot.spinal === 'undefined') globalRoot.spinal = {};

if (typeof globalRoot.spinal.spinalHeatmapService === 'undefined') {
  globalRoot.spinal.spinalHeatmapService = spinalControlPointService;
}

if (typeof globalRoot.spinal.spinalControlPointService === 'undefined') {
  globalRoot.spinal.spinalControlPointService = spinalControlPointService;
}



export {
  spinalControlPointService,
  spinalHeatmapService,
  BoolConfig,
  EnumConfig,
  NumberConfig,
  getConfig,
  SpinalControlPoint,
  ControlPointObj,
  CalculationRule,
  ControlEndpointDataType,
  ControlEndpointType,
};
