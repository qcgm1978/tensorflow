class ML {
    constructor() {

    }
    generatePattern(sevenSteps) {
        if (sevenSteps.length !== 7) {
            throw Error('Not Sevent ML methods')
        }
        for (let item of sevenSteps) {
            if (item instanceof Function) {
                item.call(this);
            } else {
                this[Object.keys(item)[0]] = Object.values(item)[0];
            }
        }
    }
}