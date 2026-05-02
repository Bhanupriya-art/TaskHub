const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects for user
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { adminId: userId },
          { members: { some: { userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = projects.map(p => p.id);

    if (projectIds.length === 0) {
      return res.json({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        assignedToMe: 0,
        projects: 0
      });
    }

    // Get all tasks for these projects
    const allTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      }
    });

    const now = new Date();

    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'COMPLETED').length,
      pendingTasks: allTasks.filter(t => t.status === 'PENDING').length,
      inProgressTasks: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
      overdueTasks: allTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'COMPLETED').length,
      assignedToMe: allTasks.filter(t => t.assignedTo === userId && t.status !== 'COMPLETED').length,
      projects: projectIds.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get tasks assigned to me
router.get('/assigned-to-me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
        status: { not: 'COMPLETED' }
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, email: true, name: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    res.status(500).json({ error: 'Failed to get assigned tasks' });
  }
});

// Get overdue tasks
router.get('/overdue', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Get all projects for user
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { adminId: userId },
          { members: { some: { userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = projects.map(p => p.id);

    const overdueTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: now },
        status: { not: 'COMPLETED' }
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, email: true, name: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(overdueTasks);
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({ error: 'Failed to get overdue tasks' });
  }
});

// Get task summary by status
router.get('/summary/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is member
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(projectId),
          userId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: parseInt(projectId) }
    });

    const summary = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'PENDING').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      cancelled: tasks.filter(t => t.status === 'CANCELLED').length,
      highPriority: tasks.filter(t => t.priority === 'HIGH').length,
      mediumPriority: tasks.filter(t => t.priority === 'MEDIUM').length,
      lowPriority: tasks.filter(t => t.priority === 'LOW').length
    };

    res.json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

module.exports = router;
