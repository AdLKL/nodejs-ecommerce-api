import jwt from "jsonwebtoken";

const generateToken = (id) => {
    // for the token generation we need the payload (which represents the logged in user)
    return jwt.sign({id}, process.env.JWT_KEY, { expiresIn: "4d" });
};

export default generateToken;