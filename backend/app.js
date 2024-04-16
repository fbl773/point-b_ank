require("reflect-metadata");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const { morganIntegration } = require("./config/logger");
const cors = require("cors");

// const { synchModels } = require("./models");
// const dataSource = require("./config/db");

const healthRouter = require("./routes/health");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const catalogueRouter = require("./routes/catalogues");
const regionRouter = require("./routes/regions");
const siteRouter = require("./routes/sites");
const periodRouter = require("./routes/periods");

const bladeShapeRouter = require("./routes/bladeShapes");
const baseShapeRouter = require("./routes/baseShapes");
const haftingShapeRouter = require("./routes/haftingShapes");
const crossSectionRouter = require("./routes/crossSections");
const cultureRouter = require("./routes/cultures");

const artifactTypeRouter = require("./routes/artifactTypes");
const artifactRouter = require("./routes/artifacts");
const materialRouter = require("./routes/materials");

const aggregateStatisticsGeneratorRouter = require("./routes/aggregateStatisticsGenerators");

const projectilePointsRouter = require("./routes/projectilePoints");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morganIntegration);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Synchronize models with the database
// synchModels()
//   .then(() => {
//     console.log("Database synchronization complete. Starting server...");
//   })
//   .catch((error) => {
//     console.error("Database synchronization failed:", error);
//   });

// Middleware
app.use(bodyParser.json());

// Use CORS middleware
app.use(
	cors({
		//origin: "http://localhost:8080", // Replace with your frontend's URL
		origin: "http://orgoch:8080", // Replace with your frontend's URL
		methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
		credentials: true, // Enable credentials (cookies, authorization headers)
	}),
);

const api_root = "/api"; //the root path for API requs to hopefully fix our nginx issues :)
app.use(`${api_root}/`, healthRouter);
app.use(`${api_root}/`, indexRouter);
app.use(`${api_root}/users`, usersRouter);

app.use(`${api_root}/catalogues`, catalogueRouter);
app.use(`${api_root}/regions`, regionRouter);
app.use(`${api_root}/sites`, siteRouter);
app.use(`${api_root}/periods`, periodRouter);

app.use(`${api_root}/bladeshapes`, bladeShapeRouter);
app.use(`${api_root}/baseshapes`, baseShapeRouter);
app.use(`${api_root}/haftingshapes`, haftingShapeRouter);
app.use(`${api_root}/crosssections`, crossSectionRouter);
app.use(`${api_root}/cultures`, cultureRouter);

app.use(`${api_root}/artifacttypes`, artifactTypeRouter);
app.use(`${api_root}/artifacts`, artifactRouter);
app.use(`${api_root}/materials`, materialRouter);

app.use(`${api_root}/projectilepoints`, projectilePointsRouter);

app.use(`${api_root}/aggregateStatisticsGenerators`, aggregateStatisticsGeneratorRouter);

app.use(`${api_root}/uploads`, express.static(path.join(__dirname, "uploads")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
