import { CalculationRule } from "./CalculationRulesDataType";
export interface EnumConfigDataType {
    enumeration: Array<{
        name: string;
        color: string;
    }>;
    calculation_rule: CalculationRule;
}
export interface NumberConfigDataType {
    min: {
        value: number;
        color: string;
    };
    average: {
        value: number;
        color: string;
    };
    max: {
        value: number;
        color: string;
    };
    calculation_rule: CalculationRule;
}
export interface BoolConfigDataType {
    min: {
        value: boolean;
        color: string;
    };
    max: {
        value: boolean;
        color: string;
    };
    calculation_rule: CalculationRule;
}
