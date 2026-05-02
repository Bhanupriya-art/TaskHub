const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, priority, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: 'projectId and title are required' });
    }

    // Check if user is member of project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.id
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If assigning to someone, check if they're a member
    if (assignedTo) {
      const assigneeMembership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: assignedTo
          }
        }
      });

      if (!assigneeMembership) {
        return res.status(400).json({ error: 'Assignee is not a member of project' });
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        assignedTo: assignedTo || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        assignee: {
          select: { id: true, email: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get tasks by project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assignedTo } = req.query;

    // Check if user is member of project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(projectId),
          userId: req.user.id
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const where = { projectId: parseInt(projectId) };
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = parseInt(assignedTo);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, email: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get single task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignee: {
          select: { id: true, email: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is member of project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: task.projectId,
          userId: req.user.id
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is member of project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: task.projectId,
          userId: req.user.id
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If updating assignee, check if they're a member
    if (assignedTo) {
      const assigneeMembership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: task.projectId,
            userId: assignedTo
          }
        }
      });

      if (!assigneeMembership) {
        return res.status(400).json({ error: 'Assignee is not a member of project' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (assignedTo === null) updateData.assignedTo = null;
    if (dueDate) updateData.dueDate = new Date(dueDate);

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, email: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is admin of project
    const project = await prisma.project.findUnique({
      where: { id: task.projectId }
    });

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can delete tasks' });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
