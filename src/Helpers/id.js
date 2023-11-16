let lastId = 0;

export function uuid(prefix='id') {
    lastId++;
    return `${prefix}${lastId}`;
}