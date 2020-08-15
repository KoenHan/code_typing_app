var str = 'abcdef/ghij';

console.log(str.lastIndexOf('/'));
str = str.slice(0, str.lastIndexOf('/') - str.length);
console.log(str);