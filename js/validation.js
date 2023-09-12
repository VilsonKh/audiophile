$(function () {
	$.validator.addMethod(
		"numberValidator",
		function (value) {
			return /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value);
		},
		"Wrong format"
	);

	$.validator.addMethod(
		"pinValidator",
		function (value) {
			return parseInt(value.length) === 4;
		},
		"PIN must be 4 characters"
	);

	$.validator.addMethod(
		"zipValidator",
		function (value) {
			return /^\d{5}(?:[-\s]\d{4})?$/.test(value);
		},
		"Wrong format"
	);

	$.validator.addMethod(
		"moneyValidator",
		function (value) {
			return parseInt(value.length) === 9;
		},
		"e-Number must be 9 characters"
	);

	$(".checkout__form").validate({
		rules: {
			name: {
				required: true,
			},

			email: {
				required: true,
			},

			number: {
				required: true,
				numberValidator: true,
			},

			address: {
				required: true,
			},

			zip: {
				required: true,
				number: true,
				zipValidator: true,
			},

			city: {
				required: true,
			},

			country: {
				required: true,
			},

			moneyNumber: {
				required: true,
				digits: true,
				moneyValidator: true,
			},

			pin: {
				required: true,
				digits: true,
				pinValidator: true,
			},
		},

		messages: {},
	});
});
