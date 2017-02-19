// var items = [{
// 	product: "Ammonium Sulfate",
// 	form: "solid",
// 	hazardous: "Yes",
// 	location: "Laboratory",
// 	quantity: 0,
// 	url: "http://www.aluminumsulfate.net/wp-content/uploads/2015/09/Ammonium-Sulfate-768x576.jpg"
//   },
// 	{
// 	product: "Windex",
//   form: "liquid",
//   hazardous: "No",
//   location: "Closet",
//   quantity: "3",
//   url: "https://i0.wp.com/thecrazycouponchick.com/wp-content/uploads/2016/11/Windex.jpg?resize=800%2C445"
//  	},
//  	{
//  	product: "Bleach",
//  	form: "liquid",
//  	hazardous: "Yes",
//  	location: "Bathroom",
//  	quantity: "2",
//  	url: "https://cdn01-www-clorox-com.scdn3.secure.raxcdn.com/wp-content/uploads/2017/01/hero-Bleach-with-Pinesol-Lemon.png"
//  	}]
function getProducts() {
  var items = []
  axios.get('http://localhost:8080/items').then(function({ data, status }) {
    if ( status !== 200) {
    	return alert ('your server is probably not running')
    }
    showProducts(data)
  })
}

function showProducts(items) {
	console.log(items)
	items.forEach(function(element) {
	  $(".results").append('<li><div class="item-left"><p>' +
	    'Product: ' + element.product + '</p><span class="prod-loc">' +
	    'Location: ' + element.location + '</span><span class="qty">' +
	    'Quantity: ' + element.quantity + '</span></div>' +
	    '<div class="item-right"><img src="' + element.url +
	    '"></div></li>')
	});
}


function init() {
  $('form').on('submit', function(event) {
    event.preventDefault();
  })
  $('#add').on('click', function(event) {
    $('.main').addClass('hidden')
    $('.add-inventory').removeClass('hidden')
  })
  $('.add-inventory .back').on('click', function(event) {
    $('.add-inventory').addClass('hidden');
    $('.main').removeClass('hidden');
  })
  $('.item-info .back').on('click', function(event) {
    $('.item-info').addClass('hidden');
    $('.main').removeClass('hidden');
  })
  $('#add-location-input').on('click', function(event) {
    var locationInput = prompt("Please enter a location name")
    console.log(locationInput)
  })
  $('#add-image').on('click', function(event) {
    prompt("Please enter an image URL")
  })
}


$(document).ready(function() {
  init();
  getProducts();
});