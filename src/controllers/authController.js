const dynamoDb = require("../config/aws");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const USERS_TABLE = process.env.USERS_TABLE || "login";

// POST /register
exports.register = async (req, res, next) => {
  try {
    // Get values from request body
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    // Check if user already exists
    const existingUser = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { email },
      })
      .promise();

    if (existingUser.Item) {
      throw new Error("User already exists");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user item
    const newUser = {
      email,
      name,
      password: hashedPassword,
      subscriptions: [], // user subscriptions stored here
    };

    // Save user to DynamoDB
    await dynamoDb
      .put({
        TableName: USERS_TABLE,
        Item: newUser,
      })
      .promise();

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /login
exports.login = async (req, res, next) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user in DynamoDB
    const result = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { email },
      })
      .promise();

    const user = result.Item;

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};