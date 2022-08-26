module.exports = YetAnotherSet

function YetAnotherSet (iterator = []) {
    if (typeof new.target === 'undefined') {
        return new YetAnotherSet(iterator);
    }

    this._values = [];
    if (iterator[Symbol.iterator]) {
        [...iterator].forEach(el => {
            if (!this._values.some(v => Object.is(v, el))) {
                this._values.push(el);
            }
        });
    }

    YetAnotherSet.prototype.toString = () => '[object ^_^]';

    YetAnotherSet.prototype[Symbol.iterator] = function() {
        let i = 0;
        return {
            next: () => {
                const nextValue = i < this._values.length
                    ? { value: this._values[i], done: false}
                    : { value: undefined, done: true};

                i++;
                return nextValue;
            }
        };
    };

    Object.defineProperty(YetAnotherSet.prototype, Symbol.iterator, {
        enumerable: false,
        configurable: false,
        writable: false
    });

    Object.defineProperty(YetAnotherSet.prototype, 'size', {
        get: () => this._values.length,
        enumerable: true,
        configurable: true
    });

    YetAnotherSet.prototype.has = v => this._values.some(el => Object.is(el, v));

    YetAnotherSet.prototype.add = v => {
        if (!this.has(v)) {
            this._values.push(v);
        }
        return this;
    };

    YetAnotherSet.prototype.delete = v => {
        if (this.has(v)) {
            this._values = this._values.filter(el => !Object.is(el, v));
            return true;
        }
        return false;
    };

    YetAnotherSet.prototype.clear = () => this._values = [];

    YetAnotherSet.prototype.forEach = Array.prototype.forEach.bind(this);

    YetAnotherSet.prototype.keys = () => ({
        [Symbol.iterator]: () => {
            let i = 0;
            return {
                next: () => {
                    const nextValue = i < this._values.length
                        ? { value: this._values[i], done: false}
                        : { value: undefined, done: true};
    
                    i++;
                    return nextValue;
                }
            };
        }
    });

    YetAnotherSet.prototype.values = YetAnotherSet.prototype.keys;

    YetAnotherSet.prototype.entries = () => ({
        [Symbol.iterator]: () => {
            let i = 0;
            return {
                next: () => {
                    const nextValue = i < this._values.length
                        ? { value: [this._values[i], this._values[i]], done: false}
                        : { value: undefined, done: true};
    
                    i++;
                    return nextValue;
                }
            };
        }
    });
};

// вспомогательные функции
const originalObjectToString = Object.prototype.toString;
Object.prototype.toString = function() {
    return this instanceof YetAnotherSet ? this.toString() : originalObjectToString();
};

// ТЕСТЫ

let object = null
let array = null
let set = null

let res = null

// преобразования
set = YetAnotherSet([])
console.assert(String(set) === '[object ^_^]', 'String(set)')
console.assert(Object.prototype.toString.call(set) === '[object ^_^]', 'Object.prototype.toString.call(set)')

// работает в цикле for-of
array = [3, 14, 15]
set = YetAnotherSet(array)
for (const item of set) {
    console.assert(item === array.shift(), 'for-of')
}

// хранит только уникальные значения
array = [4, 4, 8, 15, 15, 16, 23, 42]
set = YetAnotherSet(array)
console.assert(String([...set]) === String([...new Set(array)]), 'unique value')

// есть свойство size
array = [1, 2, 3, 4, 5]
set = YetAnotherSet(array)
console.assert(set.size === array.length, 'size property')

// TODO
// есть методы has, add, delete, clear
object = {}
array = [{}, object, 42, NaN, undefined]
set = YetAnotherSet(array)

console.assert(set.has(23) === false, 'has not 23')
console.assert(set.has({}) === false, 'has not {}')

console.assert(set.has(42) === true, 'has 42')
console.assert(set.has(NaN) === true, 'has NaN')
console.assert(set.has(object) === true, 'has object')
console.assert(set.has(undefined) === true, 'has undefined')

set.add(NaN).add(undefined)
console.assert(set.size === array.length, 'add NaN & undefined')

set.add({})
array.push({})
console.assert(set.size === array.length, 'add {}')

res = set.delete(23)
console.assert(res === false, '23 is not deleted')
console.assert(set.size === array.length, 'same size after delete 23')

res = set.delete({})
console.assert(res === false, '{} is not deleted')
console.assert(set.size === array.length, 'same size after delete {}')

res = set.delete(42)
console.assert(res === true, '42 is deleted')
console.assert([...set].includes(42) === false, 'do not includes 42')

res = set.delete(object)
console.assert(res === true, 'object is deleted')
console.assert([...set].includes(object) === false, 'do not includes object')

res = set.delete(NaN)
console.assert(res === true, 'NaN is deleted')
console.assert([...set].includes(NaN) === false, 'do not includes NaN')

res = set.delete(undefined)
console.assert(res === true, 'undefined is deleted')
console.assert([...set].includes(undefined) === false, 'do not includes undefined')

set.clear()
console.assert(set.size === 0, 'empty after clear')

set.add(4).add(4).add(8).add(15).add(16).add(23).add(42).add(42)
console.assert(set.size === 6, 'add handels not unique values')

set.clear()
set.add({}).add({}).add({})
set.add(object).add(object).add(object).add(object).add(object)
console.assert(set.size === 4, 'add handels not unique refs')

// работает без new и инициализатора
set = YetAnotherSet()
console.assert(set.has(undefined) === false, 'has nothing')
console.assert(set.delete(undefined) === false, 'nothing to delete')
console.assert(set.size === 0, 'size is zero for emply')

// работает для интерируемых объектов
set = YetAnotherSet('hello')
console.assert(String([...set]) === String(['h', 'e', 'l', 'o']), 'works with string')

// forEach
array = [23, 42]

set = YetAnotherSet(array)
set.forEach((item, index) => {
    console.assert(item === array[index], 'forEach for values')
})

set = YetAnotherSet(array)
set.forEach(function (item, index) {
    this.value = item
    console.assert(this.getValue() === array[index], 'forEach with context')
}, { getValue () { return this.value } })

// есть методы keys, values, entries
array = [4, 8, 15, 16, 23, 42]
set = YetAnotherSet(array)

const keys = [...array]
for (const item of set.keys()) {
    console.assert(item === keys.shift(), 'for-of keys')
}

const values = [...array]
for (const item of set.values()) {
    console.assert(item === values.shift(), 'for-of values')
}

const entries = [...array]
for (const [key, value] of set.entries()) {
    const elem = entries.shift()
    console.assert(key === elem && value === elem, 'for-of entries')
}