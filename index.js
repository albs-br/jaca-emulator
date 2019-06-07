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
  },
  {
    name: 'Test OUT/SHL instr',
    data: 
          '04 00 01\n'  // LD A, 1
        + '44 02 00\n'  // OUT 1, A
        + 'B0 00 00\n'  // SHL A
        + '18 00 00\n'  // JP Z, 0
        + '14 00 03\n'  // JP 3
  },
  {
    name: 'Test all instr',
    data:
          '04 00 43\n'	// LD A, 0x43		// 67 in decimal
        + '07 00 C7\n'	// LD E, 0xc7		// 199 in decimal
        + 'A0 00 00\n'	// INC A		
        + 'A4 00 00\n'	// DEC A		
        + '80 60 00\n'	// ADD A, E			// A should be 266 - 256 = 10 (0xA)
        + '08 E0 00\n'	// LD B, E			// Reverse A and E registers, A will be  = 199 and E = 10
        + '0B 00 00\n'	// LD E, A			
        + '08 10 00\n'	// LD A, B			
        + '84 60 00\n'	// SUB A, E			// A = 189
        + '88 00 00\n'	// NOT A			  // A = 66
        + '8C 60 00\n'	// AND A, E			// A = 2
        + '90 60 00\n'	// OR A, E			// A = 10
        + '94 60 00\n'	// XOR A, E			// A = 0
        + '98 60 00\n'	// NOR A, E			// A = 245
        + '9C 60 00\n'	// XNOR A, E		// A = 0
        + 'A4 00 00\n'	// DEC A			  // A = 255
        + '28 00 60\n'	// ST [0x60], A		
        + '0C 80 60\n'	// LD B, [0x60]	// B = 255
        + '05 00 00\n'	// LD H, 0x0		// H = 0x0
        + '05 80 60\n'	// LD L, 0x60		// L = 0x60
        + '13 80 00\n'	// LD F, [HL]		// F = 255
        + '2D 80 00\n'	// ST [HL], L		
        + '12 00 00\n'	// LD C, [HL]		// C = 0x60
        + '12 80 00\n'	// LD D, [HL]		// D = 0x60
                        // Lacks testing the JP, JP Z and OUT instructions
  },
  {
    name: 'Test CALL C instr',
    data:
          'A0 00 00\n'	// INC A		
        + '34 00 09\n'	// CALL C, 9
        + '14 00 00\n'	// JP 0
        + 'A0 80 00\n'	// INC B
        + '80 60 00\n'	// RET
  },
  {
    name: 'Test LD R1, [addr] instr',
    data:
          '0C 00 00\n'	// LD A, 0
        + '0C 80 0A\n'	// LD B, 10
        + '0C 00 ff\n'	// LD A, 255
        + '0C 7f ff\n'	// LD A, 32767
        + '0C ff ff\n'	// LD B, 32767
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
  
  let data = memory
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .split(' ');

  emulator.loadMemory(data);

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