export function parseSort(sort){
    const [col, dir] = sort.split('|');
    return {[col]: dir};
}