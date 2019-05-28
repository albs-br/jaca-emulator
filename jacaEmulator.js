export class JacaEmulator {
  constructor () {
    // 0 - Fetch-1
    // 1 - Fetch-2
    // 2 - Fetch-3
    // 3 - Execute
    // this.cpuState = 0;

    // this.pc = 0;
    // this.ir1 = 0;
    // this.ir2 = 0;
    // this.ir3 = 0;

    // this.registers = new Array(0, 0, 0, 0, 0, 0, 0, 0);

    // this.arrMem = new Array();
    this.reset();
  }
  
  step () {
    //console.info(arrMem.length);
    //console.info('|' + arrMem[0] + '|');

    let byteFromMemory = this.arrMem[this.pc];

    switch(this.cpuState) {
      case 0:
        this.ir1 = byteFromMemory;
        break;
      case 1:
        this.ir2 = byteFromMemory;
        break;
      case 2:
        this.ir3 = byteFromMemory;
        break;
      case 3:
        // Execute
        this.execute();

        break;
    }

    // When string is empty, the .split method returns an 
    // array with one empty string, instead of an empty array
    if(this.pc >= this.arrMem.length || this.arrMem.length == 1) {
      //console.info('No memory for read at position ' + pc);
      //return;
      this.pc = 0;
    }
    else {
      if(this.cpuState != 3) this.pc++;
    }

    this.cpuState++;
    if(this.cpuState == 4) this.cpuState = 0;      
  }

  execute () {
    let instruction = hex2bin(this.ir1) + hex2bin(this.ir2) + hex2bin(this.ir3);
    //console.info('instruction: ' + instruction);

    let opcode = parseInt(instruction.substring(0, 6), 2);
    let r1addr = parseInt(instruction.substring(6, 9), 2);
    let r2addr = parseInt(instruction.substring(9, 12), 2);
    let dataValue = parseInt(instruction.substring(16, 24), 2);
    // console.info('opcode: ' + opcode);
    // console.info('r1addr: ' + r1addr);
    // console.info('r2addr: ' + r2addr);
    // console.info('dataValue: ' + dataValue);
    let instructionFormatIndex;
    let opcodeTxt = '';
    let r1Txt = this.registerNames[r1addr];
    let r2Txt = this.registerNames[r2addr];

    switch(opcode) {

      case 0: // NO OP
        opcodeTxt = 'NO OP';
        instructionFormatIndex = 0;
        break;

      case 1: // LD R1, data
        opcodeTxt = 'LD';
        instructionFormatIndex = 1;
        this.registers[r1addr] = dataValue;
        break;

      case 2: // LD R1, R2
        opcodeTxt = 'LD';
        instructionFormatIndex = 2;
        this.registers[r1addr] = this.registers[r2addr];
        break;

      case 32: // ADD R1, R2
        opcodeTxt = 'ADD';
        instructionFormatIndex = 2;
        let output = this.registers[r1addr] + this.registers[r2addr];
        //output = parseInt(output, 2).toString().slice(-5);
        this.registers[r1addr] = (output <= 255) ? output : (output % 256);
        break;
    }

    // console.info(r1addr);
    // console.info(r2addr);

    let instructionTxt = 
      this.instructionFormats[instructionFormatIndex]
        .replace('[opcode]', opcodeTxt)
        .replace('[r1]', r1Txt)
        .replace('[r2]', r2Txt)
        .replace('[data]', dataValue);

    this.currentInstruction = instructionTxt;

    // console.info('Current instruction: ' + instructionTxt);
  }

  reset () {
    //console.info('reset()');

    this.cpuState = 0;

    this.pc = 0;
    this.ir1 = 0;
    this.ir2 = 0;
    this.ir3 = 0;

    // this.registers.forEach(function (element, index, array) {
    //   this.registers[index] = 0; // Not working. Don't know why
    // });

    // for(let i=0; i<this.registers.length; i++) {
    //   this.registers[i] = 0
    // }

    this.instructionFormats = new Array(
      '[opcode]',
      '[opcode] [r1], [data]',
      '[opcode] [r1], [r2]',
      // more
    );
    
    this.registerNames = new Array('A', 'B', 'H', 'L', 'C', 'D', 'E', 'F');
    this.registers = new Array(0, 0, 0, 0, 0, 0, 0, 0);

    this.currentInstruction = '';

    this.arrMem = new Array();
  }
}

function hex2bin(hex){
  return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
