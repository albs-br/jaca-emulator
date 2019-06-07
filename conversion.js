// function hex2bin(hex){
//   return (parseInt(hex, 16).toString(2)).padStart(8, '0');
// }

// function dec2bin(dec){
//   return (parseInt(dec, 10).toString(2)).padStart(8, '0');
// }

export class Conversion {
  
  hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
  }

  hex2dec(hex){
    return parseInt(hex, 16).toString(10);
  }  

  dec2bin(dec){
    return (parseInt(dec, 10).toString(2)).padStart(8, '0');
  }
}
