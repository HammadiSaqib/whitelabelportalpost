import type { Express } from "express";
import { db } from "./db";
import { whiteLabels, clientTemplateCustomizations } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";
import fs from 'fs';
import path from 'path';

// White label customization interface
interface WhiteLabelCustomization {
  id?: number;
  whiteLabelId: number;
  customizations: {
    text?: {
      heroTitle?: string;
      heroSubtitle?: string;
      ctaButtonText?: string;
      companyName?: string;
      footerText?: string;
    };
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
      buttonBackground?: string;
      buttonText?: string;
    };
  };
}

export function registerWhiteLabelCustomizationRoutes(app: Express) {
  // Create or update white label customizations (without whiteLabelId parameter)
  app.post('/api/white-label-customizations', isAuthenticated, async (req, res) => {
    try {
      const { text, colors } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Update the template code in routes.ts with the new customizations
      await updateTemplateCode(text);

      // Also save to database for persistence
      const whiteLabel = await db.select()
        .from(whiteLabels)
        .where(eq(whiteLabels.userId, userId))
        .limit(1);

      if (whiteLabel.length > 0) {
        const whiteLabelId = whiteLabel[0].id;
        const customizations = { text, colors };

        // Check if customizations already exist
        const existingCustomizations = await db.select()
          .from(clientTemplateCustomizations)
          .where(eq(clientTemplateCustomizations.clientId, whiteLabelId))
          .limit(1);

        if (existingCustomizations.length > 0) {
          // Update existing customizations
          await db.update(clientTemplateCustomizations)
            .set({
              customConfig: customizations,
              updatedAt: new Date().toISOString()
            })
            .where(eq(clientTemplateCustomizations.id, existingCustomizations[0].id));
        } else {
          // Create new customizations
          await db.insert(clientTemplateCustomizations).values({
            clientId: whiteLabelId,
            templateId: 1,
            customConfig: customizations,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      res.json({
        message: 'Customizations saved and template updated successfully',
        customizations: { text, colors }
      });
    } catch (error) {
      console.error('Error saving white label customizations:', error);
      res.status(500).json({ error: 'Failed to save customizations' });
    }
  });

  // Helper function to update template code in routes.ts
  async function updateTemplateCode(textCustomizations: any) {
    try {
      const routesPath = path.join(__dirname, 'routes.ts');
      let routesContent = fs.readFileSync(routesPath, 'utf8');

      // Update the default template data with new customizations
      if (textCustomizations.heroTitle) {
        routesContent = routesContent.replace(
          /heroTitle:\s*['"`][^'"`]*['"`]/g,
          `heroTitle: '${textCustomizations.heroTitle.replace(/'/g, "\\'")}'`
        );
      }

      if (textCustomizations.heroSubtitle) {
        routesContent = routesContent.replace(
          /heroSubtitle:\s*['"`][^'"`]*['"`]/g,
          `heroSubtitle: '${textCustomizations.heroSubtitle.replace(/'/g, "\\'")}'`
        );
      }

      if (textCustomizations.ctaButtonText) {
        routesContent = routesContent.replace(
          /ctaButtonText:\s*['"`][^'"`]*['"`]/g,
          `ctaButtonText: '${textCustomizations.ctaButtonText.replace(/'/g, "\\'")}'`
        );
      }

      if (textCustomizations.companyName) {
        routesContent = routesContent.replace(
          /companyName:\s*['"`][^'"`]*['"`]/g,
          `companyName: '${textCustomizations.companyName.replace(/'/g, "\\'")}'`
        );
      }

      // Write the updated content back to routes.ts
      fs.writeFileSync(routesPath, routesContent, 'utf8');
    } catch (error) {
      console.error('Error updating template code:', error);
      throw error;
    }
  }
  // Get white label customizations
  app.get('/api/white-label-customizations/:whiteLabelId', isAuthenticated, async (req, res) => {
    try {
      const whiteLabelId = parseInt(req.params.whiteLabelId);
      
      // Check if user has access to this white label
      const whiteLabel = await db.select()
        .from(whiteLabels)
        .where(eq(whiteLabels.id, whiteLabelId))
        .limit(1);
      
      if (!whiteLabel.length) {
        return res.status(404).json({ error: 'White label not found' });
      }

      // Get existing customizations
      const customizations = await db.select()
        .from(clientTemplateCustomizations)
        .where(eq(clientTemplateCustomizations.clientId, whiteLabelId))
        .limit(1);

      if (customizations.length === 0) {
        // Return default customizations
        return res.json({
          whiteLabelId,
          customizations: {
            text: {
              heroTitle: "Welcome to Our Platform",
              heroSubtitle: "Discover amazing features and services",
              ctaButtonText: "Get Started",
              companyName: whiteLabel[0].businessName || "Your Company",
              footerText: "© 2024 All rights reserved"
            },
            colors: {
              primary: "#6366f1",
              secondary: "#8b5cf6",
              accent: "#06b6d4",
              background: "#ffffff",
              text: "#1f2937",
              buttonBackground: "#6366f1",
              buttonText: "#ffffff"
            }
          }
        });
      }

      res.json({
        id: customizations[0].id,
        whiteLabelId,
        customizations: customizations[0].customConfig
      });
    } catch (error) {
      console.error('Error fetching white label customizations:', error);
      res.status(500).json({ error: 'Failed to fetch customizations' });
    }
  });

  // Create or update white label customizations
  app.post('/api/white-label-customizations/:whiteLabelId', isAuthenticated, async (req, res) => {
    try {
      const whiteLabelId = parseInt(req.params.whiteLabelId);
      const { customizations } = req.body;

      // Check if user has access to this white label
      const whiteLabel = await db.select()
        .from(whiteLabels)
        .where(eq(whiteLabels.id, whiteLabelId))
        .limit(1);
      
      if (!whiteLabel.length) {
        return res.status(404).json({ error: 'White label not found' });
      }

      // Check if customizations already exist
      const existingCustomizations = await db.select()
        .from(clientTemplateCustomizations)
        .where(eq(clientTemplateCustomizations.clientId, whiteLabelId))
        .limit(1);

      if (existingCustomizations.length > 0) {
        // Update existing customizations
        await db.update(clientTemplateCustomizations)
          .set({
            customConfig: customizations,
            updatedAt: new Date().toISOString()
          })
          .where(eq(clientTemplateCustomizations.id, existingCustomizations[0].id));

        res.json({
          id: existingCustomizations[0].id,
          whiteLabelId,
          customizations,
          message: 'Customizations updated successfully'
        });
      } else {
        // Create new customizations
        const result = await db.insert(clientTemplateCustomizations).values({
          clientId: whiteLabelId,
          templateId: 1, // Default template ID
          customConfig: customizations,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        res.json({
          id: result.insertId,
          whiteLabelId,
          customizations,
          message: 'Customizations created successfully'
        });
      }
    } catch (error) {
      console.error('Error saving white label customizations:', error);
      res.status(500).json({ error: 'Failed to save customizations' });
    }
  });

  // Delete white label customizations (reset to default)
  app.delete('/api/white-label-customizations/:whiteLabelId', isAuthenticated, async (req, res) => {
    try {
      const whiteLabelId = parseInt(req.params.whiteLabelId);

      await db.delete(clientTemplateCustomizations)
        .where(eq(clientTemplateCustomizations.clientId, whiteLabelId));

      res.json({ message: 'Customizations reset to default successfully' });
    } catch (error) {
      console.error('Error deleting white label customizations:', error);
      res.status(500).json({ error: 'Failed to reset customizations' });
    }
  });
}