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
    // ... решение задачи

    // пример вызова read
    input.read(0, (elem) => console.log(`read: ${elem}`));

    // пример вызова size
    input.size((size) => console.log(`size: ${size}`));
}
