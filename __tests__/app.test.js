const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/User.js");

jest.mock("../src/models/User.js", () => ({ create: jest.fn()}));

describe("User routes!", () => {
    describe("CREATE controller", () => {
        it("should create a user and return the username", async () => {
            const userData= {
                username: "testuser",
                password: "password",
                email: "test@test.com"
            };
            const userMock = { ...userData, _id: "mockedID" };
            User.create.mockResolvedValue(userMock);

            const response = await request(app).post("/user").send(userData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ user: userMock.username});
            expect(User.create).toHaveBeenCalledWith(userData);
        });

        it("should return 500 if user creation fails", async () => {
            const error = new Error("User creation failed");
            User.create.mockRejectedValue(error);

            const response = await request(app).post("/user");

            expect(response.status).toBe(500);
            expect(response.text).toContain("User creation failed");
        })
    })
})