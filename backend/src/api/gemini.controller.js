import { PrismaClient } from '@prisma/client';
import { generateContentFromPrompt } from './gemini.service.js';
import { clerkClient } from '@clerk/express';

const prisma = new PrismaClient();

export const generateSolution = async (req, res) => {
  try {

     console.log("hello from generate solution")

    const { prompt } = req.body;

    const clerkUserId = req.auth?.userId;  // ✅ FIXED

    if (!clerkUserId) {
      console.log("No clerkUserId found in request");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log("Authenticated userId from Clerk:", clerkUserId);

    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {


      user = await prisma.user.create({
        data: { clerkUserId },

      });
    }

    const solution = await generateContentFromPrompt(prompt);

    if (!solution || solution.trim() === "") {
      return res.status(500).json({ error: 'No content was returned from the API.' });
    }

    console.log(solution);

    const newChat = await prisma.chat.create({
      data: {
        prompt,
        response: solution,
        userId: user.id,
      },
    });

    res.status(200).json({ solution });
  } catch (error) {
    console.error('An error occurred in the controller:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;  // ✅ FIXED

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "unknown";

    console.log("Clerk User Email:", email);

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatHistory = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        prompt: true,
        response: true,
        createdAt: true,
      },
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

