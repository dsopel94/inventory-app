# Inventory Management System
An MVP application for basic inventory management system for small to medium inventory centric businessses.
### API
-- `GET`
`/inventory`
```
{
	"product": "product 1",
	"form": "form 1",
	"hazardous": true,
	"location": abc123,
	"quantity": 1
}
```
-- `GET by ID`
`/inventory/:id`
```
{
    "_id": "Object ID"
	"product": "product 1",
	"form": "form 1",
	"hazardous": true,
	"location": abc123,
	"quantity": 1
}
```

-- `POST`
`/inventory/`
```
{
	"product": "product 1",
	"form": "form 1",
	"hazardous": true,
	"location": abc123,
	"quantity": 1
}
```
-- `PUT`
`/inventory/:id`
```
{
    "_id": "Object ID"
	"product": "product 1",
	"form": "form 1",
	"hazardous": true,
	"location": abc123,
	"quantity": 1
}
```
-- `DELETE`
`/inventory/:id`
```
null
```
[Screenshot](http://imgur.com/a/w1cJB)

Built with jQuery and node.js. Deployed via TravisCI and hosted on heroku
