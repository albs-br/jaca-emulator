export class JacaEmulator {
    constructor () {
      // 0 - Fetch-1
      // 1 - Fetch-2
      // 2 - Fetch-3
      // 3 - Execute
      this.cpuState = 0;

      this.pc = 0;
      this.ir1 = 0;
      this.ir2 = 0;
      this.ir3 = 0;

      this.registers = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    }
    
    execute () {
      let instruction = hex2bin(this.ir1) + hex2bin(this.ir2) + hex2bin(this.ir3);
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
          this.registers[r1addr] = dataValue;
          break;
        case 2:
          this.registers[r1addr] = this.registers[r2addr];
          break;
      }
    }

    reset () {
      // console.info('reset()');

      this.cpuState = 0;

      this.pc = 0;
      this.ir1 = 0;
      this.ir2 = 0;
      this.ir3 = 0;

      // this.registers.forEach(function (element, index, array) {
      //   this.registers[index] = 0; // Not working. Don't know why
      // });

      for(let i=0; i<registers.length; i++) {
        this.registers[i] = 0
      }
    }
}

function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
