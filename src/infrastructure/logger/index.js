export const logger = Object.keys({
    debug: 3,
    info: 2,
    warn: 1,
    error: 0
}).reduce((obj, level) => ({ 
    ...obj,
    [level]: log => {
        console.log(JSON.stringify(log))
    }
}), {})