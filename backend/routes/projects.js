const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        adminId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        },
        admin: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get all projects for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { adminId: req.user.id },
          {
            members: {
              some: { userId: req.user.id }
            }
          }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        },
        admin: {
          select: { id: true, email: true, name: true }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is member or admin
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(id),
          userId: req.user.id
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        },
        admin: {
          select: { id: true, email: true, name: true }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, email: true, name: true }
            }
          }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can update project' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name: name || project.name,
        description: description !== undefined ? description : project.description
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        },
        admin: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can delete project' });
    }

    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add member to project
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can add members' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(id),
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(409).json({ error: 'User already a member' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: parseInt(id),
        userId,
        role: role || 'MEMBER'
      },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Member added successfully',
      member
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from project
router.delete('/:id/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can remove members' });
    }

    await prisma.projectMember.delete({
      where: { id: parseInt(memberId) }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

module.exports = router;
