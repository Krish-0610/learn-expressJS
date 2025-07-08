import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                  type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               avatar:
 *                 type: file
 *                 format: binary
 *               coverImage:
 *                 type: file
 *                 format: binary
 *               
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.route("/login").post(loginUser)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/logout").post(verifyJWT, logoutUser)

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.route("/refresh-token").post(refreshAccessToken)

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change current user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Unauthorized
 */
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

/**
 * @swagger
 * /users/current-user:
 *   get:
 *     summary: Get current user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Unauthorized
 */
router.route("/current-user").get(verifyJWT, getCurrentUser)

/**
 * @swagger
 * /users/update-account:
 *   patch:
 *     summary: Update account details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated
 *       401:
 *         description: Unauthorized
 */
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Update user avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated
 *       401:
 *         description: Unauthorized
 */
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

/**
 * @swagger
 * /users/coverImage:
 *   patch:
 *     summary: Update user cover image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover image updated
 *       401:
 *         description: Unauthorized
 */
router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

/**
 * @swagger
 * /users/c/{username}:
 *   get:
 *     summary: Get user channel profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User channel profile
 *       401:
 *         description: Unauthorized
 */
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

/**
 * @swagger
 * /users/history:
 *   get:
 *     summary: Get user watch history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User watch history
 *       401:
 *         description: Unauthorized
 */
router.route("/history").get(verifyJWT, getWatchHistory)

export default router