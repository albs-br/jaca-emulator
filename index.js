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

let memoryTest = 
    '04 00 0F\n'   // LD A, 15
  + '05 80 30\n'   // LD L, 0x30
  + '07 00 01\n'   // LD E, 1
  + '08 B0 00\n'   // LD B, L
  + '80 60 00\n'   // ADD A, E
  + '14 00 0C\n'   // JP 12
$('#memory').text(memoryTest);

let emulator = new J.JacaEmulator();

function reset() {
  emulator.reset();

  updateScreen();
}

function updateScreen() {
  
  $('.cpuState span').removeClass('w3-yellow w3-red');
  if(emulator.cpuState == 3) {
    $('.cpuState span:nth-child(' + (emulator.cpuState + 1) + ')').addClass('w3-red');
  }
  else {
    $('.cpuState span:nth-child(' + (emulator.cpuState + 1) + ')').addClass('w3-yellow');
  }
  
  $('#pc').val(emulator.pc);
  $('#ir1').val(emulator.ir1);
  $('#ir2').val(emulator.ir2);
  $('#ir3').val(emulator.ir3);

  console.info(emulator.currentInstructionText());

  $('#currentInstruction').text(emulator.currentInstructionText());

  emulator.registers.forEach((element, index, array) => {
    //console.info('register ' + index + ': ' + emulator.registers[index]);
    $('#registers div:nth-child(' + (index + 2) + ') input').val(emulator.registers[index]);
  });
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
});
