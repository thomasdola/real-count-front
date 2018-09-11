import _find from "lodash/find";
import _includes from 'lodash/includes';

export default class CanUser{
    constructor(){
        this.gate = undefined;
        this.action = undefined;
        this.scope = undefined;
        this.entity = undefined;
    }

    static view(gate, {gates}){
        return _includes(gates, gate);
    }

    perform(action){
        this.action = action;
        return this;
    }

    on(entity){
        this.entity = entity;
        return this;
    }

    through(gate){
        this.gate = gate;
        return this;
    }

    within(scope){
        this.scope = scope;
        return this;
    }

    with(policies, level){
        if(!this.action) throw new Error(`Action is ${this.action}`);
        if(!this.entity) throw new Error(`Entity is ${this.entity}`);
        if(!this.gate) throw new Error(`Gate is ${this.gate}`);

        let canHe = false;

        if(policies.length < 1) return canHe;

        canHe = !!_find(policies, ({gate: {name: gateName}, entity: {name: entityName}, actions}) => {
            return gateName === this.gate
                && entityName === this.entity
                && !!_find(actions, ({name: actionName}) => actionName === this.action);
        });

        if(!level) return canHe;

        return canHe && level === this.scope
    }
}