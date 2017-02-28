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
	var itemsHTML = [];
	var url = 'http://placehold.it/100x100'
	items.forEach(function(element) {
	  itemsHTML.push('<li><div class="item-left" data-product-id="' + element.id + '"><p><span class = "prod-name">' +
	    'Product: ' + element.product + '</p></span><span class="prod-loc">' +
	    'Location: ' + element.location + '</span><span class="qty">' +
	    'Quantity: ' + element.quantity + '</span></div>' +
	    '<div class="item-right"><img src="' + url +
	    '"></div></li>')
	});
	$('.results').html(itemsHTML)
}

function addProduct() {
	var newProd = {
		product: $('#add-name').val(),
		form: $('#add-form').val(),
		hazardous: $('#add-hazardous').val(),
		location: $('#add-location').val() ,
		quantity: $('#add-qty').val()
	}; 
	
	axios.post('http://localhost:8080/items', newProd)
		.then(function(res) {
			$('#add-name').val('')
			$('#add-form').val(null)
			$('#add-hazardous').val(null)
			$('#add-location').val(null)
			$('#add-qty').val(0)
			$('.add-inventory').addClass('hidden');
		  $('.main').removeClass('hidden');
		  getProducts();
		})
		.catch(function(err){
			console.error(err)
		})

}

function editProduct(id) {
	var editProd = {
		product: $('#edit-product').val(),
		form: $('#edit-form').val(),
		hazardous: $('#edit-hazardous').val(),
		location: $('#edit-location').val(),
		quantity: $('#edit-quantity').val()
	}
	axios.put('http://localhost:8080/items/' + id, editProd)
		.then(function(res) {
			getProducts();
			$('.item-info').addClass('hidden')
			$('.main').removeClass('hidden')
		})
		.catch(function(err){
			console.error(err)
		})
}


function init() {
  $('.add-inventory-form').on('submit', function(event) {
    event.preventDefault();
    addProduct();
  })
   $('.search-form').on('submit', function(event) {
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
  $('.results').on('click', '.item-left', function(event) {
		axios.get('http://localhost:8080/items/'+ $(this).data('product-id'))
			.then(function({ data }) {		
		    $('#edit-product').val(data.product)
		    $('#edit-quantity').val(data.quantity)
		    $('#edit-form').val(data.form)
		    $('#edit-hazardous').val(data.hazardous)
		    $('#edit-location').val(data.location)
		    $('.edit-item-form').data('product-id', data.id)
		    $('.main').addClass('hidden')
		    $('.item-info').removeClass('hidden')
			})
	})
	$('.edit-item-form').on('submit', function(event) {
  	event.preventDefault();
  	editProduct($(this).data('product-id'));
  }) 
}


$(document).ready(function() {
  init();
  getProducts();
});