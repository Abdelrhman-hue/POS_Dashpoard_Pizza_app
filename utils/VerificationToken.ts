import crypto from "crypto";
import { prisma } from "./prisma";

export const generateVerificationToken = async (identifier: string) => {
    // find token first
  const validVerificationToken = await prisma.verificationToken.findFirst({
    where: { identifier },
  });
//   and then if token exist delete token
  if (validVerificationToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: validVerificationToken.identifier,
          token: validVerificationToken.token,
        },
      },
    });
  }

//   generate token
  const token = crypto.randomBytes(32).toString("hex");
  const newVerificationToken = await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
  return newVerificationToken;
};
