import {isEmpty as _isEmpty} from "lodash-es";

// Typed version of lodash !isEmpty
export const isNotEmpty = (obj: Set<any> | Map<any, any> | Record<any, any> | any[] | undefined): boolean =>
    !_isEmpty(obj);