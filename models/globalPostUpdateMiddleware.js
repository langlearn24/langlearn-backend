import catchAsyncErr from "../utils/catchAsyncErr.js";

const globalPostUpdateMiddleware = function (schema, options) {
  const modelsWithContent = ["Post", "Comment", "Reply"];
  const modelName  = options?.modelName;

  schema.post(/update/i, async function (doc, next) {
    if (modelsWithContent.includes(modelName)) {
      doc.isEdited = true;
    }
    doc.lastModifiedAt = new Date(Date.now());
    await doc.save();
    console.log('updated commons from global plugin')
    next();
  });
};
export default globalPostUpdateMiddleware;
