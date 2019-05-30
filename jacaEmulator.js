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

  decodeIR () {
    let instruction = hex2bin(this.ir1) + hex2bin(this.ir2) + hex2bin(this.ir3);
    //console.info('instruction: ' + instruction);

    return {
      opcode: parseInt(instruction.substring(0, 6), 2),
      r1addr: parseInt(instruction.substring(6, 9), 2),
      r2addr: parseInt(instruction.substring(9, 12), 2),
      dataValue: parseInt(instruction.substring(16, 24), 2)
    };
  }

  execute () {
    let currentInstruction = this.decodeIR();

    switch(currentInstruction.opcode) {

      case 0: // NO OP
        break;

      case 1: // LD R1, data
        this.registers[currentInstruction.r1addr] = currentInstruction.dataValue;
        break;

      case 2: // LD R1, R2
        this.registers[currentInstruction.r1addr] = this.registers[currentInstruction.r2addr];
        break;

      case 32: // ADD R1, R2
        let output = this.registers[currentInstruction.r1addr] + this.registers[currentInstruction.r2addr];
        this.registers[currentInstruction.r1addr] = (output <= 255) ? output : (output % 256);
        break;
    }
  }

  currentInstructionText () {

    if(this.cpuState != 3) return '';

    let currentInstruction = this.decodeIR();

    let instructionFormatIndex;
    let opcodeTxt = '';
    let r1Txt = this.registerNames[currentInstruction.r1addr];
    let r2Txt = this.registerNames[currentInstruction.r2addr];
    let dataValue = currentInstruction.dataValue;

    switch(currentInstruction.opcode) {

      case 0: // NO OP
        opcodeTxt = 'NO OP';
        instructionFormatIndex = 0;
        break;

      case 1: // LD R1, data
        opcodeTxt = 'LD';
        instructionFormatIndex = 1;
        break;

      case 2: // LD R1, R2
        opcodeTxt = 'LD';
        instructionFormatIndex = 2;
        break;

      case 32: // ADD R1, R2
        opcodeTxt = 'ADD';
        instructionFormatIndex = 2;
        break;
    }

    let instructionText = 
      this.instructionFormats[instructionFormatIndex]
        .replace('[opcode]', opcodeTxt)
        .replace('[r1]', r1Txt)
        .replace('[r2]', r2Txt)
        .replace('[data]', dataValue);

    return instructionText;
  }

  reset () {
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

    // this.instructions = new Array(
    //   { instructionFormat: 0, opcodeTxt: 'NO OP' },
    //   { instructionFormat: 1, opcodeTxt: 'LD' },
    //   { instructionFormat: 2, opcodeTxt: 'LD' },
    //   //{ instructionFormat: 0, opcodeTxt: 'NO OP' },
    // );
    
    this.registerNames = new Array('A', 'B', 'H', 'L', 'C', 'D', 'E', 'F');
    this.registers = new Array(0, 0, 0, 0, 0, 0, 0, 0);

    this.arrMem = new Array();
  }
}

function hex2bin(hex){
  return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
