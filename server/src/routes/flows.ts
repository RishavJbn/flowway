import { Router, Request, Response } from 'express';
import { requireAuth } from '@clerk/express';
import prisma from '../lib/db.js';

const router = Router();

// Define a type assertion helper since Clerk adds the auth object to Request
interface AuthRequest extends Request {
  auth?: {
    userId?: string;
  };
}

// 1. GET /api/flows - Get all flows for the logged-in user
router.get('/', requireAuth(), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.auth?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const flows = await prisma.flow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(flows);
  } catch (error) {
    console.error('Error fetching flows:', error);
    res.status(500).json({ error: 'Failed to fetch flows' });
  }
});

// 2. GET /api/flows/:id - Get a single flow
router.get('/:id', requireAuth(), async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.auth?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const flow = await prisma.flow.findUnique({
      where: { id },
    });

    if (!flow) {
      res.status(404).json({ error: 'Flow not found' });
      return;
    }

    if (flow.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.json(flow);
  } catch (error) {
    console.error('Error fetching flow:', error);
    res.status(500).json({ error: 'Failed to fetch flow' });
  }
});

// 3. POST /api/flows - Create a new flow
router.post('/', requireAuth(), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.auth?.userId;
  const { name, nodes, edges, theme, pattern } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const newFlow = await prisma.flow.create({
      data: {
        name: name || 'Untitled Diagram',
        nodes: nodes || [],
        edges: edges || [],
        theme: theme || 'light',
        pattern: pattern || 'grid',
        userId,
      },
    });
    res.status(201).json(newFlow);
  } catch (error) {
    console.error('Error creating flow:', error);
    res.status(500).json({ error: 'Failed to create flow' });
  }
});

// 4. PUT /api/flows/:id - Update an existing flow
router.put('/:id', requireAuth(), async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.auth?.userId;
  const { name, nodes, edges, theme, pattern } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const existingFlow = await prisma.flow.findUnique({
      where: { id },
    });

    if (!existingFlow) {
      res.status(404).json({ error: 'Flow not found' });
      return;
    }

    if (existingFlow.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedFlow = await prisma.flow.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingFlow.name,
        nodes: nodes !== undefined ? nodes : existingFlow.nodes,
        edges: edges !== undefined ? edges : existingFlow.edges,
        theme: theme !== undefined ? theme : existingFlow.theme,
        pattern: pattern !== undefined ? pattern : existingFlow.pattern,
      },
    });

    res.json(updatedFlow);
  } catch (error) {
    console.error('Error updating flow:', error);
    res.status(500).json({ error: 'Failed to update flow' });
  }
});

// 5. DELETE /api/flows/:id - Delete a flow
router.delete('/:id', requireAuth(), async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.auth?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const existingFlow = await prisma.flow.findUnique({
      where: { id },
    });

    if (!existingFlow) {
      res.status(404).json({ error: 'Flow not found' });
      return;
    }

    if (existingFlow.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.flow.delete({
      where: { id },
    });

    res.json({ message: 'Flow deleted successfully' });
  } catch (error) {
    console.error('Error deleting flow:', error);
    res.status(500).json({ error: 'Failed to delete flow' });
  }
});

export default router;
