const request = require("supertest");
const randomEmail = require("random-email");
const app = require("../../app");

const { connectDB, disconnectDB } = require("../../config/db");

describe("Testing API", () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	
	});

	describe("Test POST /api/users", () => {
		const email = randomEmail();
		const fullData = {
			name: "Diganta Das 1",
			email: email,
			password: "12345678",
		};
		const dataWithoutName = {
			email: email,
			password: "12345678",
		};
		const dataWithoutEmail = {
			name: "Diganta Das 1",
			password: "12345678",
		};
		const dataWithoutPassword = {
			name: "Diganta Das 1",
			email: email,
		};
		test("It should respond with 200 success and Content-Type:JSON", async () => {
			const response = await request(app)
				.post("/api/users")
				.send(fullData)
				.expect("Content-Type", /json/)
				.expect(200);
		});
		test("It should respond with 400 error and Content-Type:JSON and catch all missing properties", async () => {
			const response = await request(app)
				.post("/api/users")
				.send({})
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				errors: [
					{
						msg: "Name is required",
						param: "name",
						location: "body",
					},
					{
						msg: "Please include a valid email",
						param: "email",
						location: "body",
					},
					{
						msg: "Please enter a password with 6 or more characters",
						param: "password",
						location: "body",
					},
				],
			});
		});
		test("It should respond with 400 bad request and Content-Type:JSON and catch missing name", async () => {
			const response = await request(app)
				.post("/api/users")
				.send(dataWithoutName)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				errors: [
					{
						msg: "Name is required",
						param: "name",
						location: "body",
					},
				],
			});
		});

		test("It should respond with 400 bad request and Content-Type:JSON and catch missing email", async () => {
			const response = await request(app)
				.post("/api/users")
				.send(dataWithoutEmail)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				errors: [
					{
						msg: "Please include a valid email",
						param: "email",
						location: "body",
					},
				],
			});
		});

		test("It should respond with 400 bad request and Content-Type:JSON and catch missing password", async () => {
			const response = await request(app)
				.post("/api/users")
				.send(dataWithoutPassword)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				errors: [
					{
						msg: "Please enter a password with 6 or more characters",
						param: "password",
						location: "body",
					},
				],
			});
		});
	});
});
