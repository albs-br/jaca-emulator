// Import stylesheets
import './style.css';
//import 'w3css';

import $ from 'jquery';

//import './jquery.js';

// Write Javascript code!
const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>JS Starter</h1>`;


import * as pJson from "./package.json";

$('#version').text('v.' + pJson.version);
$('title').text('JACA-2 Emulator v.' + pJson.version);

let memoryTest = 
  '04 00 0F\n' +  // LD A, 15
  '05 80 30\n' +  // LD L, 0x30
  '07 00 FF\n' +  // LD E, 255
  '08 B0 00'      // LD B, L
$('#memory').text(memoryTest);

// 0 - Fetch-1
// 1 - Fetch-2
// 2 - Fetch-3
// 3 - Execute
let cpuState; 
let pc;
let ir1;
let ir2;
let ir3;
let registers = new Array(0, 0, 0, 0, 0, 0, 0, 0);

function Reset() {
  cpuState = 0;
  pc = 0;
  ir1 = 0;
  ir2 = 0;
  ir3 = 0;
  registers.forEach(function (element, index, array) {
    registers[index] = 0;
  });

  UpdateScreen();
}

function UpdateScreen() {
  
  $('.cpuState span').removeClass('w3-yellow');
  $('.cpuState span:nth-child(' + (cpuState + 1) + ')').addClass('w3-yellow');
  
  $('#pc').val(pc);
  $('#ir1').val(ir1);
  $('#ir2').val(ir2);
  $('#ir3').val(ir3);

  
  registers.forEach(function (element, index, array) {
    console.info('register ' + index + ': ' + registers[index]);
    $('#registers div:nth-child(' + (index + 2) + ') input').val(registers[index]);
  });
}

function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

$(function () {
  Reset();

  $('#step').click(function () {
    let memory = $('#memory').val().trim();
    let arrMem = memory.replace(/\n/g, ' ').split(' ');

    //console.info(arrMem.length);
    //console.info('|' + arrMem[0] + '|');

    let byteFromMemory = arrMem[pc];

    switch(cpuState) {
      case 0:
        ir1 = byteFromMemory;
        break;
      case 1:
        ir2 = byteFromMemory;
        break;
      case 2:
        ir3 = byteFromMemory;
        break;
      case 3:
        // Execute
        let instruction = hex2bin(ir1) + hex2bin(ir2) + hex2bin(ir3);
        console.info('instruction: ' + instruction);

        let opcode = parseInt(instruction.substring(0, 6), 2);
        let r1addr = parseInt(instruction.substring(6, 9), 2);
        let r2addr = parseInt(instruction.substring(9, 12), 2);
        let dataValue = parseInt(instruction.substring(16, 24), 2);
        console.info('opcode: ' + opcode);
        console.info('r1addr: ' + r1addr);
        console.info('r2addr: ' + r2addr);
        console.info('dataValue: ' + dataValue);

        switch(opcode) {
          case 0:
            break;
          case 1:
            registers[r1addr] = dataValue;
            break;
          case 2:
            registers[r1addr] = registers[r2addr];
            break;
        }

        // registers.forEach(function (element, index, array) {
        //   console.info('register ' + index + ': ' + registers[index]);
        // });

        break;
    }

    UpdateScreen();

    // When string is empty, the .split method returns an 
    // array with one empty string, instead of an empty array
    if(pc >= arrMem.length || arrMem.length == 1) {
      console.info('No memory for read at position ' + pc);
      return;
    }

    if(cpuState != 3) pc++;

    cpuState++;
    if(cpuState == 4) cpuState = 0;

  });

  $('#reset').click(function () {
    Reset();
  });

  $('#clearMemory').click(function () {
    $('#memory').val('');
  });
});
