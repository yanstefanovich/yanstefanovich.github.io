var cyc = document.getElementsByClassName('hero-cycle__block');

var temp = Array.from(cyc);

console.log(temp);

// while (true) {
//   for (var i = 0; i < temp.length; i++) {
//     temp[i].classList.add('hero-cycle__block--display');
//     setTimeout(function() {
//       temp[i].classList.remove('hero-cycle__block--display');
//     },3500);
//   }
// }
// setInterval(() => {
//   if (i > 2) {
//     i = 0;
//     cyc[2].classList.remove('hero-cycle__block--display');
//     cyc[i].classList.add('hero-cycle__block--display');
//   } else {
//     cyc[i-1].classList.remove('hero-cycle__block--display');
//     cyc[i].classList.add('hero-cycle__block--display');
//   }
// }, 3500);

// class CycleElements {
//   constructor() {
//     this.elements = document.getElementsByClassName('hero-cycle__block');
//     this.cycle();
//   }
//
//   cycle(){
//     var temp = this.elements;
//     while(true){
//       for (let i = 0; i < temp.length; i++) {
//         temp[i].classList.add('hero-cycle__block--display');
//         setTimeout(function() {
//           temp[i].classList.remove('hero-cycle__block--display');
//         },3500);
//       }
//     }
//   }
// }
//
// var test = new CycleElements();
