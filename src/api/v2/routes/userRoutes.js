// ADICIONADO: rotas relativas V2 com schemas próprios e middleware compartilhado.
import express from "express";
import uploadPhoto from "../../../config/multer.js";
import * as userController from "../controllers/userController.js";
import validate from "../../../middlewares/validate.js";
import {
  createUserV2Schema,
  idParamSchema,
  updateUserV2Schema,
} from "../schemas/userSchema.js";

const router = express.Router();

/**
 * ADICIONADO: arquivo sozinho é uma atualização; campos continuam estritos.
 * @param {import("express").Request} req - Texto e foto interpretados pelo Multer.
 * @param {import("express").Response} res - Resposta Express.
 * @param {import("express").NextFunction} next - Próximo middleware.
 */
function validateUpdateWithPhoto(req, res, next) {
  if (req.file && Object.keys(req.body).length === 0) return next();
  return validate(updateUserV2Schema)(req, res, next);
}

router.post(
  "/",
  uploadPhoto,
  validate(createUserV2Schema),
  userController.create,
);
router.get("/", userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  // MODIFICADO: parser antes da validação do texto, depois do ID válido.
  uploadPhoto,
  validateUpdateWithPhoto,
  userController.update,
);
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
