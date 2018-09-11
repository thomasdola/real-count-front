import _includes from "lodash/includes";
import _find from "lodash/find";
import _isString from 'lodash/isString';
import _isEqual from 'lodash/isEqual';

export default class Can{

    constructor(user){
        this.user = user;
    }

    static User(user){
        return new Can(user);
    }

    access(page, scope = null){
        if(!page) throw new Error(`Gate is ${page}`);

        let canHe = false;

        const {gates} = this.user.role;
        canHe = _includes(gates, page);

        if(!scope) return canHe;

        return this.canHeWithScope(canHe, scope);
    }

    perform(action, entity, page, scope = null){
        if(!action) throw new Error(`Action is ${action}`);
        if(!entity) throw new Error(`Entity is ${entity}`);
        if(!page) throw new Error(`Gate is ${page}`);

        let canHe = false;

        const {policies} = this.user.role;

        if(policies.length < 1) return canHe;

        canHe = !!_find(policies, ({gate: {name: gateName}, entity: {name: entityName}, actions}) => {
            return _isEqual(gateName, page)
                && _isEqual(entityName, entity)
                && !!_find(actions, ({name: actionName}) => _isEqual(actionName, action));
        });

        if(!scope) return canHe;

        return this.canHeWithScope(canHe, scope);
    }

    canHeWithScope(canHe, scope){
        let scoped = false;
        
        const {type, id} = this.user.role.level;

        if(_isString(scope)){
            scoped = _isEqual(scope, type);
            return canHe && scoped;
        }

        const {regionId, districtId, locationId} = scope;

        switch(type){
            case "region":
                scoped = regionId 
                    ? _isEqual(parseInt(regionId, 10), parseInt(id, 10)) 
                    : true;
                break;
            case "district":
                scoped = districtId 
                    ? _isEqual(parseInt(districtId, 10), parseInt(id, 10)) 
                    : true;
                break;
            case "location":
                scoped = locationId 
                    ? _isEqual(parseInt(locationId, 10), parseInt(id, 10)) 
                    : true;
                break;
            default:
                scoped = false;
        }

        return canHe && scoped;
    }
}