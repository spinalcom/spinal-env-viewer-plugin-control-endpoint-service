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

import { ControlEndpointDataType } from "../dataTypes/ControlEndpointDataType";
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from "../dataTypes/ControlConfigDataType";
import { CalculationRule } from "../dataTypes/CalculationRulesDataType";


export const BoolConfig: BoolConfigDataType = {
    min: { value: false, color: "#008000" },
    max: { value: true, color: "#FF0000" },
    calculation_rule: CalculationRule.Reference
}


export const EnumConfig: EnumConfigDataType = {
    enumeration: [],
    calculation_rule: CalculationRule.Reference
}

export const NumberConfig: NumberConfigDataType = {
    min: { value: 0, color: "#FF0000" },
    average: { value: 15, color: "#ffff00" },
    max: { value: 30, color: "#008000" },
    calculation_rule: CalculationRule.Reference
}

export const getConfig = function (dataType: ControlEndpointDataType) {

    switch (dataType) {
        case ControlEndpointDataType.Boolean:
            return BoolConfig;

        case ControlEndpointDataType.Enum:
            return EnumConfig;

        case ControlEndpointDataType.Float:
        case ControlEndpointDataType.Integer:
        case ControlEndpointDataType.Integer16:
        case ControlEndpointDataType.Real:
        case ControlEndpointDataType.Double:
        case ControlEndpointDataType.Long:
            return NumberConfig;
    }

}