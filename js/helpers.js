//creates an array with no repeating 3 numbers
export function getRandomNum(goods) {
	let randNumbArr = [];
	while (randNumbArr.length < 3) {
		let randNumb = Math.floor(Math.random() * goods.length);
		let found = false;
		for (let i = 0; i < randNumbArr.length; i++) {
			if (randNumbArr[i] === randNumb) {
				found = true;
				break;
			}
		}
		if (!found) {
			randNumbArr[randNumbArr.length] = randNumb;
		}
	}
	return randNumbArr;
}

//find total items number in basket
export function findTotalQuantity() {
	let total = 0;
	let inputs = $(".basket__quantity");
	inputs.each(function () {
		total += parseFloat($(this).val());
	});
	return total;
}

//forward back in browser history
export function onBackButtonClick() {
	window.history.back();
}

//find total items number from localStorage
export function countTotalQuantityFromLocalStorage() {
	let total = 0;
	for (let j = 0; j < localStorage.length; j++) {
		let basketKey = localStorage.key(j);
		let basketValue = localStorage.getItem(localStorage.key(j));
		if (basketKey.startsWith("basket")) {
			total += parseFloat(basketValue);
		}
	}

	return total;
}
