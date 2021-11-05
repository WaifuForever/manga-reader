import supertest from "supertest";
import { app } from "../../src/config/express.js";
import { getMessage } from "../../src/common/messages.js";

const payload = {
	name: "Kentarou Kishima",
	type: "artist",
	birthDate: "2008-05-22",
	socialMedia: ["orkut", "twitter"],
	biography: "A nice and sexy person",
	author_id: "",
};

const payload2 = {
	name: "Abe Yamamoto",
	type: "writer",
	birthDate: "1990-08-02",
	socialMedia: ["reddit", "twitter"],
	biography: "A tough and gloom person",
	author_id: "",
};

export const authorTests = () => {
	it("POST /authors", async () => {
		await supertest(app)
			.post("/authors")
			.field(payload)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("photos", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				
				expect(response.body.data).toBeDefined();
				expect(response.body.metadata).toBeDefined();
				expect(response.body.status).toEqual(200);

				global.navigator.artist = response.body.data._id;
				expect(response.body).toMatchObject({
					message: getMessage("author.save.success"),
					data: {
						type: ["artist"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["orkut", "twitter"],
						//_id: '617f58e87ab874251ce7cd58',
						name: "Kentarou Kishima",
						birthDate: "2008-05-22T03:00:00.000Z",
						deathDate: null,
						biography: "A nice and sexy person",
						//createdAt: '2021-11-01T03:03:04.290Z',
						//updatedAt: '2021-11-01T03:03:04.290Z',
						__v: 0,
					},
					metadata: {},
					status: 200,
				});
			});
	});

	it("POST /authors", async () => {
		await supertest(app)
			.post("/authors")
			.field(payload2)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("photos", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(response.body.data).toBeDefined();
				expect(response.body.metadata).toBeDefined();
				expect(response.body.status).toEqual(200);

				global.navigator.writer = response.body.data._id;
				expect(response.body).toMatchObject({
					message: getMessage("author.save.success"),
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						//_id: '617f58e87ab874251ce7cd5c',
						name: "Abe Yamamoto",
						birthDate: "1990-08-02T03:00:00.000Z",
						deathDate: null,
						biography: "A tough and gloom person",
						//createdAt: '2021-11-01T03:03:04.482Z',
						//updatedAt: '2021-11-01T03:03:04.482Z',
						__v: 0,
					},
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /authors 2 documents", async () => {
		await supertest(app)
			.get("/authors")
			.send({})
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.message.startsWith("Author list retrieved successfully")
				).toBeTruthy();
				expect(response.body.status).toEqual(200);
				expect(response.body).toMatchObject({
					message: "Author list retrieved successfully: 2",
					data: [
						{
							type: ["artist"],
							photos: [
								{
									originalname: "__tiger_the_great.jpg",
									size: 103280,
								},
							],
							works: [],
							socialMedia: ["orkut", "twitter"],

							name: "Kentarou Kishima",
							birthDate: "2008-05-22T03:00:00.000Z",
							deathDate: null,
							biography: "A nice and sexy person",

							__v: 0,
						},
						{
							type: ["writer"],
							photos: [
								{
									originalname: "__tiger_the_great.jpg",
									size: 103280,
								},
							],
							works: [],
							socialMedia: ["reddit", "twitter"],
							name: "Abe Yamamoto",
							birthDate: "1990-08-02T03:00:00.000Z",
							deathDate: null,
							biography: "A tough and gloom person",

							__v: 0,
						},
					],
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /authors/findOne", async () => {
		await supertest(app)
			.get(`/authors/findOne?author_id=${global.navigator.writer}`)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.data.birthDate.startsWith(payload2.birthDate)
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: "Author retrieved successfully!",
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						name: "Abe Yamamoto",

						deathDate: null,
						biography: "A tough and gloom person",

						__v: 0,
					},

					metadata: {},
					status: 200,
				});
			});
	});

	it("PUT /authors name", async () => {
		payload2.name = "Iito Tachibana";
		payload2.author_id = global.navigator.writer;
		console.log(payload2);
		await supertest(app)
			.put("/authors")
			.send(payload2)
			.set("Authorization", "Bearer " + global.navigator.token)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);

				expect(response.body).toMatchObject({
					message: getMessage("author.update.success"),
					data: null,
					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /authors/findOne", async () => {
		await supertest(app)
			.get(`/authors/findOne?author_id=${global.navigator.writer}`)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.data.birthDate.startsWith(payload2.birthDate)
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: "Author retrieved successfully!",
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						name: "Iito Tachibana",
						deathDate: null,
						biography: "A tough and gloom person",

						__v: 0,
					},

					metadata: {},
					status: 200,
				});
			});
	});

	it("PUT /authors type", async () => {
		payload2.type = "artist";
		payload2.author_id = global.navigator.writer;

		await supertest(app)
			.put("/authors")
			.send(payload2)
			.set("Authorization", "Bearer " + global.navigator.token)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				console.log(response.body);

				expect(response.body).toMatchObject({
					message: "Update Done!",
					data: null,

					metadata: {},
					status: 200,
				});
			});
	});

	it("GET /authors/findOne", async () => {
		await supertest(app)
			.get(`/authors/findOne?author_id=${global.navigator.writer}`)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.data.birthDate.startsWith(payload2.birthDate)
				).toBeTruthy();

				expect(response.body).toMatchObject({
					message: "Author retrieved successfully!",
					data: {
						type: ["artist"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						name: "Iito Tachibana",
						deathDate: null,
						biography: "A tough and gloom person",

						__v: 0,
					},

					metadata: {},
					status: 200,
				});
			});
	});

	it("DELETE /authors", async () => {
		payload2.type = "writer";

		await supertest(app)
			.delete(`/authors?author_id=${payload2.author_id}`)

			.set("Authorization", "Bearer " + global.navigator.token)
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();
				
				expect(response.body.data.mangas).toBeDefined();
				expect(response.body.data.removed).toBeTruthy();
				expect(
					response.body.message.startsWith("Author deleted.")
				).toBeTruthy();
			});
	});

	it("GET /authors 1 documents", async () => {
		await supertest(app)
			.get("/authors")
			.send({})
			.expect(200)
			.then((response) => {
				// Check type and length
				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				expect(
					response.body.message.startsWith("Author list retrieved successfully")
				).toBeTruthy();
				expect(response.body.status).toEqual(200);
				expect(response.body).toMatchObject({
					message: "Author list retrieved successfully: 1",
					data: [
						{
							type: ["artist"],
							photos: [
								{
									originalname: "__tiger_the_great.jpg",
									size: 103280,
								},
							],
							works: [],
							socialMedia: ["orkut", "twitter"],

							name: "Kentarou Kishima",
							birthDate: "2008-05-22T03:00:00.000Z",
							deathDate: null,
							biography: "A nice and sexy person",

							__v: 0,
						},
					],
					metadata: {},
					status: 200,
				});
			});
	});
	
	it("POST /authors", async () => {
		await supertest(app)
			.post("/authors")
			.field(payload2)
			.set("Authorization", "Bearer " + global.navigator.token)

			.attach("photos", "C:/Users/Waifu/Downloads/Memes/__tiger_the_great.jpg")
			.expect(200)
			.then((response) => {
				// Check type and length

				expect(
					typeof response.body === "object" &&
						!Array.isArray(response.body) &&
						response.body !== null
				).toBeTruthy();

				
				expect(response.body.data).toBeDefined();
				expect(response.body.metadata).toBeDefined();
				expect(response.body.status).toEqual(200);

				global.navigator.writer = response.body.data._id;
				expect(response.body).toMatchObject({
					message: getMessage("author.save.success"),
					data: {
						type: ["writer"],
						photos: [
							{
								originalname: "__tiger_the_great.jpg",
								size: 103280,
							},
						],
						works: [],
						socialMedia: ["reddit", "twitter"],
						//_id: '617f58e87ab874251ce7cd5c',
						name: "Iito Tachibana",
						birthDate: "1990-08-02T03:00:00.000Z",
						deathDate: null,
						biography: "A tough and gloom person",
						//createdAt: '2021-11-01T03:03:04.482Z',
						//updatedAt: '2021-11-01T03:03:04.482Z',
						__v: 0,
					},
					metadata: {},
					status: 200,
				});
			});
	});
};
