'use strict';

((global) => {
    const timeoutMS = 100;

    const _async = (fn, cb) => {
        setTimeout(() => {
            cb(fn());
        }, Math.random() * timeoutMS);
    };

    const _error = (value) =>
        Math.random() < 0.1 ? null : value;

    const AsyncArray = function (a = []) {
        if (!new.target) {
            return new AsyncArray(a);
        }

        this.read = (index, cb) =>
            _async(() => _error(a[index]), cb);

        this.size = (cb) =>
            _async(() => _error(a.length), cb);
    };

    Object.freeze(AsyncArray);
    global.AsyncArray = AsyncArray;
})(typeof window === 'undefined' ? global : window);

const input = AsyncArray([
    8,
    AsyncArray([
        15,
        16,
    ]),
    AsyncArray([
        AsyncArray([
            AsyncArray([
                42,
                AsyncArray([
                    AsyncArray([]),
                    23,
                ]),
            ]),
        ]),
        4,
    ]),
]);

const promisifySizeFn = fn => new Promise(res => {
    const _cb = r => r === null ? fn(_cb) : res(r);
    fn(_cb);
});

const promisifyReadFn = (fn, cb) => i => new Promise(res => {
    const _cb = r => r === null ? fn(i, _cb) : res(cb(r));
    fn(i, _cb);
});

// проверка решения
solution(input).then(result => {
    const answer = [8, 15, 16, 42, 23, 4];
    const isEqual = String(answer) === String(result);

    if (isEqual) {
        console.log('OK');
    } else {
        console.log('WRONG');
    }
});

async function solution(input) {
    const promisifyAsyncArray = async (asyncArray) => {
        const promises = [];
        const size = await promisifySizeFn(asyncArray.size);
        const promisifiedReadFnCallback = v => typeof v === 'number' ? v : promisifyAsyncArray(v);
        const promisifiedReadFn = promisifyReadFn(asyncArray.read, promisifiedReadFnCallback);

        for (let i = 0; i < size; i++) {
            promises.push(promisifiedReadFn(i));
        }

        return Promise.all(promises);
    };

    return (await promisifyAsyncArray(input)).flat(Infinity);
}
