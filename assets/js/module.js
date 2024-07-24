'use strict';

export const numberToKilo = function (number) {
    if (number < 1000) {
        return String(number);
    } else if (number >= 1000 && number < 1000000) {
        return `${(number / 1000).toFixed(1)}k`.replace('.0', '');
    } else {
        return `${(number / 1000000).toFixed(1)}M`.replace('.0', '');
    }
}



// export const numberToKilo = function (number) {
//     const numString = String(number);

//     if(numString.length <= 3) {
//         return numString;
//     } else if (numString.length >= 4 && numString.length <=5) {
//         return `${numString.slice(0, -3)}.${numString.slice(-3,-2)}k`;
//     }else if(numString.length === 6) {
//         return `${numString.slice(0, -3)}k`;
//     } else {
//         return `${numString.slice(0, -6)}M`;
//     }
// }