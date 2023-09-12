import { cleanLocalStorage, createBusketItems, createSummaryBasketItem, onBurgerMenuOpen, onBusketClose, onBusketOpen, setCurrentProduct } from "./index.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", (e) => onBusketClose(e));

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	$(".btn-checkout").on("click", createSummaryBasketItem);

	$(".busket__remove").on("click", cleanLocalStorage);

	createBusketItems();
	$(".checkout__radio-label").first().focus();
	const checkbox = document.querySelector(".checkout__right");
	checkbox.addEventListener("click", function (e) {
		if (e.target.getAttribute("for") === "cash") {
			$(".checkout__payment-info").hide();
		} else if (e.target.getAttribute("for") === "eMoney") {
			$(".checkout__payment-info").show();
		}
	});
});
