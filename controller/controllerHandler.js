const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.delete = (model) => {
  return asyncHandler(async (req, res, next) => {
    const documentId = req.params.id;
    const document = await model.findByIdAndDelete(documentId);
    if (!document) {
      return next(new ApiError(`No document For This Id : ${documentId}`, 404));
    }
    res.status(202).json({ msg: `document Deleted Successfully` });
  });
};

exports.update = (model) => {
  return asyncHandler(async (req, res, next) => {
    const documentId = req.params.id;
    const { password, ...rest } = req.body;
    const document = await model.findById(documentId);
    if (!document) {
      return next(new ApiError(`No document For This Id : ${documentId}`, 404));
    }
    Object.assign(document, rest);
    await document.save();
    res.status(200).json({ data: document });
  });
};

exports.create = (model) => {
  return asyncHandler(async (req, res, next) => {
    const newDocument = await model.create(req.body);
    res.status(201).json({ data: newDocument });
  });
};

exports.getAll = (model, modelName) => {
  return asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const documentsCount = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .filter()
      .limit()
      .paginate(documentsCount)
      .sort()
      .search(modelName);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
};

exports.getSpecific = (model) => {
  return asyncHandler(async (req, res, next) => {
    const documentId = req.params.id;
    const document = await model.findById(documentId);
    if (!document) {
      return next(new ApiError(`No document For This id : ${documentId}`, 404));
    }
    res.status(200).json({ data: document });
  });
};
