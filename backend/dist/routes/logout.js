import Router from "express";
const router = Router();
router.post('/logout', (req, res) => {
    res.cookie('token', "");
    return res.status(200).json({ message: 'Logout successful' });
});
export default router;
//# sourceMappingURL=logout.js.map