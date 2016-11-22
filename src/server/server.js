const teste = 'testando';
console.log(`imprimindo ${teste}`);

const obj = { hey: 1, ola: 2 };
const obj2 = { ...obj, teste: 3 };

console.log(obj2);

class AppComponent {
	static PropTypes = {
		teste: 'ola'
	};
}

// console.log(<AppComponent />);

// for (let [a] of [1, 2, 3]) {
// 	console.log(a);
// }
