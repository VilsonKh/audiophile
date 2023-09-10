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

export function findTotalQuantity() {
	let total = 0;
	let inputs = $(".busket__quantity");
	inputs.each(function () {
		total += parseFloat($(this).val());
	});
	return total;
}

export function onBackButtonClick() {
	window.history.back();
}

export function countTotalQuantityFromLocalStorage() {
	let total = 0;
	for (let j = 0; j < localStorage.length; j++) {
		let busketKey = localStorage.key(j);
		let busketValue = localStorage.getItem(localStorage.key(j));
		if (busketKey.startsWith("busket")) {
			total += parseFloat(busketValue);
		}
	}

	return total;
}
