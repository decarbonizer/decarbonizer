declare module 'json-conditions' {
  // See https://github.com/raisely/json-conditions

  export default function checkConditions(config: CheckConditionsConfig, reference: any);

  export interface CheckConditionsConfig {
    rules: Array<JsonConditionsRule>;
    satisfy: 'ANY' | 'ALL';
    log?: typeof console.log;
  }

  export interface JsonConditionsRule {
    property: string;
    op:
      | 'eq'
      | 'neq'
      | 'ne'
      | 'gt'
      | 'gte'
      | 'lt'
      | 'lte'
      | 'absent'
      | 'empty'
      | 'present'
      | 'startsWith'
      | 'endsWith'
      | 'contains';
    value?: any;
  }
}
