let array = ['a', 'b', 'c', 'd', 'e'];

// Insert element 99 between index 2 and 3
let insertIndex = 5; // The position where you want to insert
array.splice(insertIndex, 0, '99');

console.log(array);
// Output: [1, 2, 3, 99, 4, 5]