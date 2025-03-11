const express = require("express");
const cors = require("cors");
const fs = require("fs")
const path = require("path")
const app = express();
const authJwt = require("./app/middleware/authJwt")
var corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sql = require("mssql/msnodesqlv8");
const conn = new sql.ConnectionPool({
	database: "DWSRMT",
	server: "DESKTOP-244AKNA",
	driver: "msnodesqlv8",
	options: {
		trustedConnection: true
	}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// simple route
app.use("/api/auth", require("./app/routes/auth.routes")(app));

app.get("/api/initial/:type", [authJwt.verifyToken], (req, res) => {
	const type = req.params.type;
	try {
		const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `db/${type}.data.json`)))
		const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, `db/${type}.user.json`)))
		res.json({ data, users })
	} catch {

		res.json({ data: [], users: [] })
	}
})

app
	.put("/api/addUser",
		[authJwt.verifyToken]
		, (req, res) => {
			const { name, type } = req.body;
			const filePath = path.resolve(__dirname, `db/${type}.user.json`);

			var users = JSON.parse(fs.readFileSync(filePath))
			let user = users.filter(item => item.name === name)[0]
			if (user)
				return res.status(400).json("duplicated user")

			let data = {
				name,
				access: []
			}
			users.push(data)
			fs.writeFileSync(filePath, JSON.stringify(users))
			res.status(200).json(data)
		})

app
	.delete("/api/deleteUser/:type/:name",
		[authJwt.verifyToken]
		, (req, res) => {
			const { name, type } = req.params;
			const filePath = path.resolve(__dirname, `db/${type}.user.json`);

			var users = JSON.parse(fs.readFileSync(filePath))
			users = users.filter(item => item.name !== name)
			fs.writeFileSync(filePath, JSON.stringify(users))
			res.status(200).json(name);
		})

app
	.post("/api/updateAccess",
		[authJwt.verifyToken]
		, (req, res) => {
			const { name, type, access } = req.body;
			const filePath = path.resolve(__dirname, `db/${type}.user.json`);
			var users = JSON.parse(fs.readFileSync(filePath))
			users = users.map(item =>{
				if (item.name === name)
					return {...item, access}
				return item;
			})
			fs.writeFileSync(filePath, JSON.stringify(users))
			res.json()
		})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
