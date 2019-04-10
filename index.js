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

let memoryTest = '04 00 01\n04 00 FF'
$('#memory').text(memoryTest);

// 0 - Fetch-1
// 1 - Fetch-2
// 2 - Fetch-3
// 3 - Execute
let cpuState = 0; 
let pc = 0;
let ir1 = 0;
let ir2 = 0;
let ir3 = 0;

function Reset() {
  cpuState = 0;
  pc = 0;
  ir1 = 0;
  ir2 = 0;
  ir3 = 0;
}

function UpdateScreen() {
  
  $('.cpuState span').removeClass('w3-yellow');
  $('.cpuState span:nth-child(' + (cpuState + 1) + ')').addClass('w3-yellow');
  
  $('#pc').val(pc);
  $('#ir1').val(ir1);
  $('#ir2').val(ir2);
  $('#ir3').val(ir3);
}

$(function () {
  Reset();
  UpdateScreen();

  $('#step').click(function () {
    let memory = $('#memory').text();
    let arrMem = memory.replace(/\n/g, ' ').split(' ');

    //console.info(arrMem[0]);

    if(pc >= arrMem.length) {
      console.info('No memory for read at position ' + pc);
      return;
    }

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
        //ir1 = byteFromMemory;
        break;
    }

    if(cpuState != 3) pc++;

    cpuState++;
    if(cpuState == 4) cpuState = 0;


    UpdateScreen();
  });
});
