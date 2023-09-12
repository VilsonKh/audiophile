import {
	cleanLocalStorage,
	confirmtionPopupClose,
	createBusketItems,
	createSummaryBasketItem,
	onBurgerMenuOpen,
	onBusketClose,
	onBusketOpen,
	onConfirmClick,
	setCurrentProduct,
	toggleInputs,
} from "./index.js";

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

	$("#confirm").on("click", onConfirmClick);

	$(".popup-confirmation").on("click", (e) => confirmtionPopupClose(e));

	$(".checkout__radio-label").first().trigger("click");

	$(".checkout__right").on("click", (e) => toggleInputs(e));
});
