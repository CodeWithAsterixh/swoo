# ERD - Business Card Editor (simplified)

Entities and relationships:

- User (1) ---> (N) Project
  - User: `_id`, name, email, passwordHash, role
  - Project: `_id`, userId -> User, templateId -> Template, canvas, pages, elements (embedded), status

- Project (1) ---> (N) Order
  - Order: `_id`, userId -> User, projectId -> Project, quantity, status, address, paymentInfo

- Project (1) ---> (1) PrintFile
  - PrintFile: `_id`, projectId -> Project, filePath, metadata

- Template (1) ---> (N) Asset
  - Template: `_id`, name, category, assets -> [Asset]
  - Asset: `_id`, type, filePath, previewUrl

- Project embeds Element subdocuments inside `pages[].elements` (fast reads for editor).

Indexes (important):
- User: `email` (unique), `role`
- Template: `category`
- Project: `userId`, `status`
- Asset: `type`
- Order: `userId`, `status`
- PrintFile: `projectId`

Design notes:
- Elements are embedded for fast editor loads and fewer joins.
- Assets stored separately to avoid duplication across templates/projects.
- Files (PrintFile, assets) should be stored in object storage (S3/GCS) and only referenced by path/URL.
- Consider background workers for order processing and PDF generation.
