"use strict";

// import './manifest.json';

// Import stylesheets
import './style.css';
//import 'w3css';

import $ from 'jquery';

//import './jquery.js';

// Write Javascript code!
// const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>JS Starter</h1>`;


import * as pJson from "./package.json";

import * as J from './jacaEmulator.js';

$('#version').text('v.' + pJson.version);
$('title').text('JACA-2 Emulator v.' + pJson.version);

let testProgramsArray = [
  {
    name: 'Test program 1',
    data: 
          '04 00 0F\n'   // LD A, 15
        + '05 80 30\n'   // LD L, 0x30
        + '07 00 01\n'   // LD E, 1
        + '08 B0 00\n'   // LD B, L
        + '80 60 00\n'   // ADD A, E
        + '18 00 00\n'   // JP Z, 0
        + '14 00 0C\n'   // JP 12
  },
  {
    name: 'Test program 2',
    data: 
          '04 00 05\n'  // LD A, 5
        + '1C 00 09\n'  // CALL 9
        + 'A0 00 00\n'  // INC A
          
        + 'A0 00 00\n'  // INC A
        + '24 00 00\n'  // RET
  }  
];

function loadTestProgram(name) {
  let program = testProgramsArray.find(p => p.name === name);

  if(program == undefined) return '';

  return program.data;
}

$('#memory').text(testProgramsArray[0].data);

let emulator = new J.JacaEmulator();

function reset() {
  emulator.reset();

  updateScreen();
}

function updateScreen() {
  
  // update CPU state
  $('.cpuState span').removeClass('w3-yellow w3-red');
  if(emulator.cpuState == 3) {
    $('.cpuState .cpuStateInner:nth-child(' + (emulator.cpuState + 1) + ')').addClass('w3-red');
  }
  else {
    $('.cpuState .cpuStateInner:nth-child(' + (emulator.cpuState + 1) + ')').addClass('w3-yellow');
  }
  
  $('#pc').val(emulator.pc);
  $('#ret').val(emulator.ret);
  $('#ir1').val(emulator.ir1);
  $('#ir2').val(emulator.ir2);
  $('#ir3').val(emulator.ir3);

  $('#aluA').val(emulator.aluA);
  $('#aluB').val(emulator.aluB);
  $('#aluOut').val(emulator.aluOut);

  // update ALU flags
  $('#Z_flag, #C_flag').removeClass('w3-red');
  if(emulator.Z_flag) {
    $('#Z_flag').addClass('w3-red');
  }
  if(emulator.C_flag) {
    $('#C_flag').addClass('w3-red');
  }

  // console.info(emulator.currentInstructionText());

  $('#currentInstruction').text(emulator.currentInstructionText());

  emulator.registers.forEach((element, index, array) => {
    //console.info('register ' + index + ': ' + emulator.registers[index]);
    $('#registers div:nth-child(' + (index + 2) + ') input').val(emulator.registers[index]);
  });

  // emulator.outputReg = 2; //[debug]
  $('#outputReg').val(emulator.outputReg);
  $('#outputLeds').empty();
  let outputRegBin = dec2bin(emulator.outputReg);
  //console.info(outputRegBin);
  for(let i=0; i<8; i++) {
    let bit = outputRegBin.toString().charAt(i);
    let classAttr = '';
    if(bit == "0") {
      classAttr = 'led';
    }
    else {
      classAttr = 'led hi';
    }
    $('<div class="' + classAttr +  '"></div>').appendTo("#outputLeds");
  }

}

function step() {

  let startTime = new Date();

  let memory = $('#memory').val().trim();
  
  emulator.arrMem = memory.replace(/\n/g, ' ').split(' ');

  emulator.step();

  updateScreen();

  let endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  //$('#timeElapsed').val(timeDiff);
}

// Jquery.ready:
$(() => {
  reset();

  let timer;
  let isRunning = false;

  $('#play').click(() => {

    if(isRunning) return;

    // $(this).removeClass('w3-green'); // $(this) is not working inside () =>
    
    $('#play').removeClass('w3-green');
    $('#play').addClass('w3-red');

    isRunning = true;
    timer = window.setInterval(step, 5);
    // do {
    //   step();
    // }
    // while (isRunning);
  });

  $('#pause').click(() => {
    $('#play').removeClass('w3-red');
    $('#play').addClass('w3-green');

    isRunning = false;
    window.clearInterval(timer);
  });

  $('#step').click(() => {
    step();
  });

  $('#reset').click(() => {
    reset();
  });

  $('#clearMemory').click(() => {
    $('#memory').val('');
  });


  $('#loadMemory').click(() => {
    $('#loadMemoryMenu').toggleClass('w3-show');
  });

  testProgramsArray.forEach((item) => {
    $('<a href="#" class="w3-bar-item w3-button">' + item.name + '</a>').appendTo("#loadMemoryMenu");
  });

  $('#loadMemoryMenu a').click((event) => {
    let element = $(event.target);
    let programData = loadTestProgram(element.text());

    $('#memory').text(programData);

    $('#loadMemoryMenu').removeClass('w3-show');

    event.preventDefault();
  });

});


//TODO: make it work on conversion.js file
function dec2bin(dec){
  return (parseInt(dec, 10).toString(2)).padStart(8, '0');
}