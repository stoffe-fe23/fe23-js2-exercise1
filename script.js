
import { createHTMLElement } from './modules/stoffe-utilities.js';


const person = {
    first: 'Elon',
    last: 'Musk',
    twitter: '@elonmusk',
    company: 'Space X'
}

const person1 = {
    first: 'Anna',
    last: 'Anka',
    location: 'Malmö'
}
const person2 = {
    first: 'Nick',
    last: 'Cage',
    location: 'Los Angeles'
}

const niklasBur = {
    firstName: 'Nicolas',
    lastName: 'Cage',
    location: 'Los Angeles',
    occupation: 'actor',
    age: 60,
    birthday: 'January 7',
    uncle: 'Francis Ford Coppola',
    bestMovie: 'The Unbearable Weight of Massive Talent'
}


const item = {
    name: 'Xbox One X',
    originalPrice: 499.99,
    discount: 0.15
}

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { d: 4, e: 5 }

const country = {
    name: 'Sweden',
    population: '9000000',
    capital: 'Malmö',
    weather: 'probably windy',
    age: 500,
}

/************************************************************************************** */

createHTMLElement('select', ['1|One|Numbers', '2|Two|Numbers', '3|Three|Numbers', '4|Four|Numbers', 'yes|Affirmative|NASA', 'no|Negative|NASA', 'understood|Copy|NASA'], document.body);

// 2
displayPersonName(person);

// 3
createHTMLElement("div", `Price sum of 4 ${item.name}: ${calculatePriceSum(item, 4)}`, document.body);

// 4
createHTMLElement("div", `Price sum of 4 discounted ${item.name}: ${calculatePriceSumWithDiscount(item, 4)}`, document.body);

// 5
createHTMLElement("div", `New name: ${getOldschoolMarriageName(person1, person2)}`, document.body);

// 6
console.log("Cloned object: ", cloneAndAddLocationToObject(obj1, "Malmö"), " Original: ", obj1);
console.log("Cloned object: ", cloneAndAddLocationToObject(obj2, "Lund"), " Original: ", obj2);

// 7
console.log("Weekdays: ", getWeekdayNames());

// 8
console.log("Months: ", getMonthNames());

// 9
const testCreature = buildCreatureObject();
console.log("Creature: ", testCreature);

// 10 
console.log("Reverted object: ", invertObjectProperties(testCreature), " original: ", testCreature);
// console.log("Reverted object: ", invertObjectPropertiesAlt(testCreature), " original: ", testCreature);

// 11
displayObject(country, 'countrybox');
displayObject(niklasBur, 'personbox');


/************************************************************************************** */

// 2
function displayPersonName({ first, last }) {
    createHTMLElement("h2", `${first} ${last}`, document.body);
}

// 3
function calculatePriceSum({ originalPrice }, amount) {
    return originalPrice * amount;
}

// 4
function calculatePriceSumWithDiscount({ originalPrice, discount }, amount) {
    return (originalPrice * amount) * (1.0 - discount);
}

// 5
function getOldschoolMarriageName({ first }, { last }) {
    return `${first} ${last}`;
}

// 6
function cloneAndAddLocationToObject(myObject, newLocation) {
    return { ...myObject, location: newLocation };
}

// 7
function getWeekdayNames() {
    const arr1 = ['fre', 'lör', 'sön'];
    const arr2 = ['mån', 'tis'];
    const arr3 = ['ons', 'tors'];

    return [...arr2, ...arr3, ...arr1];
}

// 8
function getMonthNames() {
    const month1 = ['jan', 'feb'];
    const month2 = ['mar', 'apr', 'maj'];
    const month3 = ['sep', 'okt'];
    const year = ['jun', 'jul', 'aug', 'nov', 'dec'];

    year.splice(3, 0, ...month3);
    year.splice(0, 0, ...month1, ...month2);
    return year;
}

// 9
function buildCreatureObject() {
    const creature = {};
    const prop1 = 'animal';
    const prop2 = 'name';
    const prop3 = 'continent';

    creature[prop1] = 'Lion';
    creature[prop2] = 'Simba';
    creature[prop3] = 'Africa';
    return creature;
}


// 10
function invertObjectProperties(originalObject) {
    const myObject = { ...originalObject };

    for (const propertyName in originalObject) {
        const newKey = originalObject[propertyName];
        const newVal = propertyName;
        myObject[newKey] = newVal;
    }
    return myObject;
}


function invertObjectPropertiesAlt(originalObject) {
    const myObject = {};
    Object.keys(originalObject).forEach((propertyName) => {
        myObject[originalObject[propertyName]] = propertyName;
    });
    return myObject;
}


// 11
function displayObject(country, cssClass) {
    const objectWrapper = createHTMLElement("div", '', document.body, cssClass);
    for (const propertyName in country) {
        createHTMLElement("div", `<strong>${propertyName}</strong>: ${country[propertyName]}`, objectWrapper, '', null, true);
    }
}