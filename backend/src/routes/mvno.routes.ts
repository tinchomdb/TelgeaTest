import { Router } from "express";
import { mvnoController } from "../controllers/mvno.controller";

const router = Router();

router.post("/soap", mvnoController.normalizeSoapCharge);
router.post("/rest", mvnoController.normalizeRestUsage);

export default router;
