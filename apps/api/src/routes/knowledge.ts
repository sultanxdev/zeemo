import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse, errorResponse } from '@zeemo/shared';
import { KnowledgeDocumentSchema } from '@zeemo/schemas';
import { v4 as uuidv4 } from 'uuid';

export const knowledgeRouter = Router();

// GET /v1/knowledge/documents
knowledgeRouter.get('/documents', (req: Request, res: Response) => {
  const docs = Array.from(store.documents.values()).filter(
    (doc) => doc.workspaceId === req.workspaceId
  );
  res.json(successResponse(docs));
});

// POST /v1/knowledge/documents
knowledgeRouter.post('/documents', (req: Request, res: Response) => {
  const { name, source, documentType, service, environment } = req.body;

  if (!name || !source || !documentType) {
    res.status(400).json(errorResponse('name, source, and documentType are required', 'BAD_REQUEST'));
    return;
  }

  const now = new Date().toISOString();
  const doc = KnowledgeDocumentSchema.parse({
    id: uuidv4(),
    workspaceId: req.workspaceId,
    name,
    source,
    documentType,
    service: service || null,
    environment: environment || 'production',
    status: 'indexed',
    chunkCount: 8,
    createdAt: now,
    updatedAt: now,
  });

  store.documents.set(doc.id, doc);
  res.status(201).json(successResponse(doc));
});

// POST /v1/knowledge/search - Hybrid search endpoint
knowledgeRouter.post('/search', (req: Request, res: Response) => {
  const { query, service } = req.body;
  if (!query) {
    res.status(400).json(errorResponse('Query string required', 'BAD_REQUEST'));
    return;
  }

  const docs = Array.from(store.documents.values()).filter(
    (doc) => doc.workspaceId === req.workspaceId
  );

  const results = docs.map((doc) => {
    let score = 0.5;
    if (doc.name.toLowerCase().includes(query.toLowerCase())) {
      score += 0.35;
    }
    if (service && doc.service === service) {
      score += 0.15;
    }
    return {
      document: doc,
      score: Math.min(score, 0.98),
      snippet: `Relevant excerpt from ${doc.name} matching keyword query "${query}"`,
    };
  });

  results.sort((a, b) => b.score - a.score);
  res.json(successResponse(results));
});
