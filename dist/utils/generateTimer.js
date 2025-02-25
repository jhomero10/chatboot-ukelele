"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimer = generateTimer;
function generateTimer(min, max) {
    const numSal = Math.random();
    const numeroAleatorio = Math.floor(numSal * (max - min + 1)) + min;
    return numeroAleatorio;
}
