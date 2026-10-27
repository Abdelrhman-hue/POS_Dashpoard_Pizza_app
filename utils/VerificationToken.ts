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

export const forgetpasswordgenerateToken = async (identifier: string) => {
  // Find existing token
  const existingToken = await prisma.forgetpasswordToken.findFirst({
    where: {
      identifier,
    },
  });

  // Delete old token if it exists
  if (existingToken) {
    await prisma.forgetpasswordToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token,
        },
      },
    });
  }

  // Generate new token
  const token = crypto.randomBytes(32).toString("hex");

  const verificationToken = await prisma.forgetpasswordToken.create({
    data: {
      identifier,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  return verificationToken;
};
