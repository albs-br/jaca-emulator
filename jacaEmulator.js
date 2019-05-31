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

    this.updateALU();
  }

  decodeIR () {
    let instruction = hex2bin(this.ir1) + hex2bin(this.ir2) + hex2bin(this.ir3);
    //console.info('instruction: ' + instruction);

    return {
      opcode: parseInt(instruction.substring(0, 6), 2),     // bits 0 to 5 (6 most significant bits)
      r1addr: parseInt(instruction.substring(6, 9), 2),     // bits 6 to 8 (3 bits)
      r2addr: parseInt(instruction.substring(9, 12), 2),    // bits 9 to 11 (3 bits)
      dataValue: parseInt(instruction.substring(16, 24), 2),// bits 16 to 23 (8 bits)
      address: parseInt(instruction.substring(9, 24), 2)    // bits 9 to 23 (15 bits)
    };
  }

  execute () {
    let currentInstruction = this.decodeIR();

    console.info('execute opcode: ' + currentInstruction.opcode);

    switch(currentInstruction.opcode) {

      case 0: // NO OP
        break;

      case 1: // LD R1, data
        this.registers[currentInstruction.r1addr] = currentInstruction.dataValue;
        break;

      case 2: // LD R1, R2
        this.registers[currentInstruction.r1addr] = this.registers[currentInstruction.r2addr];
        break;

      // ....

      case 5: // JP [addr]
        this.pc = currentInstruction.address;
        break;

      case 6: // JP Z, [addr]
        if(this.Z_flag) {
          this.pc = currentInstruction.address;
        }
        break;

      case 7: // CALL [addr]
        this.ret = this.pc;
        this.pc = currentInstruction.address;
        break;

      case 8: // CALL Z, [addr]
        if(this.Z_flag) {
          this.ret = this.pc;
          this.pc = currentInstruction.address;
        }
        break;

      case 9: // RET
        this.pc = this.ret;
        break;

      // ....

      case 32: // ADD R1, R2
        let output = this.registers[currentInstruction.r1addr] + this.registers[currentInstruction.r2addr];
        this.registers[currentInstruction.r1addr] = this.setAluOutput(output);
        break;

      // ....

      case 40: // INC R1
        let output = this.registers[currentInstruction.r1addr] + 1;
        this.registers[currentInstruction.r1addr] = this.setAluOutput(output);
        break;

      default:
        alert('Opcode ' + currentInstruction.opcode + ' not implemented');
    }
  }

  setAluOutput(output) {

    if(output > 255) {
      this.C_flag = true;
      output = output % 256;
    }
    else {
      this.C_flag = false;
    }

    this.Z_flag = (output == 0);

    return output;
  }

  updateALU () {

    if(this.cpuState != 3) {
      this.aluA = 0;
      this.aluB = 0;
      this.aluOut = 0;
      return;
    }

    let currentInstruction = this.decodeIR();

    if(currentInstruction.opcode >= 32) { // check if is ALU operation
      this.aluA = this.registers[currentInstruction.r1addr];
      
      let opcodeInfo = this.getOpcodeInfo(currentInstruction.opcode);

      // check if ALU operation uses 1 or 2 registers as input
      if(opcodeInfo.instructionFormatIndex == 4) {
        this.aluB = 0;
      }
      else {      
        this.aluB = this.registers[currentInstruction.r2addr];
      }

      this.aluOut = 'test';
    }
  }  

  currentInstructionText () {

    if(this.cpuState != 3) return '';

    let currentInstruction = this.decodeIR();

    let opcodeInfo = this.getOpcodeInfo(currentInstruction.opcode);
    let opcodeTxt = opcodeInfo.opcodeTxt;
    let instructionFormatIndex = opcodeInfo.instructionFormatIndex;

    let r1Txt = this.registerNames[currentInstruction.r1addr];
    let r2Txt = this.registerNames[currentInstruction.r2addr];
    let dataValue = currentInstruction.dataValue;
    let address = currentInstruction.address;

    let instructionText = 
      this.instructionFormats[instructionFormatIndex]
        .replace('[opcode]', opcodeTxt)
        .replace('[r1]', r1Txt)
        .replace('[r2]', r2Txt)
        .replace('[data]', dataValue)
        .replace('[address]', address);

    return instructionText;
  }

  getOpcodeInfo(opcode) {
    let opcodeTxt = '';
    let instructionFormatIndex = 0;
    
    console.info('getOpcodeInfo opcode: ' + opcode);

    switch(opcode) {

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

      //...

      case 5: // JP [addr]
        opcodeTxt = 'JP';
        instructionFormatIndex = 3;
        break;

      case 6: // JP Z, [addr]
        opcodeTxt = 'JP Z,';
        instructionFormatIndex = 3;
        break;

      case 7: // CALL [addr]
        opcodeTxt = 'CALL';
        instructionFormatIndex = 3;
        break;

      case 8: // CALL Z, [addr]
        opcodeTxt = 'CALL Z,';
        instructionFormatIndex = 3;
        break;

      case 9: // RET
        opcodeTxt = 'RET';
        instructionFormatIndex = 0;
        break;

      //...

      case 32: // ADD R1, R2
        opcodeTxt = 'ADD';
        instructionFormatIndex = 2;
        break;

      //...

      case 40: // INC R1
        opcodeTxt = 'INC';
        instructionFormatIndex = 4;
        break;

      default:
        alert('Opcode ' + currentInstruction.opcode + ' not implemented');
    }

    return {
      opcodeTxt: opcodeTxt,
      instructionFormatIndex: instructionFormatIndex
    };
  }

  reset () {
    this.cpuState = 0;

    this.pc = 0;
    this.ret = 0;
    this.ir1 = 0;
    this.ir2 = 0;
    this.ir3 = 0;
    this.Z_flag = false;
    this.C_flag = false;
    this.aluA = 0;
    this.aluB = 0;
    this.aluOut = 0;

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
      '[opcode] [address]',
      '[opcode] [r1]',
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
